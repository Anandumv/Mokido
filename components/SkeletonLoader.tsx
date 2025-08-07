import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}

export function SkeletonBox({ width, height, borderRadius = 8, style }: SkeletonProps) {
  const shimmerValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    shimmerAnimation.start();

    return () => {
      shimmerAnimation.stop();
    };
  }, []);

  const translateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={[
      styles.skeleton,
      { width, height, borderRadius },
      style
    ]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          }
        ]}
      />
    </View>
  );
}

// Common skeleton patterns
export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <SkeletonBox width={56} height={56} borderRadius={28} />
        <View style={styles.cardInfo}>
          <SkeletonBox width="80%" height={18} />
          <SkeletonBox width="60%" height={14} style={{ marginTop: 8 }} />
        </View>
      </View>
      <SkeletonBox width="100%" height={12} style={{ marginTop: 16 }} />
      <View style={styles.cardFooter}>
        <SkeletonBox width={80} height={24} borderRadius={12} />
        <SkeletonBox width={60} height={20} borderRadius={10} />
      </View>
    </View>
  );
}

export function SkeletonStatCard() {
  return (
    <View style={styles.statCard}>
      <SkeletonBox width={24} height={24} borderRadius={12} />
      <SkeletonBox width="60%" height={20} style={{ marginTop: 8 }} />
      <SkeletonBox width="40%" height={14} style={{ marginTop: 4 }} />
    </View>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
  },
});