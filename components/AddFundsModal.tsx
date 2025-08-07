import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, DollarSign, PiggyBank, TrendingUp, Coins, Sparkles, Info } from 'lucide-react-native';

interface AddFundsModalProps {
  visible: boolean;
  onClose: () => void;
  onAddFunds: (amount: number, fundType: 'savings' | 'investment' | 'crypto', sourceAccount?: 'savings' | 'investment' | 'crypto') => void;
}

const fundTypes = [
  {
    id: 'savings' as const,
    name: 'Regular Savings',
    icon: PiggyBank,
    color: '#10B981',
    description: 'Safe money for your goals',
    details: 'Perfect for short-term goals and emergency funds. Your money stays safe and grows slowly.',
    emoji: '🏦'
  },
  {
    id: 'investment' as const,
    name: 'Investments',
    icon: TrendingUp,
    color: '#3B82F6',
    description: 'Grow your money over time',
    details: 'For long-term goals. Your money might grow faster but can go up and down.',
    emoji: '📈'
  },
  {
    id: 'crypto' as const,
    name: 'Crypto Savings',
    icon: Coins,
    color: '#F59E0B',
    description: 'Digital currency (Parent approval needed)',
    details: 'Modern digital money. Requires parent to transfer funds from their crypto wallet.',
    emoji: '₿'
  }
];

