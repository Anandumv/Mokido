import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, DollarSign, Coins, ArrowRight, Sparkles, Info } from 'lucide-react-native';

interface CashConversionModalProps {
  visible: boolean;
  onClose: () => void;
  onConvert: (amount: number) => Promise<boolean>;
  userMokTokens: number;
}

const CONVERSION_RATE = 0.01; // 1 MokToken = $0.01

export default function CashConversionModal({ 
  visible, 
  onClose, 
  onConvert, 
  userMokTokens 
}: CashConversionModalProps) {
  const [amount, setAmount] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const resetForm = () => {
    setAmount('');
    setFocusedField(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const numAmount = parseInt(amount);
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid number of MokTokens greater than 0');
      return false;
    }
    
    if (numAmount > userMokTokens) {
      Alert.alert('Insufficient MokTokens', `You only have ${userMokTokens} MokTokens available.`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    const numAmount = parseInt(amount);
    const cashAmount = numAmount * CONVERSION_RATE;
    
    setIsConverting(true);
    
    try {
      const success = await onConvert(numAmount);
      
      if (success) {
        Alert.alert(
          '💰 Conversion Successful!',
          `You've converted ${numAmount} MokTokens to $${cashAmount.toFixed(2)} cash!\n\nThe money has been added to your savings account. Keep earning more MokTokens through learning and missions! 🌟`,
          [{ text: 'Awesome! 🎉', style: 'default' }]
        );
        handleClose();
      } else {
        Alert.alert('Conversion Failed', 'There was an error processing your conversion. Please try again.');
      }
    } catch (error) {
      Alert.alert('Conversion Failed', 'There was an error processing your conversion. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const convertedAmount = amount ? (parseInt(amount || '0') * CONVERSION_RATE).toFixed(2) : '0.00';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <LinearGradient
        colors={['#F0FDF4', '#FFFFFF']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X color="#6B7280" size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Convert to Cash 💰</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Available MokTokens */}
            <View style={styles.balanceContainer}>
              <View style={styles.balanceHeader}>
                <Coins color="#10B981" size={24} />
                <Text style={styles.balanceTitle}>Available MokTokens</Text>
              </View>
              <Text style={styles.balanceAmount}>{userMokTokens}</Text>
              <Text style={styles.balanceSubtext}>Earned through learning and missions</Text>
            </View>

            {/* Conversion Rate Info */}
            <View style={styles.rateContainer}>
              <Text style={styles.rateTitle}>💱 Conversion Rate</Text>
              <View style={styles.rateDisplay}>
                <View style={styles.rateItem}>
                  <Text style={styles.rateNumber}>1</Text>
                  <Text style={styles.rateLabel}>MokToken</Text>
                </View>
                <ArrowRight color="#10B981" size={20} />
                <View style={styles.rateItem}>
                  <Text style={styles.rateNumber}>$0.01</Text>
                  <Text style={styles.rateLabel}>Cash</Text>
                </View>
              </View>
            </View>

            {/* Amount Input */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How many MokTokens to convert?</Text>
              <View style={[
                styles.inputContainer,
                focusedField === 'amount' && styles.inputContainerFocused
              ]}>
                <Coins color={focusedField === 'amount' ? '#10B981' : '#9CA3AF'} size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  onFocus={() => setFocusedField('amount')}
                  onBlur={() => setFocusedField(null)}
                />
                <Text style={styles.inputSuffix}>MokTokens</Text>
              </View>
              
              {/* Quick Amount Buttons */}
              <View style={styles.quickAmounts}>
                <TouchableOpacity 
                  style={styles.quickAmountButton}
                  onPress={() => setAmount(Math.min(100, userMokTokens).toString())}
                >
                  <Text style={styles.quickAmountText}>100</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickAmountButton}
                  onPress={() => setAmount(Math.min(500, userMokTokens).toString())}
                >
                  <Text style={styles.quickAmountText}>500</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickAmountButton}
                  onPress={() => setAmount(userMokTokens.toString())}
                >
                  <Text style={styles.quickAmountText}>All</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Conversion Preview */}
            {amount && parseInt(amount) > 0 && (
              <View style={styles.previewSection}>
                <Text style={styles.previewTitle}>Conversion Preview 👀</Text>
                <View style={styles.previewCard}>
                  <View style={styles.conversionFlow}>
                    <View style={styles.conversionItem}>
                      <Coins color="#F59E0B" size={32} />
                      <Text style={styles.conversionAmount}>{amount}</Text>
                      <Text style={styles.conversionLabel}>MokTokens</Text>
                    </View>
                    
                    <ArrowRight color="#10B981" size={24} />
                    
                    <View style={styles.conversionItem}>
                      <DollarSign color="#10B981" size={32} />
                      <Text style={styles.conversionAmount}>${convertedAmount}</Text>
                      <Text style={styles.conversionLabel}>Cash</Text>
                    </View>
                  </View>
                  
                  <View style={styles.previewDetails}>
                    <Text style={styles.previewDetailsText}>
                      💰 The cash will be added to your savings account
                    </Text>
                    <Text style={styles.previewDetailsText}>
                      🎯 Keep earning MokTokens through learning and missions!
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity 
              style={[
                styles.submitButton,
                (!amount || parseInt(amount) <= 0 || isConverting) && styles.submitButtonDisabled
              ]} 
              onPress={handleSubmit}
              disabled={!amount || parseInt(amount) <= 0 || isConverting}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.submitGradient}
              >
                <Sparkles color="#FFFFFF" size={20} />
                <Text style={styles.submitButtonText}>
                  {isConverting ? 'Converting...' : 'Convert to Cash'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Info Section */}
            <View style={styles.infoContainer}>
              <View style={styles.infoHeader}>
                <Info color="#3B82F6" size={16} />
                <Text style={styles.infoTitle}>About Cash Conversion</Text>
              </View>
              <View style={styles.tipsList}>
                <Text style={styles.tipText}>
                  💡 Converting MokTokens to cash adds real money to your savings account
                </Text>
                <Text style={styles.tipText}>
                  🎯 Earn more MokTokens by completing learning modules and missions
                </Text>
                <Text style={styles.tipText}>
                  💰 Cash conversions help you reach your savings goals faster
                </Text>
                <Text style={styles.tipText}>
                  🌟 The more you learn, the more you can earn and convert!
                </Text>
              </View>
            </View>
          </ScrollView>
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
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  balanceContainer: {
    backgroundColor: '#DCFCE7',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    marginBottom: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  balanceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: 'Fredoka-Bold',
    color: '#059669',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#047857',
  },
  rateContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rateTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  rateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  rateItem: {
    alignItems: 'center',
  },
  rateNumber: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#10B981',
    marginBottom: 4,
  },
  rateLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputContainerFocused: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    paddingVertical: 12,
    marginLeft: 12,
    textAlign: 'center',
  },
  inputSuffix: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  previewSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  conversionFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20,
  },
  conversionItem: {
    alignItems: 'center',
    flex: 1,
  },
  conversionAmount: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  conversionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  previewDetails: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  previewDetailsText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#059669',
    textAlign: 'center',
  },
  submitButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
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
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  infoContainer: {
    backgroundColor: '#EFF6FF',
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
  },
  tipsList: {
    gap: 8,
  },
  tipText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#1E40AF',
    lineHeight: 16,
  },
});