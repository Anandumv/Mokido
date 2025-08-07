import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, Coins, Target, GraduationCap, Zap, Shield, TrendingUp } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { loginDemo } = useAuth();
  const mountedRef = useRef(true);

  useEffect(() => {
    // Set mounted to true when component mounts
    mountedRef.current = true;
    
    // Cleanup function to set mounted to false when component unmounts
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleGetStarted = () => {
    if (mountedRef.current) {
      router.push('/(auth)/register');
    }
  };

  const handleLogin = () => {
    if (mountedRef.current) {
      router.push('/(auth)/login');
    }
  };

  const handleDemoLogin = async () => {
    try {
      const success = await loginDemo();
      // Only navigate if component is still mounted and login was successful
      if (mountedRef.current && success) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      // Only handle errors if component is still mounted
      if (mountedRef.current) {
        console.error('Demo login failed:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />
      
      {/* Overlay Pattern */}
      <View style={styles.patternOverlay} />
      
      {/* Floating Elements */}
      <View style={styles.floatingElement1} />
      <View style={styles.floatingElement2} />
      <View style={styles.floatingElement3} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            {/* Main Logo */}
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6', '#EC4899']}
                style={styles.logoGradient}
              >
                <GraduationCap color="#FFFFFF" size={48} />
              </LinearGradient>
            </View>
            
            <Text style={styles.logoText}>Mokido</Text>
            <Text style={styles.subtitle}>Financial Education for Kids</Text>
            
            {/* Security Badge */}
            <View style={styles.securityBadge}>
              <Shield color="#FFFFFF" size={16} />
              <Text style={styles.securityText}>Secure & Safe Platform</Text>
            </View>
          </View>

          {/* Features Grid */}
          <View style={styles.featuresContainer}>
            <View style={styles.featuresGrid}>
              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.featureIconGradient}
                  >
                    <Sparkles color="#FFFFFF" size={24} />
                  </LinearGradient>
                </View>
                <Text style={styles.featureTitle}>Interactive Learning</Text>
                <Text style={styles.featureDescription}>Gamified lessons that make finance fun</Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    style={styles.featureIconGradient}
                  >
                    <Coins color="#FFFFFF" size={24} />
                  </LinearGradient>
                </View>
                <Text style={styles.featureTitle}>Earn MokTokens</Text>
                <Text style={styles.featureDescription}>Rewards for completing activities</Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    style={styles.featureIconGradient}
                  >
                    <Target color="#FFFFFF" size={24} />
                  </LinearGradient>
                </View>
                <Text style={styles.featureTitle}>Set Goals</Text>
                <Text style={styles.featureDescription}>Track savings and achievements</Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.featureIconGradient}
                  >
                    <TrendingUp color="#FFFFFF" size={24} />
                  </LinearGradient>
                </View>
                <Text style={styles.featureTitle}>Build Wealth</Text>
                <Text style={styles.featureDescription}>Learn investing fundamentals</Text>
              </View>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statsCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.statsGradient}
              >
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>10K+</Text>
                    <Text style={styles.statLabel}>Students</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>50+</Text>
                    <Text style={styles.statLabel}>Lessons</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>95%</Text>
                    <Text style={styles.statLabel}>Success Rate</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* CTA Section */}
          <View style={styles.ctaContainer}>
            {/* Primary CTA */}
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleGetStarted}
            >
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
                <Zap color="#FFFFFF" size={20} />
              </LinearGradient>
            </TouchableOpacity>

            {/* Secondary CTA */}
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={handleLogin}
            >
              <Text style={styles.secondaryButtonText}>I Have an Account</Text>
            </TouchableOpacity>

            {/* Demo CTA */}
            <TouchableOpacity 
              style={styles.demoButton} 
              onPress={handleDemoLogin}
            >
              <View style={styles.demoButtonContent}>
                <View style={styles.demoBadge}>
                  <Text style={styles.demoBadgeText}>DEMO</Text>
                </View>
                <Text style={styles.demoButtonText}>Try Demo Mode</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Bottom Decoration */}
          <View style={styles.bottomDecoration}>
            <View style={styles.decorationDot} />
            <View style={[styles.decorationDot, styles.decorationDotActive]} />
            <View style={styles.decorationDot} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  floatingElement1: {
    position: 'absolute',
    top: 100,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  floatingElement2: {
    position: 'absolute',
    top: 300,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  floatingElement3: {
    position: 'absolute',
    bottom: 200,
    right: 50,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 42,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 16,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  securityText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    width: (width - 64) / 2,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIconContainer: {
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 16,
  },
  statsContainer: {
    marginBottom: 40,
  },
  statsCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  statsGradient: {
    padding: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  ctaContainer: {
    gap: 16,
    marginBottom: 32,
  },
  primaryButton: {
    borderRadius: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  demoButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  demoButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  demoBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  demoButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  bottomDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  decorationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  decorationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
});