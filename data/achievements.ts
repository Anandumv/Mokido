export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'missions' | 'savings' | 'special' | 'milestones';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: string;
  points?: number;
}

export const allAchievements: Achievement[] = [
  // Learning Achievements
  {
    id: 'first-lesson',
    title: 'First Steps',
    description: 'Completed your first learning module',
    icon: '🎯',
    category: 'learning',
    rarity: 'common',
    requirement: 'Complete 1 learning module',
    points: 10
  },
  {
    id: 'knowledge-seeker',
    title: 'Knowledge Seeker',
    description: 'Completed 5 learning modules',
    icon: '📚',
    category: 'learning',
    rarity: 'rare',
    requirement: 'Complete 5 learning modules',
    points: 50
  },
  {
    id: 'learning-master',
    title: 'Learning Master',
    description: 'Completed all available learning modules',
    icon: '🎓',
    category: 'learning',
    rarity: 'epic',
    requirement: 'Complete all learning modules',
    points: 100
  },
  {
    id: 'perfect-score',
    title: 'Perfect Scholar',
    description: 'Scored 100% on a learning module',
    icon: '⭐',
    category: 'learning',
    rarity: 'rare',
    requirement: 'Score 100% on any module',
    points: 25
  },

  // Mission Achievements
  {
    id: 'mission-starter',
    title: 'Mission Starter',
    description: 'Completed your first mission',
    icon: '🚀',
    category: 'missions',
    rarity: 'common',
    requirement: 'Complete 1 mission',
    points: 10
  },
  {
    id: 'mission-master',
    title: 'Mission Master',
    description: 'Completed 10 missions',
    icon: '⭐',
    category: 'missions',
    rarity: 'rare',
    requirement: 'Complete 10 missions',
    points: 50
  },
  {
    id: 'streak-warrior',
    title: 'Streak Warrior',
    description: 'Completed missions for 7 days in a row',
    icon: '🔥',
    category: 'missions',
    rarity: 'epic',
    requirement: 'Complete missions for 7 consecutive days',
    points: 75
  },
  {
    id: 'household-helper',
    title: 'Household Helper',
    description: 'Completed 5 household missions',
    icon: '🏠',
    category: 'missions',
    rarity: 'common',
    requirement: 'Complete 5 household missions',
    points: 20
  },

  // Savings Achievements
  {
    id: 'first-saver',
    title: 'First Saver',
    description: 'Saved your first $10',
    icon: '💰',
    category: 'savings',
    rarity: 'common',
    requirement: 'Save $10',
    points: 15
  },
  {
    id: 'goal-setter',
    title: 'Goal Setter',
    description: 'Created your first savings goal',
    icon: '🎯',
    category: 'savings',
    rarity: 'common',
    requirement: 'Create 1 savings goal',
    points: 10
  },
  {
    id: 'goal-achiever',
    title: 'Goal Achiever',
    description: 'Completed your first savings goal',
    icon: '🏆',
    category: 'savings',
    rarity: 'rare',
    requirement: 'Complete 1 savings goal',
    points: 30
  },
  {
    id: 'super-saver',
    title: 'Super Saver',
    description: 'Saved $100',
    icon: '🏦',
    category: 'savings',
    rarity: 'epic',
    requirement: 'Save $100',
    points: 50
  },
  {
    id: 'investment-pioneer',
    title: 'Investment Pioneer',
    description: 'Made your first investment',
    icon: '📈',
    category: 'savings',
    rarity: 'rare',
    requirement: 'Add funds to investments',
    points: 25
  },

  // Special Achievements
  {
    id: 'welcome-mokido',
    title: 'Welcome to Mokido!',
    description: 'Joined the Mokido community',
    icon: '🌟',
    category: 'special',
    rarity: 'common',
    requirement: 'Create account',
    points: 5
  },
  {
    id: 'demo-user',
    title: 'Demo User',
    description: 'Explored Mokido with demo account',
    icon: '🎮',
    category: 'special',
    rarity: 'common',
    requirement: 'Use demo account',
    points: 5
  },
  {
    id: 'parent-mode',
    title: 'Parent Mode Explorer',
    description: 'Switched to parent mode',
    icon: '👨‍👩‍👧‍👦',
    category: 'special',
    rarity: 'common',
    requirement: 'Toggle parent mode',
    points: 10
  },
  {
    id: 'crypto-curious',
    title: 'Crypto Curious',
    description: 'Connected a crypto wallet',
    icon: '👻',
    category: 'special',
    rarity: 'rare',
    requirement: 'Connect Phantom wallet',
    points: 30
  },

  // Milestone Achievements
  {
    id: 'level-up',
    title: 'Level Up!',
    description: 'Reached level 2',
    icon: '⬆️',
    category: 'milestones',
    rarity: 'common',
    requirement: 'Reach level 2',
    points: 20
  },
  {
    id: 'token-collector',
    title: 'Token Collector',
    description: 'Earned 100 MokTokens',
    icon: '🪙',
    category: 'milestones',
    rarity: 'rare',
    requirement: 'Earn 100 MokTokens',
    points: 25
  },
  {
    id: 'xp-master',
    title: 'XP Master',
    description: 'Earned 500 XP',
    icon: '⚡',
    category: 'milestones',
    rarity: 'epic',
    requirement: 'Earn 500 XP',
    points: 40
  },
  {
    id: 'financial-genius',
    title: 'Financial Genius',
    description: 'Reached level 5',
    icon: '🧠',
    category: 'milestones',
    rarity: 'legendary',
    requirement: 'Reach level 5',
    points: 100
  },

  // Additional Fun Achievements
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Completed a mission before 9 AM',
    icon: '🌅',
    category: 'special',
    rarity: 'common',
    requirement: 'Complete mission before 9 AM',
    points: 15
  },
  {
    id: 'weekend-warrior',
    title: 'Weekend Warrior',
    description: 'Completed missions on both Saturday and Sunday',
    icon: '🏃‍♂️',
    category: 'missions',
    rarity: 'rare',
    requirement: 'Complete missions on weekend',
    points: 30
  },
  {
    id: 'money-converter',
    title: 'Money Converter',
    description: 'Converted MokTokens to real assets',
    icon: '🔄',
    category: 'special',
    rarity: 'rare',
    requirement: 'Convert MokTokens',
    points: 20
  },
  {
    id: 'travel-dreamer',
    title: 'Travel Dreamer',
    description: 'Converted MokTokens to travel miles',
    icon: '✈️',
    category: 'special',
    rarity: 'rare',
    requirement: 'Convert to travel miles',
    points: 25
  }
];

export const getCategoryColor = (category: Achievement['category']): string => {
  switch (category) {
    case 'learning': return '#3B82F6';
    case 'missions': return '#F59E0B';
    case 'savings': return '#10B981';
    case 'special': return '#8B5CF6';
    case 'milestones': return '#EF4444';
    default: return '#6B7280';
  }
};

export const getRarityColor = (rarity: Achievement['rarity']): string => {
  switch (rarity) {
    case 'common': return '#6B7280';
    case 'rare': return '#3B82F6';
    case 'epic': return '#8B5CF6';
    case 'legendary': return '#F59E0B';
    default: return '#6B7280';
  }
};

export const getRarityGradient = (rarity: Achievement['rarity']): string[] => {
  switch (rarity) {
    case 'common': return ['#9CA3AF', '#6B7280'];
    case 'rare': return ['#60A5FA', '#3B82F6'];
    case 'epic': return ['#A78BFA', '#8B5CF6'];
    case 'legendary': return ['#FBBF24', '#F59E0B'];
    default: return ['#9CA3AF', '#6B7280'];
  }
};