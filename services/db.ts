import * as SQLite from 'expo-sqlite';

// Lazy initialization — openDatabaseSync must NOT run at module load time on web
// because expo-sqlite's web worker requires SharedArrayBuffer (needs cross-origin
// isolation headers that Metro dev server doesn't provide).
let _db: SQLite.SQLiteDatabase | null = null;
function db(): SQLite.SQLiteDatabase {
  if (!_db) _db = SQLite.openDatabaseSync('flavorcraft.db');
  return _db;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type Recipe = {
  id: number;
  title: string;
  instructions: string;
  category: string;
  is_completed: number; // 0 | 1
};

// ─── Init ────────────────────────────────────────────────────────────────────

export function initDB(): void {
  db().execSync(
    `CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      instructions TEXT NOT NULL,
      category TEXT NOT NULL,
      is_completed INTEGER DEFAULT 0
    );`
  );
}

// ─── Insert ──────────────────────────────────────────────────────────────────

export function insertRecipe(
  title: string,
  instructions: string,
  category: string
): void {
  db().runSync(
    'INSERT INTO recipes (title, instructions, category) VALUES (?, ?, ?);',
    title,
    instructions,
    category
  );
}

// ─── Query ───────────────────────────────────────────────────────────────────

export function getRecipes(): Recipe[] {
  return db().getAllSync<Recipe>('SELECT * FROM recipes ORDER BY id DESC;');
}

// ─── Toggle ──────────────────────────────────────────────────────────────────

export function toggleRecipe(id: number, current: number): void {
  const next = current === 0 ? 1 : 0;
  db().runSync('UPDATE recipes SET is_completed = ? WHERE id = ?;', next, id);
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export function deleteRecipe(id: number): void {
  db().runSync('DELETE FROM recipes WHERE id = ?;', id);
}
