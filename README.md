# FlavorCraft

A minimalist recipe manager built with **React Native + Expo** (SDK 54). Save culinary ideas, track what you've cooked, and get daily inspiration — all from a single, elegant app.

---

## Features

### Home
- Welcome screen with the app's purpose
- Quick-action cards linking directly to Add, Collection, and Inspiration tabs

### Add Recipe
- Form with **Recipe Name**, **Category** (Breakfast / Lunch / Dinner / Dessert), and **Instructions**
- Required-field validation with native alerts before saving
- Persists to SQLite on submit; resets form on success

### My Recipes (List)
- Full recipe collection rendered in a live `FlatList`
- **Category** and **Status** dropdown filters (All · Breakfast · Lunch · Dinner · Dessert · Cooked · Uncooked) — combinable
- Tap any row to open a **detail card** with:
  - Full title, category badge, and complete instructions
  - **Edit** — inline form to update name, category, and instructions
  - **Mark Cooked / Uncooked** — toggle completion state
  - **Delete** — confirmation before removal
- List refreshes automatically on tab focus

### Inspiration
- Fetches a random motivational quote from `dummyjson.com/quotes/random`
- Loading indicator while fetching; graceful error fallback
- "Refresh" button to pull a new quote on demand

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo SDK 54 |
| Language | TypeScript |
| Navigation | `expo-router` (file-based, tab layout) |
| Local storage | `expo-sqlite` (+ `localStorage` fallback on web) |
| Remote data | `fetch` / `async-await` |
| Icons | `@expo/vector-icons` (Ionicons) |
| Category picker | `@react-native-picker/picker` |

---

## Project Structure

```
app/
├── _layout.tsx          # Root layout — DB init, fonts, safe area
└── (tabs)/
    ├── _layout.tsx      # Tab bar configuration (4 tabs)
    ├── index.tsx        # Home screen
    ├── add.tsx          # Add recipe form
    ├── list.tsx         # Recipe list + detail modal + filters
    └── inspiration.tsx  # Daily quote screen

services/
└── db.ts               # SQLite CRUD + web localStorage fallback

constants/
└── Colors.ts           # Design tokens (colours, typography, spacing, radius)
```

---

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS recipes (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT    NOT NULL,
  instructions TEXT    NOT NULL,
  category     TEXT    NOT NULL,
  is_completed INTEGER DEFAULT 0
);
```

The database is initialised synchronously at app startup in `app/_layout.tsx`. On web, an equivalent `localStorage` store is used instead.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- Expo CLI (`npm install -g expo-cli`) or `npx`
- Expo Go app on your iOS / Android device

### Install

```bash
git clone https://github.com/mehdielk11/expo_exam.git
cd expo_exam
npm install
```

### Run

```bash
# Start Metro (local network)
npm start

# Tunnel mode (cross-network, for Expo Go over mobile data)
npx expo start --tunnel

# Web browser
npm run web
```

Scan the QR code with the **Expo Go** app on your phone.

---

## Platform Notes

| Platform | Storage | Category picker |
|---|---|---|
| iOS | SQLite | Native ActionSheet |
| Android | SQLite | Dropdown Picker |
| Web | localStorage | Dropdown Picker |

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start Metro bundler |
| `npm run ios` | Open in iOS simulator |
| `npm run android` | Open in Android emulator |
| `npm run web` | Open in browser |

---

## License

ISC
