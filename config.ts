// src/config.ts for your NEW React Native project

// --- App Sharing & Links ---
export const APP_SHARE_URL = 'https://kalat.app'; // VERIFY THIS IS YOUR INTENDED SHARE URL
export const FEEDBACK_TARGET_USERNAME = 'kalat_feedback'; // Or 'kalat' - CHOOSE ONE

// --- API Configuration (if your app uses a backend) ---
export const API_CONFIG = {
  // IMPORTANT: Replace this with your actual API URL for the mobile app.
  // process.env.VITE_API_URL will not work here.
  BASE_URL: 'https://your-actual-api.kalat.app/api', // EXAMPLE: REPLACE THIS
  TIMEOUT: 10000,
};

// --- Game Configuration ---
// VERIFY THESE ARE THE CORRECT RULES FOR YOUR GAME
export const GAME_CONFIG = {
  MAX_GUESSES: 6, // Or 3, or other value based on your decision
  WORD_LENGTH: 5, // Or 4, or other value
  DAILY_RESET_HOUR: 0, // UTC (from File 2 - keep if needed)
  DIFFICULTY_LEVELS: {
    // (from File 1, if you use difficulty levels)
    EASY: 'easy',
    HARD: 'hard',
  },
};

// --- Animation Durations ---
// Combine the most relevant/up-to-date animation settings
export const ANIMATION_CONFIG = {
  TILE_FLIP_DURATION: 500,
  TILE_BOUNCE_DURATION: 100, // From File 2
  TILE_SHAKE_DURATION: 300, // From File 2
  KEYBOARD_FADE_DURATION: 200,
  // Add other specific durations if needed, or general ones like:
  // DURATION: {
  //     FAST: 200,
  //     MEDIUM: 400,
  //     SLOW: 600,
  // },
  // EASING: { /* ... */ }, // If you use these generic easings
};

// Optional: Log configuration on load for debugging in development
if (__DEV__) {
  // __DEV__ is a global variable in React Native, true in development
  console.log(
    `Configuration loaded: APP_SHARE_URL = ${APP_SHARE_URL}, API_BASE_URL = ${API_CONFIG.BASE_URL}`,
  );
}

// --- Basic Validation (Optional, but good for sanity checks) ---
const simpleValidate = (value: string | undefined | null, name: string) => {
  if (
    !value ||
    value.includes('YOUR_') ||
    value.includes('example.com') ||
    value.endsWith('/api')
  ) {
    // Added a check for unreplaced API
    console.warn(
      `Configuration Check: ${name} might be missing or using a placeholder/default value ('${value}'). Please verify.`,
    );
  }
};

simpleValidate(APP_SHARE_URL, 'APP_SHARE_URL');
simpleValidate(FEEDBACK_TARGET_USERNAME, 'FEEDBACK_TARGET_USERNAME');
simpleValidate(API_CONFIG.BASE_URL, 'API_CONFIG.BASE_URL');
