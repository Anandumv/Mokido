import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Lock, Shield, Eye, EyeOff } from 'lucide-react-native';

interface ParentPinModalProps {
  visible: boolean;
  onClose: () => void;
  onVerifyPin: (pin: string) => Promise<boolean>;
}

export default function ParentPinModal({ visible, onClose, onVerifyPin }: ParentPinModalProps) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [shakeAnim] = useState(new Animated.Value(0));
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      // Focus input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // Reset state when modal closes
      setPin('');
      setShowPin(false);
      setIsVerifying(false);
    }
  }, [visible]);

  const handleClose = () => {
    setPin('');
    setShowPin(false);
    setIsVerifying(false);
    onClose();
  };

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = async () => {
    if (!pin || pin.length < 4) {
      Alert.alert('Invalid PIN', 'Please enter your 4-5 digit parent PIN');
      return;
    }

    setIsVerifying(true);

    try {
      const isValid = await onVerifyPin(pin);
      
      if (isValid) {
        Alert.alert(
          '🔓 Access Granted!',
          'Welcome to Parent Mode! You now have access to detailed financial information and settings.',
          [{ text: 'Continue', onPress: handleClose }]
        );
      } else {
        shakeAnimation();
        Alert.alert(
          '❌ Incorrect PIN',
          'The PIN you entered is incorrect. Please try again.',
          [{ text: 'Try Again', onPress: () => setPin('') }]
        );
      }
    } catch (error) {
      Alert.alert('Verification Error', 'There was an error verifying your PIN. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePinChange = (text: string) => {
    // Only allow numbers and limit to 5 digits
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 5);
    setPin(numericText);
  };

  const renderPinDots = () => {
    const dots = [];
    for (let i = 0; i < 5; i++) {
      const isFilled = i < pin.length;
      dots.push(
        <View
          key={i}
          style={[
            styles.pinDot,
            isFilled && styles.pinDotFilled,
            i === pin.length && styles.pinDotActive
          ]}
        />
      );
    }
    return dots;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
    >
      <LinearGradient
        colors={['#EFF6FF', '#FFFFFF']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X color="#6B7280" size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Parent Mode Access 🔐</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.content}>
            {/* Security Icon */}
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.iconGradient}
              >
                <Shield color="#FFFFFF" size={48} />
              </LinearGradient>
            </View>

            {/* Title and Description */}
            <Text style={styles.modalTitle}>Enter Parent PIN</Text>
            <Text style={styles.description}>
              Please enter your 4-5 digit PIN to access Parent Mode with detailed financial information and settings.
            </Text>

            {/* PIN Input Section */}
            <Animated.View style={[
              styles.pinSection,
              { transform: [{ translateX: shakeAnim }] }
            ]}>
              {/* Visual PIN Dots */}
              <View style={styles.pinDotsContainer}>
                {renderPinDots()}
              </View>

              {/* Hidden Text Input */}
              <TextInput
                ref={inputRef}
                style={styles.hiddenInput}
                value={pin}
                onChangeText={handlePinChange}
                keyboardType="numeric"
                secureTextEntry={!showPin}
                maxLength={5}
                autoFocus={true}
                selectTextOnFocus={true}
              />

              {/* Show/Hide PIN Toggle */}
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setShowPin(!showPin)}
              >
                {showPin ? (
                  <EyeOff color="#6B7280" size={20} />
                ) : (
                  <Eye color="#6B7280" size={20} />
                )}
                <Text style={styles.toggleText}>
                  {showPin ? 'Hide PIN' : 'Show PIN'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (pin.length < 4 || isVerifying) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={pin.length < 4 || isVerifying}
            >
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.submitGradient}
              >
                <Lock color="#FFFFFF" size={20} />
                <Text style={styles.submitButtonText}>
                  {isVerifying ? 'Verifying...' : 'Access Parent Mode'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Security Notice */}
            <View style={styles.securityNotice}>
              <Shield color="#10B981" size={16} />
              <Text style={styles.securityNoticeText}>
                Your PIN is securely encrypted and never stored in plain text
              </Text>
            </View>

            {/* Help Text */}
            <View style={styles.helpContainer}>
              <Text style={styles.helpTitle}>💡 Forgot your PIN?</Text>
              <Text style={styles.helpText}>
                If you've forgotten your parent PIN, you'll need to contact support or reset your account. 
                The PIN was set during account registration for security.
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  iconContainer: {
    marginBottom: 32,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 28,
    fontFamily: 'Fredoka-Bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  pinSection: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  pinDotsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  pinDotFilled: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  pinDotActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  toggleText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  submitButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  securityNoticeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    flex: 1,
    textAlign: 'center',
  },
  helpContainer: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 16,
    width: '100%',
  },
  helpTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  helpText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
    textAlign: 'center',
  },
});