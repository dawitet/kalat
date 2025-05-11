// src/context/actions.ts
import {
  Difficulty,
  TileState,
  ModalType,
  ThemePreference,
  MobileDailyStatus,
  WordData,
} from '../types';

/**
 * Discriminated union type for all game actions
 * This pattern ensures type safety when handling different action types
 */

// System/App Actions
export type AppSystemAction =
  | {type: 'SET_INITIALIZING'; payload: boolean}
  | {type: 'LOAD_PERSISTED_DATA'; payload: Record<string, any>}
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
  | {type: 'SET_SHAKE_GRID'; payload: boolean}
  | {type: 'SET_FLIPPING_ROW'; payload: number | null}
  | {
      type: 'SET_LETTER_FEEDBACK';
      payload: {rowIndex: number; feedback: TileState[]};
    };

// Game State Actions
export type GameStateAction =
  | {type: 'SET_GAME_COMPLETE'; payload: {won: boolean}}
  | {type: 'RESET_GAME'}
  | {type: 'SET_SHOW_WIN_ANIMATION'; payload: boolean}
  | {type: 'SET_LOSING_ANIMATION'; payload: boolean}
  | {type: 'REVEAL_HINT'; payload: boolean}
  | {type: 'SET_HINT_LETTER'; payload: string};

// UI Actions
export type UIAction =
  | {type: 'SET_ACTIVE_MODAL'; payload: ModalType}
  | {type: 'SET_THEME_PREFERENCE'; payload: ThemePreference}
  | {type: 'SET_HINTS_ENABLED'; payload: boolean}
  | {type: 'SET_MUTED'; payload: boolean}
  | {type: 'SET_ACTIVE_SUGGESTION'; payload: string[] | null};

// Combine all action types
export type GameAction =
  | AppSystemAction
  | GameSetupAction
  | GameInputAction
  | GameStateAction
  | UIAction;

/**
 * Action creator functions to ensure type safety when dispatching actions
 */

// System action creators
export const systemActions = {
  /**
   * Set the initializing state of the application
   */
  setInitializing: (isInitializing: boolean): AppSystemAction => ({
    type: 'SET_INITIALIZING',
    payload: isInitializing,
  }),

  /**
   * Load persisted data from storage into the state
   */
  loadPersistedData: (data: Record<string, any>): AppSystemAction => ({
    type: 'LOAD_PERSISTED_DATA',
    payload: data,
  }),

  /**
   * Signal that base game data has been loaded
   */
  baseDataLoaded: (): AppSystemAction => ({
    type: 'BASE_DATA_LOADED',
  }),

  /**
   * Set the user ID
   */
  setUserId: (userId: string | null): AppSystemAction => ({
    type: 'SET_USER_ID',
    payload: userId,
  }),

  /**
   * Set an error message to display to the user
   */
  setError: (message: string | null): AppSystemAction => ({
    type: 'SET_ERROR',
    payload: message,
  }),
};

// Game setup action creators
export const gameSetupActions = {
  /**
   * Set the target words for each difficulty level
   */
  setTargetWords: (words: {
    easy: WordData;
    hard: WordData;
  }): GameSetupAction => ({
    type: 'SET_TARGET_WORDS',
    payload: words,
  }),

  /**
   * Update the daily status tracking
   */
  setDailyStatus: (status: MobileDailyStatus): GameSetupAction => ({
    type: 'SET_DAILY_STATUS',
    payload: status,
  }),

  /**
   * Set the current difficulty level
   */
  setCurrentDifficulty: (difficulty: Difficulty | null): GameSetupAction => ({
    type: 'SET_CURRENT_DIFFICULTY',
    payload: difficulty,
  }),

  /**
   * Initialize a new game with the current settings
   */
  initializeGame: (): GameSetupAction => ({
    type: 'INITIALIZE_GAME',
  }),
};

// Game input action creators
export const gameInputActions = {
  /**
   * Add a letter to the current guess
   */
  addLetter: (letter: string): GameInputAction => ({
    type: 'ADD_LETTER',
    payload: letter,
  }),

  /**
   * Delete the last letter from the current guess
   */
  deleteLetter: (): GameInputAction => ({
    type: 'DELETE_LETTER',
  }),

  /**
   * Submit the current guess for validation
   */
  submitGuess: (): GameInputAction => ({
    type: 'SUBMIT_GUESS',
  }),

  /**
   * Set submitting state while processing guess
   */
  setSubmitting: (isSubmitting: boolean): GameInputAction => ({
    type: 'SET_SUBMITTING',
    payload: isSubmitting,
  }),

  /**
   * Set whether the grid should shake (invalid input)
   */
  setShakeGrid: (shouldShake: boolean): GameInputAction => ({
    type: 'SET_SHAKE_GRID',
    payload: shouldShake,
  }),

  /**
   * Set which row is currently flipping
   */
  setFlippingRow: (rowIndex: number | null): GameInputAction => ({
    type: 'SET_FLIPPING_ROW',
    payload: rowIndex,
  }),

  /**
   * Update the feedback for a specific row
   */
  setLetterFeedback: (
    rowIndex: number,
    feedback: TileState[],
  ): GameInputAction => ({
    type: 'SET_LETTER_FEEDBACK',
    payload: {rowIndex, feedback},
  }),
};

// Game state action creators
export const gameStateActions = {
  /**
   * Set the game as complete
   */
  setGameComplete: (won: boolean): GameStateAction => ({
    type: 'SET_GAME_COMPLETE',
    payload: {won},
  }),

  /**
   * Reset the current game
   */
  resetGame: (): GameStateAction => ({
    type: 'RESET_GAME',
  }),

  /**
   * Show or hide win animation
   */
  setShowWinAnimation: (show: boolean): GameStateAction => ({
    type: 'SET_SHOW_WIN_ANIMATION',
    payload: show,
  }),

  /**
   * Show or hide losing animation
   */
  setLosingAnimation: (show: boolean): GameStateAction => ({
    type: 'SET_LOSING_ANIMATION',
    payload: show,
  }),

  /**
   * Reveal or hide the hint
   */
  revealHint: (reveal: boolean): GameStateAction => ({
    type: 'REVEAL_HINT',
    payload: reveal,
  }),

  /**
   * Set a specific hint letter
   */
  setHintLetter: (letter: string): GameStateAction => ({
    type: 'SET_HINT_LETTER',
    payload: letter,
  }),
};

// UI action creators
export const uiActions = {
  /**
   * Set which modal is currently active
   */
  setActiveModal: (modal: ModalType): UIAction => ({
    type: 'SET_ACTIVE_MODAL',
    payload: modal,
  }),

  /**
   * Set theme preference
   */
  setThemePreference: (preference: ThemePreference): UIAction => ({
    type: 'SET_THEME_PREFERENCE',
    payload: preference,
  }),

  /**
   * Enable or disable hints
   */
  setHintsEnabled: (enabled: boolean): UIAction => ({
    type: 'SET_HINTS_ENABLED',
    payload: enabled,
  }),

  /**
   * Mute or unmute sound
   */
  setMuted: (muted: boolean): UIAction => ({
    type: 'SET_MUTED',
    payload: muted,
  }),

  /**
   * Set active suggestion family
   */
  setActiveSuggestion: (suggestion: string[] | null): UIAction => ({
    type: 'SET_ACTIVE_SUGGESTION',
    payload: suggestion,
  }),
};

// Export all action creators in a single object
export const actions = {
  ...systemActions,
  ...gameSetupActions,
  ...gameInputActions,
  ...gameStateActions,
  ...uiActions,
};
