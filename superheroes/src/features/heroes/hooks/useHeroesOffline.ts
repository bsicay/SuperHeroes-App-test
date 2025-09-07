import { useState, useEffect } from 'react';
import { Hero } from '@types/hero';
import { heroesRepository } from '@services/storage/heroesRepository';
import useGetHeroes from './useGetHeroes';
export default function useHeroesOffline() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);
  
  const { heroes: apiHeroes, loading: apiLoading, error: apiError } = useGetHeroes();

  useEffect(() => {
    loadHeroes();
  }, []);

  useEffect(() => {
    if (apiHeroes && apiHeroes.length > 0) {
      // Si tenemos datos de la API, los guardamos en la base de datos local
      saveHeroesToLocal(apiHeroes);
      setHeroes(apiHeroes);
      setLoading(false);
      setIsOffline(false);
    } else if (apiError) {
      // Si hay error de API, intentamos cargar desde la base de datos local
      loadHeroesFromLocal();
      setIsOffline(true);
    }
  }, [apiHeroes, apiError]);

  const loadHeroes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Primero intentamos cargar desde la base de datos local
      const localHeroes = await heroesRepository.getAllHeroes();
      
      if (localHeroes.length > 0) {
        setHeroes(localHeroes);
        setLoading(false);
        console.log(`[useHeroesOffline] Loaded ${localHeroes.length} heroes from local database`);
      }
      
      // Si no hay datos locales, esperamos a que la API responda
      if (localHeroes.length === 0 && !apiLoading) {
        setLoading(false);
      }
    } catch (err) {
      console.error('[useHeroesOffline] Error loading heroes:', err);
      setError(err);
      setLoading(false);
    }
  };

  const loadHeroesFromLocal = async () => {
    try {
      const localHeroes = await heroesRepository.getAllHeroes();
      setHeroes(localHeroes);
      setLoading(false);
      console.log(`[useHeroesOffline] Loaded ${localHeroes.length} heroes from local database (offline mode)`);
    } catch (err) {
      console.error('[useHeroesOffline] Error loading heroes from local:', err);
      setError(err);
      setLoading(false);
    }
  };

  const saveHeroesToLocal = async (heroesToSave: Hero[]) => {
    try {
      await heroesRepository.saveHeroes(heroesToSave);
      console.log(`[useHeroesOffline] Saved ${heroesToSave.length} heroes to local database`);
    } catch (err) {
      console.error('[useHeroesOffline] Error saving heroes to local:', err);
    }
  };

  const searchHeroes = async (query: string): Promise<Hero[]> => {
    try {
      if (query.trim() === '') {
        return heroes;
      }
      
      const searchResults = await heroesRepository.searchHeroes(query);
      return searchResults;
    } catch (err) {
      console.error('[useHeroesOffline] Error searching heroes:', err);
      return heroes.filter(hero => 
        hero.name.toLowerCase().includes(query.toLowerCase()) ||
        hero.biography.fullName.toLowerCase().includes(query.toLowerCase())
      );
    }
  };

  const toggleFavorite = async (heroId: number): Promise<boolean> => {
    try {
      const newFavoriteStatus = await heroesRepository.toggleFavorite(heroId);
      
      // Actualizar el estado local
      setHeroes(prevHeroes => 
        prevHeroes.map(hero => 
          hero.id === heroId 
            ? { ...hero, isFavorite: newFavoriteStatus }
            : hero
        )
      );
      
      return newFavoriteStatus;
    } catch (err) {
      console.error('[useHeroesOffline] Error toggling favorite:', err);
      throw err;
    }
  };

  const getFavoriteHeroes = async (): Promise<Hero[]> => {
    try {
      return await heroesRepository.getFavoriteHeroes();
    } catch (err) {
      console.error('[useHeroesOffline] Error getting favorite heroes:', err);
      return heroes.filter(hero => hero.isFavorite);
    }
  };

  const refreshHeroes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Limpiar datos locales y recargar desde la API
      await heroesRepository.clearAllHeroes();
      await loadHeroes();
    } catch (err) {
      console.error('[useHeroesOffline] Error refreshing heroes:', err);
      setError(err);
      setLoading(false);
    }
  };

  return {
    heroes,
    loading,
    error,
    isOffline,
    searchHeroes,
    toggleFavorite,
    getFavoriteHeroes,
    refreshHeroes,
  };
}
