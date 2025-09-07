import { useEffect, useState } from 'react';
import { Hero } from '@types/hero';
import { heroesRepository } from '@services/storage/heroesRepository';

const SUPERHERO_API_BASE = 'https://akabab.github.io/superhero-api/api';

export default function useGetHero(heroId: number) {
  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    loadHero();
  }, [heroId]);

  const loadHero = async () => {
    try {
      setLoading(true);
      setError(null);

      // Primero intentar cargar desde la base de datos local
      const localHero = await heroesRepository.getHeroById(heroId);
      
      if (localHero) {
        setHero(localHero);
        setLoading(false);
        console.log(`[useGetHero] Loaded hero ${heroId} from local database`);
        return;
      }

      // Si no está en local, cargar desde la API
      const response = await fetch(`${SUPERHERO_API_BASE}/id/${heroId}.json`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const heroData = await response.json();
      setHero(heroData);

      // Guardar en la base de datos local para futuras consultas
      await heroesRepository.saveHero(heroData);
      
      setLoading(false);
      console.log(`[useGetHero] Loaded hero ${heroId} from API and saved to local`);
    } catch (err) {
      console.error('[useGetHero] Error loading hero:', err);
      setError(err);
      setLoading(false);
    }
  };

  const toggleFavorite = async (): Promise<boolean> => {
    if (!hero) return false;

    try {
      const newFavoriteStatus = await heroesRepository.toggleFavorite(hero.id);
      
      // Actualizar el estado local
      setHero(prevHero => prevHero ? { ...prevHero, isFavorite: newFavoriteStatus } : null);
      
      return newFavoriteStatus;
    } catch (err) {
      console.error('[useGetHero] Error toggling favorite:', err);
      throw err;
    }
  };

  return {
    hero,
    loading,
    error,
    toggleFavorite,
    refetch: loadHero,
  };
}
