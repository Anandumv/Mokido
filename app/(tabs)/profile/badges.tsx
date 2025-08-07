import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Award, Trophy, Star, Filter, Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { allAchievements, getCategoryColor, getRarityColor, getRarityGradient, Achievement } from '@/data/achievements';

const { width } = Dimensions.get('window');

export default function BadgesScreen() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  if (!user) return null;

  const categories = ['all', 'learning', 'missions', 'savings', 'special', 'milestones'];
  const rarities = ['all', 'common', 'rare', 'epic', 'legendary'];

  // Filter achievements based on selected filters
  const filteredAchievements = allAchievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const rarityMatch = selectedRarity === 'all' || achievement.rarity === selectedRarity;
    return categoryMatch && rarityMatch;
  });

  // Check if user has earned an achievement
  const hasEarned = (achievementTitle: string) => {
    return user.badges.includes(achievementTitle);
  };

  // Calculate stats
  const totalAchievements = allAchievements.length;
  const earnedAchievements = allAchievements.filter(a => hasEarned(a.title)).length;
  const progressPercentage = totalAchievements > 0 ? Math.round((earnedAchievements / totalAchievements) * 100) : 0;
  const progressWidth = totalAchievements > 0 ? (earnedAchievements / totalAchievements) * 100 : 0;
  const remainingAchievements = Math.max(0, totalAchievements - earnedAchievements);
  const totalPoints = allAchievements
    .filter(a => hasEarned(a.title))
    .reduce((sum, a) => sum + (a.points || 0), 0);

  const handleBack = () => {
    router.back();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return '📚';
      case 'missions': return '🎯';
      case 'savings': return '💰';
      case 'special': return '⭐';
      case 'milestones': return '🏆';
      default: return '🏅';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return '🥉';
      case 'rare': return '🥈';
      case 'epic': return '🥇';
      case 'legendary': return '💎';
      default: return '🏅';
    }
  };

  return (
    <LinearGradient
      colors={['#FDF2F8', '#FFFFFF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft color="#6B7280" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>My Trophy Room 🏆</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.statGradient}
              >
                <Trophy color="#FFFFFF" size={28} />
                <Text style={styles.statValue}>{earnedAchievements}</Text>
                <Text style={styles.statLabel}>Earned! 🎉</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.statGradient}
              >
                <Award color="#FFFFFF" size={28} />
                <Text style={styles.statValue}>{totalAchievements}</Text>
                <Text style={styles.statLabel}>Total Available</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.statGradient}
              >
                <Star color="#FFFFFF" size={28} />
                <Text style={styles.statValue}>{totalPoints}</Text>
                <Text style={styles.statLabel}>Achievement Points</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Collection Progress</Text>
              <Text style={styles.progressPercentage}>
                {progressPercentage}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: `${progressWidth}%` }
              ]} />
            </View>
            <Text style={styles.progressText}>
              {remainingAchievements} more to unlock!
            </Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Filter Tabs */}
          <View style={styles.filtersContainer}>
            <Text style={styles.filterTitle}>Categories</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterScrollView}
              contentContainerStyle={styles.filterContent}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterChip,
                    selectedCategory === category && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={styles.filterIcon}>
                    {category === 'all' ? '🏅' : getCategoryIcon(category)}
                  </Text>
                  <Text style={[
                    styles.filterText,
                    selectedCategory === category && styles.filterTextActive
                  ]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.filterTitle}>Rarity</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterScrollView}
              contentContainerStyle={styles.filterContent}
            >
              {rarities.map((rarity) => (
                <TouchableOpacity
                  key={rarity}
                  style={[
                    styles.filterChip,
                    selectedRarity === rarity && styles.filterChipActive,
                    { borderColor: selectedRarity === rarity ? getRarityColor(rarity) : '#E5E7EB' }
                  ]}
                  onPress={() => setSelectedRarity(rarity)}
                >
                  <Text style={styles.filterIcon}>
                    {rarity === 'all' ? '🏅' : getRarityIcon(rarity)}
                  </Text>
                  <Text style={[
                    styles.filterText,
                    selectedRarity === rarity && { color: getRarityColor(rarity) }
                  ]}>
                    {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Achievements Grid */}
          <View style={styles.achievementsContainer}>
            <Text style={styles.sectionTitle}>
              Achievements ({filteredAchievements.length})
            </Text>
            
            <View style={styles.achievementsGrid}>
              {filteredAchievements.map((achievement) => {
                const earned = hasEarned(achievement.title);
                
                return (
                  <View
                    key={achievement.id}
                    style={[
                      styles.achievementCard,
                      earned && styles.achievementCardEarned,
                      !earned && styles.achievementCardLocked
                    ]}
                  >
                    {/* Rarity Border */}
                    {earned && (
                      <LinearGradient
                        colors={getRarityGradient(achievement.rarity)}
                        style={styles.rarityBorder}
                      />
                    )}

                    {/* Achievement Content */}
                    <View style={styles.achievementContent}>
                      {/* Icon */}
                      <View style={[
                        styles.achievementIconContainer,
                        earned && styles.achievementIconEarned,
                        !earned && styles.achievementIconLocked
                      ]}>
                        <Text style={[
                          styles.achievementIcon,
                          !earned && styles.achievementIconTextLocked
                        ]}>
                          {earned ? achievement.icon : '🔒'}
                        </Text>
                      </View>

                      {/* Title */}
                      <Text style={[
                        styles.achievementTitle,
                        earned && styles.achievementTitleEarned,
                        !earned && styles.achievementTitleLocked
                      ]}>
                        {achievement.title}
                      </Text>

                      {/* Description */}
                      <Text style={[
                        styles.achievementDescription,
                        !earned && styles.achievementDescriptionLocked
                      ]}>
                        {earned ? achievement.description : achievement.requirement}
                      </Text>

                      {/* Category & Rarity Tags */}
                      <View style={styles.achievementTags}>
                        <View style={[
                          styles.categoryTag,
                          { backgroundColor: getCategoryColor(achievement.category) + '20' }
                        ]}>
                          <Text style={[
                            styles.categoryTagText,
                            { color: getCategoryColor(achievement.category) }
                          ]}>
                            {achievement.category}
                          </Text>
                        </View>
                        
                        {earned && (
                          <View style={[
                            styles.rarityTag,
                            { backgroundColor: getRarityColor(achievement.rarity) + '20' }
                          ]}>
                            <Text style={[
                              styles.rarityTagText,
                              { color: getRarityColor(achievement.rarity) }
                            ]}>
                              {achievement.rarity}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Points */}
                      {earned && achievement.points && (
                        <View style={styles.pointsContainer}>
                          <Star color="#F59E0B" size={12} />
                          <Text style={styles.pointsText}>+{achievement.points} pts</Text>
                        </View>
                      )}

                      {/* Earned Indicator */}
                      {earned && (
                        <View style={styles.earnedIndicator}>
                          <Award color="#10B981" size={16} />
                          <Text style={styles.earnedText}>Earned!</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Motivation Section */}
          <View style={styles.motivationContainer}>
            <LinearGradient
              colors={['#6366F1', '#4F46E5']}
              style={styles.motivationGradient}
            >
              <Text style={styles.motivationEmoji}>🌟</Text>
              <Text style={styles.motivationTitle}>Keep Collecting!</Text>
              <Text style={styles.motivationText}>
                Every achievement tells a story of your financial learning journey. 
                Keep learning, saving, and completing missions to unlock more badges! 🏆
              </Text>
            </LinearGradient>
          </View>

          {/* Tips Section */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 How to Earn More Badges</Text>
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>📚</Text>
                <Text style={styles.tipText}>Complete learning modules to earn knowledge badges</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>🎯</Text>
                <Text style={styles.tipText}>Finish missions consistently for streak achievements</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>💰</Text>
                <Text style={styles.tipText}>Save money and reach goals for savings badges</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>⚡</Text>
                <Text style={styles.tipText}>Level up and earn XP for milestone achievements</Text>
              </View>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
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
  statsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
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
    minHeight: 140,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 14,
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  progressPercentage: {
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
    color: '#10B981',
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
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 12,
  },
  filterScrollView: {
    marginBottom: 8,
  },
  filterContent: {
    paddingRight: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  filterIcon: {
    fontSize: 14,
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#10B981',
  },
  achievementsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Fredoka-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: (width - 64) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  achievementCardEarned: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  achievementCardLocked: {
    opacity: 0.6,
    backgroundColor: '#F9FAFB',
  },
  rarityBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  achievementContent: {
    alignItems: 'center',
  },
  achievementIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  achievementIconEarned: {
    backgroundColor: '#DCFCE7',
  },
  achievementIconLocked: {
    backgroundColor: '#F3F4F6',
  },
  achievementIcon: {
    fontSize: 28,
  },
  achievementIconTextLocked: {
    opacity: 0.5,
  },
  achievementTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 6,
  },
  achievementTitleEarned: {
    color: '#059669',
  },
  achievementTitleLocked: {
    color: '#9CA3AF',
  },
  achievementDescription: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 12,
  },
  achievementDescriptionLocked: {
    color: '#D1D5DB',
  },
  achievementTags: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 9,
    fontFamily: 'Inter-SemiBold',
  },
  rarityTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rarityTagText: {
    fontSize: 9,
    fontFamily: 'Inter-SemiBold',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  pointsText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  earnedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  earnedText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
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
    padding: 20,
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
    alignItems: 'center',
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
    color: '#6B7280',
    flex: 1,
    lineHeight: 18,
  },
});