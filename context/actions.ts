// src/context/actions.ts

import {
  ModalType,
  ThemePreference,
  TileState,
  MobileDailyStatus,
  Difficulty,
  WordData,
  MobileDifficultyProgress,
} from '../types';

/**
 * Discriminated union type for all game actions
 * This pattern ensures type safety when handling different action types
 */

// Define a type for persisted data structure
export interface PersistedGameData {
  userId?: string | null;
  gameProgress?: {
    easy?: MobileDifficultyProgress;
    hard?: MobileDifficultyProgress;
  };
  dailyStatus?: MobileDailyStatus;
  themePreference?: ThemePreference;
  hintsEnabled?: boolean;
  isMuted?: boolean;
  statistics?: {
    gamesPlayed?: number;
    gamesWon?: number;
    currentStreak?: number;
    maxStreak?: number;
    guessDistribution?: Record<number, number>;
    lastPlayedDate?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown; // Allow for future extensions
}

// System/App Actions
export type AppSystemAction =
  | {type: 'SET_INITIALIZING'; payload: boolean}
  | {type: 'LOAD_PERSISTED_DATA'; payload: PersistedGameData}
  | {type: 'BASE_DATA_LOADED'}
  | {type: 'SET_USER_ID'; payload: string | null}
  | {type: 'SET_ERROR'; payload: string | null};

// Game Setup Actions
export type GameSetupAction =
  | {type: 'SET_TARGET_WORDS'; payload: {easy: WordData; hard: WordData}}
  | {type: 'SET_DAILY_STATUS'; payload: MobileDailyStatus}
  | {type: 'SET_CURRENT_DIFFICULTY'; payload: Difficulty | null}
  | {type: 'INITIALIZE_GAME'};

// Game Input Actions
export type GameInputAction =
  | {type: 'ADD_LETTER'; payload: string}
  | {type: 'DELETE_LETTER'}
  | {type: 'SUBMIT_GUESS'}
  | {type: 'SET_SUBMITTING'; payload: boolean}
  | {
      type: 'SET_FEEDBACK';
      payload: {rowIndex: number; feedback: TileState[]};
    }
  | {type: 'RESET_GAME'}
  | {type: 'WIN_GAME'}
  | {type: 'LOSE_GAME'};

// Game State Actions
export type GameStateAction =
  | {type: 'SET_SAVED_STATE'; payload: MobileDifficultyProgress}
  | {type: 'UPDATE_HINTS'; payload: {letter: string; state: TileState}}
  | {type: 'REVEAL_HINT_LETTER'; payload: number}
  | {type: 'REVEAL_MAIN_HINT'}
  | {type: 'START_GAME'; payload: {targetWord: string; hint: string}}
  | {type: 'SET_FLIPPING_ROW'; payload: number | null}
  | {type: 'ACTIVATE_LOSING_ANIMATION'; payload: boolean}
  | {type: 'SET_BACKUP_MODE'; payload: boolean}
  | {type: 'SET_WORD_SOURCE'; payload: string};

// UI State Actions
export type UIAction =
  | {type: 'SET_ACTIVE_MODAL'; payload: ModalType}
  | {type: 'SET_THEME_PREFERENCE'; payload: ThemePreference}
  | {type: 'SET_ERROR_MESSAGE'; payload: string | null}
  | {type: 'SET_SHOULD_SHAKE_GRID'; payload: boolean}
  | {type: 'SET_SHOW_WIN_ANIMATION'; payload: boolean}
  | {type: 'SET_ACTIVE_SUGGESTION_FAMILY'; payload: string[] | null}
  | {type: 'SET_FLIPPING_ROW_UI'; payload: number | null}
  | {type: 'SET_HINTS_ENABLED'; payload: boolean}
  | {type: 'SET_MUTED'; payload: boolean};

// Combined action type used by the reducer
export type GameAction =
  | AppSystemAction
  | GameSetupAction
  | GameInputAction
  | GameStateAction
  | UIAction;

/**
 * Action creators
 * These functions create action objects with the correct type and payload
 */

// System/App action creators
export const appSystemActionCreators = {
  setInitializing: (isInitializing: boolean): AppSystemAction => ({
    type: 'SET_INITIALIZING',
    payload: isInitializing,
  }),

  /**
   * Load persisted data from storage into the state
   */
  loadPersistedData: (data: PersistedGameData): AppSystemAction => ({
    type: 'LOAD_PERSISTED_DATA',
    payload: data,
  }),

  baseDataLoaded: (): AppSystemAction => ({
    type: 'BASE_DATA_LOADED',
  }),

  setUserId: (userId: string | null): AppSystemAction => ({
    type: 'SET_USER_ID',
    payload: userId,
  }),

  setError: (error: string | null): AppSystemAction => ({
    type: 'SET_ERROR',
    payload: error,
  }),
};

// Game setup action creators
export const gameSetupActionCreators = {
  setTargetWords: (targetWords: {easy: WordData; hard: WordData}): GameSetupAction => ({
    type: 'SET_TARGET_WORDS',
    payload: targetWords,
  }),

  setDailyStatus: (status: MobileDailyStatus): GameSetupAction => ({
    type: 'SET_DAILY_STATUS',
    payload: status,
  }),

  setCurrentDifficulty: (difficulty: Difficulty | null): GameSetupAction => ({
    type: 'SET_CURRENT_DIFFICULTY',
    payload: difficulty,
  }),

  initializeGame: (): GameSetupAction => ({
    type: 'INITIALIZE_GAME',
  }),
};

// Game input action creators
export const gameInputActionCreators = {
  addLetter: (letter: string): GameInputAction => ({
    type: 'ADD_LETTER',
    payload: letter,
  }),

  deleteLetter: (): GameInputAction => ({
    type: 'DELETE_LETTER',
  }),

  submitGuess: (): GameInputAction => ({
    type: 'SUBMIT_GUESS',
  }),

  setSubmitting: (isSubmitting: boolean): GameInputAction => ({
    type: 'SET_SUBMITTING',
    payload: isSubmitting,
  }),

  setFeedback: (rowIndex: number, feedback: TileState[]): GameInputAction => ({
    type: 'SET_FEEDBACK',
    payload: {rowIndex, feedback},
  }),

  resetGame: (): GameInputAction => ({
    type: 'RESET_GAME',
  }),

  winGame: (): GameInputAction => ({
    type: 'WIN_GAME',
  }),

  loseGame: (): GameInputAction => ({
    type: 'LOSE_GAME',
  }),
};

// Game state action creators
export const gameStateActionCreators = {
  setSavedState: (state: MobileDifficultyProgress): GameStateAction => ({
    type: 'SET_SAVED_STATE',
    payload: state,
  }),

  updateHints: (letter: string, state: TileState): GameStateAction => ({
    type: 'UPDATE_HINTS',
    payload: {letter, state},
  }),

  revealHintLetter: (index: number): GameStateAction => ({
    type: 'REVEAL_HINT_LETTER',
    payload: index,
  }),

  revealMainHint: (): GameStateAction => ({
    type: 'REVEAL_MAIN_HINT',
  }),

  startGame: (targetWord: string, hint: string): GameStateAction => ({
    type: 'START_GAME',
    payload: {targetWord, hint},
  }),

  setFlippingRow: (rowIndex: number | null): GameStateAction => ({
    type: 'SET_FLIPPING_ROW',
    payload: rowIndex,
  }),

  activateLosingAnimation: (isActive: boolean): GameStateAction => ({
    type: 'ACTIVATE_LOSING_ANIMATION',
    payload: isActive,
  }),

  setBackupMode: (isBackupMode: boolean): GameStateAction => ({
    type: 'SET_BACKUP_MODE',
    payload: isBackupMode,
  }),

  setWordSource: (source: string): GameStateAction => ({
    type: 'SET_WORD_SOURCE',
    payload: source,
  }),
};

// UI action creators
export const uiActionCreators = {
  setActiveModal: (modalType: ModalType): UIAction => ({
    type: 'SET_ACTIVE_MODAL',
    payload: modalType,
  }),

  setThemePreference: (preference: ThemePreference): UIAction => ({
    type: 'SET_THEME_PREFERENCE',
    payload: preference,
  }),

  setErrorMessage: (message: string | null): UIAction => ({
    type: 'SET_ERROR_MESSAGE',
    payload: message,
  }),

  setShouldShakeGrid: (shouldShake: boolean): UIAction => ({
    type: 'SET_SHOULD_SHAKE_GRID',
    payload: shouldShake,
  }),

  setShowWinAnimation: (shouldShow: boolean): UIAction => ({
    type: 'SET_SHOW_WIN_ANIMATION',
    payload: shouldShow,
  }),

  setActiveSuggestionFamily: (family: string[] | null): UIAction => ({
    type: 'SET_ACTIVE_SUGGESTION_FAMILY',
    payload: family,
  }),

  setFlippingRowUI: (rowIndex: number | null): UIAction => ({
    type: 'SET_FLIPPING_ROW_UI',
    payload: rowIndex,
  }),

  setHintsEnabled: (enabled: boolean): UIAction => ({
    type: 'SET_HINTS_ENABLED',
    payload: enabled,
  }),

  setMuted: (muted: boolean): UIAction => ({
    type: 'SET_MUTED',
    payload: muted,
  }),
};

// Combined action creators
export const actionCreators = {
  ...appSystemActionCreators,
  ...gameSetupActionCreators,
  ...gameInputActionCreators,
  ...gameStateActionCreators,
  ...uiActionCreators,
};
