// src/context/actionCreators.ts
import {
  Difficulty,
  ModalType,
  ThemePreference,
  // Specific action types to be used as return types
  ShowModalAction,
  SetThemePreferenceAction,
  SetErrorAction,
  ShowWinAnimationAction,
  HideWinAnimationAction,
  SetMutedStateAction,
  SetHintsEnabledAction,
  ClearFlipAnimationAction,
  TriggerShakeAction,
  SetCurrentDifficultyAction,
  SetTargetWordsAction,
  InitializeGameAction,
  ResetUserDataAction,
  AddLetterAction,
  DeleteLetterAction,
  SubmitGuessAction,
  RevealMainHintAction,
  SetUserIdAction,
  AnimationCompletedAction,
} from '../types';

/**
 * Game UI Action Creators
 * These action creators handle UI-specific state changes
 */

export const setActiveModal = (modalType: ModalType): ShowModalAction => ({
  type: 'SHOW_MODAL',
  payload: modalType,
});

export const setThemePreference = (
  preference: ThemePreference,
): SetThemePreferenceAction => ({
  type: 'SET_THEME_PREFERENCE',
  payload: preference,
});

export const setError = (message: string | null): SetErrorAction => ({
  type: 'SET_ERROR',
  payload: message,
});

export const setShowWinAnimation = (show: boolean): ShowWinAnimationAction | HideWinAnimationAction =>
  show
    ? {type: 'SHOW_WIN_ANIMATION'}
    : {type: 'HIDE_WIN_ANIMATION'};

export const toggleMute = (isMuted: boolean): SetMutedStateAction => ({
  type: 'SET_MUTED_STATE',
  payload: isMuted,
});

export const toggleHints = (hintsEnabled: boolean): SetHintsEnabledAction => ({
  type: 'SET_HINTS_ENABLED',
  payload: hintsEnabled,
});

export const setFlippingRow = (_rowIndex: number | null): ClearFlipAnimationAction => ({
  type: 'CLEAR_FLIP_ANIMATION',
  // Note: This may need to be adjusted based on what the reducer expects
});

export const setShakeGrid = (shouldShake: boolean): TriggerShakeAction => ({
  type: 'TRIGGER_SHAKE',
  payload: shouldShake ? 'grid' : undefined,
});

/**
 * Game Logic Action Creators
 * These action creators handle game state changes
 */

export const setCurrentDifficulty = (difficulty: Difficulty): SetCurrentDifficultyAction => ({
  type: 'SET_CURRENT_DIFFICULTY',
  payload: difficulty,
});

export const setPreferredDifficulty = (difficulty: Difficulty): SetCurrentDifficultyAction => ({
  type: 'SET_CURRENT_DIFFICULTY',
  payload: difficulty,
});

export const setTargetWords = (words: {
  easy: {word: string; hint: string};
  hard: {word: string; hint: string};
}): SetTargetWordsAction => ({
  type: 'SET_TARGET_WORDS',
  payload: words,
});

export const initializeGame = (): InitializeGameAction => ({
  type: 'INITIALIZE_GAME',
});

export const resetGame = (): ResetUserDataAction => ({
  type: 'RESET_USER_DATA',
});

export const addLetter = (letter: string): AddLetterAction => ({
  type: 'ADD_LETTER',
  payload: letter,
});

export const deleteLetter = (): DeleteLetterAction => ({
  type: 'DELETE_LETTER',
});

export const submitGuess = (): SubmitGuessAction => ({
  type: 'SUBMIT_GUESS',
});

export const revealHint = (): RevealMainHintAction => ({
  type: 'REVEAL_MAIN_HINT',
});

export const updateUserId = (userId: string): SetUserIdAction => ({
  type: 'SET_USER_ID',
  payload: userId,
});

export const animationCompleted = (data: {
  rowIndex: number;
  type: 'flip' | 'shake';
}): AnimationCompletedAction => ({
  type: 'ANIMATION_COMPLETED',
  payload: { rowIndex: data.rowIndex },
});
