import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, CircleCheck as CheckCircle2, Clock, Coins, Plus, Calendar, Trophy, Star, Play, Zap, Award } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { SkeletonList } from '@/components/SkeletonLoader';
import MissionHistoryModal from '@/components/MissionHistoryModal';

export default function MissionsScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [completingMission, setCompletingMission] = useState<string | null>(null);
  const [showMissionHistory, setShowMissionHistory] = useState(false);
  const { missions, updateMission, isLoading } = useData();
  const { user, updateUser } = useAuth();

  const filters = ['All', 'Easy', 'Medium', 'Hard', 'Completed'];

  const filteredMissions = missions.filter(mission => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Completed') return mission.completed;
    return mission.difficulty === selectedFilter;
  });

  const completedMissions = missions.filter(m => m.completed).length;
  const totalRewards = missions
    .filter(m => m.completed)
    .reduce((sum, m) => sum + m.reward, 0);

  const handleStartMission = (missionId: string, reward: number, title: string, difficulty: string) => {
    if (!user) return;

    const xpReward = Math.floor(reward * 1.5);
    const difficultyEmoji = difficulty === 'Easy' ? '🌟' : difficulty === 'Medium' ? '⭐' : '🏆';

    Alert.alert(
      `${difficultyEmoji} Start Mission`,
      `Ready to start "${title}"?\n\n🎯 Difficulty: ${difficulty}\n💰 Reward: ${reward} MokTokens\n⚡ XP: ${xpReward}\n\nTap "Start Mission" when you're ready to begin!`,
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'Start Mission! 🚀',
          style: 'default',
          onPress: () => {
            setCompletingMission(missionId);
            
            // Simulate mission progress with a timer
            setTimeout(() => {
              Alert.alert(
                '🎉 Mission Complete!',
                `Awesome job completing "${title}"!\n\n🎁 You earned:\n💰 ${reward} MokTokens\n⚡ ${xpReward} XP\n\nKeep up the great work! 🌟`,
                [
                  {
                    text: 'Collect Rewards! ✨',
                    style: 'default',
                    onPress: () => {
                      updateMission(missionId, { completed: true });
                      updateUser({
                        mokTokens: user.mokTokens + reward,
                        xp: user.xp + xpReward
                      });
                      setCompletingMission(null);
                      
                      // Show celebration
                      setTimeout(() => {
                        Alert.alert(
                          '🎊 Celebration Time!',
                          `You're doing amazing! ${completedMissions + 1} missions completed!\n\nYour parents will be so proud! 👨‍👩‍👧‍👦`,
                          [{ text: 'Thanks! 😊', style: 'default' }]
                        );
                      }, 500);
                    }
                  }
                ]
              );
            }, 3000); // 3 second "mission time"
          }
        }
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getDifficultyEmoji = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '🌟';
      case 'Medium': return '⭐';
      case 'Hard': return '🏆';
      default: return '📋';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Household': return '🏠';
      case 'Kitchen': return '🍽️';
      case 'Pet Care': return '🐕';
      case 'Garden': return '🌱';
      default: return '📋';
    }
  };

  return (
    <LinearGradient
      colors={['#FEF3C7', '#FFFFFF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Missions 🎯</Text>
          <Text style={styles.subtitle}>Complete tasks and earn awesome rewards!</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Stats Overview */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={[styles.statCard, styles.primaryStat]}>
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.statGradient}
                >
                  <Trophy color="#FFFFFF" size={28} />
                  <Text style={styles.statValue}>{completedMissions}</Text>
                  <Text style={styles.statLabel}>Missions Done! 🎉</Text>
                </LinearGradient>
              </View>

              <View style={[styles.statCard, styles.secondaryStat]}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.statGradient}
                >
                  <Coins color="#FFFFFF" size={28} />
                  <Text style={styles.statValue}>{totalRewards}</Text>
                  <Text style={styles.statLabel}>Tokens Earned! 💰</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Mission Progress Card */}
          <View style={styles.progressCardContainer}>
            <TouchableOpacity 
              style={styles.progressCard}
              onPress={() => setShowMissionHistory(true)}
            >
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.progressCardGradient}
              >
                <View style={styles.progressCardHeader}>
                  <Target color="#FFFFFF" size={24} />
                  <Text style={styles.progressCardTitle}>Mission History & Streaks</Text>
                </View>
                <View style={styles.progressCardStats}>
                  <View style={styles.progressStat}>
                    <Text style={styles.progressStatNumber}>{completedMissions}</Text>
                    <Text style={styles.progressStatLabel}>Completed</Text>
                  </View>
                  <View style={styles.progressStatDivider} />
                  <View style={styles.progressStat}>
                    <Text style={styles.progressStatNumber}>{totalRewards}</Text>
                    <Text style={styles.progressStatLabel}>Tokens</Text>
                  </View>
                  <View style={styles.progressStatDivider} />
                  <View style={styles.progressStat}>
                    <Text style={styles.progressStatNumber}>3</Text>
                    <Text style={styles.progressStatLabel}>Day Streak</Text>
                  </View>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarTrack}>
                    <View style={[
                      styles.progressBarFill,
                      { width: `${missions.length > 0 ? (completedMissions / missions.length) * 100 : 0}%` }
                    ]} />
                  </View>
                  <Text style={styles.progressPercentage}>
                    View History
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Filter Tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  selectedFilter === filter && styles.filterChipActive
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Missions List */}
          <View style={styles.missionsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Your Missions ({filteredMissions.length})
              </Text>
              <TouchableOpacity style={styles.addButton}>
                <Plus color="#10B981" size={20} />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <SkeletonList count={5} />
            ) : (
              filteredMissions.map((mission) => {
                const isCompleting = completingMission === mission.id;
                
                return (
                  <TouchableOpacity
                    key={mission.id}
                    style={[
                      styles.missionCard,
                      mission.completed && styles.missionCardCompleted,
                      isCompleting && styles.missionCardCompleting
                    ]}
                    onPress={() => !mission.completed && !isCompleting && handleStartMission(mission.id, mission.reward, mission.title, mission.difficulty)}
                    disabled={isCompleting}
                  >
                    <View style={styles.missionHeader}>
                      <View style={[
                        styles.missionIconContainer,
                        mission.completed && styles.missionIconCompleted,
                        isCompleting && styles.missionIconCompleting
                      ]}>
                        <Text style={styles.missionIcon}>
                          {getCategoryIcon(mission.category)}
                        </Text>
                      </View>
                      <View style={styles.missionInfo}>
                        <Text style={[
                          styles.missionTitle,
                          mission.completed && styles.missionTitleCompleted
                        ]}>
                          {mission.title}
                        </Text>
                        <Text style={styles.missionDescription}>
                          {mission.description}
                        </Text>
                      </View>
                      {mission.completed ? (
                        <View style={styles.completedIcon}>
                          <CheckCircle2 color="#10B981" size={28} fill="#10B981" />
                        </View>
                      ) : isCompleting ? (
                        <View style={styles.completingIcon}>
                          <Clock color="#F59E0B" size={28} />
                          <Text style={styles.completingText}>Working...</Text>
                        </View>
                      ) : (
                        <View style={styles.startButton}>
                          <Play color="#3B82F6" size={24} fill="#3B82F6" />
                        </View>
                      )}
                    </View>

                    <View style={styles.missionFooter}>
                      <View style={styles.missionTags}>
                        <View style={[
                          styles.difficultyTag,
                          { backgroundColor: getDifficultyColor(mission.difficulty) + '20' }
                        ]}>
                          <Text style={styles.difficultyEmoji}>
                            {getDifficultyEmoji(mission.difficulty)}
                          </Text>
                          <Text style={[
                            styles.difficultyTagText,
                            { color: getDifficultyColor(mission.difficulty) }
                          ]}>
                            {mission.difficulty}
                          </Text>
                        </View>
                        <View style={styles.categoryTag}>
                          <Text style={styles.categoryTagText}>{mission.category}</Text>
                        </View>
                        {mission.dueDate && (
                          <View style={styles.dueDateTag}>
                            <Calendar color="#6B7280" size={12} />
                            <Text style={styles.dueDateText}>
                              Due {mission.dueDate}
                            </Text>
                          </View>
                        )}
                      </View>
                      
                      <View style={styles.rewardContainer}>
                        <Coins color="#F59E0B" size={18} />
                        <Text style={styles.rewardText}>+{mission.reward}</Text>
                        <Zap color="#3B82F6" size={16} />
                        <Text style={styles.xpText}>+{Math.floor(mission.reward * 1.5)}</Text>
                      </View>
                    </View>

                    {isCompleting && (
                      <View style={styles.progressOverlay}>
                        <Text style={styles.progressText}>🚀 Mission in Progress...</Text>
                        <Text style={styles.progressSubtext}>Keep up the great work!</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {/* Motivation Section */}
          <View style={styles.motivationContainer}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.motivationGradient}
            >
              <Text style={styles.motivationEmoji}>⭐</Text>
              <Text style={styles.motivationTitle}>You're Amazing!</Text>
              <Text style={styles.motivationText}>
                Every mission you complete helps you learn responsibility and earn rewards! 
                Your family is so proud of you! 💪✨
              </Text>
            </LinearGradient>
          </View>

          {/* Mission Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Mission Tips for Success!</Text>
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>🎯</Text>
                <Text style={styles.tipText}>Start with Easy missions to build confidence</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>⏰</Text>
                <Text style={styles.tipText}>Complete missions when you have time to focus</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>🏆</Text>
                <Text style={styles.tipText}>Hard missions give the biggest rewards!</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>👨‍👩‍👧‍👦</Text>
                <Text style={styles.tipText}>Ask for help if you need it - teamwork is great!</Text>
              </View>
            </View>
          </View>

          {/* Add Mission Suggestion */}
          <View style={styles.addMissionSuggestion}>
            <Text style={styles.suggestionTitle}>🌟 Want More Missions?</Text>
            <Text style={styles.suggestionText}>
              Ask your parents to add custom missions just for you! 
              You can suggest fun chores you'd like to try for extra MokTokens! 🎁
            </Text>
          </View>
        </ScrollView>

        {/* Mission History Modal */}
        <MissionHistoryModal
          visible={showMissionHistory}
          onClose={() => setShowMissionHistory(false)}
          completedMissions={completedMissions}
          totalRewards={totalRewards}
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
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  primaryStat: {},
  secondaryStat: {},
  filterContainer: {
    marginBottom: 20,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: '#F59E0B',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  missionsContainer: {
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
  missionCard: {
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
  missionCardCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  missionCardCompleting: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  missionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  missionIconCompleted: {
    backgroundColor: '#DCFCE7',
  },
  missionIconCompleting: {
    backgroundColor: '#FED7AA',
  },
  missionIcon: {
    fontSize: 28,
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  missionTitleCompleted: {
    color: '#059669',
  },
  missionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  completedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completingIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  completingText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
    marginTop: 2,
  },
  startButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  missionTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  difficultyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  difficultyEmoji: {
    fontSize: 12,
  },
  difficultyTagText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  categoryTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryTagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  dueDateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginRight: 8,
  },
  xpText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  progressOverlay: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    marginHorizontal: -20,
    marginBottom: -20,
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginBottom: 2,
  },
  progressSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#D97706',
  },
  motivationContainer: {
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
  motivationGradient: {
    padding: 24,
    alignItems: 'center',
  },
  motivationEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  motivationTitle: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  motivationText: {
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
    marginBottom: 20,
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
  addMissionSuggestion: {
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
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  suggestionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
  },
  progressCardContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  progressCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  progressCardGradient: {
    padding: 20,
  },
  progressCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  progressCardTitle: {
    fontSize: 18,
    fontFamily: 'Fredoka-SemiBold',
    color: '#FFFFFF',
  },
  progressCardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressStat: {
    flex: 1,
    alignItems: 'center',
  },
  progressStatNumber: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  progressStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  progressStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
    marginHorizontal: 12,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    minWidth: 40,
    textAlign: 'right',
  },
});