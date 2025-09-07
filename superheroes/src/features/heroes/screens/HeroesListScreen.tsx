import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@theme/index';
import { Hero } from '@types/hero';

import useGetHeroes from '../hooks/useGetHeroes';
import HeroCard from '../components/HeroCard';
import SkeletonCard from '@components/SkeletonCard';
import SearchBar from '@components/SearchBar';

export default function HeroesListScreen() {
  const navigation = useNavigation();
  const { heroes, loading, error } = useGetHeroes();
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar héroes basado en la búsqueda
  const filteredHeroes = useMemo(() => {
    if (!heroes) return [];
    
    if (!searchQuery.trim()) return heroes;
    
    return heroes.filter(hero => 
      hero.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.biography.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [heroes, searchQuery]);

  const handleHeroPress = (hero: Hero) => {
    navigation.navigate('HeroDetail', { heroId: hero.id });
  };

  const handleToggleFavorite = (hero: Hero) => {
    Alert.alert('Favorito', `Agregado/quitar ${hero.name} de favoritos`);
  };

  const renderHeroCard = ({ item }: { item: Hero }) => (
    <HeroCard
      hero={item}
      onPress={handleHeroPress}
      onToggleFavorite={handleToggleFavorite}
      isFavorite={false}
    />
  );

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <SkeletonCard height={200} />
      <SkeletonCard height={200} />
      <SkeletonCard height={200} />
    </View>
  );

  if (error) {
    console.log('HeroesListScreen error:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar los superhéroes</Text>
        <Text style={styles.errorDetails}>
          {error.message || 'Error desconocido'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Superheroes</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search"
      />

      {loading ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={filteredHeroes}
          renderItem={renderHeroCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[8],
    paddingBottom: theme.spacing[4],
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  listContainer: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[8],
  },
  skeletonContainer: {
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[4],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[6],
  },
  errorText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  errorDetails: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
});
