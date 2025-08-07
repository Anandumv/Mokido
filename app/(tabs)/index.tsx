import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Trophy, 
  PiggyBank, 
  Target, 
  TrendingUp,
  ChevronRight,
  Award,
  BookOpen,
  Zap,
  Crown
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { SkeletonCard, SkeletonStatCard } from '@/components/SkeletonLoader';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const { learningModules, missions, goals, isLoading } = useData();

  if (!user) return null;

  const completedModules = learningModules.filter(m => m.completed).length;
  const completedMissions = missions.filter(m => m.completed).length;
  const totalGoalProgress = goals.length > 0 
    ? goals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount * 100), 0) / goals.length 
    : 0;

  // Calculate XP and tokens earned from completed activities
  const xpFromModules = learningModules
    .filter(m => m.completed)
    .reduce((sum, m) => sum + m.xpReward, 0);
  
  const tokensFromMissions = missions
    .filter(m => m.completed)
    .reduce((sum, m) => sum + m.reward, 0);

  // Calculate estimated tokens from learning (XP / 2 as per the pattern)
  const tokensFromLearning = Math.floor(xpFromModules / 2);
  const otherTokens = Math.max(0, user.mokTokens - tokensFromLearning - tokensFromMissions);
  const totalSavingsAmount = user.savings + user.investmentBalance + user.cryptoBalance;

  const nextLevel = Math.ceil(user.level + 1);
  const xpForNextLevel = nextLevel * 250;
  const currentLevelXP = user.level * 250;
  const levelProgress = ((user.xp - currentLevelXP) / (xpForNextLevel - currentLevelXP)) * 100;

  const handleNavigateToLearn = () => {
    router.push('/(tabs)/learn');
  };

  const handleNavigateToMissions = () => {
    router.push('/(tabs)/missions');
  };

  const handleNavigateToSavings = () => {
    router.push('/(tabs)/savings');
  };

  return (
    <LinearGradient
      colors={['#F8FAFC', '#FFFFFF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>Hello, {user.name}! 👋</Text>
              <Text style={styles.welcomeText}>Ready to learn something new?</Text>
            </View>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>{user.avatar}</Text>
              <View style={styles.levelBadge}>
                <Crown color="#FFFFFF" size={12} />
                <Text style={styles.levelBadgeText}>{user.level}</Text>
              </View>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              {/* Points Card */}
              <TouchableOpacity 
                style={[styles.statCard, styles.pointsCard]}
                onPress={() => {
                  Alert.alert(
                    '🏆 Your MokTokens',
                    `Total: ${user.mokTokens} tokens\n\n💰 Sources:\n• Learning modules: ${tokensFromLearning} tokens\n• Completed missions: ${tokensFromMissions} tokens\n• Savings bonuses: ${otherTokens} tokens\n\n🎯 Use tokens to unlock rewards and celebrate your achievements!`,
                    [{ text: 'Awesome! 🌟', style: 'default' }]
                  );
                }}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.statGradient}
                >
                  <View style={styles.statHeader}>
                    <Trophy color="#FFFFFF" size={20} />
                    <Text style={styles.statLabel}>Points</Text>
                  </View>
                  <Text style={styles.statValue}>{user.mokTokens}</Text>
                  <Text style={styles.statSubtext}>Last earned 2h ago</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Savings Card */}
              <TouchableOpacity 
                style={[styles.statCard, styles.savingsCard]}
                onPress={() => {
                  Alert.alert(
                    '💰 Your Savings Breakdown',
                    `Total Savings: $${totalSavingsAmount.toFixed(2)}\n\n📊 Breakdown:\n• Regular Savings: $${user.savings.toFixed(2)}\n• Investments: $${user.investmentBalance.toFixed(2)}\n• Crypto: $${user.cryptoBalance.toFixed(2)}\n\n🎯 Goal Progress: ${totalGoalProgress.toFixed(1)}%\n\n💡 Keep saving to reach your dreams!`,
                    [
                      { text: 'View Details', onPress: handleNavigateToSavings },
                      { text: 'Got it! 💪', style: 'default' }
                    ]
                  );
                }}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.statGradient}
                >
                  <View style={styles.statHeader}>
                    <PiggyBank color="#FFFFFF" size={20} />
                    <Text style={styles.statLabel}>Savings</Text>
                  </View>
                  <Text style={styles.statValue}>${user.savings.toFixed(2)}</Text>
                  <View style={styles.progressIndicator}>
                    <TrendingUp color="#FFFFFF" size={12} />
                    <Text style={styles.progressText}>{totalGoalProgress.toFixed(1)}% of goals</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              {/* Goals Card */}
              <TouchableOpacity 
                style={[styles.statCard, styles.goalsCard]}
                onPress={() => {
                  const completedGoals = goals.filter(g => (g.currentAmount / g.targetAmount) >= 1);
                  const inProgressGoals = goals.filter(g => (g.currentAmount / g.targetAmount) < 1);
                  const nextGoal = inProgressGoals.sort((a, b) => (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount))[0];
                  
                  Alert.alert(
                    '🎯 Your Savings Goals',
                    `Completed: ${completedGoals.length}/${goals.length} goals\n\n✅ Completed Goals:\n${completedGoals.length > 0 ? completedGoals.map(g => `• ${g.title}`).join('\n') : '• None yet - keep saving!'}\n\n🚀 Next Goal:\n${nextGoal ? `• ${nextGoal.title}: $${nextGoal.currentAmount.toFixed(2)}/$${nextGoal.targetAmount.toFixed(2)} (${((nextGoal.currentAmount / nextGoal.targetAmount) * 100).toFixed(0)}%)` : '• All goals completed! 🎉'}\n\n💪 You're doing great!`,
                    [
                      { text: 'View All Goals', onPress: handleNavigateToSavings },
                      { text: 'Keep Going! 🔥', style: 'default' }
                    ]
                  );
                }}
              >
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={[styles.statGradient, styles.goalsGradient]}
                >
                  <View style={styles.statHeader}>
                    <Target color="#FFFFFF" size={20} />
                    <Text style={styles.statLabel}>Goals</Text>
                  </View>
                  <Text style={styles.statValue}>{goals.filter(g => (g.currentAmount / g.targetAmount) >= 1).length}/{goals.length}</Text>
                  <Text style={styles.statSubtext}>Next goal in 14 days</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Level Card with Progress */}
              <TouchableOpacity 
                style={[styles.statCard, styles.levelCard]}
                onPress={() => {
                  const xpNeeded = xpForNextLevel - user.xp;
                  const xpProgress = user.xp - currentLevelXP;
                  const xpForCurrentLevel = xpForNextLevel - currentLevelXP;
                  
                  Alert.alert(
                    `⚡ Level ${user.level} Progress`,
                    `Current XP: ${user.xp}\nLevel ${user.level} Range: ${currentLevelXP} - ${xpForNextLevel - 1} XP\n\n📊 Progress to Level ${nextLevel}:\n• Earned: ${xpProgress}/${xpForCurrentLevel} XP\n• Remaining: ${xpNeeded} XP\n• Progress: ${Math.max(0, levelProgress).toFixed(1)}%\n\n🎓 XP Sources:\n• Learning: ${xpFromModules} XP\n• Other activities: ${Math.max(0, user.xp - xpFromModules)} XP\n\n🚀 Keep learning to level up!`,
                    [
                      { text: 'Start Learning', onPress: handleNavigateToLearn },
                      { text: 'Amazing! ⭐', style: 'default' }
                    ]
                  );
                }}
              >
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  style={styles.statGradient}
                >
                  <View style={styles.statHeader}>
                    <TrendingUp color="#FFFFFF" size={20} />
                    <Text style={styles.statLabel}>Level {user.level}</Text>
                  </View>
                  <Text style={styles.statValue}>{user.xp} XP</Text>
                  
                  {/* Integrated Progress Bar */}
                  <View style={styles.levelProgressContainer}>
                    <View style={styles.levelProgressBar}>
                      <View style={[styles.levelProgressFill, { width: `${Math.max(0, Math.min(100, levelProgress))}%` }]} />
                    </View>
                    <Text style={styles.levelProgressText}>
                      {xpForNextLevel - user.xp} XP to next level
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            {isLoading ? (
              <View style={styles.actionsContainer}>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </View>
            ) : (
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionCard} onPress={handleNavigateToLearn}>
                  <View style={styles.actionIconContainer}>
                    <BookOpen color="#10B981" size={24} />
                  </View>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>Continue Learning</Text>
                    <Text style={styles.actionSubtitle}>
                      {completedModules}/{learningModules.length} modules • {xpFromModules} XP earned
                    </Text>
                  </View>
                  <ChevronRight color="#10B981" size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionCard} onPress={handleNavigateToMissions}>
                  <View style={styles.actionIconContainer}>
                    <Target color="#3B82F6" />
                  </View>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>Complete Missions</Text>
                    <Text style={styles.actionSubtitle}>
                      {completedMissions}/{missions.length} missions • {tokensFromMissions} tokens earned
                    </Text>
                  </View>
                  <ChevronRight color="#3B82F6" size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionCard} onPress={handleNavigateToSavings}>
                  <View style={styles.actionIconContainer}>
                    <Zap color="#F59E0B" size={24} />
                  </View>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>Track Goals</Text>
                    <Text style={styles.actionSubtitle}>
                      {totalGoalProgress.toFixed(0)}% progress • ${totalSavingsAmount.toFixed(2)} saved
                    </Text>
                  </View>
                  <ChevronRight color="#F59E0B" size={20} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Recent Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
          
            <View style={styles.achievementsContainer}>
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : Array.isArray(user?.badges) && user.badges.length > 0 ? (
                user.badges.slice(0, 3).map((badge, index) => (
                  <View key={index} style={styles.achievementCard}>
                    <View style={styles.achievementIconContainer}>
                      <Award color="#10B981" size={18} />
                    </View>
                    <View style={styles.achievementContent}>
                      <Text style={styles.achievementTitle}>{badge}</Text>
                      <Text style={styles.achievementDate}>Earned recently</Text>
                    </View>
                    <View style={styles.achievementBadge}>
                      <Text style={styles.achievementBadgeText}>✨</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={{ color: '#6B7280' }}>No achievements yet.</Text>
              )}
            </View>
          </View>

          {/* Motivational Message */}
          <View style={styles.motivationContainer}>
            <LinearGradient
              colors={['#6366F1', '#4F46E5']}
              style={styles.motivationGradient}
            >
              <Text style={styles.motivationEmoji}>🌟</Text>
              <Text style={styles.motivationTitle}>Keep it up!</Text>
              <Text style={styles.motivationText}>
                You're doing great on your financial journey. Every step counts towards building your future!
              </Text>
            </LinearGradient>
          </View>

        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Fredoka-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  avatarContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    fontSize: 28,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  levelBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  statGradient: {
    padding: 20,
    minHeight: 120,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  levelProgressContainer: {
    marginTop: 4,
  },
  levelProgressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 6,
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  levelProgressText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  pointsCard: {},
  savingsCard: {},
  goalsCard: {},
  goalsGradient: {
    minHeight: 120,
    flex: 1,
  },
  levelCard: {},
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Fredoka-SemiBold',
    color: '#1F2937',
    marginBottom: 20,
  },
  actionsContainer: {
    gap: 16,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  achievementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  achievementDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  achievementBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementBadgeText: {
    fontSize: 12,
  },
  motivationContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  motivationGradient: {
    padding: 28,
    alignItems: 'center',
  },
  motivationEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  motivationTitle: {
    fontSize: 22,
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
});