// src/game-state.ts

// This file holds constants related to game state.
// Device Storage keys are removed as persistence is handled by the backend.

// --- Game Constants ---
export const WORD_LENGTH = 4; // Standard length for words in the game (Confirmed 4)
export const MAX_GUESSES = 3; // Maximum number of attempts allowed per game

// --- Backend API ---
// Define the base path for your API calls. Adjust if your worker has a custom domain.
// Using a relative path assumes the frontend and backend are served from the same origin
// or that a proxy handles routing. If they are on different domains, use the full worker URL.
export const API_BASE_URL =
  'https://kalat-bot-backend.dawitfikadu3.workers.dev'; // Relative path to the API endpoints on your worker

// --- Device Storage Keys REMOVED ---
// export const DEVICE_STORAGE_ALL_DATA_KEY = 'kalatoch_device_data_v3'; // REMOVED

// --- Cloud Storage Keys REMOVED ---

// --- Backend-Specific Constants REMOVED ---

console.log(
  `Game State Constants: WORD_LENGTH=${WORD_LENGTH}, MAX_GUESSES=${MAX_GUESSES}, API_BASE_URL=${API_BASE_URL}`,
);
