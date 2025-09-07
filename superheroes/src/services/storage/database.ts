import SQLite from 'react-native-sqlite-storage';
import { Hero, Team } from '@types';

// Habilitar debug en desarrollo
SQLite.DEBUG = __DEV__;
SQLite.enablePromise(true);

export class Database {
  private static instance: Database;
  private db: SQLite.SQLiteDatabase | null = null;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: 'SuperHeroesDB.db',
        location: 'default',
      });

      await this.createTables();
      console.log('[Database] Initialized successfully');
    } catch (error) {
      console.error('[Database] Initialization error:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Tabla de héroes
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS heroes (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        powerstats TEXT NOT NULL,
        appearance TEXT NOT NULL,
        biography TEXT NOT NULL,
        work TEXT NOT NULL,
        connections TEXT NOT NULL,
        images TEXT NOT NULL,
        powerScore INTEGER NOT NULL,
        isFavorite INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de equipos
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS teams (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        memberIds TEXT NOT NULL,
        isPublic INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Índices para mejor performance
    await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_heroes_name ON heroes(name)');
    await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_heroes_favorite ON heroes(isFavorite)');
    await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_teams_name ON teams(name)');
  }

  getDatabase(): SQLite.SQLiteDatabase {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      console.log('[Database] Closed successfully');
    }
  }
}

export const database = Database.getInstance();
