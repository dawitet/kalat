// src/context/initialState.ts

import { GameState, WordSource } from '../types'; // Removed Difficulty, ThemePreference
import { getDateString } from '../core/utils/calendar';
import { WORD_LENGTH, MAX_GUESSES } from '../game-state';

// Function to create the initial state for a specific difficulty level
export const createDefaultDifficultyState = (): any /* MobileDifficultyProgress */ => ({
    guesses: Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill('')),
    feedback: Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill('empty' as any /* TileState */)), // Ensure type
    letterHints: {},
    currentRow: 0,
    currentGuess: '', // Changed to single quotes
    isFinished: false,
    won: false,
    gameStartTime: undefined, // Explicitly undefined
    targetWord: '', // Initialize directly
    currentHint: '', // Initialize directly
    mainHintRevealed: false,
    hintLetters: [],
    isLosingAnimationActive: false,
    flippingRowIndex: null,
});

export const initialState: GameState = {
    isInitializing: true,
    userId: null,
    isBaseDataLoaded: false,
    isUserDataLoading: false,
    isUserDataSaving: false,
    isUserDataResetting: false,
    targetWords: {
        easy: { word: '', hint: '' },
        hard: { word: '', hint: '' },
    },
    currentDifficulty: null, // Default to null, will be set by user or persisted preference
    gameProgress: {
        easy: createDefaultDifficultyState(),
        hard: createDefaultDifficultyState(),
    },
    activeModal: null,
    errorMessage: null,
    shouldShakeGrid: false,
    isSubmitting: false,
    activeSuggestionFamily: null,
    shouldShowWinAnimation: false,
    preferredDifficulty: 'hard', // Default preference
    themePreference: 'system', // Default theme
    hintsEnabled: true,
    isMuted: false,
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    lastPlayedDate: null,
    lastWinDate: null,
    gamesPlayedEasy: 0,
    gamesWonEasy: 0,
    totalGuessesEasy: 0,
    gamesPlayedHard: 0,
    gamesWonHard: 0,
    totalTimePlayedHard: 0,
    bestTimeHard: null,
    guessesInBestTimeHardGame: 0,
    dailyStatus: {
        date: getDateString(new Date()), // Initialize with today's date string
        hardCompleted: false,
        easyCompleted: false,
    },
    wordSourceInfo: {
        easy: { source: WordSource.Unknown, date: '' },
        hard: { source: WordSource.Unknown, date: '' },
    },
    dailyReminderEnabled: false, // Default to false
    lastAnalyticsEvent: undefined, // Changed from null to undefined
};
