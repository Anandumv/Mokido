import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { errorHandler, withErrorHandling } from '@/utils/errorHandler';

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  duration: string;
  ageGroups: string[];
  completed: boolean;
  icon: string;
  lessons: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  completed: boolean;
  dueDate?: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'saving';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface DataContextType {
  learningModules: LearningModule[];
  missions: Mission[];
  goals: Goal[];
  transactions: Transaction[];
  updateModule: (id: string, updates: Partial<LearningModule>) => void;
  updateMission: (id: string, updates: Partial<Mission>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  addGoal: (goal: Goal) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [learningModules, setLearningModules] = useState<LearningModule[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Clear data when user logs out
      setLearningModules([]);
      setMissions([]);
      setGoals([]);
      setTransactions([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await Promise.all([
        loadLearningModules(),
        loadMissions(),
        loadGoals(),
        loadTransactions()
      ]);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLearningModules = async () => {
    if (!user) return;

    const result = await withErrorHandling(
      async () => {
        // Get all learning modules
        const { data: modules, error: modulesError } = await supabase
          .from('learning_modules')
          .select('*');

        if (modulesError) {
          throw new Error(`Failed to load learning modules: ${modulesError.message}`);
        }

        // Get user progress for these modules
        const { data: progress, error: progressError } = await supabase
          .from('user_learning_progress')
          .select('*')
          .eq('user_id', user.id);

        if (progressError) {
          throw new Error(`Failed to load learning progress: ${progressError.message}`);
        }

        // Combine modules with user progress
        const modulesWithProgress = modules?.map(module => {
          const userProgress = progress?.find(p => p.module_id === module.id);
          
          // Check if this module is appropriate for the user's age group
          const isAgeAppropriate = module.age_groups.includes(user.ageGroup);
          
          return {
            id: module.id,
            title: module.title,
            description: module.description,
            category: module.category,
            difficulty: module.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
            xpReward: module.xp_reward,
            duration: module.duration,
            ageGroups: module.age_groups,
            completed: userProgress?.completed || false,
            icon: module.icon,
            lessons: module.lessons,
            isAgeAppropriate
          };
        }).filter(module => module.isAgeAppropriate) || [];

        setLearningModules(modulesWithProgress);
        return modulesWithProgress;
      },
      { 
        action: 'loadLearningModules', 
        component: 'DataContext',
        userId: user.id
      },
      false
    );

    if (!result.success) {
      // Set empty array on error to prevent undefined state
      setLearningModules([]);
    }
  };

  const loadMissions = async () => {
    if (!user) return;

    const result = await withErrorHandling(
      async () => {
        // Get all missions
        const { data: allMissions, error: missionsError } = await supabase
          .from('missions')
          .select('*');

        if (missionsError) {
          throw new Error(`Failed to load missions: ${missionsError.message}`);
        }

        // Get user mission progress
        const { data: userMissions, error: userMissionsError } = await supabase
          .from('user_missions')
          .select('*')
          .eq('user_id', user.id);

        if (userMissionsError) {
          throw new Error(`Failed to load user missions: ${userMissionsError.message}`);
        }

        // Combine missions with user progress
        const missionsWithProgress = allMissions?.map(mission => {
          const userMission = userMissions?.find(um => um.mission_id === mission.id);
          return {
            id: mission.id,
            title: mission.title,
            description: mission.description,
            reward: mission.reward,
            difficulty: mission.difficulty as 'Easy' | 'Medium' | 'Hard',
            category: mission.category,
            completed: userMission?.completed || false,
            dueDate: userMission?.due_date || undefined
          };
        }) || [];

        setMissions(missionsWithProgress);
        return missionsWithProgress;
      },
      { 
        action: 'loadMissions', 
        component: 'DataContext',
        userId: user.id
      },
      false
    );

    if (!result.success) {
      setMissions([]);
    }
  };

  const loadGoals = async () => {
    if (!user) return;

    const result = await withErrorHandling(
      async () => {
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(`Failed to load goals: ${error.message}`);
        }

        const goalsData = data?.map(goal => ({
          id: goal.id,
          title: goal.title,
          targetAmount: goal.target_amount,
          currentAmount: goal.current_amount,
          category: goal.category,
          dueDate: goal.due_date,
          priority: goal.priority as 'Low' | 'Medium' | 'High'
        })) || [];

        setGoals(goalsData);
        return goalsData;
      },
      { 
        action: 'loadGoals', 
        component: 'DataContext',
        userId: user.id
      },
      false
    );

    if (!result.success) {
      setGoals([]);
    }
  };

  const loadTransactions = async () => {
    if (!user) return;

    const result = await withErrorHandling(
      async () => {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          throw new Error(`Failed to load transactions: ${error.message}`);
        }

        const transactionsData = data?.map(transaction => ({
          id: transaction.id,
          type: transaction.type as 'income' | 'expense' | 'saving',
          amount: transaction.amount,
          category: transaction.category,
          description: transaction.description,
          date: transaction.date
        })) || [];

        setTransactions(transactionsData);
        return transactionsData;
      },
      { 
        action: 'loadTransactions', 
        component: 'DataContext',
        userId: user.id
      },
      false
    );

    if (!result.success) {
      setTransactions([]);
    }
  };

  const updateModule = async (id: string, updates: Partial<LearningModule>) => {
    if (!user) return;

    const result = await withErrorHandling(
      async () => {
        if (updates.completed !== undefined) {
          // Update or insert user progress
          const { error } = await supabase
            .from('user_learning_progress')
            .upsert({
              user_id: user.id,
              module_id: id,
              completed: updates.completed,
              completed_at: updates.completed ? new Date().toISOString() : null,
              updated_at: new Date().toISOString()
            });

          if (error) {
            throw new Error(`Failed to update module progress: ${error.message}`);
          }
        }

        return true;
      },
      { 
        action: 'updateModule', 
        component: 'DataContext',
        userId: user.id,
        additionalData: { moduleId: id, updates }
      },
      false
    );

    if (result.success) {
      // Update local state only if database update succeeded
      setLearningModules(prev => 
        prev.map(module => 
          module.id === id ? { ...module, ...updates } : module
        )
      );
    }
  };

  const updateMission = async (id: string, updates: Partial<Mission>) => {
    if (!user) return;

    const result = await withErrorHandling(
      async () => {
        if (updates.completed !== undefined) {
          // Update or insert user mission progress
          const { error } = await supabase
            .from('user_missions')
            .upsert({
              user_id: user.id,
              mission_id: id,
              completed: updates.completed,
              completed_at: updates.completed ? new Date().toISOString() : null,
              updated_at: new Date().toISOString()
            });

          if (error) {
            throw new Error(`Failed to update mission progress: ${error.message}`);
          }
        }

        return true;
      },
      { 
        action: 'updateMission', 
        component: 'DataContext',
        userId: user.id,
        additionalData: { missionId: id, updates }
      },
      false
    );

    if (result.success) {
      // Update local state only if database update succeeded
      setMissions(prev => 
        prev.map(mission => 
          mission.id === id ? { ...mission, ...updates } : mission
        )
      );
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    if (!user) return;

    try {
      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.targetAmount !== undefined) dbUpdates.target_amount = updates.targetAmount;
      if (updates.currentAmount !== undefined) dbUpdates.current_amount = updates.currentAmount;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;

      dbUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('goals')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating goal:', error);
        return;
      }

      // Update local state
      setGoals(prev => 
        prev.map(goal => 
          goal.id === id ? { ...goal, ...updates } : goal
        )
      );
    } catch (error) {
      console.error('Error in updateGoal:', error);
    }
  };

  const addGoal = async (goal: Goal) => {
    if (!user) return;

    const result = await withErrorHandling(
      async () => {
        const { data, error } = await supabase
          .from('goals')
          .insert({
            user_id: user.id,
            title: goal.title,
            target_amount: goal.targetAmount,
            current_amount: goal.currentAmount,
            category: goal.category,
            due_date: goal.dueDate,
            priority: goal.priority
          })
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to add goal: ${error.message}`);
        }

        if (!data) {
          throw new Error('Goal creation succeeded but no data returned');
        }

        const newGoal: Goal = {
          id: data.id,
          title: data.title,
          targetAmount: data.target_amount,
          currentAmount: data.current_amount,
          category: data.category,
          dueDate: data.due_date,
          priority: data.priority as 'Low' | 'Medium' | 'High'
        };

        setGoals(prev => [newGoal, ...prev]);
        return newGoal;
      },
      { 
        action: 'addGoal', 
        component: 'DataContext',
        userId: user.id,
        additionalData: { goalTitle: goal.title, targetAmount: goal.targetAmount }
      },
      true // Show user error for this operation
    );

    return result.success;
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;

    const result = await withErrorHandling(
      async () => {
        const { data, error } = await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            type: transaction.type,
            amount: transaction.amount,
            category: transaction.category,
            description: transaction.description,
            date: transaction.date
          })
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to add transaction: ${error.message}`);
        }

        if (!data) {
          throw new Error('Transaction creation succeeded but no data returned');
        }

        const newTransaction: Transaction = {
          id: data.id,
          type: data.type as 'income' | 'expense' | 'saving',
          amount: data.amount,
          category: data.category,
          description: data.description,
          date: data.date
        };

        setTransactions(prev => [newTransaction, ...prev]);
        return newTransaction;
      },
      { 
        action: 'addTransaction', 
        component: 'DataContext',
        userId: user.id,
        additionalData: { 
          type: transaction.type, 
          amount: transaction.amount,
          category: transaction.category 
        }
      },
      false
    );

    return result.success;
  };

  return (
    <DataContext.Provider value={{
      learningModules,
      missions,
      goals,
      transactions,
      updateModule,
      updateMission,
      updateGoal,
      addGoal,
      addTransaction,
      isLoading
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}