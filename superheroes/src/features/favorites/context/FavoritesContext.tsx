import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Hero } from '@types/hero';
import { heroesRepository } from '@services/storage/heroesRepository';

interface FavoritesContextType {
  favoriteHeroes: Hero[];
  loading: boolean;
  error: any;
  toggleFavorite: (hero: Hero) => Promise<boolean>;
  isFavorite: (heroId: number) => boolean;
  searchFavorites: (query: string) => Promise<Hero[]>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favoriteHeroes, setFavoriteHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    loadFavoriteHeroes();
  }, [loadFavoriteHeroes]);

  const loadFavoriteHeroes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const favorites = await heroesRepository.getFavoriteHeroes();
      setFavoriteHeroes(favorites);
      
      console.log(`[FavoritesContext] Loaded ${favorites.length} favorite heroes`);
    } catch (err) {
      console.error('[FavoritesContext] Error loading favorite heroes:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback(async (hero: Hero): Promise<boolean> => {
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
      
      console.log(`[FavoritesContext] Toggled favorite for ${hero.name}: ${newFavoriteStatus}`);
      return newFavoriteStatus;
    } catch (err) {
      console.error('[FavoritesContext] Error toggling favorite:', err);
      throw err;
    }
  }, []);

  const isFavorite = useCallback((heroId: number): boolean => {
    return favoriteHeroes.some(hero => hero.id === heroId);
  }, [favoriteHeroes]);

  const searchFavorites = useCallback(async (query: string): Promise<Hero[]> => {
    try {
      if (query.trim() === '') {
        return favoriteHeroes;
      }
      
      return favoriteHeroes.filter(hero =>
        hero.name.toLowerCase().includes(query.toLowerCase()) ||
        hero.biography.fullName.toLowerCase().includes(query.toLowerCase())
      );
    } catch (err) {
      console.error('[FavoritesContext] Error searching favorites:', err);
      return favoriteHeroes;
    }
  }, [favoriteHeroes]);

  const refreshFavorites = useCallback(async () => {
    await loadFavoriteHeroes();
  }, [loadFavoriteHeroes]);

  const value: FavoritesContextType = {
    favoriteHeroes,
    loading,
    error,
    toggleFavorite,
    isFavorite,
    searchFavorites,
    refreshFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
