import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Mail, Calendar, Lock, GraduationCap, Shield, Sparkles } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { handleAsyncError } from '@/utils/errorHandler';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [parentPin, setParentPin] = useState('');
  const { register, isLoading } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !age || !parentPin) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    if (name.trim().length < 2) {
      Alert.alert('Invalid Name', 'Please enter a valid name (at least 2 characters)');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 6 || ageNum > 9) {
      Alert.alert('Invalid Age', 'Age must be between 6 and 9');
      return;
    }

    if (parentPin.length < 4 || parentPin.length > 5) {
      Alert.alert('Invalid Parent PIN', 'Parent PIN must be 4-5 digits');
      return;
    }

    if (!/^\d+$/.test(parentPin)) {
      Alert.alert('Invalid Parent PIN', 'Parent PIN must contain only numbers');
      return;
    }
    try {
      const success = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        age: ageNum,
        parentPin,
      });

      if (success) {
        Alert.alert(
          'Welcome to Mokido! 🎉',
          `Hi ${name.trim()}! Your account has been created successfully. Let's start your financial learning journey!`,
          [{ text: 'Let\'s Go! 🚀', onPress: () => router.push('/(tabs)') }]
        );
      } else {
        Alert.alert('Registration Failed', 'An account with this email already exists. Please try logging in instead.');
      }
    } catch (error) {
      const errorMessage = handleAsyncError(error, {
        action: 'handleRegister',
        component: 'RegisterScreen',
        additionalData: { email: email.trim().toLowerCase(), name: name.trim(), age: ageNum }
      });
      Alert.alert('Registration Error', errorMessage);
    }
  };

  const handleBack = () => {
    router.back();
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

      <SafeAreaView style={styles.safeArea}>
        {/* Header with Back Button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <View style={styles.securityIndicator}>
            <Shield color="#FFFFFF" size={16} />
            <Text style={styles.securityText}>Secure Registration</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
            {/* Main Card */}
            <View style={styles.card}>
              {/* Floating Icon */}
              <View style={styles.floatingIconContainer}>
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6', '#EC4899']}
                  style={styles.iconGradient}
                >
                  <GraduationCap color="#FFFFFF" size={32} />
                </LinearGradient>
              </View>

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Join Mokido!</Text>
                <Text style={styles.subtitle}>Start your financial adventure today</Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                {/* Name Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      placeholderTextColor="#9CA3AF"
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                </View>

                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor="#9CA3AF"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* Age Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Age (6-9)</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your age"
                      placeholderTextColor="#9CA3AF"
                      value={age}
                      onChangeText={(text) => {
                        // Only allow numbers
                        const numericText = text.replace(/[^0-9]/g, '');
                        setAge(numericText);
                      }}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Create a password"
                      placeholderTextColor="#9CA3AF"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={true}
                    />
                  </View>
                </View>

                {/* Parent PIN Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Parent PIN</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter 4-5 digit PIN for Parent Mode"
                      placeholderTextColor="#9CA3AF"
                      value={parentPin}
                      onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9]/g, '').slice(0, 5);
                        setParentPin(numericText);
                      }}
                      keyboardType="numeric"
                      maxLength={5}
                      secureTextEntry={true}
                    />
                  </View>
                  <Text style={styles.helperText}>
                    This PIN is required to access Parent Mode later
                  </Text>
                </View>

                {/* Register Button */}
                <TouchableOpacity 
                  style={[styles.registerButton, isLoading && styles.disabledButton]} 
                  onPress={handleRegister}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#6366F1', '#8B5CF6']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.registerButtonText}>
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Text>
                    <Sparkles color="#FFFFFF" size={20} />
                  </LinearGradient>
                </TouchableOpacity>

                {/* Login Link */}
                <TouchableOpacity 
                  style={styles.loginLink}
                  onPress={() => router.push('/(auth)/login')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.loginLinkText}>
                    Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text>
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Age Groups Info */}
              <View style={styles.ageGroupsContainer}>
                <Text style={styles.ageGroupsTitle}>🎯 Perfect for Kids Like You!</Text>
                <View style={styles.ageGroupsList}>
                <View style={styles.ageGroup}>
                  <View style={styles.ageGroupIcon}>
                    <Text style={styles.ageGroupEmoji}>🌱</Text>
                  </View>
                  <View style={styles.ageGroupContent}>
                    <Text style={styles.ageGroupRange}>Ages 6-7</Text>
                    <Text style={styles.ageGroupDescription}>Learning About Money</Text>
                  </View>
                </View>
                  
                <View style={styles.ageGroup}>
                  <View style={styles.ageGroupIcon}>
                    <Text style={styles.ageGroupEmoji}>🌿</Text>
                  </View>
                  <View style={styles.ageGroupContent}>
                    <Text style={styles.ageGroupRange}>Ages 8-9</Text>
                    <Text style={styles.ageGroupDescription}>Saving & Smart Choices</Text>
                  </View>
                </View>
                </View>
              </View>
            </View>

            {/* Bottom Decoration */}
            <View style={styles.bottomDecoration}>
              <View style={styles.decorationDot} />
              <View style={styles.decorationDot} />
              <View style={[styles.decorationDot, styles.decorationDotActive]} />
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
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  securityText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 20,
    position: 'relative',
  },
  floatingIconContainer: {
    position: 'absolute',
    top: -40,
    left: '50%',
    transform: [{ translateX: -40 }],
    width: 80,
    height: 80,
    borderRadius: 40,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Fredoka-Bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    paddingVertical: 16,
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 6,
  },
  registerButton: {
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  loginLinkText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  loginLinkBold: {
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
  ageGroupsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ageGroupsTitle: {
    fontSize: 16,
    fontFamily: 'Fredoka-SemiBold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  ageGroupsList: {
    gap: 16,
  },
  ageGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ageGroupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ageGroupEmoji: {
    fontSize: 20,
  },
  ageGroupContent: {
    flex: 1,
  },
  ageGroupRange: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  ageGroupDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  bottomDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
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