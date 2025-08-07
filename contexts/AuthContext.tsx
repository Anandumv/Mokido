import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { errorHandler, withErrorHandling } from '@/utils/errorHandler';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  ageGroup: '6-9 years';
  avatar: string;
  level: number;
  xp: number;
  mokTokens: number;
  savings: number;
  investmentBalance: number;
  cryptoBalance: number;
  usdcBalance: number;
  travelMiles: number;
  solanaWalletAddress: string | null;
  solBalance: string | null;
  isParentMode: boolean;
  badges: string[];
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginDemo: () => Promise<boolean>;
  register: (userData: Partial<User> & { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  toggleParentMode: () => void;
  convertMokTokens: (amount: number, assetType: 'cash' | 'usdc' | 'travelMiles') => Promise<boolean>;
  verifyParentPin: (pin: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Conversion rates for MokTokens
const CONVERSION_RATES = {
  cash: 0.01, // 1 MokToken = $0.01
  usdc: 0.01, // 1 MokToken = $0.01 USDC
  travelMiles: 0.5, // 1 MokToken = 0.5 travel miles
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('AuthContext: AuthProvider initialized');

  useEffect(() => {
    console.log('AuthContext: useEffect for initial session check started');
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthContext: Initial session check - session exists:', !!session, 'user id:', session?.user?.id);
      if (session?.user) {
        console.log('AuthContext: Loading user profile for initial session');
        loadUserProfile(session.user);
      } else {
        console.log('AuthContext: No initial session found, setting isLoading to false');
      }
      setIsLoading(false);
      console.log('AuthContext: Initial session check complete, isLoading set to false');
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext: Auth state change event:', event, 'session exists:', !!session, 'user id:', session?.user?.id);
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('AuthContext: SIGNED_IN event - loading user profile');
        await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        console.log('AuthContext: SIGNED_OUT event - clearing user');
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    console.log('AuthContext: loadUserProfile called for user id:', supabaseUser.id);
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      console.log('AuthContext: Profile query result - profile exists:', !!profile, 'error:', error?.message);

      if (!profile) {
        // Profile doesn't exist, create a basic one
        console.log('AuthContext: Profile not found, creating basic profile...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email,
            name: 'Little Explorer',
            age: 7,
            age_group: '6-9 years',
            avatar: '🧑',
            badges: ['Welcome to Mokido!'],
            join_date: new Date().toISOString().split('T')[0]
          })
          .select()
          .single();
        
        if (createError) {
          console.error('AuthContext: Error creating profile:', createError);
          console.log('AuthContext: Failed to create profile, setting user to null');
          setUser(null);
          return;
        }
        
        if (newProfile) {
          const newUserObject = {
            id: newProfile.id,
            email: newProfile.email || supabaseUser.email || '',
            name: newProfile.name || 'Little Explorer',
            age: newProfile.age || 7,
            ageGroup: '6-9 years' as const,
            avatar: newProfile.avatar || '🧑',
            level: newProfile.level,
            xp: newProfile.xp,
            mokTokens: newProfile.mok_tokens,
            savings: newProfile.savings,
            investmentBalance: newProfile.investment_balance,
            cryptoBalance: newProfile.crypto_balance,
            usdcBalance: newProfile.usdc_balance,
            travelMiles: newProfile.travel_miles,
            solanaWalletAddress: newProfile.solana_wallet_address,
            solBalance: newProfile.sol_balance?.toString() || null,
            isParentMode: newProfile.is_parent_mode,
            badges: newProfile.badges,
            joinDate: newProfile.join_date || new Date().toISOString().split('T')[0]
          };
          console.log('AuthContext: Setting user from new profile:', newUserObject);
          setUser({
            ...newUserObject
          });
        }
        return;
      }

      if (error) {
        console.error('Error loading profile:', error.message);
        console.log('AuthContext: Profile query error, setting user to null');
        setUser(null);
        return;
      }

      if (profile) {
        const userObject = {
          id: profile.id,
          email: profile.email || supabaseUser.email || '',
          name: profile.name || 'Little Explorer',
          age: profile.age || 7,
          ageGroup: '6-9 years' as const,
          avatar: profile.avatar || '🧑',
          level: profile.level,
          xp: profile.xp,
          mokTokens: profile.mok_tokens,
          savings: profile.savings,
          investmentBalance: profile.investment_balance,
          cryptoBalance: profile.crypto_balance,
          usdcBalance: profile.usdc_balance,
          travelMiles: profile.travel_miles,
          solanaWalletAddress: profile.solana_wallet_address,
          solBalance: profile.sol_balance?.toString() || null,
          isParentMode: profile.is_parent_mode,
          badges: profile.badges,
          joinDate: profile.join_date || new Date().toISOString().split('T')[0]
        };
        console.log('AuthContext: Setting user from existing profile:', userObject);
        setUser({
          ...userObject
        });
      } else {
        console.log('AuthContext: Profile is null, setting user to null');
        setUser(null);
      }
      setIsLoading(false);
      console.log('AuthContext: loadUserProfile complete, isLoading set to false');
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      console.log('AuthContext: loadUserProfile error, setting user to null and isLoading to false');
      setUser(null);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('AuthContext: login called with email:', email);
    
    const result = await withErrorHandling(
      async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (!data.user) {
          throw new Error('No user data received from authentication');
        }

        await loadUserProfile(data.user);
        return data.user;
      },
      { 
        action: 'login', 
        component: 'AuthContext',
        additionalData: { email: email.toLowerCase() }
      },
      false // Don't show user error here, we handle it in the component
    );

    return result.success;
  };

  const loginDemo = async () => {
    console.log('AuthContext: loginDemo called');
    const demoEmail = 'demo@mokido.com';
    const demoPassword = 'demo123';
    
    setIsLoading(true);
    
    const result = await withErrorHandling(
      async () => {
        // Try to sign in first
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: demoEmail,
          password: demoPassword,
        });

        if (signInError) {
          // If sign in fails, try to create the account
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: demoEmail,
            password: demoPassword,
          });

          if (signUpError) {
            throw new Error(`Failed to create demo account: ${signUpError.message}`);
          }

          // Create demo profile with parent PIN
          const demoProfileData = {
            id: signUpData.user!.id,
            email: demoEmail,
            name: 'Demo Kid',
            age: 8,
            age_group: '6-9 years',
            avatar: '🎮',
            badges: ['Welcome to Mokido!', 'Demo User', 'First Steps'],
            join_date: new Date().toISOString().split('T')[0],
            parent_pin_hash: await bcrypt.hash('1234', 10) // Demo PIN is 1234
          };

          const { error: profileError } = await supabase
            .from('profiles')
            .insert(demoProfileData);

          if (profileError) {
            console.log('Demo profile creation error (may already exist):', profileError.message);
          }

          // Try signing in again after account creation
          const { data: retrySignInData, error: retrySignInError } = await supabase.auth.signInWithPassword({
            email: demoEmail,
            password: demoPassword,
          });

          if (retrySignInError || !retrySignInData.user) {
            throw new Error('Failed to sign in to demo account after creation');
          }

          await loadUserProfile(retrySignInData.user);
          return retrySignInData.user;
        }

        if (!signInData.user) {
          throw new Error('No user data received from demo login');
        }

        await loadUserProfile(signInData.user);
        return signInData.user;
      },
      { 
        action: 'loginDemo', 
        component: 'AuthContext',
        additionalData: { email: demoEmail }
      },
      false
    );

    setIsLoading(false);
    return result.success;
  };

  const register = async (userData: Partial<User> & { email: string; password: string; parentPin?: string }): Promise<boolean> => {
    console.log('AuthContext: register called with email:', userData.email);
    setIsLoading(true);
    
    const result = await withErrorHandling(
      async () => {
        const { data, error } = await supabase.auth.signUp({
          email: userData.email.toLowerCase(),
          password: userData.password,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (!data.user) {
          throw new Error('No user data received from registration');
        }

        // Create profile
        const profileData: any = {
          id: data.user.id,
          email: userData.email.toLowerCase(),
          name: userData.name || 'Little Explorer',
          age: userData.age || 7,
          age_group: '6-9 years',
          avatar: '🧑',
          badges: ['Welcome to Mokido!', 'First Steps', 'Learning Beginner'],
          join_date: new Date().toISOString().split('T')[0]
        };

        // Encode parent PIN if provided
        if (userData.parentPin) {
          console.log('AuthContext: Hashing parent PIN for registration');
          profileData.parent_pin_hash = await bcrypt.hash(userData.parentPin, 10);
        } else {
          console.warn('AuthContext: No parent PIN provided during registration - parent mode will not be available');
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();

        if (profileError) {
          throw new Error(`Failed to create user profile: ${profileError.message}`);
        }

        if (!profile) {
          throw new Error('Profile creation succeeded but no profile data returned');
        }

        // Set user from profile data
        const newUserObject = {
          id: profile.id,
          email: profile.email || data.user.email || '',
          name: profile.name || 'Little Explorer',
          age: profile.age || 7,
          ageGroup: '6-9 years' as const,
          avatar: profile.avatar || '🧑',
          level: profile.level,
          xp: profile.xp,
          mokTokens: profile.mok_tokens,
          savings: profile.savings,
          investmentBalance: profile.investment_balance,
          cryptoBalance: profile.crypto_balance,
          usdcBalance: profile.usdc_balance,
          travelMiles: profile.travel_miles,
          solanaWalletAddress: profile.solana_wallet_address,
          solBalance: profile.sol_balance?.toString() || null,
          isParentMode: profile.is_parent_mode,
          badges: profile.badges,
          joinDate: profile.join_date || new Date().toISOString().split('T')[0]
        };
        
        setUser(newUserObject);
        return data.user;
      },
      { 
        action: 'register', 
        component: 'AuthContext',
        additionalData: { 
          email: userData.email.toLowerCase(),
          name: userData.name,
          age: userData.age
        }
      },
      false
    );

    setIsLoading(false);
    return result.success;
  };

  const logout = async () => {
    console.log('AuthContext: logout called');
    
    const result = await withErrorHandling(
      async () => {
        await supabase.auth.signOut();
        setUser(null);
        return true;
      },
      { action: 'logout', component: 'AuthContext' },
      false
    );

    if (!result.success) {
      // Even if logout fails on server, clear local state
      setUser(null);
      errorHandler.logWarning('Logout failed on server but cleared local state');
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    console.log('AuthContext: updateUser called with updates:', updates);

    const result = await withErrorHandling(
      async () => {
        // Convert User interface fields to database column names
        const dbUpdates: any = {};
        
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.age !== undefined) dbUpdates.age = updates.age;
        if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
        if (updates.level !== undefined) dbUpdates.level = updates.level;
        if (updates.xp !== undefined) dbUpdates.xp = updates.xp;
        if (updates.mokTokens !== undefined) dbUpdates.mok_tokens = updates.mokTokens;
        if (updates.savings !== undefined) dbUpdates.savings = updates.savings;
        if (updates.investmentBalance !== undefined) dbUpdates.investment_balance = updates.investmentBalance;
        if (updates.cryptoBalance !== undefined) dbUpdates.crypto_balance = updates.cryptoBalance;
        if (updates.usdcBalance !== undefined) dbUpdates.usdc_balance = updates.usdcBalance;
        if (updates.travelMiles !== undefined) dbUpdates.travel_miles = updates.travelMiles;
        if (updates.solanaWalletAddress !== undefined) dbUpdates.solana_wallet_address = updates.solanaWalletAddress;
        if (updates.solBalance !== undefined) dbUpdates.sol_balance = updates.solBalance ? parseFloat(updates.solBalance) : null;
        if (updates.isParentMode !== undefined) dbUpdates.is_parent_mode = updates.isParentMode;
        if (updates.badges !== undefined) dbUpdates.badges = updates.badges;

        dbUpdates.updated_at = new Date().toISOString();

        const { error } = await supabase
          .from('profiles')
          .update(dbUpdates)
          .eq('id', user.id);

        if (error) {
          throw new Error(`Failed to update user profile: ${error.message}`);
        }

        return true;
      },
      { 
        action: 'updateUser', 
        component: 'AuthContext',
        userId: user.id,
        additionalData: { updates }
      },
      false
    );

    if (result.success) {
      // Update local state only if database update succeeded
      setUser({ ...user, ...updates });
    } else {
      errorHandler.logError(
        new Error('Failed to update user profile in database'),
        { action: 'updateUser', userId: user.id }
      );
    }
  };

  const toggleParentMode = async () => {
    if (!user) return;
    
    try {
      await updateUser({ isParentMode: !user.isParentMode });
    } catch (error) {
      console.error('Error toggling parent mode:', error);
      throw error;
    }
  };

  const convertMokTokens = async (amount: number, assetType: 'cash' | 'usdc' | 'travelMiles'): Promise<boolean> => {
    if (!user) return false;
    
    const result = await withErrorHandling(
      async () => {
        // Check if user has enough MokTokens
        if (user.mokTokens < amount) {
          throw new Error(`Insufficient MokTokens. You have ${user.mokTokens} but need ${amount}.`);
        }
        
        // Calculate converted amount based on rates
        const convertedAmount = amount * CONVERSION_RATES[assetType];
        
        // Update user balances
        const updates: Partial<User> = {
          mokTokens: user.mokTokens - amount,
        };
        
        switch (assetType) {
          case 'cash':
            updates.savings = user.savings + convertedAmount;
            break;
          case 'usdc':
            updates.usdcBalance = user.usdcBalance + convertedAmount;
            break;
          case 'travelMiles':
            updates.travelMiles = user.travelMiles + convertedAmount;
            break;
        }
        
        await updateUser(updates);
        return true;
      },
      { 
        action: 'convertMokTokens', 
        component: 'AuthContext',
        userId: user.id,
        additionalData: { amount, assetType, userMokTokens: user.mokTokens }
      },
      false
    );

    return result.success;
  };

  const verifyParentPin = async (pin: string): Promise<boolean> => {
    if (!user) return false;

    const result = await withErrorHandling(
      async () => {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('parent_pin_hash')
          .eq('id', user.id)
          .single();

        if (error || !profile) {
          throw new Error('Could not verify PIN - profile not found');
        }

        if (!profile.parent_pin_hash) {
          // No PIN set, allow access for backward compatibility
          return true;
        }

        // Use bcrypt to compare the PIN with the stored hash
        const isValid = await bcrypt.compare(pin, profile.parent_pin_hash);
        return isValid;
      },
      { 
        action: 'verifyParentPin', 
        component: 'AuthContext',
        userId: user.id
      },
      false
    );

    return result.success && result.data === true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loginDemo,
      register,
      logout,
      updateUser,
      toggleParentMode,
      convertMokTokens,
      verifyParentPin,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}