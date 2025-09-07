import { database } from './database';
import { Team, CreateTeamRequest, UpdateTeamRequest } from '@types/team';
import { heroesRepository } from './heroesRepository';

export class TeamsRepository {
  private db = database.getDatabase();

  /**
   * Crea un nuevo equipo
   */
  async createTeam(request: CreateTeamRequest): Promise<Team> {
    const teamId = this.generateTeamId();
    const memberIds = JSON.stringify(request.memberIds);

    const query = `
      INSERT INTO teams (id, name, description, memberIds, isPublic)
      VALUES (?, ?, ?, ?, ?)
    `;

    await this.db.executeSql(query, [
      teamId,
      request.name,
      request.description || null,
      memberIds,
      request.isPublic ? 1 : 0,
    ]);

    return this.getTeamById(teamId);
  }

  /**
   * Actualiza un equipo existente
   */
  async updateTeam(request: UpdateTeamRequest): Promise<Team> {
    const updates: string[] = [];
    const values: any[] = [];

    if (request.name !== undefined) {
      updates.push('name = ?');
      values.push(request.name);
    }

    if (request.description !== undefined) {
      updates.push('description = ?');
      values.push(request.description);
    }

    if (request.memberIds !== undefined) {
      updates.push('memberIds = ?');
      values.push(JSON.stringify(request.memberIds));
    }

    if (request.isPublic !== undefined) {
      updates.push('isPublic = ?');
      values.push(request.isPublic ? 1 : 0);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    updates.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(request.id);

    const query = `UPDATE teams SET ${updates.join(', ')} WHERE id = ?`;
    await this.db.executeSql(query, values);

    return this.getTeamById(request.id);
  }

  /**
   * Obtiene un equipo por ID
   */
  async getTeamById(teamId: string): Promise<Team> {
    const [results] = await this.db.executeSql(
      'SELECT * FROM teams WHERE id = ?',
      [teamId]
    );

    if (results.rows.length === 0) {
      throw new Error('Team not found');
    }

    const row = results.rows.item(0);
    return this.mapRowToTeam(row);
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
      teams.push(await this.mapRowToTeam(row));
    }

    return teams;
  }

  /**
   * Obtiene equipos públicos
   */
  async getPublicTeams(): Promise<Team[]> {
    const [results] = await this.db.executeSql(`
      SELECT * FROM teams WHERE isPublic = 1 ORDER BY createdAt DESC
    `);

    const teams: Team[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      teams.push(await this.mapRowToTeam(row));
    }

    return teams;
  }

  /**
   * Elimina un equipo
   */
  async deleteTeam(teamId: string): Promise<void> {
    const [results] = await this.db.executeSql(
      'DELETE FROM teams WHERE id = ?',
      [teamId]
    );

    if (results.rowsAffected === 0) {
      throw new Error('Team not found');
    }
  }

  /**
   * Verifica si un equipo existe
   */
  async teamExists(teamId: string): Promise<boolean> {
    const [results] = await this.db.executeSql(
      'SELECT COUNT(*) as count FROM teams WHERE id = ?',
      [teamId]
    );

    return results.rows.item(0).count > 0;
  }

  /**
   * Obtiene el conteo total de equipos
   */
  async getTeamsCount(): Promise<number> {
    const [results] = await this.db.executeSql('SELECT COUNT(*) as count FROM teams');
    return results.rows.item(0).count;
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
      teams.push(await this.mapRowToTeam(row));
    }

    return teams;
  }

  /**
   * Genera un ID único para el equipo
   */
  private generateTeamId(): string {
    return `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Mapea una fila de la base de datos a un objeto Team
   */
  private async mapRowToTeam(row: any): Promise<Team> {
    const memberIds: number[] = JSON.parse(row.memberIds);
    const members = [];

    // Obtener los héroes miembros del equipo
    for (const heroId of memberIds) {
      const hero = await heroesRepository.getHeroById(heroId);
      if (hero) {
        members.push(hero);
      }
    }

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      members,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      isPublic: row.isPublic === 1,
    };
  }
}

export const teamsRepository = new TeamsRepository();
