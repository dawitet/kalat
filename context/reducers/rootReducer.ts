// src/context/reducers/rootReducer.ts
import {GameState, GameActionType, UIAction, UIState, GameLogicState} from '../../types';
import {uiReducer} from './uiReducer';
import {gameLogicReducer} from './gameReducer';
import {initialState} from '../initialState'; // Import initialState

export const rootReducer = (
  state: GameState = initialState, // Provide a default value for state
  action: GameActionType | UIAction,
): GameState => {
  // Separate UIState from GameState
  const currentUiState: UIState = {
    activeModal: state.activeModal,
    errorMessage: state.errorMessage,
    shouldShakeGrid: state.shouldShakeGrid,
    shouldShowWinAnimation: state.shouldShowWinAnimation,
    activeSuggestionFamily: state.activeSuggestionFamily,
    themePreference: state.themePreference,
    hintsEnabled: state.hintsEnabled,
    isMuted: state.isMuted,
    flippingRowIndex: state.flippingRowIndex, // Ensure this is from GameState, which includes UIState parts
  };

  // Construct GameLogicState from the parts of GameState that are not in UIState
  // This ensures all properties of GameLogicState are correctly sourced from the overall GameState.
  const currentGameLogicState: GameLogicState = {
    isInitializing: state.isInitializing,
    userId: state.userId,
    isBaseDataLoaded: state.isBaseDataLoaded,
    isUserDataLoading: state.isUserDataLoading,
    isUserDataSaving: state.isUserDataSaving,
    isUserDataResetting: state.isUserDataResetting,
    targetWords: state.targetWords,
    currentDifficulty: state.currentDifficulty,
    gameProgress: state.gameProgress,
    preferredDifficulty: state.preferredDifficulty,
    gamesPlayed: state.gamesPlayed,
    gamesWon: state.gamesWon,
    currentStreak: state.currentStreak,
    maxStreak: state.maxStreak,
    lastPlayedDate: state.lastPlayedDate,
    lastWinDate: state.lastWinDate,
    gamesPlayedEasy: state.gamesPlayedEasy,
    gamesWonEasy: state.gamesWonEasy,
    totalGuessesEasy: state.totalGuessesEasy,
    gamesPlayedHard: state.gamesPlayedHard,
    gamesWonHard: state.gamesWonHard,
    totalTimePlayedHard: state.totalTimePlayedHard,
    bestTimeHard: state.bestTimeHard,
    guessesInBestTimeHardGame: state.guessesInBestTimeHardGame,
    dailyStatus: state.dailyStatus,
    wordSourceInfo: state.wordSourceInfo,
    hapticType: state.hapticType,
    accessibilityAnnouncement: state.accessibilityAnnouncement,
    lastAnalyticsEvent: state.lastAnalyticsEvent,
    dailyReminderEnabled: state.dailyReminderEnabled,
    isSubmitting: state.isSubmitting,
  };

  let nextGameLogicState = currentGameLogicState;
  let nextUiState = currentUiState;

  // Check if the action is primarily a UI action based on its type string or specific known UI actions
  // This is a heuristic. A more robust way might involve checking if action.type is one of the keys of UIAction discriminated union.
  const uiActionTypes = [
    'SET_ACTIVE_MODAL', 'SET_ERROR', 'SET_THEME_PREFERENCE', 'SET_SHAKE_GRID',
    'SET_SHOW_WIN_ANIMATION', 'SET_ACTIVE_SUGGESTION_FAMILY', 'SET_ACTIVE_SUGGESTION',
    'SET_HINTS_ENABLED', 'SET_MUTED', 'SET_FLIPPING_ROW', // Added comma here
    // LOAD_PERSISTED_DATA is handled by both, so it's not exclusively UI
  ];

  if (uiActionTypes.includes(action.type) || (action.type === 'LOAD_PERSISTED_DATA')) {
    nextUiState = uiReducer(currentUiState, action as UIAction);
  }

  // Pass all actions to gameLogicReducer. It should ignore actions it doesn't handle.
  // LOAD_PERSISTED_DATA is also handled by gameLogicReducer.
  nextGameLogicState = gameLogicReducer(currentGameLogicState, action as GameActionType);

  return {
    ...state, // Start with the original state to preserve any properties not explicitly handled
    ...nextGameLogicState,
    ...nextUiState,
  };
};

export default rootReducer;
