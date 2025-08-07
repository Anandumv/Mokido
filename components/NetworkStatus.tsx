import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { WifiOff, Wifi } from 'lucide-react-native';
import { isOnline } from '@/utils/networkUtils';

export default function NetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const slideAnim = useState(new Animated.Value(-60))[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let mounted = true;

    // Only run on web where we can detect network status
    if (typeof navigator !== 'undefined' && 'onLine' in navigator && typeof window.addEventListener === 'function') {
      const checkConnection = () => {
        if (!mounted) return;
        
        const online = isOnline();
        if (online !== isConnected) {
          setIsConnected(online);
          
          if (!online) {
            // Show offline banner
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start();
          } else {
            // Hide offline banner after a delay
            setTimeout(() => {
              if (!mounted) return;
              Animated.timing(slideAnim, {
                toValue: -60,
                duration: 300,
                useNativeDriver: true,
              }).start();
            }, 2000);
          }
        }
      };

      // Check immediately
      checkConnection();

      // Set up listeners
      window.addEventListener('online', checkConnection);
      window.addEventListener('offline', checkConnection);

      // Fallback polling for browsers that don't support online/offline events
      interval = setInterval(checkConnection, 5000);

      return () => {
        mounted = false;
        window.removeEventListener('online', checkConnection);
        window.removeEventListener('offline', checkConnection);
        if (interval) clearInterval(interval);
      };
    }
    
    return () => {
      mounted = false;
    };
  }, [isConnected, slideAnim]);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <View style={[
        styles.banner,
        isConnected ? styles.onlineBanner : styles.offlineBanner
      ]}>
        {isConnected ? (
          <Wifi color="#FFFFFF" size={16} />
        ) : (
          <WifiOff color="#FFFFFF" size={16} />
        )}
        <Text style={styles.text}>
          {isConnected ? 'Back online!' : 'No internet connection'}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  onlineBanner: {
    backgroundColor: '#10B981',
  },
  offlineBanner: {
    backgroundColor: '#EF4444',
  },
  text: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});