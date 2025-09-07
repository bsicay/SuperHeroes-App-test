import { httpClient } from './http';
import { Hero } from '@types/hero';
import { addPowerScoreToHeroes } from '@utils/powerScore';

export class HeroesAPI {
  private static readonly ENDPOINTS = {
    ALL_HEROES: '/all.json',
    HERO_BY_ID: (id: number) => `/id/${id}.json`,
  };

  /**
   * Obtiene todos los superhéroes
   */
  static async getAllHeroes(): Promise<Hero[]> {
    try {
      const heroes = await httpClient.get<Hero[]>(this.ENDPOINTS.ALL_HEROES);
      return addPowerScoreToHeroes(heroes);
    } catch (error) {
      console.error('Error fetching all heroes:', error);
      throw new Error('Failed to fetch heroes');
    }
  }

  /**
   * Obtiene un superhéroe por ID
   */
  static async getHeroById(id: number): Promise<Hero> {
    try {
      const hero = await httpClient.get<Hero>(this.ENDPOINTS.HERO_BY_ID(id));
      return hero;
    } catch (error) {
      console.error(`Error fetching hero with id ${id}:`, error);
      throw new Error(`Failed to fetch hero with id ${id}`);
    }
  }

  /**
   * Busca superhéroes por nombre o nombre real
   */
  static async searchHeroes(query: string, heroes: Hero[]): Promise<Hero[]> {
    if (!query.trim()) return heroes;

    const searchTerm = query.toLowerCase().trim();
    
    return heroes.filter(hero => {
      const name = hero.name.toLowerCase();
      const realName = hero.biography['full-name'].toLowerCase();
      const aliases = hero.biography.aliases.join(' ').toLowerCase();
      
      return name.includes(searchTerm) || 
             realName.includes(searchTerm) || 
             aliases.includes(searchTerm);
    });
  }

  /**
   * Filtra superhéroes por alineación
   */
  static filterByAlignment(heroes: Hero[], alignment: 'good' | 'bad' | 'neutral'): Hero[] {
    return heroes.filter(hero => hero.biography.alignment === alignment);
  }

  /**
   * Filtra superhéroes por género
   */
  static filterByGender(heroes: Hero[], gender: 'Male' | 'Female'): Hero[] {
    return heroes.filter(hero => hero.appearance.gender === gender);
  }

  /**
   * Ordena superhéroes por score de poder
   */
  static sortByPower(heroes: Hero[], ascending: boolean = false): Hero[] {
    return [...heroes].sort((a, b) => {
      const scoreA = parseInt(a.powerstats.power) || 0;
      const scoreB = parseInt(b.powerstats.power) || 0;
      return ascending ? scoreA - scoreB : scoreB - scoreA;
    });
  }

  /**
   * Obtiene superhéroes aleatorios
   */
  static getRandomHeroes(heroes: Hero[], count: number): Hero[] {
    const shuffled = [...heroes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
