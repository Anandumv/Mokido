import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, DollarSign, Target, Flag, Sparkles, Info, TrendingUp } from 'lucide-react-native';
import { Goal } from '@/contexts/DataContext';
import DatePicker from './DatePicker';

interface ContributeToGoalModalProps {
  visible: boolean;
  onClose: () => void;
  goal: Goal | null;
  userSavings: number;
  onContribute: (goalId: string, amount: number, updates?: Partial<Goal>) => void;
}

const priorities = [
  { id: 'Low', name: 'Low Priority', color: '#10B981', description: 'Nice to have' },
  { id: 'Medium', name: 'Medium Priority', color: '#F59E0B', description: 'Important goal' },
  { id: 'High', name: 'High Priority', color: '#EF4444', description: 'Must achieve' },
];

export default function ContributeToGoalModal({ 
  visible, 
  onClose, 
  goal, 
  userSavings, 
  onContribute 
}: ContributeToGoalModalProps) {
  const [amount, setAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  if (!goal) return null;

  const resetForm = () => {
    setAmount('');
    setNewDueDate(goal.dueDate);
    setNewPriority(goal.priority);
    setFocusedField(null);
    setShowAdvancedOptions(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const currentProgress = (goal.currentAmount / goal.targetAmount) * 100;

  const validateForm = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than $0');
      return false;
    }
    
    if (numAmount > userSavings) {
      Alert.alert('Insufficient Funds', `You only have $${userSavings.toFixed(2)} in your savings account.`);
      return false;
    }

    if (numAmount > remainingAmount) {
      Alert.alert('Amount Too Large', `You only need $${remainingAmount.toFixed(2)} more to reach this goal.`);
      return false;
    }

    // Validate date if provided and different from current
    if (newDueDate && newDueDate !== goal.dueDate && newDueDate.trim() !== '') {
      const goalDate = new Date(newDueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (goalDate <= today) {
        Alert.alert('Invalid Date', 'Due date must be in the future.');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const numAmount = parseFloat(amount);
    const updates: Partial<Goal> = {};
    
    // Check if due date was changed
    if (newDueDate && newDueDate !== goal.dueDate && newDueDate.trim() !== '') {
      updates.dueDate = newDueDate;
    }
    
    // Check if priority was changed
    if (newPriority !== goal.priority) {
      updates.priority = newPriority;
    }
    
    onContribute(goal.id, numAmount, Object.keys(updates).length > 0 ? updates : undefined);
    
    const newTotal = goal.currentAmount + numAmount;
    const isCompleted = newTotal >= goal.targetAmount;
    
    Alert.alert(
      isCompleted ? '🎉 Goal Completed!' : '💰 Contribution Added!',
      isCompleted 
        ? `Congratulations! You've reached your goal "${goal.title}"! 🎊\n\nYou contributed $${numAmount.toFixed(2)} and completed your goal!`
        : `You contributed $${numAmount.toFixed(2)} to "${goal.title}"!\n\nProgress: $${newTotal.toFixed(2)} / $${goal.targetAmount.toFixed(2)} (${((newTotal / goal.targetAmount) * 100).toFixed(0)}%)\n\nKeep up the great work! 💪`,
      [{ text: isCompleted ? 'Amazing! 🌟' : 'Great! 👍', style: 'default' }]
    );
    
    handleClose();
  };

  const getPriorityColor = (priority: string) => {
    const priorityData = priorities.find(p => p.id === priority);
    return priorityData?.color || '#6B7280';
  };

  const newProgress = amount ? ((goal.currentAmount + parseFloat(amount || '0')) / goal.targetAmount) * 100 : currentProgress;

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
            <Text style={styles.title}>Contribute to Goal 🎯</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Goal Overview */}
            <View style={styles.goalOverview}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
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

              <View style={styles.goalProgress}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressAmount}>
                    <Text>${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</Text>
                  </Text>
                  <Text style={styles.progressPercentage}>
                    <Text>{currentProgress.toFixed(0)}% complete</Text>
                  </Text>
                </View>
                
                <View style={styles.progressBar}>
                  <View style={[
                    styles.progressFill,
                    { width: `${Math.min(currentProgress, 100)}%` }
                  ]} />
                </View>
                
                <Text style={styles.remainingAmount}>
                  <Text>${remainingAmount.toFixed(2)} remaining</Text>
                </Text>
              </View>

              <View style={styles.goalMeta}>
                <Text style={styles.goalCategory}>
                  <Text>Category: {goal.category}</Text>
                </Text>
                <Text style={styles.goalDueDate}>
                  <Text>Due: {goal.dueDate}</Text>
                </Text>
              </View>
            </View>

            {/* Available Funds */}
            <View style={styles.fundsInfo}>
              <View style={styles.fundsHeader}>
                <DollarSign color="#10B981" size={20} />
                <Text style={styles.fundsTitle}>Available in Savings</Text>
              </View>
              <Text style={styles.fundsAmount}>
                <Text>${userSavings.toFixed(2)}</Text>
              </Text>
            </View>

            {/* Contribution Amount */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contribution Amount</Text>
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
              
              {/* Quick Amount Buttons */}
              <View style={styles.quickAmounts}>
                <TouchableOpacity 
                  style={styles.quickAmountButton}
                  onPress={() => setAmount(Math.min(25, remainingAmount, userSavings).toFixed(2))}
                >
                  <Text style={styles.quickAmountText}>$25</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickAmountButton}
                  onPress={() => setAmount(Math.min(50, remainingAmount, userSavings).toFixed(2))}
                >
                  <Text style={styles.quickAmountText}>$50</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickAmountButton}
                  onPress={() => setAmount(Math.min(remainingAmount, userSavings).toFixed(2))}
                >
                  <Text style={styles.quickAmountText}>All Remaining</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Advanced Options Toggle */}
            <TouchableOpacity 
              style={styles.advancedToggle}
              onPress={() => setShowAdvancedOptions(!showAdvancedOptions)}
            >
              <Text style={styles.advancedToggleText}>
                {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
              </Text>
              <TrendingUp 
                color="#6366F1" 
                size={16} 
                style={{ 
                  transform: [{ rotate: showAdvancedOptions ? '180deg' : '0deg' }] 
                }} 
              />
            </TouchableOpacity>

            {/* Advanced Options */}
            {showAdvancedOptions && (
              <View style={styles.advancedOptions}>
                {/* Update Due Date */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Update Due Date (Optional)</Text>
                  <DatePicker
                    value={newDueDate}
                    onDateChange={setNewDueDate}
                    placeholder={`Current: ${new Date(goal.dueDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}`}
                    minimumDate={new Date()}
                  />
                  <Text style={styles.helperText}>
                    💡 Leave unchanged to keep the current due date
                  </Text>
                </View>

                {/* Update Priority */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Update Priority (Optional)</Text>
                  <View style={styles.prioritiesContainer}>
                    {priorities.map((priority) => (
                      <TouchableOpacity
                        key={priority.id}
                        style={[
                          styles.priorityCard,
                          newPriority === priority.id && styles.priorityCardSelected,
                          { borderColor: newPriority === priority.id ? priority.color : '#E5E7EB' }
                        ]}
                        onPress={() => setNewPriority(priority.id as 'Low' | 'Medium' | 'High')}
                      >
                        <View style={styles.priorityHeader}>
                          <Flag color={priority.color} size={16} />
                          <Text style={[
                            styles.priorityName,
                            newPriority === priority.id && { color: priority.color }
                          ]}>
                            {priority.name}
                          </Text>
                        </View>
                        <Text style={styles.priorityDescription}>
                          {priority.description}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* Preview */}
            {amount && (
              <View style={styles.previewSection}>
                <Text style={styles.previewTitle}>Contribution Preview 👀</Text>
                <View style={styles.previewCard}>
                  <View style={styles.previewHeader}>
                    <Text style={styles.previewAmount}>
                      <Text>+${parseFloat(amount || '0').toFixed(2)}</Text>
                    </Text>
                    <View style={styles.previewBadge}>
                      <Text style={styles.previewBadgeText}>Contribution</Text>
                    </View>
                  </View>
                  
                  <View style={styles.previewProgress}>
                    <Text style={styles.previewProgressTitle}>New Progress:</Text>
                    <Text style={styles.previewProgressText}>
                      <Text>${(goal.currentAmount + parseFloat(amount || '0')).toFixed(2)} / ${goal.targetAmount.toFixed(2)} ({newProgress.toFixed(0)}%)</Text>
                    </Text>
                    
                    <View style={styles.previewProgressBar}>
                      <View style={[
                        styles.previewProgressFill,
                        { width: `${Math.min(newProgress, 100)}%` }
                      ]} />
                    </View>
                  </View>

                  <View style={styles.previewRewards}>
                    <Text style={styles.previewRewardsTitle}>Great progress!</Text>
                    <Text style={styles.encouragementText}>
                      🌟 Contributing to your goals builds excellent saving habits! Keep up the amazing work!
                    </Text>
                  </View>

                  {newProgress >= 100 && (
                    <View style={styles.completionNotice}>
                      <Text style={styles.completionNoticeText}>
                        🎉 This contribution will complete your goal!
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
                (!amount || parseFloat(amount || '0') <= 0) && styles.submitButtonDisabled
              ]} 
              onPress={handleSubmit}
              disabled={!amount || parseFloat(amount || '0') <= 0}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.submitGradient}
              >
                <Sparkles color="#FFFFFF" size={20} />
                <Text style={styles.submitButtonText}>Contribute to Goal</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Info Section */}
            <View style={styles.infoContainer}>
              <View style={styles.infoHeader}>
                <Info color="#3B82F6" size={16} />
                <Text style={styles.infoTitle}>Smart Saving Tips</Text>
              </View>
              <View style={styles.tipsList}>
                <Text style={styles.tipText}>
                  💡 Regular small contributions add up faster than you think!
                </Text>
                <Text style={styles.tipText}>
                  🎯 Adjust your goal's priority if your circumstances change
                </Text>
                <Text style={styles.tipText}>
                  📅 Update due dates to keep your goals realistic and achievable
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
  goalOverview: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
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
  goalProgress: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressAmount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  progressPercentage: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  remainingAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
    textAlign: 'center',
  },
  goalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  goalDueDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  fundsInfo: {
    backgroundColor: '#F0FDF4',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    marginBottom: 20,
  },
  fundsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  fundsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
  },
  fundsAmount: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#059669',
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
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 8,
  },
  advancedToggleText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
  advancedOptions: {
    backgroundColor: '#F8FAFC',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
  },
  prioritiesContainer: {
    gap: 8,
  },
  priorityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  priorityCardSelected: {
    backgroundColor: '#F8FAFC',
  },
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  priorityName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  priorityDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
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
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  previewBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
  },
  previewProgress: {
    marginBottom: 16,
  },
  previewProgressTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  previewProgressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginBottom: 8,
  },
  previewProgressBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
  },
  previewProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
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
  rewardsList: {
    gap: 4,
  },
  rewardItem: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  encouragementText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#059669',
    lineHeight: 18,
    textAlign: 'center',
  },
  completionNotice: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  completionNoticeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
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