import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

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
  if (Platform.OS === 'web') {
    if (!localStorage.getItem('recipes')) {
      localStorage.setItem('recipes', JSON.stringify([]));
    }
    return;
  }
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
  if (Platform.OS === 'web') {
    const recipes = getRecipes();
    const newRecipe: Recipe = {
      id: Date.now(),
      title,
      instructions,
      category,
      is_completed: 0,
    };
    recipes.unshift(newRecipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    return;
  }
  db().runSync(
    'INSERT INTO recipes (title, instructions, category) VALUES (?, ?, ?);',
    title,
    instructions,
    category
  );
}

// ─── Query ───────────────────────────────────────────────────────────────────

export function getRecipes(): Recipe[] {
  if (Platform.OS === 'web') {
    try {
      const data = localStorage.getItem('recipes');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
  return db().getAllSync<Recipe>('SELECT * FROM recipes ORDER BY id DESC;');
}

// ─── Toggle ──────────────────────────────────────────────────────────────────

export function toggleRecipe(id: number, current: number): void {
  if (Platform.OS === 'web') {
    const recipes = getRecipes();
    const idx = recipes.findIndex((r) => r.id === id);
    if (idx !== -1) {
      recipes[idx].is_completed = current === 0 ? 1 : 0;
      localStorage.setItem('recipes', JSON.stringify(recipes));
    }
    return;
  }
  const next = current === 0 ? 1 : 0;
  db().runSync('UPDATE recipes SET is_completed = ? WHERE id = ?;', next, id);
}

// ─── Update ──────────────────────────────────────────────────────────────────

export function updateRecipe(
  id: number,
  title: string,
  instructions: string,
  category: string
): void {
  if (Platform.OS === 'web') {
    const recipes = getRecipes();
    const idx = recipes.findIndex((r) => r.id === id);
    if (idx !== -1) {
      recipes[idx] = { ...recipes[idx], title, instructions, category };
      localStorage.setItem('recipes', JSON.stringify(recipes));
    }
    return;
  }
  db().runSync(
    'UPDATE recipes SET title = ?, instructions = ?, category = ? WHERE id = ?;',
    title,
    instructions,
    category,
    id
  );
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export function deleteRecipe(id: number): void {
  if (Platform.OS === 'web') {
    const recipes = getRecipes().filter((r) => r.id !== id);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    return;
  }
  db().runSync('DELETE FROM recipes WHERE id = ?;', id);
}
