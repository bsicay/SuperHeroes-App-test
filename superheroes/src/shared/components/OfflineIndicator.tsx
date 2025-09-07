import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@theme';

interface OfflineIndicatorProps {
  isOffline: boolean;
}

export default function OfflineIndicator({ isOffline }: OfflineIndicatorProps) {
  if (!isOffline) return null;

  return (
    <View style={styles.container}>
      <View style={styles.indicator} />
      <Text style={styles.text}>Modo offline</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    marginRight: 8,
  },
  text: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
  },
});