export default function AddFundsModal({ visible, onClose, onAddFunds }: AddFundsModalProps) {
  const [amount, setAmount] = useState('');
  const [selectedFundType, setSelectedFundType] = useState<'savings' | 'investment' | 'crypto' | null>(null);
  const [selectedSourceAccount, setSelectedSourceAccount] = useState<'savings' | 'investment' | 'crypto' | null>(null);
  const [isTransfer, setIsTransfer] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const resetForm = () => {
    setAmount('');
    setSelectedFundType(null);
    setSelectedSourceAccount(null);
    setIsTransfer(false);
    setFocusedField(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than $0');
      return false;
    }
    
    if (!selectedFundType) {
      Alert.alert('Select Fund Type', 'Please choose where you want to add your funds');
      return false;
    }

    if (isTransfer && !selectedSourceAccount) {
      Alert.alert('Select Source Account', 'Please choose which account to transfer from');
      return false;
    }

    if (isTransfer && selectedSourceAccount === selectedFundType) {
      Alert.alert('Invalid Transfer', 'Cannot transfer to the same account type');
      return false;
    }
    
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const numAmount = parseFloat(amount);
    const selectedType = fundTypes.find(type => type.id === selectedFundType);
    
    handleAddFundsWithRewards(numAmount, selectedFundType!, selectedSourceAccount || undefined);
    
    const transferText = isTransfer && selectedSourceAccount 
      ? ` transferred from your ${fundTypes.find(t => t.id === selectedSourceAccount)?.name}`
      : '';
    
    Alert.alert(
      `${selectedType?.emoji} Funds ${isTransfer ? 'Transferred' : 'Added'}!`,
      `$${numAmount.toFixed(2)} has been ${isTransfer ? 'transferred to' : 'added to'} your ${selectedType?.name}${transferText}! ${selectedFundType === 'crypto' ? 'Your parent will be notified to approve the transfer.' : 'Keep up the great saving!'}`,
      [{ text: 'Awesome! 🌟', style: 'default' }]
    );
    
    handleClose();
  };

  const getFundTypeColor = (fundType: string) => {
    const type = fundTypes.find(t => t.id === fundType);
    return type?.color || '#6B7280';
  };

  const handleAddFundsWithRewards = (amount: number, fundType: 'savings' | 'investment' | 'crypto', sourceAccount?: 'savings' | 'investment' | 'crypto') => {
    if (sourceAccount) {
      // This is a transfer - use existing transfer logic
      handleAddFundsWithTransfer(amount, fundType, sourceAccount);
    } else {
      // This is adding new money
      if (fundType === 'investment') {
        // Award tokens and XP for new investments
        const tokensEarned = Math.floor(amount * 2);
        const xpEarned = Math.floor(amount * 3);
        
        // Call the original handler
        onAddFunds(amount, fundType, sourceAccount);
        
        // Show rewards notification
        setTimeout(() => {
          Alert.alert(
            '🎉 Investment Rewards!',
            `Great job investing! You earned:\n\n🪙 +${tokensEarned} MokTokens\n⚡ +${xpEarned} XP\n\nInvesting helps your money grow and teaches you about building wealth! 💪`,
            [{ text: 'Awesome! 🌟', style: 'default' }]
          );
        }, 500);
      } else {
        // Regular savings or crypto - no special rewards
        onAddFunds(amount, fundType, sourceAccount);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <LinearGradient
        colors={['#ECFCCB', '#FFFFFF']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X color="#6B7280" size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Add Funds 💰</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Transfer Toggle */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How would you like to add funds?</Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleOption, !isTransfer && styles.toggleOptionActive]}
                  onPress={() => {
                    setIsTransfer(false);
                    setSelectedSourceAccount(null);
                  }}
                >
                  <Text style={[styles.toggleText, !isTransfer && styles.toggleTextActive]}>
                    Add New Money
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleOption, isTransfer && styles.toggleOptionActive]}
                  onPress={() => setIsTransfer(true)}
                >
                  <Text style={[styles.toggleText, isTransfer && styles.toggleTextActive]}>
                    Transfer Between Accounts
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Source Account Selection (only for transfers) */}
            {isTransfer && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Transfer from which account?</Text>
                <View style={styles.fundTypesContainer}>
                  {fundTypes.map((fundType) => (
                    <TouchableOpacity
                      key={`source-${fundType.id}`}
                      style={[
                        styles.fundTypeCard,
                        selectedSourceAccount === fundType.id && styles.fundTypeCardSelected,
                        { borderColor: selectedSourceAccount === fundType.id ? fundType.color : '#E5E7EB' }
                      ]}
                      onPress={() => setSelectedSourceAccount(fundType.id)}
                    >
                      <View style={styles.fundTypeHeader}>
                        <View style={[
                          styles.fundTypeIconContainer,
                          { backgroundColor: fundType.color + '20' }
                        ]}>
                          <fundType.icon color={fundType.color} size={24} />
                        </View>
                        <View style={styles.fundTypeInfo}>
                          <Text style={[
                            styles.fundTypeName,
                            selectedSourceAccount === fundType.id && { color: fundType.color }
                          ]}>
                            {fundType.name}
                          </Text>
                          <Text style={styles.fundTypeDescription}>
                            {fundType.description}
                          </Text>
                        </View>
                        {selectedSourceAccount === fundType.id && (
                          <View style={[
                            styles.selectedIndicator,
                            { backgroundColor: fundType.color }
                          ]}>
                            <Text style={styles.selectedEmoji}>{fundType.emoji}</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Amount Input */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {isTransfer ? 'How much would you like to transfer?' : 'How much would you like to add?'}
              </Text>
              <View style={[
                styles.inputContainer,
                focusedField === 'amount' && styles.inputContainerFocused
              ]}>
                <DollarSign color={focusedField === 'amount' ? '#10B981' : '#9CA3AF'} size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  onFocus={() => setFocusedField('amount')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
              <Text style={styles.helperText}>
                💡 Tip: {isTransfer ? 'Make sure you have enough in your source account!' : 'Start with any amount - even $1 makes a difference!'}
              </Text>
            </View>

            {/* Destination Fund Type Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {isTransfer ? 'Transfer to which account?' : 'Where would you like to add it?'}
              </Text>
              <View style={styles.fundTypesContainer}>
                {fundTypes.map((fundType) => (
                  <TouchableOpacity
                    key={`dest-${fundType.id}`}
                    style={[
                      styles.fundTypeCard,
                      selectedFundType === fundType.id && styles.fundTypeCardSelected,
                      { borderColor: selectedFundType === fundType.id ? fundType.color : '#E5E7EB' },
                      isTransfer && selectedSourceAccount === fundType.id && styles.fundTypeCardDisabled
                    ]}
                    onPress={() => {
                      if (!(isTransfer && selectedSourceAccount === fundType.id)) {
                        setSelectedFundType(fundType.id);
                      }
                    }}
                    disabled={isTransfer && selectedSourceAccount === fundType.id}
                  >
                    <View style={styles.fundTypeHeader}>
                      <View style={[
                        styles.fundTypeIconContainer,
                        { backgroundColor: fundType.color + '20' }
                      ]}>
                        <fundType.icon color={fundType.color} size={24} />
                      </View>
                      <View style={styles.fundTypeInfo}>
                        <Text style={[
                          styles.fundTypeName,
                          selectedFundType === fundType.id && { color: fundType.color },
                          isTransfer && selectedSourceAccount === fundType.id && styles.fundTypeNameDisabled
                        ]}>
                          {fundType.name}
                        </Text>
                        <Text style={[
                          styles.fundTypeDescription,
                          isTransfer && selectedSourceAccount === fundType.id && styles.fundTypeDescriptionDisabled
                        ]}>
                          {fundType.description}
                        </Text>
                      </View>
                      {selectedFundType === fundType.id && !(isTransfer && selectedSourceAccount === fundType.id) && (
                        <View style={[
                          styles.selectedIndicator,
                          { backgroundColor: fundType.color }
                        ]}>
                          <Text style={styles.selectedEmoji}>{fundType.emoji}</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.fundTypeDetails}>
                      <Text style={[
                        styles.fundTypeDetailsText,
                        isTransfer && selectedSourceAccount === fundType.id && styles.fundTypeDetailsDisabled
                      ]}>
                        {fundType.details}
                      </Text>
                    </View>

                    {fundType.id === 'crypto' && (
                      <View style={styles.cryptoNotice}>
                        <Info color="#F59E0B" size={16} />
                        <Text style={styles.cryptoNoticeText}>
                          Parent approval required for crypto transfers
                        </Text>
                      </View>
                    )}

                    {isTransfer && selectedSourceAccount === fundType.id && (
                      <View style={styles.disabledOverlay}>
                        <Text style={styles.disabledText}>Cannot transfer to same account</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preview */}
            {amount && selectedFundType && (!isTransfer || selectedSourceAccount) && (
              <View style={styles.previewSection}>
                <Text style={styles.previewTitle}>Transaction Preview 👀</Text>
                <View style={styles.previewCard}>
                  <View style={styles.previewHeader}>
                    <Text style={styles.previewAmount}>
                      <Text>{isTransfer ? '↔️' : '+'} ${parseFloat(amount || '0').toFixed(2)}</Text>
                    </Text>
                    <View style={[
                      styles.previewBadge,
                      { backgroundColor: getFundTypeColor(selectedFundType) + '20' }
                    ]}>
                      <Text style={[
                        styles.previewBadgeText,
                        { color: getFundTypeColor(selectedFundType) }
                      ]}>
                        {isTransfer ? 'Transfer' : 'Add'} to {fundTypes.find(t => t.id === selectedFundType)?.name}
                      </Text>
                    </View>
                  </View>

                  {isTransfer && selectedSourceAccount && (
                    <View style={styles.transferInfo}>
                      <Text style={styles.transferInfoText}>
                        From: {fundTypes.find(t => t.id === selectedSourceAccount)?.name}
                      </Text>
                      <Text style={styles.transferInfoText}>
                        To: {fundTypes.find(t => t.id === selectedFundType)?.name}
                      </Text>
                    </View>
                  )}
                  
                  {!isTransfer && selectedFundType === 'investment' && (
                    <View style={styles.previewRewards}>
                      <Text style={styles.previewRewardsTitle}>Investment Rewards:</Text>
                      <View style={styles.rewardsList}>
                        <Text style={styles.rewardItem}>
                          🪙 +{Math.floor(parseFloat(amount || '0') * 2)} MokTokens
                        </Text>
                        <Text style={styles.rewardItem}>
                          ⚡ +{Math.floor(parseFloat(amount || '0') * 3)} XP
                        </Text>
                      </View>
                    </View>
                  )}
                  
                  {!isTransfer && selectedFundType !== 'investment' && (
                    <View style={styles.previewEncouragement}>
                      <Text style={styles.previewEncouragementText}>
                        🌟 Great job building your savings habits! Every dollar saved brings you closer to your financial goals!
                      </Text>
                    </View>
                  )}

                  {isTransfer && (selectedSourceAccount === 'investment' || selectedFundType === 'investment') && (
                    <View style={styles.previewTokenChange}>
                      <Text style={styles.previewTokenChangeTitle}>Token Impact:</Text>
                      {selectedSourceAccount === 'investment' && selectedFundType !== 'investment' && (
                        <Text style={styles.tokenLossText}>
                          📉 -{Math.floor(parseFloat(amount || '0') * 2)} MokTokens, -{Math.floor(parseFloat(amount || '0') * 3)} XP (withdrawing from investments)
                        </Text>
                      )}
                      {selectedSourceAccount !== 'investment' && selectedFundType === 'investment' && (
                        <Text style={styles.tokenGainText}>
                          🎉 +{Math.floor(parseFloat(amount || '0') * 2)} MokTokens, +{Math.floor(parseFloat(amount || '0') * 3)} XP (investing funds)
                        </Text>
                      )}
                      {selectedSourceAccount === 'investment' && selectedFundType === 'investment' && (
                        <Text style={styles.tokenNeutralText}>
                          ↔️ No token change (staying in investments)
                        </Text>
                      )}
                    </View>
                  )}

                  {selectedFundType === 'crypto' && (
                    <View style={styles.previewNotice}>
                      <Text style={styles.previewNoticeText}>
                        📱 Your parent will receive a notification to approve this crypto transfer
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.submitGradient}
              >
                <Sparkles color="#FFFFFF" size={20} />
                <Text style={styles.submitButtonText}>
                  {isTransfer ? 'Transfer Funds' : 'Add Funds'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Educational Info */}
            <View style={styles.educationContainer}>
              <Text style={styles.educationTitle}>💡 Smart Money Tips</Text>
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>🏦</Text>
                  <Text style={styles.tipText}>Regular savings are perfect for goals you want to reach soon</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>📈</Text>
                  <Text style={styles.tipText}>Investments earn MokTokens and work best when you can wait years for them to grow</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>₿</Text>
                  <Text style={styles.tipText}>Crypto is digital money that can change value quickly</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>🔄</Text>
                  <Text style={styles.tipText}>Moving money out of investments will cost you MokTokens - invest wisely!</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>👨‍👩‍👧‍👦</Text>
                  <Text style={styles.tipText}>Always talk to your parents about big financial decisions!</Text>
                </View>
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#10B981',
    fontFamily: 'Inter-SemiBold',
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
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    paddingVertical: 12,
    marginLeft: 12,
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
  },
  fundTypesContainer: {
    gap: 16,
  },
  fundTypeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  fundTypeCardSelected: {
    backgroundColor: '#F8FAFC',
    shadowColor: '#10B981',
    shadowOpacity: 0.1,
    elevation: 4,
  },
  fundTypeCardDisabled: {
    opacity: 0.5,
  },
  fundTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fundTypeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  fundTypeInfo: {
    flex: 1,
  },
  fundTypeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  fundTypeNameDisabled: {
    color: '#9CA3AF',
  },
  fundTypeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  fundTypeDescriptionDisabled: {
    color: '#D1D5DB',
  },
  selectedIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedEmoji: {
    fontSize: 16,
  },
  fundTypeDetails: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  fundTypeDetailsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 16,
  },
  fundTypeDetailsDisabled: {
    color: '#D1D5DB',
  },
  cryptoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 8,
    gap: 6,
  },
  cryptoNoticeText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    flex: 1,
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#9CA3AF',
  },
  transferInfo: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  transferInfoText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
    marginBottom: 2,
  },
  previewSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewAmount: {
    fontSize: 24,
    fontFamily: 'Fredoka-Bold',
    color: '#10B981',
  },
  previewBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  previewBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  previewRewards: {
    marginBottom: 12,
  },
  previewRewardsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  previewEncouragement: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  previewEncouragementText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#0369A1',
    textAlign: 'center',
    lineHeight: 18,
  },
  rewardsList: {
    gap: 4,
  },
  rewardItem: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  previewTokenChange: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  previewTokenChangeTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  tokenGainText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  tokenLossText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#DC2626',
  },
  tokenNeutralText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  previewNotice: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  previewNoticeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#92400E',
    lineHeight: 16,
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
  educationContainer: {
    backgroundColor: '#F0FDF4',
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  educationTitle: {
    fontSize: 16,
    fontFamily: 'Fredoka-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipEmoji: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#059669',
    flex: 1,
    lineHeight: 18,
  },
});