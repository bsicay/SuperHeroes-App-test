import { useState, useEffect } from 'react';
import { Hero } from '@types/hero';
import { heroesRepository } from '@services/storage/heroesRepository';

export default function useFavoritesOffline() {
  const [favoriteHeroes, setFavoriteHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    loadFavoriteHeroes();
  }, []);

  const loadFavoriteHeroes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const favorites = await heroesRepository.getFavoriteHeroes();
      setFavoriteHeroes(favorites);
      
      console.log(`[useFavoritesOffline] Loaded ${favorites.length} favorite heroes`);
    } catch (err) {
      console.error('[useFavoritesOffline] Error loading favorite heroes:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (hero: Hero): Promise<boolean> => {
    try {
      const newFavoriteStatus = await heroesRepository.toggleFavorite(hero.id);
      
      // Update local state
      if (newFavoriteStatus) {
        // Add to favorites
        setFavoriteHeroes(prevFavorites => [...prevFavorites, { ...hero, isFavorite: true }]);
      } else {
        // Remove from favorites
        setFavoriteHeroes(prevFavorites => prevFavorites.filter(fav => fav.id !== hero.id));
      }
      
      return newFavoriteStatus;
    } catch (err) {
      console.error('[useFavoritesOffline] Error toggling favorite:', err);
      throw err;
    }
  };

  const isFavorite = (heroId: number): boolean => {
    return favoriteHeroes.some(hero => hero.id === heroId);
  };

  const searchFavorites = async (query: string): Promise<Hero[]> => {
    try {
      if (query.trim() === '') {
        return favoriteHeroes;
      }
      
      return favoriteHeroes.filter(hero =>
        hero.name.toLowerCase().includes(query.toLowerCase()) ||
        hero.biography.fullName.toLowerCase().includes(query.toLowerCase())
      );
    } catch (err) {
      console.error('[useFavoritesOffline] Error searching favorites:', err);
      return favoriteHeroes;
    }
  };

  const refreshFavorites = async () => {
    await loadFavoriteHeroes();
  };

  return {
    favoriteHeroes,
    loading,
    error,
    toggleFavorite,
    isFavorite,
    searchFavorites,
    refreshFavorites,
  };
}
