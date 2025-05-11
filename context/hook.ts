// src/context/hook.ts
import {useContext, useCallback} from 'react';
import {GameContext} from './GameContext';
import {Difficulty, ModalType, ThemePreference} from '../types';
import * as actionCreators from './actionCreators';

/**
 * Custom hook to access the game context.
 * Throws an error if used outside of a GameProvider.
 */
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }

  const {gameState, dispatch} = context;

  // Game setup helpers
  const setDifficulty = useCallback(
    (difficulty: Difficulty | null) => {
      if (difficulty) {
        dispatch(actionCreators.setCurrentDifficulty(difficulty));
      }
    },
    [dispatch]
  );

  const initGame = useCallback(
    () => dispatch(actionCreators.initializeGame()),
    [dispatch]
  );

  // Game input helpers
  const addLetter = useCallback(
    (letter: string) => {
      dispatch(actionCreators.addLetter(letter));
    },
    [dispatch],
  );

  const deleteLetter = useCallback(() => {
    dispatch(actionCreators.deleteLetter());
  }, [dispatch]);

  const submitGuess = useCallback(() => {
    dispatch(actionCreators.submitGuess());
  }, [dispatch]);

  // UI helpers
  const setActiveModal = useCallback(
    (modal: ModalType) => {
      dispatch(actionCreators.setActiveModal(modal));
    },
    [dispatch],
  );

  const setThemePreference = useCallback(
    (theme: ThemePreference) => {
      dispatch(actionCreators.setThemePreference(theme));
    },
    [dispatch],
  );

  const toggleHints = useCallback(() => {
    dispatch(actionCreators.toggleHints(!gameState.hintsEnabled));
  }, [dispatch, gameState.hintsEnabled]);

  const toggleSound = useCallback(() => {
    dispatch(actionCreators.toggleMute(!gameState.isMuted));
  }, [dispatch, gameState.isMuted]);

  // Additional helpers for our optimized components
  const revealHint = useCallback(() => {
    dispatch(actionCreators.revealHint());
  }, [dispatch]);

  // Navigation helpers
  const startNewGame = useCallback((difficulty: Difficulty) => {
    dispatch({
      type: 'START_NEW_GAME',
      payload: {difficulty},
    });
  }, [dispatch]);

  const goHome = useCallback(() => {
    dispatch({type: 'GO_HOME'});
  }, [dispatch]);

  return {
    ...context,
    dispatch,  // Return the raw dispatch function

    // Specialized helpers
    setDifficulty,
    initGame,
    addLetter,
    deleteLetter,
    submitGuess,
    setActiveModal,
    setThemePreference,
    toggleHints,
    toggleSound,
    revealHint,
    startNewGame,
    goHome,
  };
};
