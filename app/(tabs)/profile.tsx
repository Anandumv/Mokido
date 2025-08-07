import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Award, TrendingUp, Target, Crown, LogOut, CreditCard as Edit, Share, CircleHelp as HelpCircle, Bell, Shield, ChevronRight, Star, Coins, Calendar, DollarSign, Plane, ArrowUpRight } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import CashConversionModal from '@/components/CashConversionModal';
import USDCConversionModal from '@/components/USDCConversionModal';
import TravelMilesConversionModal from '@/components/TravelMilesConversionModal';
import ParentPinModal from '@/components/ParentPinModal';
import { allAchievements } from '@/data/achievements';

export default function ProfileScreen() {
  const { user, logout, toggleParentMode, convertMokTokens, verifyParentPin } = useAuth();
  const [showCashConversionModal, setShowCashConversionModal] = useState(false);
  const [showUSDCConversionModal, setShowUSDCConversionModal] = useState(false);
  const [showTravelMilesConversionModal, setShowTravelMilesConversionModal] = useState(false);
  const [showParentPinModal, setShowParentPinModal] = useState(false);
  
  if (!user) return null;

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)');
          }
        }
      ]
    );
  };

  const nextLevelXP = (user.level + 1) * 250;
  const currentLevelXP = user.level * 250;
  const progressToNext = ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  const handleNavigateToBadges = () => {
    router.push('/(tabs)/profile/badges');
  };

  const handleModeToggle = () => {
    try {
      if (user.isParentMode) {
        // Switching from Parent Mode to Kid Mode - no PIN required
        toggleParentMode();
      } else {
        // Switching from Kid Mode to Parent Mode - PIN required
        setShowParentPinModal(true);
      }
    } catch (error) {
      console.error('Error toggling parent mode:', error);
      Alert.alert('Error', 'Failed to toggle parent mode. Please try again.');
    }
  };

  const handleVerifyPin = async (pin: string): Promise<boolean> => {
    try {
      if (!pin || typeof pin !== 'string') {
        console.error('Invalid PIN provided:', pin);
        return false;
      }
      
      const isValid = await verifyParentPin(pin);
      if (isValid) {
        await toggleParentMode();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return false;
    }
  };

  const menuItems = [
    { title: 'Edit Profile', icon: Edit, color: '#10B981' },
    { title: 'Notifications', icon: Bell, color: '#3B82F6' },
    { title: 'Privacy & Security', icon: Shield, color: '#8B5CF6' },
    { title: 'Help & Support', icon: HelpCircle, color: '#F59E0B' },
    { title: 'Share App', icon: Share, color: '#EF4444' },
  ];

  const handleConvertMokTokens = async (amount: number, assetType: 'cash' | 'usdc' | 'travelMiles') => {
    return await convertMokTokens(amount, assetType);
  };

  return (
    <LinearGradient
      colors={['#FDF2F8', '#FFFFFF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.headerGradient}
            >
              <View style={styles.profileInfo}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatar}>{user.avatar}</Text>
                  <View style={styles.levelBadge}>
                    <Crown color="#FFFFFF" size={16} />
                    <Text style={styles.levelText}>{user.level}</Text>
                  </View>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userAge}>Age {user.age} • {user.ageGroup} years</Text>
                  <Text style={styles.joinDate}>Member since {user.joinDate}</Text>
                </View>
              </View>

              {/* XP Progress */}
              <View style={styles.xpContainer}>
                <View style={styles.xpHeader}>
                  <Text style={styles.xpTitle}>Level Progress</Text>
                  <Text style={styles.xpAmount}>{user.xp} XP</Text>
                </View>
                <View style={styles.xpBar}>
                  <View style={[styles.xpFill, { width: `${progressToNext}%` }]} />
                </View>
                <Text style={styles.xpText}>
                  {nextLevelXP - user.xp} XP to Level {user.level + 1}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Stats Cards */}
          {user.isParentMode ? (
            <View style={styles.statsContainer}>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Coins color="#10B981" size={24} />
                  <Text style={styles.statValue}>{user.mokTokens}</Text>
                  <Text style={styles.statLabel}>MokTokens</Text>
                </View>
                <View style={styles.statCard}>
                  <Award color="#F59E0B" size={24} />
                  <Text style={styles.statValue}>{user.badges.length}</Text>
                  <Text style={styles.statLabel}>Badges</Text>
                </View>
              </View>
              
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Target color="#3B82F6" size={24} />
                  <Text style={styles.statValue}>${user.savings.toFixed(0)}</Text>
                  <Text style={styles.statLabel}>Cash Savings</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statEmoji}>💎</Text>
                  <Text style={styles.statValue}>${user.usdcBalance.toFixed(2)}</Text>
                  <Text style={styles.statLabel}>USDC</Text>
                </View>
              </View>
              
              <View style={styles.singleStatRow}>
                <View style={styles.statCard}>
                  <Plane color="#F59E0B" size={24} />
                  <Text style={styles.statValue}>{user.travelMiles.toFixed(1)}</Text>
                  <Text style={styles.statLabel}>Travel Miles</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.statsContainer}>
              <View style={styles.statsRow}>
                <View style={styles.kidModeCard}>
                  <Text style={styles.kidModeEmoji}>🪙</Text>
                  <Text style={styles.kidModeValue}>{user.mokTokens}</Text>
                  <Text style={styles.kidModeLabel}>My MokTokens!</Text>
                </View>
                <TouchableOpacity style={styles.kidModeCard} onPress={handleNavigateToBadges}>
                  <Text style={styles.kidModeEmoji}>🏆</Text>
                  <Text style={styles.kidModeValue}>{user.badges.length}</Text>
                  <Text style={styles.kidModeLabel}>My Badges!</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* MokToken Conversion Section - Available in both modes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {user.isParentMode ? 'MokToken Conversion 🪙' : 'Turn MokTokens into Cool Stuff! 🪙'}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {user.isParentMode 
                ? 'Convert your earned MokTokens into different assets'
                : 'Trade your MokTokens for real money, digital coins, and travel miles!'
              }
            </Text>
            
            <View style={styles.conversionContainer}>
              {/* Cash Conversion */}
              <TouchableOpacity 
                style={styles.conversionCard}
                onPress={() => setShowCashConversionModal(true)}
              >
                <View style={styles.conversionHeader}>
                  <View style={[styles.conversionIcon, { backgroundColor: '#DCFCE7' }]}>
                    <DollarSign color="#10B981" size={24} />
                  </View>
                  <View style={styles.conversionInfo}>
                    <Text style={styles.conversionTitle}>
                      {user.isParentMode ? 'Convert to Cash' : 'Get Real Money! 💰'}
                    </Text>
                    <Text style={styles.conversionDescription}>
                      1 MokToken = $0.01
                    </Text>
                  </View>
                  <ArrowUpRight color="#10B981" size={20} />
                </View>
                <Text style={styles.conversionDetails}>
                  {user.isParentMode 
                    ? 'Add real money to your savings account'
                    : 'Turn your tokens into real dollars for your savings!'
                  }
                </Text>
              </TouchableOpacity>

              {/* USDC Conversion */}
              <TouchableOpacity 
                style={styles.conversionCard}
                onPress={() => setShowUSDCConversionModal(true)}
              >
                <View style={styles.conversionHeader}>
                  <View style={[styles.conversionIcon, { backgroundColor: '#DBEAFE' }]}>
                    <Text style={styles.conversionEmoji}>💎</Text>
                  </View>
                  <View style={styles.conversionInfo}>
                    <Text style={styles.conversionTitle}>
                      {user.isParentMode ? 'Convert to USDC' : 'Get Digital Coins! 💎'}
                    </Text>
                    <Text style={styles.conversionDescription}>
                      1 MokToken = $0.01 USDC
                    </Text>
                  </View>
                  <ArrowUpRight color="#3B82F6" size={20} />
                </View>
                <Text style={styles.conversionDetails}>
                  {user.isParentMode 
                    ? 'Digital stablecoin for crypto learning'
                    : 'Learn about digital money with safe USDC coins!'
                  }
                </Text>
              </TouchableOpacity>

              {/* Travel Miles Conversion */}
              <TouchableOpacity 
                style={styles.conversionCard}
                onPress={() => setShowTravelMilesConversionModal(true)}
              >
                <View style={styles.conversionHeader}>
                  <View style={[styles.conversionIcon, { backgroundColor: '#FEF3C7' }]}>
                    <Plane color="#F59E0B" size={24} />
                  </View>
                  <View style={styles.conversionInfo}>
                    <Text style={styles.conversionTitle}>
                      {user.isParentMode ? 'Convert to Travel Miles' : 'Get Travel Miles! ✈️'}
                    </Text>
                    <Text style={styles.conversionDescription}>
                      1 MokToken = 0.5 Miles
                    </Text>
                  </View>
                  <ArrowUpRight color="#F59E0B" size={20} />
                </View>
                <Text style={styles.conversionDetails}>
                  {user.isParentMode 
                    ? 'Rewards for future adventures and trips'
                    : 'Save up for awesome family trips and adventures!'
                  }
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Kid Mode Encouragement */}
          {!user.isParentMode && (
            <View style={styles.section}>
              <View style={styles.kidEncouragementCard}>
                <LinearGradient
                  colors={['#EC4899', '#BE185D']}
                  style={styles.kidEncouragementGradient}
                >
                  <Text style={styles.kidEncouragementEmoji}>🌟</Text>
                  <Text style={styles.kidEncouragementTitle}>You're Doing Amazing!</Text>
                  <Text style={styles.kidEncouragementText}>
                    Keep learning and completing missions to earn more MokTokens! 
                    The more you learn, the more cool stuff you can get! 🚀
                  </Text>
                </LinearGradient>
              </View>
            </View>
          )}

          {/* Mode Toggle */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.modeToggle} onPress={handleModeToggle}>
              <View style={styles.modeToggleContent}>
                <Text style={styles.modeToggleEmoji}>
                  {user.isParentMode ? '👨‍👩‍👧‍👦' : '👶'}
                </Text>
                <View style={styles.modeToggleText}>
                  <Text style={styles.modeToggleTitle}>
                    {user.isParentMode ? 'Switch to Kid Mode' : 'Switch to Parent Mode'}
                  </Text>
                  <Text style={styles.modeToggleSubtitle}>
                    {user.isParentMode 
                      ? 'Switch to a fun, kid-friendly view' 
                      : 'Show detailed financial information'
                    }
                  </Text>
                </View>
              </View>
              <ChevronRight color="#6366F1" size={20} />
            </TouchableOpacity>
          </View>

          {/* Achievements */}
          {user.isParentMode && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              <TouchableOpacity 
                style={styles.viewAllBadgesButton}
                onPress={handleNavigateToBadges}
              >
                <Text style={styles.viewAllBadgesText}>View All Badges</Text>
                <ChevronRight color="#10B981" size={16} />
              </TouchableOpacity>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.achievementsContent}
              >
                {allAchievements.slice(0, 6).map((achievement) => {
                  const unlocked = user.badges.includes(achievement.title);
                  return (
                    <View 
                      key={achievement.id}
                      style={[
                        styles.achievementCard,
                        !unlocked && styles.achievementLocked
                      ]}
                    >
                      <Text style={[
                        styles.achievementIcon,
                        !unlocked && styles.achievementIconLocked
                      ]}>
                        {unlocked ? achievement.icon : '🔒'}
                      </Text>
                      <Text style={[
                        styles.achievementTitle,
                        !unlocked && styles.achievementTitleLocked
                      ]}>
                        {achievement.title}
                      </Text>
                      <Text style={[
                        styles.achievementDescription,
                        !unlocked && styles.achievementDescriptionLocked
                      ]}>
                        {achievement.description}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Financial Summary */}
          {user.isParentMode && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Financial Summary</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Cash Savings</Text>
                  <Text style={styles.summaryValue}>${user.savings.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Investments</Text>
                  <Text style={styles.summaryValue}>${user.investmentBalance.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Crypto Balance</Text>
                  <Text style={styles.summaryValue}>${user.cryptoBalance.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>USDC Balance</Text>
                  <Text style={styles.summaryValue}>${user.usdcBalance.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Travel Miles</Text>
                  <Text style={styles.summaryValue}>{user.travelMiles.toFixed(1)} miles</Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryTotal]}>
                  <Text style={styles.summaryTotalLabel}>Total Net Worth</Text>
                  <Text style={styles.summaryTotalValue}>
                    ${(user.savings + user.investmentBalance + user.cryptoBalance + user.usdcBalance).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Menu Items */}
          {user.isParentMode && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Settings</Text>
              {menuItems.map((item, index) => (
                <TouchableOpacity key={index} style={styles.menuItem}>
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                    <item.icon color={item.color} size={20} />
                  </View>
                  <Text style={styles.menuText}>{item.title}</Text>
                  <ChevronRight color="#9CA3AF" size={20} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appName}>Mokido v1.0.0</Text>
            <Text style={styles.appDescription}>
              Building financial literacy, one lesson at a time 🌟
            </Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color="#EF4444" size={20} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Conversion Modals */}
        <CashConversionModal
          visible={showCashConversionModal}
          onClose={() => setShowCashConversionModal(false)}
          onConvert={(amount) => handleConvertMokTokens(amount, 'cash')}
          userMokTokens={user.mokTokens}
        />

        <USDCConversionModal
          visible={showUSDCConversionModal}
          onClose={() => setShowUSDCConversionModal(false)}
          onConvert={(amount) => handleConvertMokTokens(amount, 'usdc')}
          userMokTokens={user.mokTokens}
        />

        <TravelMilesConversionModal
          visible={showTravelMilesConversionModal}
          onClose={() => setShowTravelMilesConversionModal(false)}
          onConvert={(amount) => handleConvertMokTokens(amount, 'travelMiles')}
          userMokTokens={user.mokTokens}
        />

        {/* Parent PIN Modal */}
        <ParentPinModal
          visible={showParentPinModal}
          onClose={() => setShowParentPinModal(false)}
          onVerifyPin={handleVerifyPin}
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
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
    lineHeight: 80,
    fontSize: 32,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userAge: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 2,
  },
  joinDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  xpContainer: {
    marginTop: 8,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  xpAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  xpBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  xpText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  singleStatRow: {
    alignItems: 'center',
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
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  kidModeCard: {
    flex: 1,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  kidModeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  kidModeValue: {
    fontSize: 24,
    fontFamily: 'Fredoka-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  kidModeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    textAlign: 'center',
  },
  kidEncouragementCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  kidEncouragementGradient: {
    padding: 20,
    alignItems: 'center',
  },
  kidEncouragementEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  kidEncouragementTitle: {
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  kidEncouragementText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 20,
  },
  conversionContainer: {
    gap: 12,
  },
  conversionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  conversionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  conversionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  conversionEmoji: {
    fontSize: 24,
  },
  conversionInfo: {
    flex: 1,
  },
  conversionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  conversionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  conversionDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    lineHeight: 16,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  modeToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modeToggleEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  modeToggleText: {
    flex: 1,
  },
  modeToggleTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  modeToggleSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  modeToggleIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletCard: {
    // Removed wallet-related styles
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Fredoka-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  viewAllBadgesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 6,
  },
  viewAllBadgesText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  achievementsContent: {
    paddingRight: 20,
    gap: 12,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  achievementLocked: {
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementIconLocked: {
    opacity: 0.5,
  },
  achievementTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
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
  },
  achievementDescriptionLocked: {
    color: '#D1D5DB',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 8,
    paddingTop: 16,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  summaryTotalValue: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#10B981',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  appName: {
    fontSize: 16,
    fontFamily: 'Fredoka-SemiBold',
    color: '#6B7280',
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    marginHorizontal: 20,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
});