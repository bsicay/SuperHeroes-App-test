import { database } from './database';
import { Team } from '@types/team';

export class TeamsRepository {
  private db = database.getDatabase();

  /**
   * Crea un nuevo equipo
   */
  async createTeam(teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team> {
    const id = Date.now().toString(); // Simple ID generation
    const now = new Date().toISOString();
    
    const team: Team = {
      id,
      ...teamData,
      createdAt: now,
      updatedAt: now,
    };

    const query = `
      INSERT INTO teams (
        id, name, description, memberIds, isPublic, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.executeSql(query, [
      team.id,
      team.name,
      team.description || '',
      JSON.stringify(team.memberIds),
      team.isPublic ? 1 : 0,
      team.createdAt,
      team.updatedAt,
    ]);

    return team;
  }

  /**
   * Obtiene todos los equipos
   */
  async getAllTeams(): Promise<Team[]> {
    const [results] = await this.db.executeSql(`
      SELECT * FROM teams ORDER BY createdAt DESC
    `);

    const teams: Team[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      teams.push(this.mapRowToTeam(row));
    }

    return teams;
  }

  /**
   * Obtiene un equipo por ID
   */
  async getTeamById(id: string): Promise<Team | null> {
    const [results] = await this.db.executeSql(
      'SELECT * FROM teams WHERE id = ?',
      [id]
    );

    if (results.rows.length > 0) {
      return this.mapRowToTeam(results.rows.item(0));
    }

    return null;
  }

  /**
   * Actualiza un equipo
   */
  async updateTeam(id: string, teamData: Partial<Team>): Promise<Team> {
    const existingTeam = await this.getTeamById(id);
    if (!existingTeam) {
      throw new Error('Team not found');
    }

    const updatedTeam: Team = {
      ...existingTeam,
      ...teamData,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    const query = `
      UPDATE teams SET 
        name = ?, description = ?, memberIds = ?, isPublic = ?, updatedAt = ?
      WHERE id = ?
    `;

    await this.db.executeSql(query, [
      updatedTeam.name,
      updatedTeam.description || '',
      JSON.stringify(updatedTeam.memberIds),
      updatedTeam.isPublic ? 1 : 0,
      updatedTeam.updatedAt,
      id,
    ]);

    return updatedTeam;
  }

  /**
   * Elimina un equipo
   */
  async deleteTeam(id: string): Promise<void> {
    await this.db.executeSql('DELETE FROM teams WHERE id = ?', [id]);
  }

  /**
   * Busca equipos por nombre
   */
  async searchTeams(query: string): Promise<Team[]> {
    const [results] = await this.db.executeSql(
      'SELECT * FROM teams WHERE name LIKE ? ORDER BY name ASC',
      [`%${query}%`]
    );

    const teams: Team[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      teams.push(this.mapRowToTeam(row));
    }

    return teams;
  }

  /**
   * Obtiene el conteo total de equipos
   */
  async getTeamsCount(): Promise<number> {
    const [results] = await this.db.executeSql('SELECT COUNT(*) as count FROM teams');
    return results.rows.item(0).count;
  }

  /**
   * Mapea una fila de la base de datos a un objeto Team
   */
  private mapRowToTeam(row: any): Team {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      memberIds: JSON.parse(row.memberIds),
      isPublic: row.isPublic === 1,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

export const teamsRepository = new TeamsRepository();