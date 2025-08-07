import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Calendar, Trophy, Target, Flame, Star, Award, TrendingUp, CircleCheck as CheckCircle2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface MissionHistoryData {
  date: string;
  missions: {
    id: string;
    title: string;
    category: string;
    reward: number;
    completed: boolean;
  }[];
  totalRewards: number;
}

interface MissionHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  completedMissions: number;
  totalRewards: number;
}

export default function MissionHistoryModal({ 
  visible, 
  onClose, 
  completedMissions, 
  totalRewards 
}: MissionHistoryModalProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Generate mock mission history data
  const generateMissionHistory = (): MissionHistoryData[] => {
    const today = new Date();
    const history: MissionHistoryData[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayMissions = [
        { id: '1', title: 'Clean Room', category: 'Household', reward: 25, completed: i <= 3 },
        { id: '2', title: 'Help with Dishes', category: 'Kitchen', reward: 30, completed: i <= 2 },
        { id: '3', title: 'Take Out Trash', category: 'Household', reward: 20, completed: i <= 4 },
        { id: '4', title: 'Walk the Dog', category: 'Pet Care', reward: 40, completed: i <= 1 },
      ].filter(mission => Math.random() > 0.3); // Randomly include missions
      
      const completedDayMissions = dayMissions.filter(m => m.completed);
      
      history.push({
        date: date.toISOString().split('T')[0],
        missions: dayMissions,
        totalRewards: completedDayMissions.reduce((sum, m) => sum + m.reward, 0)
      });
    }
    
    return history;
  };

  const missionHistory = generateMissionHistory();
  
  // Calculate streak
  const calculateStreak = (): number => {
    let streak = 0;
    for (let i = missionHistory.length - 1; i >= 0; i--) {
      const dayData = missionHistory[i];
      const hasCompletedMissions = dayData.missions.length > 0 && dayData.missions.every(m => m.completed);
      if (hasCompletedMissions) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();
  const weeklyTotal = missionHistory.reduce((sum, day) => sum + day.totalRewards, 0);
  const averageDaily = Math.round(weeklyTotal / 7);

  // Filter history based on selected day
  const filteredHistory = selectedDay 
    ? missionHistory.filter(day => day.date === selectedDay)
    : missionHistory;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
  };

  const handleDaySelect = (dayDate: string) => {
    setSelectedDay(selectedDay === dayDate ? null : dayDate);
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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <LinearGradient
        colors={['#FEF3C7', '#FFFFFF']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color="#6B7280" size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Mission History 🎯</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Stats Overview */}
            <View style={styles.statsContainer}>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    style={styles.statGradient}
                  >
                    <Flame color="#FFFFFF" size={28} />
                    <Text style={styles.statValue}>{currentStreak}</Text>
                    <Text style={styles.statLabel}>Day Streak! 🔥</Text>
                  </LinearGradient>
                </View>

                <View style={styles.statCard}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.statGradient}
                  >
                    <Trophy color="#FFFFFF" size={28} />
                    <Text style={styles.statValue}>{completedMissions}</Text>
                    <Text style={styles.statLabel}>Total Done! 🏆</Text>
                  </LinearGradient>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.statGradient}
                  >
                    <Star color="#FFFFFF" size={28} />
                    <Text style={styles.statValue}>{weeklyTotal}</Text>
                    <Text style={styles.statLabel}>Week Tokens! ⭐</Text>
                  </LinearGradient>
                </View>

                <View style={styles.statCard}>
                  <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    style={styles.statGradient}
                  >
                    <TrendingUp color="#FFFFFF" size={28} />
                    <Text style={styles.statValue}>{averageDaily}</Text>
                    <Text style={styles.statLabel}>Daily Avg! 📈</Text>
                  </LinearGradient>
                </View>
              </View>
            </View>

            {/* Streak Visualization */}
            <View style={styles.streakContainer}>
              <Text style={styles.sectionTitle}>Your Amazing Streak! 🔥</Text>
              <View style={styles.streakVisualization}>
                {missionHistory.map((day, index) => {
                  const hasCompletedMissions = day.missions.length > 0 && day.missions.every(m => m.completed);
                  const isToday = index === missionHistory.length - 1;
                  const isSelected = selectedDay === day.date;
                  
                  return (
                    <TouchableOpacity 
                      key={day.date} 
                      style={styles.streakDay}
                      onPress={() => handleDaySelect(day.date)}
                    >
                      <View style={[
                        styles.streakDot,
                        hasCompletedMissions && styles.streakDotActive,
                        isToday && styles.streakDotToday,
                        isSelected && styles.streakDotSelected
                      ]}>
                        {hasCompletedMissions ? (
                          <CheckCircle2 color="#FFFFFF" size={16} />
                        ) : (
                          <View style={styles.streakDotEmpty} />
                        )}
                      </View>
                      <Text style={[
                        styles.streakDayLabel,
                        hasCompletedMissions && styles.streakDayLabelActive,
                        isSelected && styles.streakDayLabelSelected
                      ]}>
                        {formatDate(day.date).split(' ')[0]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              
              {currentStreak > 0 && (
                <View style={styles.streakMessage}>
                  <Text style={styles.streakMessageText}>
                    🎉 Amazing! You've completed missions for {currentStreak} day{currentStreak > 1 ? 's' : ''} in a row!
                  </Text>
                  {currentStreak >= 7 && (
                    <Text style={styles.streakBonusText}>
                      🏆 Week Warrior! You've earned a special badge!
                    </Text>
                  )}
                </View>
              )}
            </View>

            {/* Daily History */}
            <View style={styles.historyContainer}>
              <View style={styles.historyHeader}>
                <Text style={styles.sectionTitle}>
                  {selectedDay ? `${formatDate(selectedDay)} Mission History 📅` : 'Daily Mission History 📅'}
                </Text>
                {selectedDay && (
                  <TouchableOpacity 
                    style={styles.clearSelectionButton}
                    onPress={() => setSelectedDay(null)}
                  >
                    <Text style={styles.clearSelectionText}>Show All Days</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {filteredHistory.slice().reverse().map((day, index) => (
                <View key={day.date} style={styles.dayCard}>
                  <View style={styles.dayHeader}>
                    <View style={styles.dayInfo}>
                      <Text style={styles.dayDate}>{formatDate(day.date)}</Text>
                      <Text style={styles.daySubtitle}>
                        {day.missions.filter(m => m.completed).length} of {day.missions.length} completed
                      </Text>
                    </View>
                    <View style={styles.dayRewards}>
                      <Text style={styles.dayRewardsText}>+{day.totalRewards}</Text>
                      <Text style={styles.dayRewardsLabel}>tokens</Text>
                    </View>
                  </View>

                  {day.missions.length > 0 && (
                    <View style={styles.missionsGrid}>
                      {day.missions.map((mission) => (
                        <View key={mission.id} style={[
                          styles.missionItem,
                          mission.completed && styles.missionItemCompleted
                        ]}>
                          <Text style={styles.missionIcon}>
                            {getCategoryIcon(mission.category)}
                          </Text>
                          <View style={styles.missionInfo}>
                            <Text style={[
                              styles.missionTitle,
                              mission.completed && styles.missionTitleCompleted
                            ]}>
                              {mission.title}
                            </Text>
                            <Text style={styles.missionReward}>+{mission.reward} tokens</Text>
                          </View>
                          {mission.completed && (
                            <CheckCircle2 color="#10B981" size={16} />
                          )}
                        </View>
                      ))}
                    </View>
                  )}

                  {day.missions.length === 0 && (
                    <View style={styles.noMissionsContainer}>
                      <Text style={styles.noMissionsText}>No missions scheduled</Text>
                      <Text style={styles.noMissionsSubtext}>Rest day! 😴</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Achievements Section */}
            <View style={styles.achievementsContainer}>
              <Text style={styles.sectionTitle}>Mission Achievements 🏆</Text>
              
              <View style={styles.achievementsList}>
                <View style={[styles.achievementCard, currentStreak >= 3 && styles.achievementUnlocked]}>
                  <Text style={styles.achievementIcon}>🔥</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>3-Day Streak</Text>
                    <Text style={styles.achievementDescription}>Complete missions for 3 days in a row</Text>
                  </View>
                  {currentStreak >= 3 && <Award color="#F59E0B" size={20} />}
                </View>

                <View style={[styles.achievementCard, currentStreak >= 7 && styles.achievementUnlocked]}>
                  <Text style={styles.achievementIcon}>⭐</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>Week Warrior</Text>
                    <Text style={styles.achievementDescription}>Complete missions for 7 days straight</Text>
                  </View>
                  {currentStreak >= 7 && <Award color="#F59E0B" size={20} />}
                </View>

                <View style={[styles.achievementCard, completedMissions >= 10 && styles.achievementUnlocked]}>
                  <Text style={styles.achievementIcon}>🏆</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>Mission Master</Text>
                    <Text style={styles.achievementDescription}>Complete 10 total missions</Text>
                  </View>
                  {completedMissions >= 10 && <Award color="#F59E0B" size={20} />}
                </View>

                <View style={[styles.achievementCard, totalRewards >= 500 && styles.achievementUnlocked]}>
                  <Text style={styles.achievementIcon}>💰</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>Token Collector</Text>
                    <Text style={styles.achievementDescription}>Earn 500 tokens from missions</Text>
                  </View>
                  {totalRewards >= 500 && <Award color="#F59E0B" size={20} />}
                </View>
              </View>
            </View>

            {/* Motivation Section */}
            <View style={styles.motivationContainer}>
              <LinearGradient
                colors={['#6366F1', '#4F46E5']}
                style={styles.motivationGradient}
              >
                <Text style={styles.motivationEmoji}>🌟</Text>
                <Text style={styles.motivationTitle}>Keep Up the Great Work!</Text>
                <Text style={styles.motivationText}>
                  Every mission you complete builds responsibility and earns rewards! 
                  Your consistency is amazing - keep building those healthy habits! 💪
                </Text>
              </LinearGradient>
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
  statsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
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
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginTop: 6,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Fredoka-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  streakContainer: {
    marginBottom: 24,
  },
  streakVisualization: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  streakDay: {
    alignItems: 'center',
    flex: 1,
  },
  streakDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  streakDotActive: {
    backgroundColor: '#10B981',
  },
  streakDotToday: {
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  streakDotSelected: {
    borderWidth: 3,
    borderColor: '#8B5CF6',
    transform: [{ scale: 1.1 }],
  },
  streakDotEmpty: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
  },
  streakDayLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  streakDayLabelActive: {
    color: '#10B981',
  },
  streakDayLabelSelected: {
    color: '#8B5CF6',
    fontFamily: 'Inter-SemiBold',
  },
  streakMessage: {
    backgroundColor: '#F0FDF4',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  streakMessageText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginBottom: 4,
  },
  streakBonusText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#047857',
  },
  historyContainer: {
    marginBottom: 24,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  clearSelectionButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  clearSelectionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  dayCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayInfo: {
    flex: 1,
  },
  dayDate: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  daySubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  dayRewards: {
    alignItems: 'flex-end',
  },
  dayRewardsText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
  dayRewardsLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#D97706',
  },
  missionsGrid: {
    gap: 8,
  },
  missionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  missionItemCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  missionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  missionTitleCompleted: {
    color: '#059669',
  },
  missionReward: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
  },
  noMissionsContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  noMissionsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  noMissionsSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#D1D5DB',
  },
  achievementsContainer: {
    marginBottom: 24,
  },
  achievementsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  achievementUnlocked: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  motivationContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
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
    fontSize: 32,
    marginBottom: 12,
  },
  motivationTitle: {
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  motivationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 20,
  },
});