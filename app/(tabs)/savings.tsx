import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PiggyBank, TrendingUp, Target, Plus, Coins, Calendar, DollarSign, ChevronRight, Trophy } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { router } from 'expo-router';
import AddGoalModal from '@/components/AddGoalModal';
import AddFundsModal from '@/components/AddFundsModal';
import ContributeToGoalModal from '@/components/ContributeToGoalModal';
import InvestmentSimulator from '@/components/InvestmentSimulator';

export default function SavingsScreen() {
  const { user, updateUser } = useAuth();
  const { goals, transactions, addTransaction, addGoal, updateGoal } = useData();
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [showInvestmentSimulator, setShowInvestmentSimulator] = useState(false);

  if (!user) return null;

  const totalSavings = user.savings + user.investmentBalance + user.cryptoBalance;
  const savingsTransactions = transactions.filter(t => t.type === 'saving').slice(0, 5);

  const handleAddSavings = () => {
    setShowAddFundsModal(true);
  };

  const handleAddFunds = (amount: number, fundType: 'savings' | 'investment' | 'crypto') => {
    let tokensEarned = 0;
    let xpEarned = 0;
    
    // Award tokens and XP for new investments
    if (fundType === 'investment') {
      tokensEarned = Math.floor(amount * 2);
      xpEarned = Math.floor(amount * 3);
    }
    
    // Add transaction record
    const transactionCategory = fundType === 'savings' ? 'Personal Savings' : 
                               fundType === 'investment' ? 'Investment Deposit' : 
                               'Crypto Deposit';
    
    addTransaction({
      type: 'saving',
      amount: amount,
      category: transactionCategory,
      description: `Added to ${fundType === 'savings' ? 'savings' : fundType === 'investment' ? 'investments' : 'crypto'}`,
      date: new Date().toISOString().split('T')[0]
    });
    
    switch (fundType) {
      case 'savings':
        updateUser({
          savings: user.savings + amount,
        });
        break;
        
      case 'investment':
        updateUser({
          investmentBalance: user.investmentBalance + amount,
          mokTokens: user.mokTokens + tokensEarned,
          xp: user.xp + xpEarned
        });
        
        // Show investment rewards notification
        setTimeout(() => {
          Alert.alert(
            '🎉 Investment Rewards!',
            `Great job investing! You earned:\n\n🪙 +${tokensEarned} MokTokens\n⚡ +${xpEarned} XP\n\nInvesting helps your money grow and teaches you about building wealth! 💪`,
            [{ text: 'Awesome! 🌟', style: 'default' }]
          );
        }, 1000);
        break;
        
      case 'crypto':
        // For crypto, show parent notification instead of directly updating balance
        // No automatic balance update for crypto
        
        // Show parent notification alert
        setTimeout(() => {
          Alert.alert(
            '📱 Parent Notification Sent',
            `Your parent has been notified to transfer $${amount.toFixed(2)} to your crypto account. They'll handle the actual transfer from their crypto wallet to yours.\n\nGreat job taking initiative with your savings! 🌟`,
            [{ text: 'Got it! 👍', style: 'default' }]
          );
        }, 1000);
        break;
    }
  };

  const handleAddFundsWithTransfer = (amount: number, fundType: 'savings' | 'investment' | 'crypto', sourceAccount?: 'savings' | 'investment' | 'crypto') => {
    if (sourceAccount) {
      // This is a transfer between accounts
      const sourceBalance = sourceAccount === 'savings' ? user.savings :
                           sourceAccount === 'investment' ? user.investmentBalance :
                           user.cryptoBalance;
      
      if (sourceBalance < amount) {
        Alert.alert('Insufficient Funds', `You don't have enough in your ${sourceAccount} account to transfer $${amount.toFixed(2)}.`);
        return;
      }
      
      // Calculate token/XP impact for transfers
      let tokenChange = 0;
      let xpChange = 0;
      
      // Lose tokens when withdrawing FROM investments
      if (sourceAccount === 'investment') {
        tokenChange -= Math.floor(amount * 2);
        xpChange -= Math.floor(amount * 3);
      }
      
      // Gain tokens when transferring TO investments
      if (fundType === 'investment') {
        tokenChange += Math.floor(amount * 2);
        xpChange += Math.floor(amount * 3);
      }
      
      // Deduct from source account
      const sourceUpdate = sourceAccount === 'savings' ? { savings: user.savings - amount } :
                          sourceAccount === 'investment' ? { investmentBalance: user.investmentBalance - amount } :
                          { cryptoBalance: user.cryptoBalance - amount };
      
      // Add to destination account
      const destUpdate = fundType === 'savings' ? { savings: user.savings + amount } :
                        fundType === 'investment' ? { investmentBalance: user.investmentBalance + amount } :
                        { cryptoBalance: user.cryptoBalance + amount };
      
      // Update user with both changes and token/XP impact
      updateUser({
        ...sourceUpdate,
        ...destUpdate,
        ...(tokenChange !== 0 && { mokTokens: user.mokTokens + tokenChange }),
        ...(xpChange !== 0 && { xp: user.xp + xpChange })
      });
      
      // Add transaction records for both sides
      addTransaction({
        type: 'expense',
        amount: amount,
        category: 'Transfer Out',
        description: `Transferred from ${sourceAccount} to ${fundType}`,
        date: new Date().toISOString().split('T')[0]
      });
      
      addTransaction({
        type: 'saving',
        amount: amount,
        category: 'Transfer In',
        description: `Transferred from ${sourceAccount} to ${fundType}`,
        date: new Date().toISOString().split('T')[0]
      });
      
      let alertMessage = `Successfully transferred $${amount.toFixed(2)} from your ${sourceAccount} to ${fundType}!`;
      
      if (tokenChange !== 0 || xpChange !== 0) {
        alertMessage += `\n\n💰 Token Impact:`;
        if (tokenChange > 0) {
          alertMessage += `\n🎉 +${tokenChange} MokTokens, +${xpChange} XP (investing funds)`;
        } else if (tokenChange < 0) {
          alertMessage += `\n📉 ${tokenChange} MokTokens, ${xpChange} XP (withdrawing from investments)`;
        }
      }
      
      alertMessage += `\n\nKeep up the great saving habits! 💪`;
      
      Alert.alert(
        '🔄 Transfer Complete!',
        alertMessage,
        [{ text: 'Great! 👍', style: 'default' }]
      );
    } else {
      // This is adding new money (existing functionality)
      handleAddFunds(amount, fundType);
    }
  };

  const getGoalProgress = (goal: any) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const handleOpenContributeModal = (goal: any) => {
    setSelectedGoal(goal);
    setShowContributeModal(true);
  };

  const handleContributeToGoal = (goalId: string, amount: number, updates?: any) => {
    // Update user savings (no tokens/XP for saving activities)
    updateUser({
      savings: user.savings - amount,
    });

    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const goalUpdates = {
        currentAmount: goal.currentAmount + amount,
        ...updates
      };
      updateGoal(goalId, goalUpdates);
    }
  };

  const handleNavigateToSavings = () => {
    // Since we're already on the savings screen, we don't need to navigate
    // This function exists for consistency with other screens
  };

  // Calculate total goal progress for the progress card
  const totalGoalProgress = goals.length > 0 
    ? goals.reduce((sum, goal) => sum + getGoalProgress(goal), 0) / goals.length 
    : 0;

  return (
    <LinearGradient
      colors={['#ECFCCB', '#FFFFFF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Savings 💰</Text>
          <Text style={styles.subtitle}>Watch your money grow!</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Savings Overview */}
          <View style={styles.overviewContainer}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.overviewGradient}
            >
              <View style={styles.overviewHeader}>
                <PiggyBank color="#FFFFFF" size={32} />
                <Text style={styles.overviewTitle}>Total Savings</Text>
              </View>
              <Text style={styles.overviewAmount}>${totalSavings.toFixed(2)}</Text>
              
              <View style={styles.balanceBreakdown}>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceLabel}>Regular Savings</Text>
                  <Text style={styles.balanceValue}>${user.savings.toFixed(2)}</Text>
                </View>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceLabel}>Investments</Text>
                  <Text style={styles.balanceValue}>${user.investmentBalance.toFixed(2)}</Text>
                </View>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceLabel}>Crypto</Text>
                  <Text style={styles.balanceValue}>${user.cryptoBalance.toFixed(2)}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.addSavingsButton} onPress={handleAddSavings}>
                <Plus color="#10B981" size={20} />
                <Text style={styles.addSavingsText}>Add Funds</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <TrendingUp color="#10B981" size={24} />
              <Text style={styles.statValue}>+12.5%</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
            <View style={styles.statCard}>
              <Target color="#3B82F6" size={24} />
              <Text style={styles.statValue}>{goals.length}</Text>
              <Text style={styles.statLabel}>Active Goals</Text>
            </View>
            <View style={styles.statCard}>
              <Trophy color="#F59E0B" size={24} />
              <Text style={styles.statValue}>
                {goals.filter(g => getGoalProgress(g) >= 100).length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>

          {/* Savings Goals */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Savings Goals</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowAddGoalModal(true)}
              >
                <Plus color="#10B981" size={20} />
              </TouchableOpacity>
            </View>

            {goals.map((goal) => {
              const progress = getGoalProgress(goal);
              const isCompleted = progress >= 100;
              const remaining = goal.targetAmount - goal.currentAmount;
              
              return (
                <TouchableOpacity 
                  key={goal.id} 
                  style={styles.goalCard}
                  onPress={() => !isCompleted && handleOpenContributeModal(goal)}
                >
                  <View style={styles.goalHeader}>
                    <View style={styles.goalInfo}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <Text style={styles.goalAmount}>
                        ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.goalMeta}>
                      <View style={[
                        styles.priorityBadge,
                        { backgroundColor: getPriorityColor(goal.priority) + '20' }
                      ]}>
                        <Text style={[
                          styles.priorityText,
                          { color: getPriorityColor(goal.priority) }
                        ]}>
                          {goal.priority}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Add Contribution Button */}
                  {!isCompleted && (
                    <View style={styles.goalActions}>
                      <TouchableOpacity 
                        style={styles.contributeButton}
                        onPress={() => handleOpenContributeModal(goal)}
                      >
                        <Plus color="#10B981" size={16} />
                        <Text style={styles.contributeButtonText}>Add Funds</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View style={[
                        styles.progressFill,
                        { width: `${progress}%` },
                        isCompleted && styles.progressCompleted
                      ]} />
                    </View>
                    <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
                  </View>

                  <View style={styles.goalFooter}>
                    <View style={styles.goalDate}>
                      <Calendar color="#6B7280" size={16} />
                      <Text style={styles.goalDateText}>Due {goal.dueDate}</Text>
                    </View>
                    <Text style={styles.goalRemaining}>
                      {isCompleted ? 'Completed! 🎉' : `$${remaining.toFixed(2)} to go`}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Recent Transactions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Savings</Text>
              <TouchableOpacity>
                <ChevronRight color="#10B981" size={20} />
              </TouchableOpacity>
            </View>

            {savingsTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionIcon}>
                  <DollarSign color="#10B981" size={20} />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>{transaction.date || ''}</Text>
                </View>
                <Text style={styles.transactionAmount}>
                  +${transaction.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Savings Tips */}
          <View style={styles.tipsContainer}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.tipsGradient}
            >
              <Text style={styles.tipsEmoji}>💡</Text>
              <Text style={styles.tipsTitle}>Savings Tip</Text>
              <Text style={styles.tipsText}>
                Try the 50/30/20 rule: Save 20% of your money, spend 30% on wants, 
                and 50% on needs. Start small and grow your savings habit!
              </Text>
            </LinearGradient>
          </View>

          {/* Investment Simulator Preview */}
          <View style={styles.simulatorContainer}>
            <View style={styles.simulatorHeader}>
              <Text style={styles.simulatorTitle}>💎 Investment Simulator</Text>
              <Text style={styles.simulatorSubtitle}>See how your money can grow</Text>
            </View>
            <TouchableOpacity 
              style={styles.simulatorExample}
              onPress={() => setShowInvestmentSimulator(true)}
            >
              <Text style={styles.simulatorText}>
                If you invest $100 + $25/month for 10 years at 7% return:
              </Text>
              <Text style={styles.simulatorResult}>
                You'd have <Text style={styles.simulatorHighlight}>$4,677</Text>!
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.simulatorButton}
              onPress={() => setShowInvestmentSimulator(true)}
            >
              <Text style={styles.simulatorButtonText}>Open Investment Simulator</Text>
              <ChevronRight color="#10B981" size={16} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Add Goal Modal */}
        <AddGoalModal
          visible={showAddGoalModal}
          onClose={() => setShowAddGoalModal(false)}
          onAddGoal={(goalData) => {
            addGoal({
              id: Date.now().toString(),
              currentAmount: 0,
              ...goalData,
            });
            setShowAddGoalModal(false);
          }}
        />

        {/* Contribute to Goal Modal */}
        <ContributeToGoalModal
          visible={showContributeModal}
          onClose={() => setShowContributeModal(false)}
          goal={selectedGoal}
          userSavings={user.savings}
          onContribute={handleContributeToGoal}
        />
        {/* Add Funds Modal */}
        <AddFundsModal
          visible={showAddFundsModal}
          onClose={() => setShowAddFundsModal(false)}
          onAddFunds={handleAddFundsWithTransfer}
        />

        {/* Investment Simulator */}
        <InvestmentSimulator
          visible={showInvestmentSimulator}
          onClose={() => setShowInvestmentSimulator(false)}
        />
      </SafeAreaView>
    </LinearGradient>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Fredoka-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  overviewContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  overviewGradient: {
    padding: 24,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  overviewAmount: {
    fontSize: 36,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  balanceBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  addSavingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addSavingsText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Fredoka-SemiBold',
    color: '#1F2937',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  goalAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  goalMeta: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressCompleted: {
    backgroundColor: '#F59E0B',
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    minWidth: 40,
    textAlign: 'right',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  goalDateText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  goalRemaining: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
  },
  goalActions: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  contributeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
    gap: 6,
  },
  contributeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  tipsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tipsGradient: {
    padding: 20,
    alignItems: 'center',
  },
  tipsEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  tipsTitle: {
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
  },
  simulatorContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  simulatorHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  simulatorTitle: {
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  simulatorSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  simulatorExample: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  simulatorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  simulatorResult: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  simulatorHighlight: {
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
    color: '#10B981',
  },
  simulatorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  simulatorButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
});