import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Target, DollarSign, Flag, Sparkles } from 'lucide-react-native';
import DatePicker from './DatePicker';
import { handleAsyncError } from '@/utils/errorHandler';

interface AddGoalModalProps {
  visible: boolean;
  onClose: () => void;
  onAddGoal: (goal: {
    title: string;
    targetAmount: number;
    category: string;
    dueDate: string;
    priority: 'Low' | 'Medium' | 'High';
  }) => void;
}

const categories = [
  { id: 'recreation', name: 'Recreation', icon: '🎮', color: '#3B82F6' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#8B5CF6' },
  { id: 'education', name: 'Education', icon: '📚', color: '#10B981' },
  { id: 'hobbies', name: 'Hobbies', icon: '🎨', color: '#F59E0B' },
  { id: 'technology', name: 'Technology', icon: '💻', color: '#EF4444' },
  { id: 'sports', name: 'Sports', icon: '⚽', color: '#06B6D4' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#EC4899' },
  { id: 'other', name: 'Other', icon: '🎯', color: '#6B7280' },
];

const priorities = [
  { id: 'Low', name: 'Low Priority', color: '#10B981', description: 'Nice to have' },
  { id: 'Medium', name: 'Medium Priority', color: '#F59E0B', description: 'Important goal' },
  { id: 'High', name: 'High Priority', color: '#EF4444', description: 'Must achieve' },
];

export default function AddGoalModal({ visible, onClose, onAddGoal }: AddGoalModalProps) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setTargetAmount('');
    setSelectedCategory('');
    setDueDate('');
    setSelectedPriority('Medium');
    setFocusedField(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a goal title');
      return false;
    }
    
    const amount = parseFloat(targetAmount);
    if (!targetAmount || isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid target amount greater than $0');
      return false;
    }
    
    if (!selectedCategory) {
      Alert.alert('Missing Category', 'Please select a category for your goal');
      return false;
    }
    
    if (!dueDate) {
      Alert.alert('Missing Due Date', 'Please enter a due date (YYYY-MM-DD format)');
      return false;
    }
    
    // Basic date validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dueDate)) {
      Alert.alert('Invalid Date Format', 'Please use YYYY-MM-DD format (e.g., 2024-12-31)');
      return false;
    }
    
    const goalDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (goalDate <= today) {
      Alert.alert('Invalid Date', 'Due date must be in the future');
      return false;
    }
    
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    try {
      const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
      
      onAddGoal({
        title: title.trim(),
        targetAmount: parseFloat(targetAmount),
        category: selectedCategoryData?.name || 'Other',
        dueDate,
        priority: selectedPriority,
      });
      
      Alert.alert(
        'Goal Created! 🎯',
        `Your goal "${title}" has been added! Start saving to make it happen!\n\n💡 Remember: You can earn MokTokens and XP by completing learning modules and missions! 💪`,
        [{ text: 'Awesome! 🌟', style: 'default' }]
      );
      
      handleClose();
    } catch (error) {
      const errorMessage = handleAsyncError(error, {
        action: 'handleSubmit',
        component: 'AddGoalModal',
        additionalData: { title: title.trim(), targetAmount: parseFloat(targetAmount) }
      });
      Alert.alert('Error Creating Goal', errorMessage);
    }
  };

  const getPriorityColor = (priority: string) => {
    const priorityData = priorities.find(p => p.id === priority);
    return priorityData?.color || '#6B7280';
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
            <Text style={styles.title}>Add New Goal 🎯</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Goal Title */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Goal Title</Text>
              <View style={[
                styles.inputContainer,
                focusedField === 'title' && styles.inputContainerFocused
              ]}>
                <Target color={focusedField === 'title' ? '#10B981' : '#9CA3AF'} size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="What do you want to save for?"
                  placeholderTextColor="#9CA3AF"
                  value={title}
                  onChangeText={setTitle}
                  onFocus={() => setFocusedField('title')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Target Amount */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Target Amount</Text>
              <View style={[
                styles.inputContainer,
                focusedField === 'amount' && styles.inputContainerFocused
              ]}>
                <DollarSign color={focusedField === 'amount' ? '#10B981' : '#9CA3AF'} size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  value={targetAmount}
                  onChangeText={setTargetAmount}
                  keyboardType="numeric"
                  onFocus={() => setFocusedField('amount')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Category Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.categoriesGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryCard,
                      selectedCategory === category.id && styles.categoryCardSelected,
                      { borderColor: selectedCategory === category.id ? category.color : '#E5E7EB' }
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={[
                      styles.categoryName,
                      selectedCategory === category.id && { color: category.color }
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Due Date */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Due Date</Text>
              <DatePicker
                value={dueDate}
                onDateChange={setDueDate}
                placeholder="Select due date"
                minimumDate={new Date()}
              />
              <Text style={styles.helperText}>
                💡 Tip: Choose a realistic deadline that motivates you to save!
              </Text>
            </View>

            {/* Priority Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Priority Level</Text>
              <View style={styles.prioritiesContainer}>
                {priorities.map((priority) => (
                  <TouchableOpacity
                    key={priority.id}
                    style={[
                      styles.priorityCard,
                      selectedPriority === priority.id && styles.priorityCardSelected,
                      { borderColor: selectedPriority === priority.id ? priority.color : '#E5E7EB' }
                    ]}
                    onPress={() => setSelectedPriority(priority.id as 'Low' | 'Medium' | 'High')}
                  >
                    <View style={styles.priorityHeader}>
                      <Flag color={priority.color} size={20} />
                      <Text style={[
                        styles.priorityName,
                        selectedPriority === priority.id && { color: priority.color }
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

            {/* Goal Preview */}
            {title && targetAmount && selectedCategory && (
              <View style={styles.previewSection}>
                <Text style={styles.previewTitle}>Goal Preview 👀</Text>
                <View style={styles.previewCard}>
                  <View style={styles.previewHeader}>
                    <Text style={styles.previewGoalTitle}>{title}</Text>
                    <View style={[
                      styles.previewPriorityBadge,
                      { backgroundColor: getPriorityColor(selectedPriority) + '20' }
                    ]}>
                      <Text style={[
                        styles.previewPriorityText,
                        { color: getPriorityColor(selectedPriority) }
                      ]}>
                        {selectedPriority}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.previewAmount}>
                    <Text>Target: ${parseFloat(targetAmount || '0').toFixed(2)}</Text>
                  </Text>
                  <Text style={styles.previewCategory}>
                    <Text>Category: {categories.find(cat => cat.id === selectedCategory)?.name || ''}</Text>
                  </Text>
                  {dueDate && (
                    <Text style={styles.previewDate}>
                      <Text>Due: {new Date(dueDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</Text>
                    </Text>
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
                <Text style={styles.submitButtonText}>Create Goal</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Motivation */}
            <View style={styles.motivationContainer}>
              <Text style={styles.motivationText}>
                🌟 Every big achievement starts with a clear goal! You're taking the first step toward making your dreams come true! 💪
              </Text>
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
  helperText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 16,
    alignItems: 'center',
    width: '30%',
    minWidth: 100,
  },
  categoryCardSelected: {
    backgroundColor: '#F0FDF4',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
  },
  prioritiesContainer: {
    gap: 12,
  },
  priorityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  priorityCardSelected: {
    backgroundColor: '#F8FAFC',
  },
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewGoalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  previewPriorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  previewPriorityText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  previewAmount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    marginBottom: 4,
  },
  previewCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  previewDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
  motivationContainer: {
    backgroundColor: '#F0FDF4',
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  motivationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#059669',
    lineHeight: 20,
    textAlign: 'center',
  },
});