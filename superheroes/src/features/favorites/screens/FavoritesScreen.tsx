import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@theme/index';
import { Hero } from '@types/hero';
import HeroCard from '@features/heroes/components/HeroCard';
import SearchBar from '@components/SearchBar';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const { favoriteHeroes, loading, error, toggleFavorite, refreshFavorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');

  // Refrescar favoritos cuando se monta el componente
  useEffect(() => {
    refreshFavorites();
  }, []);

  // Filtrar favoritos basado en la búsqueda
  const filteredFavorites = useMemo(() => {
    if (!favoriteHeroes) return [];

    if (!searchQuery.trim()) return favoriteHeroes;

    return favoriteHeroes.filter(hero =>
      hero.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.biography.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [favoriteHeroes, searchQuery]);

  const handleHeroPress = (hero: Hero) => {
    navigation.navigate('HeroDetail', { heroId: hero.id });
  };

  const handleToggleFavorite = async (hero: Hero) => {
    try {
      const newFavoriteStatus = await toggleFavorite(hero);
      const message = newFavoriteStatus 
        ? `${hero.name} agregado a favoritos` 
        : `${hero.name} removido de favoritos`;
      Alert.alert('Favorito', message);
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar el favorito');
    }
  };

  const renderHeroCard = ({ item }: { item: Hero }) => (
    <HeroCard
      hero={item}
      onPress={handleHeroPress}
      onToggleFavorite={handleToggleFavorite}
      isFavorite={true} // Todos los héroes en esta pantalla son favoritos
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando favoritos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar los favoritos</Text>
        <Text style={styles.errorDetails}>
          {error.message || 'Error desconocido'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search favorites"
      />

      {filteredFavorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {searchQuery.trim() ? 'Not found favorites' : 'No favorites yet'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery.trim() 
              ? 'Try searching with another term' 
              : 'Add heroes to favorites from the list of superheroes'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFavorites}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  loadingText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[6],
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
});
