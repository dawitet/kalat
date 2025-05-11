// src/core/game/gameState.ts

// Game Constants
export const WORD_LENGTH = 4; // Standard length for words in the game
export const MAX_GUESSES = 6; // Maximum number of attempts allowed per game
export const API_BASE_URL =
  'https://kalat-game-backend-959ede05052d.herokuapp.com'; // Example backend URL

// Enum for different states of a letter/tile
export enum TileState {
  EMPTY = 'empty', // No letter yet
  TBD = 'tbd', // Letter entered, not yet submitted (to be determined)
  CORRECT = 'correct', // Letter is correct and in the correct position
  PRESENT = 'present', // Letter is in the word but in the wrong position
  ABSENT = 'absent', // Letter is not in the word
  ERROR = 'error', // Used for invalid word submissions or other errors
}

// Enum for word sources
export enum WordSource {
  Unknown = 'Unknown',
  Daily = 'Daily',
  Practice = 'Practice',
  Shared = 'Shared',
}

// Game difficulty levels
export enum Difficulty {
  Easy = 'easy',
  Hard = 'hard',
}

// Preferences for theme settings
export enum ThemePreference {
  System = 'system',
  Light = 'light',
  Dark = 'dark',
}

// Modal types that can be active in the game
export enum ModalType {
  Settings = 'Settings',
  Rules = 'Rules',
  Streak = 'Streak',
  Credits = 'Credits',
  Feedback = 'Feedback',
  Invite = 'Invite',
  NewGame = 'NewGame',
  SelectDifficulty = 'SelectDifficulty', // Renamed from Difficulty
}

// Storage Keys
export const STORAGE_KEYS = {
  GAME_PROGRESS: 'kalat_game_progress',
  LAST_PLAYED: 'kalat_last_played',
  USER_SETTINGS: 'kalat_user_settings',
  STATS: 'kalat_stats',
} as const;

// Game Types
export interface GameProgress {
  currentRow: number;
  guesses: string[];
  isFinished: boolean;
  startTime?: number;
}

export interface GameState {
  easy?: GameProgress;
  hard?: GameProgress;
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  averageGuesses: number;
}

// Log initialization
console.log(
  `Game State Constants: WORD_LENGTH=${WORD_LENGTH}, MAX_GUESSES=${MAX_GUESSES}`,
);
