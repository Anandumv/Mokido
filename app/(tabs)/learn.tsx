import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, BookOpen, Clock, Star, Trophy, ChevronRight, Zap, Play, CircleCheck as CheckCircle2, Award, Target } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { SkeletonCard, SkeletonList } from '@/components/SkeletonLoader';
import LearningActivity from '@/components/LearningActivity';
import { moduleContent } from '@/data/learningContent';

export default function LearnScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const { learningModules, updateModule, isLoading } = useData();
  const { user, updateUser } = useAuth();

  const categories = ['All', 'Basics', 'Saving', 'Budgeting', 'Investing'];

  const filteredModules = learningModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || module.category === selectedCategory;
    const matchesAge = user ? module.ageGroups.includes(user.ageGroup) : true;
    
    return matchesSearch && matchesCategory && matchesAge;
  });

  const handleStartModule = (moduleId: string, title: string) => {
    if (!user) return;

    const content = moduleContent[moduleId];
    if (!content) {
      Alert.alert('Coming Soon!', 'This learning module is still being prepared. Check back soon!');
      return;
    }

    const module = learningModules.find(m => m.id === moduleId);
    const isCompleted = module?.completed || false;

    Alert.alert(
      isCompleted ? `📚 Review Module: ${title}` : `📚 Start Learning: ${title}`,
      `${content.introduction}\n\n🎯 You'll ${isCompleted ? 'review' : 'learn'}:\n${content.learningObjectives.map(obj => `• ${obj}`).join('\n')}\n\n${isCompleted ? 'Ready to review this lesson?' : 'Ready to begin your interactive lesson?'}`,
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: isCompleted ? 'Review Module! 📖' : 'Start Learning! 🚀',
          onPress: () => setActiveModule(moduleId)
        }
      ]
    );
  };

  const handleModuleComplete = (moduleId: string, score: number, totalPoints: number) => {
    if (!user) return;

    const module = learningModules.find(m => m.id === moduleId);
    if (!module) return;

    const percentage = (score / totalPoints) * 100;
    const xpEarned = Math.floor(module.xpReward * (percentage / 100));
    const tokensEarned = Math.floor(xpEarned / 2);

    // Update module completion
    updateModule(moduleId, { completed: true });
    
    // Update user stats
    updateUser({
      xp: user.xp + xpEarned,
      mokTokens: user.mokTokens + tokensEarned
    });

    setActiveModule(null);

    // Show completion celebration
    const content = moduleContent[moduleId];
    Alert.alert(
      '🎉 Module Complete!',
      `${content.conclusion}\n\n📊 Your Results:\n• Score: ${score}/${totalPoints} points (${percentage.toFixed(0)}%)\n• XP Earned: ${xpEarned}\n• MokTokens Earned: ${tokensEarned}\n\n🌟 Fun Facts:\n${content.funFacts.join('\n')}`,
      [
        {
          text: 'Amazing! 🎊',
          onPress: () => {
            if (percentage >= 80) {
              setTimeout(() => {
                Alert.alert(
                  '🏆 Excellent Work!',
                  `You scored ${percentage.toFixed(0)}%! You're becoming a financial expert! 🌟`,
                  [{ text: 'Thank you! 😊' }]
                );
              }, 500);
            }
          }
        }
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const completedCount = learningModules.filter(m => m.completed).length;
  const totalXpEarned = learningModules
    .filter(m => m.completed)
    .reduce((sum, m) => sum + m.xpReward, 0);

  return (
    <LinearGradient
      colors={['#F0F9FF', '#FFFFFF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Learn & Grow 📚</Text>
          <Text style={styles.subtitle}>Interactive lessons that make learning fun!</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search color="#9CA3AF" size={20} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search lessons..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Category Filter */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
            contentContainerStyle={styles.categoryContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Progress Overview */}
          <View style={styles.progressOverview}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.progressGradient}
            >
              <View style={styles.progressStats}>
                <View style={styles.progressStat}>
                  <Trophy color="#FFFFFF" size={28} />
                  <Text style={styles.progressNumber}>{completedCount}</Text>
                  <Text style={styles.progressLabel}>Completed! 🎉</Text>
                </View>
                <View style={styles.progressDivider} />
                <View style={styles.progressStat}>
                  <Zap color="#FFFFFF" size={28} />
                  <Text style={styles.progressNumber}>{totalXpEarned}</Text>
                  <Text style={styles.progressLabel}>XP Earned! ⚡</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Learning Modules */}
          <View style={styles.modulesContainer}>
            <Text style={styles.sectionTitle}>
              Interactive Lessons ({filteredModules.length})
            </Text>
            
            {isLoading ? (
              <SkeletonList count={4} />
            ) : (
              filteredModules.map((module) => {
                const hasContent = moduleContent[module.id];
                
                return (
                  <TouchableOpacity
                    key={module.id}
                    style={[
                      styles.moduleCard,
                      module.completed && styles.moduleCardCompleted,
                      !hasContent && styles.moduleCardComingSoon
                    ]}
                    onPress={() => hasContent && handleStartModule(module.id, module.title)}
                    disabled={!hasContent}
                  >
                    <View style={styles.moduleHeader}>
                      <View style={[
                        styles.moduleIcon,
                        module.completed && styles.moduleIconCompleted,
                        !hasContent && styles.moduleIconComingSoon
                      ]}>
                        <Text style={styles.moduleEmoji}>{module.icon}</Text>
                      </View>
                      <View style={styles.moduleInfo}>
                        <Text style={[
                          styles.moduleTitle,
                          module.completed && styles.moduleTitleCompleted
                        ]}>
                          {module.title}
                          {!hasContent && ' (Coming Soon)'}
                        </Text>
                        <Text style={styles.moduleDescription}>{module.description}</Text>
                        {hasContent && (
                          <Text style={styles.moduleFeatures}>
                            ✨ Interactive questions • 🎯 Real scenarios • 🏆 Instant feedback
                          </Text>
                        )}
                      </View>
                      {module.completed ? (
                        <View style={styles.completedBadge}>
                          <CheckCircle2 color="#10B981" size={28} fill="#10B981" />
                        </View>
                      ) : hasContent ? (
                        <View style={styles.playButton}>
                          <Play color="#3B82F6" size={24} fill="#3B82F6" />
                        </View>
                      ) : (
                        <View style={styles.comingSoonBadge}>
                          <Clock color="#9CA3AF" size={24} />
                        </View>
                      )}
                    </View>

                    <View style={styles.moduleFooter}>
                      <View style={styles.moduleStats}>
                        <View style={styles.moduleStat}>
                          <Clock color="#6B7280" size={16} />
                          <Text style={styles.moduleStatText}>{module.duration}</Text>
                        </View>
                        <View style={styles.moduleStat}>
                          <BookOpen color="#6B7280" size={16} />
                          <Text style={styles.moduleStatText}>
                            {hasContent ? `${moduleContent[module.id]?.questions.length || module.lessons} activities` : `${module.lessons} lessons`}
                          </Text>
                        </View>
                        <View style={[
                          styles.difficultyBadge,
                          { backgroundColor: getDifficultyColor(module.difficulty) + '20' }
                        ]}>
                          <Text style={[
                            styles.difficultyText,
                            { color: getDifficultyColor(module.difficulty) }
                          ]}>
                            {module.difficulty}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.xpReward}>
                        <Zap color="#F59E0B" size={18} />
                        <Text style={styles.xpText}>{module.completed ? '✓' : '+'}{module.xpReward} XP</Text>
                      </View>
                    </View>

                    {hasContent && (
                      <View style={styles.interactiveIndicator}>
                        <Target color="#3B82F6" size={16} />
                        <Text style={styles.interactiveText}>
                          {module.completed ? 'Review Interactive Content' : 'Interactive Learning Experience'}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {/* Learning Path Suggestion */}
          <View style={styles.suggestionContainer}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.suggestionGradient}
            >
              <Text style={styles.suggestionEmoji}>🎯</Text>
              <Text style={styles.suggestionTitle}>Your Learning Journey</Text>
              <Text style={styles.suggestionText}>
                Start with "What is Money?" to build your foundation, then progress through saving and budgeting. 
                Each lesson builds on the previous one! 🌟
              </Text>
            </LinearGradient>
          </View>

          {/* Learning Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Learning Tips for Success!</Text>
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>🧠</Text>
                <Text style={styles.tipText}>Take your time with each question</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>🎯</Text>
                <Text style={styles.tipText}>Read explanations carefully to learn more</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>🔄</Text>
                <Text style={styles.tipText}>You can retake lessons to improve your score</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>👨‍👩‍👧‍👦</Text>
                <Text style={styles.tipText}>Discuss what you learn with your family!</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Learning Activity Modal */}
      <Modal
        visible={activeModule !== null}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {activeModule && moduleContent[activeModule] && (
          <LearningActivity
            moduleId={activeModule}
            title={learningModules.find(m => m.id === activeModule)?.title || ''}
            questions={moduleContent[activeModule].questions}
            onComplete={(score, totalPoints) => handleModuleComplete(activeModule, score, totalPoints)}
            onClose={() => setActiveModule(null)}
          />
        )}
      </Modal>
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginLeft: 12,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryChipActive: {
    backgroundColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  progressOverview: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  progressGradient: {
    padding: 24,
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStat: {
    flex: 1,
    alignItems: 'center',
  },
  progressDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
    marginHorizontal: 20,
  },
  progressNumber: {
    fontSize: 28,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  modulesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Fredoka-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  moduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moduleCardCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  moduleCardComingSoon: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    opacity: 0.7,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  moduleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  moduleIconCompleted: {
    backgroundColor: '#DCFCE7',
  },
  moduleIconComingSoon: {
    backgroundColor: '#F3F4F6',
  },
  moduleEmoji: {
    fontSize: 28,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  moduleTitleCompleted: {
    color: '#059669',
  },
  moduleDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  moduleFeatures: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    lineHeight: 16,
  },
  completedBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  moduleStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moduleStatText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  xpReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  interactiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    marginHorizontal: -20,
    marginBottom: -20,
    padding: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    gap: 6,
  },
  interactiveText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  suggestionContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  suggestionGradient: {
    padding: 24,
    alignItems: 'center',
  },
  suggestionEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  suggestionTitle: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  suggestionText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 22,
  },
  tipsContainer: {
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
  tipsTitle: {
    fontSize: 18,
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
    alignItems: 'center',
    gap: 12,
  },
  tipEmoji: {
    fontSize: 20,
    width: 32,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
});