import { database } from './database';
import { Hero } from '@types/hero';
import { addPowerScoreToHero } from '@utils/powerScore';

export class HeroesRepository {
  private db = database.getDatabase();

  /**
   * Guarda o actualiza un héroe en la base de datos
   */
  async saveHero(hero: Hero): Promise<void> {
    const heroWithScore = addPowerScoreToHero(hero);
    
    const query = `
      INSERT OR REPLACE INTO heroes (
        id, name, slug, powerstats, appearance, biography, 
        work, connections, images, powerScore, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    await this.db.executeSql(query, [
      heroWithScore.id,
      heroWithScore.name,
      heroWithScore.slug,
      JSON.stringify(heroWithScore.powerstats),
      JSON.stringify(heroWithScore.appearance),
      JSON.stringify(heroWithScore.biography),
      JSON.stringify(heroWithScore.work),
      JSON.stringify(heroWithScore.connections),
      JSON.stringify(heroWithScore.images),
      heroWithScore.powerScore,
    ]);
  }

  /**
   * Guarda múltiples héroes
   */
  async saveHeroes(heroes: Hero[]): Promise<void> {
    for (const hero of heroes) {
      await this.saveHero(hero);
    }
  }

  /**
   * Obtiene todos los héroes de la base de datos
   */
  async getAllHeroes(): Promise<Hero[]> {
    const [results] = await this.db.executeSql(`
      SELECT * FROM heroes ORDER BY name ASC
    `);

    const heroes: Hero[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      heroes.push(this.mapRowToHero(row));
    }

    return heroes;
  }

  /**
   * Obtiene un héroe por ID
   */
  async getHeroById(id: number): Promise<Hero | null> {
    const [results] = await this.db.executeSql(
      'SELECT * FROM heroes WHERE id = ?',
      [id]
    );

    if (results.rows.length > 0) {
      return this.mapRowToHero(results.rows.item(0));
    }

    return null;
  }

  /**
   * Busca héroes por nombre
   */
  async searchHeroes(query: string): Promise<Hero[]> {
    const [results] = await this.db.executeSql(
      `SELECT * FROM heroes 
       WHERE name LIKE ? OR 
             json_extract(biography, '$.full-name') LIKE ? OR
             json_extract(biography, '$.aliases') LIKE ?
       ORDER BY name ASC`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );

    const heroes: Hero[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      heroes.push(this.mapRowToHero(row));
    }

    return heroes;
  }

  /**
   * Obtiene héroes favoritos
   */
  async getFavoriteHeroes(): Promise<Hero[]> {
    const [results] = await this.db.executeSql(`
      SELECT * FROM heroes WHERE isFavorite = 1 ORDER BY name ASC
    `);

    const heroes: Hero[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      heroes.push(this.mapRowToHero(row));
    }

    return heroes;
  }

  /**
   * Marca/desmarca un héroe como favorito
   */
  async toggleFavorite(heroId: number): Promise<boolean> {
    const [results] = await this.db.executeSql(
      'SELECT isFavorite FROM heroes WHERE id = ?',
      [heroId]
    );

    if (results.rows.length === 0) {
      throw new Error('Hero not found');
    }

    const currentFavorite = results.rows.item(0).isFavorite;
    const newFavorite = currentFavorite ? 0 : 1;

    await this.db.executeSql(
      'UPDATE heroes SET isFavorite = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [newFavorite, heroId]
    );

    return newFavorite === 1;
  }

  /**
   * Verifica si un héroe es favorito
   */
  async isFavorite(heroId: number): Promise<boolean> {
    const [results] = await this.db.executeSql(
      'SELECT isFavorite FROM heroes WHERE id = ?',
      [heroId]
    );

    if (results.rows.length === 0) {
      return false;
    }

    return results.rows.item(0).isFavorite === 1;
  }

  /**
   * Obtiene el conteo total de héroes
   */
  async getHeroesCount(): Promise<number> {
    const [results] = await this.db.executeSql('SELECT COUNT(*) as count FROM heroes');
    return results.rows.item(0).count;
  }

  /**
   * Limpia todos los héroes (útil para refrescar datos)
   */
  async clearAllHeroes(): Promise<void> {
    await this.db.executeSql('DELETE FROM heroes');
  }

  /**
   * Mapea una fila de la base de datos a un objeto Hero
   */
  private mapRowToHero(row: any): Hero {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      powerstats: JSON.parse(row.powerstats),
      appearance: JSON.parse(row.appearance),
      biography: JSON.parse(row.biography),
      work: JSON.parse(row.work),
      connections: JSON.parse(row.connections),
      images: JSON.parse(row.images),
    };
  }
}

export const heroesRepository = new HeroesRepository();
