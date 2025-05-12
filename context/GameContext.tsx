import React, {createContext, useReducer, ReactNode, useEffect} from 'react';
// Ensure all types are correctly imported from ../types.ts as per previous modifications
import {
  GameState,
  TileState,
  MobileDifficultyProgress,
  WordSource,
  GameContextType,
} from '../types';
import {rootReducer} from './reducers/rootReducer'; // Use the combined reducer
import {WORD_LENGTH, MAX_GUESSES} from '../game-state';
import {getDateString} from '../core/utils/calendar';

// Modified to return the full MobileDifficultyProgress type
const createInitialDifficultyProgress = (): MobileDifficultyProgress => ({
  guesses: Array.from({length: MAX_GUESSES}, () => Array(WORD_LENGTH).fill('')),
  feedback: Array.from({length: MAX_GUESSES}, () =>
    Array(WORD_LENGTH).fill('empty' as TileState),
  ),
  letterHints: {},
  currentRow: 0,
  currentGuess: '',
  isFinished: false,
  won: false,
  gameStartTime: undefined,
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
    easy: {word: '', hint: ''},
    hard: {word: '', hint: ''},
  },
  currentDifficulty: null,
  gameProgress: {
    easy: createInitialDifficultyProgress(), // Simplified usage
    hard: createInitialDifficultyProgress(), // Simplified usage
  },
  activeModal: null,
  errorMessage: null,
  shouldShakeGrid: false,
  isSubmitting: false,
  activeSuggestionFamily: null,
  shouldShowWinAnimation: false,
  preferredDifficulty: 'hard',
  themePreference: 'system',
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
    date: getDateString(new Date()),
    hardCompleted: false,
    easyCompleted: false,
  },
  wordSourceInfo: {
    easy: {source: WordSource.Unknown, date: ''},
    hard: {source: WordSource.Unknown, date: ''},
  },
};

export const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [gameState, dispatch] = useReducer(rootReducer, initialState);

  useEffect(() => {
    const loadInitialData = async () => {
      dispatch({type: 'SET_INITIALIZING', payload: true});
      const today = getDateString(new Date());
      // Check if dailyStatus from initialState needs update (it might already be today's date)
      if (
        initialState.dailyStatus.date !== today &&
        gameState.dailyStatus.date !== today
      ) {
        dispatch({
          type: 'SET_DAILY_STATUS',
          payload: {date: today, easyCompleted: false, hardCompleted: false},
        });
      }
      // Placeholder for other async loading actions
      dispatch({type: 'SET_INITIALIZING', payload: false});
    };
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Effect runs once on mount

  // Removed the notifications-related useEffect hook

  return (
    <GameContext.Provider value={{gameState, dispatch}}>
      {children}
    </GameContext.Provider>
  );
};