import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface SkeletonCardProps {
  width?: number | string;
  height?: number;
}

export default function SkeletonCard({ width = '100%', height = 120 }: SkeletonCardProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={[styles.container, { width, height }]}>
      <Animated.View 
        style={[
          styles.shimmer, 
          { 
            opacity: shimmerOpacity,
            width: '100%',
            height: '100%',
          }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#6A4DBC3D', // 24% opacity
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  shimmer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
});
