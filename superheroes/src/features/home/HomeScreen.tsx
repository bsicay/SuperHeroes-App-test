import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '@theme/index';
import Icon from '@components/Icon';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>¡Bienvenido a SuperHeroes!</Text>
        <Text style={styles.subtitle}>Explora el universo de superhéroes</Text>
      </View>

      <View style={styles.featuresGrid}>
        <TouchableOpacity style={styles.featureCard}>
          <Icon name="superhero" size={32} color={theme.colors.primary[300]} />
          <Text style={styles.featureTitle}>Superhéroes</Text>
          <Text style={styles.featureDescription}>
            Descubre más de 700 superhéroes con sus poderes y habilidades
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureCard}>
          <Icon name="team" size={32} color={theme.colors.primary[300]} />
          <Text style={styles.featureTitle}>Equipos</Text>
          <Text style={styles.featureDescription}>
            Crea y gestiona tus equipos de superhéroes favoritos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureCard}>
          <Icon name="favorite" size={32} color={theme.colors.primary[300]} />
          <Text style={styles.featureTitle}>Favoritos</Text>
          <Text style={styles.featureDescription}>
            Guarda tus superhéroes favoritos para acceso rápido
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Estadísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>700+</Text>
            <Text style={styles.statLabel}>Superhéroes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>∞</Text>
            <Text style={styles.statLabel}>Equipos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Offline</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  featuresGrid: {
    marginBottom: 40,
  },
  featureCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary[300],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
