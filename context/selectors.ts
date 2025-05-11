// src/context/selectors.ts
import {GameState, MobileDifficultyProgress} from '../types';

/**
 * UI Selectors
 */
export const selectActiveModal = (state: GameState) => state.activeModal;
export const selectThemePreference = (state: GameState) =>
  state.themePreference;
export const selectErrorMessage = (state: GameState) => state.errorMessage;
export const selectShouldShowWinAnimation = (state: GameState) =>
  state.shouldShowWinAnimation;
export const selectShouldShakeGrid = (state: GameState) =>
  state.shouldShakeGrid;
export const selectIsMuted = (state: GameState) => state.isMuted;
export const selectHintsEnabled = (state: GameState) => state.hintsEnabled;
export const selectActiveSuggestionFamily = (state: GameState) =>
  state.activeSuggestionFamily;

/**
 * Game Logic Selectors
 */
export const selectCurrentDifficulty = (state: GameState) =>
  state.currentDifficulty;
export const selectPreferredDifficulty = (state: GameState) =>
  state.preferredDifficulty;
export const selectTargetWords = (state: GameState) => state.targetWords;

export const selectCurrentProgress = (
  state: GameState,
): MobileDifficultyProgress | undefined => {
  const difficulty = state.currentDifficulty;
  if (!difficulty) {return undefined;}
  return state.gameProgress[difficulty];
};

export const selectCurrentGameStats = (state: GameState) => {
  return {
    gamesPlayed: state.gamesPlayed || 0,
    gamesWon: state.gamesWon || 0,
    currentStreak: state.currentStreak || 0,
    maxStreak: state.maxStreak || 0,
    bestTimeHard: state.bestTimeHard,
    guessesInBestTimeHardGame: state.guessesInBestTimeHardGame,
  };
};

export const selectCurrentTargetWord = (
  state: GameState,
): string | undefined => {
  const difficulty = state.currentDifficulty;
  if (!difficulty) {return undefined;}
  return state.targetWords[difficulty]?.word;
};

export const selectCurrentHint = (state: GameState): string | undefined => {
  const difficulty = state.currentDifficulty;
  if (!difficulty) {return undefined;}
  return state.targetWords[difficulty]?.hint;
};

export const selectIsGameFinished = (state: GameState): boolean => {
  const progress = selectCurrentProgress(state);
  return progress?.isFinished || false;
};

export const selectIsGameWon = (state: GameState): boolean => {
  const progress = selectCurrentProgress(state);
  return progress?.won || false;
};

export const selectCurrentGuess = (state: GameState): string => {
  const progress = selectCurrentProgress(state);
  return progress?.currentGuess || '';
};

export const selectCurrentRow = (state: GameState): number => {
  const progress = selectCurrentProgress(state);
  return progress?.currentRow || 0;
};

export const selectGuesses = (state: GameState): string[][] => {
  const progress = selectCurrentProgress(state);
  return progress?.guesses || [];
};

export const selectFeedback = (state: GameState): string[][] => {
  const progress = selectCurrentProgress(state);
  return progress?.feedback || [];
};

export const selectLetterHints = (state: GameState) => {
  const progress = selectCurrentProgress(state);
  return progress?.letterHints || {};
};
