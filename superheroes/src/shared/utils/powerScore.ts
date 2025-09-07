import { Hero, PowerStats } from '@types/hero';

/**
 * Convierte un valor de poder de string a número
 * Maneja valores como "100", "null", "infinite", etc.
 */
function parsePowerValue(value: string): number {
  if (value === 'null' || value === '') return 0;
  if (value === 'infinite') return 100;
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : Math.min(parsed, 100);
}

/**
 * Calcula el score de poder de un superhéroe
 * Fórmula: Promedio ponderado de las estadísticas
 * Peso: Intelligence(1.2), Strength(1.0), Speed(1.0), Durability(1.0), Power(1.3), Combat(1.1)
 */
export function calculatePowerScore(powerstats: PowerStats): number {
  const weights = {
    intelligence: 1.2,
    strength: 1.0,
    speed: 1.0,
    durability: 1.0,
    power: 1.3,
    combat: 1.1,
  };

  const values = {
    intelligence: parsePowerValue(powerstats.intelligence),
    strength: parsePowerValue(powerstats.strength),
    speed: parsePowerValue(powerstats.speed),
    durability: parsePowerValue(powerstats.durability),
    power: parsePowerValue(powerstats.power),
    combat: parsePowerValue(powerstats.combat),
  };

  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  const weightedSum = Object.entries(values).reduce(
    (sum, [key, value]) => sum + (value * weights[key as keyof typeof weights]),
    0
  );

  return Math.round(weightedSum / totalWeight);
}

/**
 * Agrega el score de poder a un héroe
 */
export function addPowerScoreToHero(hero: Hero): Hero & { powerScore: number } {
  return {
    ...hero,
    powerScore: calculatePowerScore(hero.powerstats),
  };
}

/**
 * Agrega el score de poder a una lista de héroes
 */
export function addPowerScoreToHeroes(heroes: Hero[]): (Hero & { powerScore: number })[] {
  return heroes.map(addPowerScoreToHero);
}

/**
 * Calcula estadísticas de un equipo
 */
export function calculateTeamStats(heroes: Hero[]) {
  const powerScores = heroes.map(hero => calculatePowerScore(hero.powerstats));
  
  return {
    totalPower: powerScores.reduce((sum, score) => sum + score, 0),
    averagePower: Math.round(powerScores.reduce((sum, score) => sum + score, 0) / heroes.length),
    memberCount: heroes.length,
    alignment: {
      good: heroes.filter(hero => hero.biography.alignment === 'good').length,
      bad: heroes.filter(hero => hero.biography.alignment === 'bad').length,
      neutral: heroes.filter(hero => hero.biography.alignment === 'neutral').length,
    },
  };
}
