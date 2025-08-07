import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, DollarSign, TrendingDown, TriangleAlert as AlertTriangle, Coins, Sparkles, Info } from 'lucide-react-native';

interface WithdrawFundsModalProps {
  visible: boolean;
  onClose: () => void;
  onWithdraw: (amount: number, fromAccount: 'savings' | 'investment' | 'crypto', toAccount: 'savings' | 'investment' | 'crypto') => void;
  userBalances: {
    savings: number;
    investment: number;
    crypto: number;
  };
}

const accountTypes = [
  {
    id: 'savings' as const,
    name: 'Regular Savings',
    icon: '🏦',
    color: '#10B981',
    description: 'Safe money for your goals'
  },
  {
    id: 'investment' as const,
    name: 'Investments',
    icon: '📈',
    color: '#3B82F6',
    description: 'Growing money over time'
  },
  {
    id: 'crypto' as const,
    name: 'Crypto Savings',
    icon: '₿',
    color: '#F59E0B',
    description: 'Digital currency'
  }
];

export default function WithdrawFundsModal({ 
  visible, 
  onClose, 
  onWithdraw, 
  userBalances 
}: WithdrawFundsModalProps) {
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState<'savings' | 'investment' | 'crypto' | null>(null);
  const [toAccount, setToAccount] = useState<'savings' | 'investment' | 'crypto' | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const resetForm = () => {
    setAmount('');
    setFromAccount(null);
    setToAccount(null);
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
    
    if (!fromAccount) {
      Alert.alert('Select Source', 'Please choose which account to withdraw from');
      return false;
    }

    if (!toAccount) {
      Alert.alert('Select Destination', 'Please choose where to transfer the funds');
      return false;
    }

    if (fromAccount === toAccount) {
      Alert.alert('Invalid Transfer', 'Cannot transfer to the same account type');
      return false;
    }

    const sourceBalance = userBalances[fromAccount];
    if (numAmount > sourceBalance) {
      Alert.alert('Insufficient Funds', `You only have $${sourceBalance.toFixed(2)} in your ${accountTypes.find(a => a.id === fromAccount)?.name}`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const numAmount = parseFloat(amount);
    
    // Special warning for withdrawing from investments
    if (fromAccount === 'investment') {
      const tokensLost = Math.floor(numAmount * 2);
      const xpLost = Math.floor(numAmount * 3);
      
      Alert.alert(
        '⚠️ Investment Withdrawal Warning',
        `Withdrawing $${numAmount.toFixed(2)} from investments will cost you:\n\n📉 ${tokensLost} MokTokens\n📉 ${xpLost} XP\n\nAre you sure you want to proceed? Investments work best when left to grow over time.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Withdraw Anyway',
            style: 'destructive',
            onPress: () => {
              onWithdraw(numAmount, fromAccount!, toAccount!);
              handleClose();
            }
          }
        ]
      );
    } else {
      onWithdraw(numAmount, fromAccount!, toAccount!);
      handleClose();
    }
  };

  const getAccountColor = (accountType: string) => {
    const account = accountTypes.find(a => a.id === accountType);
    return account?.color || '#6B7280';
  };

  const getTokenImpact = () => {
    if (!amount || !fromAccount || !toAccount) return null;
    
    const numAmount = parseFloat(amount);
    let tokenChange = 0;
    let xpChange = 0;
    
    // Lose tokens when withdrawing FROM investments
    if (fromAccount === 'investment') {
      tokenChange -= Math.floor(numAmount * 2);
      xpChange -= Math.floor(numAmount * 3);
    }
    
    // Gain tokens when transferring TO investments
    if (toAccount === 'investment') {
      tokenChange += Math.floor(numAmount * 2);
      xpChange += Math.floor(numAmount * 3);
    }
    
    return { tokenChange, xpChange };
  };

  const tokenImpact = getTokenImpact();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <LinearGradient
        colors={['#FEF2F2', '#FFFFFF']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X color="#6B7280" size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Withdraw Funds 💸</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Current Balances */}
            <View style={styles.balancesContainer}>
              <Text style={styles.sectionTitle}>Your Current Balances</Text>
              <View style={styles.balancesList}>
                {accountTypes.map((account) => (
                  <View key={account.id} style={styles.balanceItem}>
                    <Text style={styles.balanceIcon}>{account.icon}</Text>
                    <View style={styles.balanceInfo}>
                      <Text style={styles.balanceName}>{account.name}</Text>
                      <Text style={[styles.balanceAmount, { color: account.color }]}>
                        ${userBalances[account.id].toFixed(2)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Withdraw From */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Withdraw from which account?</Text>
              <View style={styles.accountsContainer}>
                {accountTypes.map((account) => (
                  <TouchableOpacity
                    key={`from-${account.id}`}
                    style={[
                      styles.accountCard,
                      fromAccount === account.id && styles.accountCardSelected,
                      { borderColor: fromAccount === account.id ? account.color : '#E5E7EB' },
                      userBalances[account.id] === 0 && styles.accountCardDisabled
                    ]}
                    onPress={() => userBalances[account.id] > 0 && setFromAccount(account.id)}
                    disabled={userBalances[account.id] === 0}
                  >
                    <View style={styles.accountHeader}>
                      <Text style={styles.accountIcon}>{account.icon}</Text>
                      <View style={styles.accountInfo}>
                        <Text style={[
                          styles.accountName,
                          fromAccount === account.id && { color: account.color },
                          userBalances[account.id] === 0 && styles.accountNameDisabled
                        ]}>
                          {account.name}
                        </Text>
                        <Text style={[
                          styles.accountBalance,
                          userBalances[account.id] === 0 && styles.accountBalanceDisabled
                        ]}>
                          ${userBalances[account.id].toFixed(2)} available
                        </Text>
                      </View>
                      {fromAccount === account.id && (
                        <View style={[styles.selectedIndicator, { backgroundColor: account.color }]}>
                          <Text style={styles.selectedEmoji}>✓</Text>
                        </View>
                      )}
                    </View>
                    
                    {userBalances[account.id] === 0 && (
                      <View style={styles.emptyAccountOverlay}>
                        <Text style={styles.emptyAccountText}>No funds available</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Amount Input */}
            {fromAccount && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>How much would you like to withdraw?</Text>
                <View style={[
                  styles.inputContainer,
                  focusedField === 'amount' && styles.inputContainerFocused
                ]}>
                  <DollarSign color={focusedField === 'amount' ? '#EF4444' : '#9CA3AF'} size={20} />
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
                
                {/* Quick Amount Buttons */}
                <View style={styles.quickAmounts}>
                  <TouchableOpacity 
                    style={styles.quickAmountButton}
                    onPress={() => setAmount(Math.min(25, userBalances[fromAccount]).toFixed(2))}
                  >
                    <Text style={styles.quickAmountText}>$25</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.quickAmountButton}
                    onPress={() => setAmount(Math.min(50, userBalances[fromAccount]).toFixed(2))}
                  >
                    <Text style={styles.quickAmountText}>$50</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.quickAmountButton}
                    onPress={() => setAmount(userBalances[fromAccount].toFixed(2))}
                  >
                    <Text style={styles.quickAmountText}>All</Text>
                  </TouchableOpacity>
                </View>

                {fromAccount === 'investment' && amount && (
                  <View style={styles.investmentWarning}>
                    <AlertTriangle color="#F59E0B" size={16} />
                    <Text style={styles.investmentWarningText}>
                      Withdrawing from investments will cost you MokTokens and XP!
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Transfer To */}
            {fromAccount && amount && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Transfer to which account?</Text>
                <View style={styles.accountsContainer}>
                  {accountTypes.filter(account => account.id !== fromAccount).map((account) => (
                    <TouchableOpacity
                      key={`to-${account.id}`}
                      style={[
                        styles.accountCard,
                        toAccount === account.id && styles.accountCardSelected,
                        { borderColor: toAccount === account.id ? account.color : '#E5E7EB' }
                      ]}
                      onPress={() => setToAccount(account.id)}
                    >
                      <View style={styles.accountHeader}>
                        <Text style={styles.accountIcon}>{account.icon}</Text>
                        <View style={styles.accountInfo}>
                          <Text style={[
                            styles.accountName,
                            toAccount === account.id && { color: account.color }
                          ]}>
                            {account.name}
                          </Text>
                          <Text style={styles.accountDescription}>
                            {account.description}
                          </Text>
                        </View>
                        {toAccount === account.id && (
                          <View style={[styles.selectedIndicator, { backgroundColor: account.color }]}>
                            <Text style={styles.selectedEmoji}>✓</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Preview */}
            {amount && fromAccount && toAccount && (
              <View style={styles.previewSection}>
                <Text style={styles.previewTitle}>Withdrawal Preview 👀</Text>
                <View style={styles.previewCard}>
                  <View style={styles.previewHeader}>
                    <Text style={styles.previewAmount}>
                      ${parseFloat(amount || '0').toFixed(2)}
                    </Text>
                    <View style={styles.previewBadge}>
                      <Text style={styles.previewBadgeText}>
                        {accountTypes.find(a => a.id === fromAccount)?.name} → {accountTypes.find(a => a.id === toAccount)?.name}
                      </Text>
                    </View>
                  </View>

                  {tokenImpact && (tokenImpact.tokenChange !== 0 || tokenImpact.xpChange !== 0) && (
                    <View style={styles.tokenImpactContainer}>
                      <Text style={styles.tokenImpactTitle}>Token Impact:</Text>
                      {tokenImpact.tokenChange < 0 && (
                        <Text style={styles.tokenLossText}>
                          📉 {Math.abs(tokenImpact.tokenChange)} MokTokens, {Math.abs(tokenImpact.xpChange)} XP (withdrawing from investments)
                        </Text>
                      )}
                      {tokenImpact.tokenChange > 0 && (
                        <Text style={styles.tokenGainText}>
                          🎉 +{tokenImpact.tokenChange} MokTokens, +{tokenImpact.xpChange} XP (moving to investments)
                        </Text>
                      )}
                    </View>
                  )}

                  {fromAccount === 'investment' && (
                    <View style={styles.warningNotice}>
                      <Text style={styles.warningNoticeText}>
                        ⚠️ Remember: Investments work best when left to grow over time. Consider if this withdrawal is really necessary.
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity 
              style={[
                styles.submitButton,
                (!amount || !fromAccount || !toAccount) && styles.submitButtonDisabled
              ]} 
              onPress={handleSubmit}
              disabled={!amount || !fromAccount || !toAccount}
            >
              <LinearGradient
                colors={['#EF4444', '#DC2626']}
                style={styles.submitGradient}
              >
                <TrendingDown color="#FFFFFF" size={20} />
                <Text style={styles.submitButtonText}>Withdraw Funds</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Educational Info */}
            <View style={styles.educationContainer}>
              <View style={styles.educationHeader}>
                <Info color="#3B82F6" size={16} />
                <Text style={styles.educationTitle}>💡 Smart Withdrawal Tips</Text>
              </View>
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>📈</Text>
                  <Text style={styles.tipText}>Investments grow best when left alone for long periods</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>🎯</Text>
                  <Text style={styles.tipText}>Only withdraw from investments if you really need the money</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>💰</Text>
                  <Text style={styles.tipText}>Withdrawing from investments costs MokTokens and XP</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>🏦</Text>
                  <Text style={styles.tipText}>Regular savings are better for money you might need soon</Text>
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
  balancesContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 24,
  },
  balancesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  balanceIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  balanceAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
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
  accountsContainer: {
    gap: 12,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  accountCardSelected: {
    backgroundColor: '#F8FAFC',
  },
  accountCardDisabled: {
    opacity: 0.5,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  accountNameDisabled: {
    color: '#9CA3AF',
  },
  accountBalance: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  accountBalanceDisabled: {
    color: '#D1D5DB',
  },
  accountDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedEmoji: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  emptyAccountOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyAccountText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#9CA3AF',
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
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    paddingVertical: 12,
    marginLeft: 12,
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
  investmentWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  investmentWarningText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    flex: 1,
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
    borderColor: '#EF4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    color: '#EF4444',
  },
  previewBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  previewBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
  },
  tokenImpactContainer: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  tokenImpactTitle: {
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
  warningNotice: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  warningNoticeText: {
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
  educationContainer: {
    backgroundColor: '#EFF6FF',
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  educationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  educationTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipEmoji: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#1E40AF',
    flex: 1,
    lineHeight: 16,
  },
});