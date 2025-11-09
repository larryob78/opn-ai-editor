import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'projects.db');

let db;

export function initDatabase() {
  // Ensure database directory exists
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  // Create projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      video_path TEXT,
      thumbnail_path TEXT,
      duration REAL,
      metadata TEXT
    )
  `);

  // Create edits table for tracking editing history
  db.exec(`
    CREATE TABLE IF NOT EXISTS edits (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      instruction TEXT NOT NULL,
      ai_response TEXT,
      edit_data TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `);

  // Create exports table
  db.exec(`
    CREATE TABLE IF NOT EXISTS exports (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      format TEXT NOT NULL,
      file_path TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `);

  console.log('✓ Database initialized');
  return db;
}

export function getDatabase() {
  if (!db) {
    initDatabase();
  }
  return db;
}

export default { initDatabase, getDatabase };
