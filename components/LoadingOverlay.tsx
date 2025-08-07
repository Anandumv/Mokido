import React from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GraduationCap, Sparkles } from 'lucide-react-native';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export default function LoadingOverlay({ 
  visible, 
  message = "Loading your financial journey..." 
}: LoadingOverlayProps) {
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const fadeValue = React.useRef(new Animated.Value(0)).current;
  const scaleValue = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    if (visible) {
      // Start animations when overlay becomes visible
      Animated.parallel([
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Start continuous rotation
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();

      return () => {
        spinAnimation.stop();
      };
    } else {
      // Fade out when hiding
      Animated.timing(fadeValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.overlay,
        {
          opacity: fadeValue,
          transform: [{ scale: scaleValue }],
        }
      ]}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Floating Background Elements */}
        <View style={styles.floatingElement1} />
        <View style={styles.floatingElement2} />
        <View style={styles.floatingElement3} />

        {/* Main Content */}
        <View style={styles.content}>
          {/* Logo with Animation */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6', '#EC4899']}
              style={styles.logoGradient}
            >
              <GraduationCap color="#FFFFFF" size={48} />
            </LinearGradient>
            
            {/* Spinning Ring */}
            <Animated.View 
              style={[
                styles.spinningRing,
                { transform: [{ rotate: spin }] }
              ]}
            >
              <View style={styles.ring} />
            </Animated.View>
          </View>

          {/* App Name */}
          <Text style={styles.appName}>Mokido</Text>
          
          {/* Loading Message */}
          <Text style={styles.loadingMessage}>{message}</Text>
          
          {/* Loading Dots */}
          <View style={styles.dotsContainer}>
            <LoadingDot delay={0} />
            <LoadingDot delay={200} />
            <LoadingDot delay={400} />
          </View>

          {/* Sparkles Animation */}
          <View style={styles.sparklesContainer}>
            <Animated.View style={[
              styles.sparkle,
              styles.sparkle1,
              { opacity: fadeValue }
            ]}>
              <Sparkles color="#FFFFFF" size={16} />
            </Animated.View>
            <Animated.View style={[
              styles.sparkle,
              styles.sparkle2,
              { opacity: fadeValue }
            ]}>
              <Sparkles color="#FFFFFF" size={12} />
            </Animated.View>
            <Animated.View style={[
              styles.sparkle,
              styles.sparkle3,
              { opacity: fadeValue }
            ]}>
              <Sparkles color="#FFFFFF" size={14} />
            </Animated.View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

// Animated Loading Dot Component
function LoadingDot({ delay }: { delay: number }) {
  const bounceValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(bounceValue, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

    bounceAnimation.start();

    return () => {
      bounceAnimation.stop();
    };
  }, [delay]);

  const translateY = bounceValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        { transform: [{ translateY }] }
      ]}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  floatingElement1: {
    position: 'absolute',
    top: '20%',
    right: '10%',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  floatingElement2: {
    position: 'absolute',
    top: '60%',
    left: '15%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  floatingElement3: {
    position: 'absolute',
    bottom: '25%',
    right: '20%',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  spinningRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: '#FFFFFF',
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
  },
  appName: {
    fontSize: 42,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
  sparklesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: '30%',
    left: '20%',
  },
  sparkle2: {
    top: '70%',
    right: '25%',
  },
  sparkle3: {
    bottom: '40%',
    left: '30%',
  },
});