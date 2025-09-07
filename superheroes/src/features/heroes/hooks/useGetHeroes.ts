import { useEffect } from 'react';
import useFetch from '@hooks/useFetch';
import { Hero } from '@types/hero';

const SUPERHERO_API_BASE = 'https://akabab.github.io/superhero-api/api';

function useGetHeroes() {
  const {
    callFetch, result, error, loading,
  } = useFetch();

  const getHeroes = async () => {
    const uri = `${SUPERHERO_API_BASE}/all.json`;
    callFetch({
      uri, 
      method: 'GET',
    });
  };

  useEffect(() => {
    getHeroes();
  }, []);

  return {
    heroes: result as Hero[] | null, 
    error, 
    loading,
    refetch: getHeroes,
  };
}

export default useGetHeroes;
