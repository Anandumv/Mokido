import { Tabs } from 'expo-router';
import { Chrome as Home, BookOpen, Target, PiggyBank, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import NetworkStatus from '@/components/NetworkStatus';

export default function TabLayout() {
  const { user, isLoading } = useAuth();
  const insets = useSafeAreaInsets();

  console.log('TabLayout: Rendering with isLoading:', isLoading, 'user id:', user?.id || 'null');

  // Show loading state while authentication is being checked
  if (isLoading) {
    console.log('TabLayout: Showing loading state');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Only redirect if we're sure there's no user and not loading
  if (!user) {
    console.log('TabLayout: No user found, redirecting to auth');
    return <Redirect href="/(auth)" />;
  }

  console.log('TabLayout: User found, rendering tabs for user:', user.name);

  return (
    <>
      <NetworkStatus />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#10B981',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Inter-Medium',
          },
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            height: 60 + insets.bottom,
            paddingBottom: Math.max(insets.bottom, 8),
            paddingTop: 8,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Home color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="learn"
          options={{
            title: 'Learn',
            tabBarIcon: ({ color, size }) => (
              <BookOpen color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="missions"
          options={{
            title: 'Missions',
            tabBarIcon: ({ color, size }) => (
              <Target color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="savings"
          options={{
            title: 'Savings',
            tabBarIcon: ({ color, size }) => (
              <PiggyBank color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <User color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/badges"
          options={{
            href: null, // This hides it from the tab bar
          }}
        />
      </Tabs>
    </>
  );
}