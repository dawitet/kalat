// src/context/reducers/gameReducer.ts
import {GameAction, TileState, WordSource, Difficulty, MobileDailyStatus} from '../../types';
import {WORD_LENGTH, MAX_GUESSES} from '../../game-state';
import {getDateString} from '../../core/utils/calendar';
import {initialState, createDefaultDifficultyState} from '../initialState';

// Define GameLogicState interface matching the state structure used in this reducer
interface GameLogicState {
  isInitializing: boolean;
  userId: string | null;
  isBaseDataLoaded: boolean;
  isUserDataLoading: boolean;
  isUserDataSaving: boolean;
  isUserDataResetting: boolean;
  targetWords: {
    easy: {word: string; hint: string};
    hard: {word: string; hint: string};
  };
  currentDifficulty: Difficulty | null;
  gameProgress: {
    easy: {
      guesses: string[][];
      feedback: TileState[][];
      letterHints: Record<string, TileState>;
      currentRow: number;
      currentGuess: string;
      targetWord: string;
      isFinished: boolean;
      won: boolean;
      gameStartTime?: number;
      currentHint: string;
      mainHintRevealed?: boolean;
      hintLetters?: string[];
      isLosingAnimationActive?: boolean;
    };
    hard: {
      guesses: string[][];
      feedback: TileState[][];
      letterHints: Record<string, TileState>;
      currentRow: number;
      currentGuess: string;
      targetWord: string;
      isFinished: boolean;
      won: boolean;
      gameStartTime?: number;
      currentHint: string;
      mainHintRevealed?: boolean;
      hintLetters?: string[];
      isLosingAnimationActive?: boolean;
    };
  };
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string | null;
  lastWinDate: string | null;
  dailyStatus: MobileDailyStatus;
  wordSourceInfo: {
    easy: {source: WordSource; date: string};
    hard: {source: WordSource; date: string};
  };
}

// Define additional action types needed for this reducer
interface SetLetterFeedbackAction {
  type: 'SET_LETTER_FEEDBACK';
  payload: {
    rowIndex: number;
    feedback: TileState[];
  };
}

interface ResetGameAction {
  type: 'RESET_GAME';
}

interface SetGameCompleteAction {
  type: 'SET_GAME_COMPLETE';
  payload: {
    won: boolean;
  };
}

interface RevealHintAction {
  type: 'REVEAL_HINT';
  payload: boolean;
}

interface SetHintLetterAction {
  type: 'SET_HINT_LETTER';
  payload: string;
}

interface SetLosingAnimationAction {
  type: 'SET_LOSING_ANIMATION';
  payload: boolean;
}

// Extend GameAction with these additional actions
declare module '../../types' {
  interface GameAction extends
    SetLetterFeedbackAction,
    ResetGameAction,
    SetGameCompleteAction,
    RevealHintAction,
    SetHintLetterAction,
    SetLosingAnimationAction {}
}

/**
 * Reducer for managing game logic state like guesses, words, progress, etc.
 */
export const gameLogicReducer = (
  state: GameLogicState,
  action: GameAction,
): GameLogicState => {
  switch (action.type) {
    case 'SET_INITIALIZING':
      return {
        ...state,
        isInitializing: action.payload,
      };

    case 'SET_USER_ID':
      return {
        ...state,
        userId: action.payload,
      };

    case 'SET_TARGET_WORDS':
      return {
        ...state,
        targetWords: action.payload,
        // When new words are set, reset progress for those difficulties if a game was active
        gameProgress: {
          easy:
            state.targetWords.easy.word !== action.payload.easy.word
              ? createDefaultDifficultyState()
              : state.gameProgress.easy,
          hard:
            state.targetWords.hard.word !== action.payload.hard.word
              ? createDefaultDifficultyState()
              : state.gameProgress.hard,
        },
        wordSourceInfo: {
          // Update word source info when new words are set
          easy: {
            source: WordSource.Daily,
            date: getDateString(new Date()),
          },
          hard: {
            source: WordSource.Daily,
            date: getDateString(new Date()),
          },
        },
      };

    case 'SET_DAILY_STATUS':
      return {
        ...state,
        dailyStatus: action.payload,
      };

    case 'SET_CURRENT_DIFFICULTY':
      if (!action.payload) {
        return state;
      }
      return {
        ...state,
        currentDifficulty: action.payload,
      };

    case 'INITIALIZE_GAME': {
      const difficulty = state.currentDifficulty;
      if (!difficulty || !state.targetWords[difficulty as keyof typeof state.targetWords]?.word) {
        return state;
      }
      return {
        ...state,
        gameProgress: {
          ...state.gameProgress,
          [difficulty]: {
            ...createDefaultDifficultyState(),
            targetWord: state.targetWords[difficulty as keyof typeof state.targetWords].word,
            currentHint: state.targetWords[difficulty as keyof typeof state.targetWords].hint,
            gameStartTime: Date.now(),
          },
        },
      };
    }

    case 'ADD_LETTER': {
      const difficulty = state.currentDifficulty;
      if (
        !difficulty ||
        !state.gameProgress[difficulty as keyof typeof state.gameProgress] ||
        state.gameProgress[difficulty as keyof typeof state.gameProgress].isFinished
      ) {
        return state;
      }

      const progress = state.gameProgress[difficulty as keyof typeof state.gameProgress];
      if (progress.currentGuess.length < WORD_LENGTH) {
        const newGuess = progress.currentGuess + action.payload;
        return {
          ...state,
          gameProgress: {
            ...state.gameProgress,
            [difficulty]: {
              ...progress,
              currentGuess: newGuess,
            },
          },
        };
      }
      return state;
    }

    case 'DELETE_LETTER': {
      const difficulty = state.currentDifficulty;
      if (
        !difficulty ||
        !state.gameProgress[difficulty as keyof typeof state.gameProgress] ||
        state.gameProgress[difficulty as keyof typeof state.gameProgress].isFinished
      ) {
        return state;
      }

      const progress = state.gameProgress[difficulty as keyof typeof state.gameProgress];
      if (progress.currentGuess.length > 0) {
        const newGuess = progress.currentGuess.slice(0, -1);
        return {
          ...state,
          gameProgress: {
            ...state.gameProgress,
            [difficulty]: {
              ...progress,
              currentGuess: newGuess,
            },
          },
        };
      }
      return state;
    }

    case 'SUBMIT_GUESS': {
      const difficulty = state.currentDifficulty;
      if (
        !difficulty ||
        !state.gameProgress[difficulty as keyof typeof state.gameProgress] ||
        state.gameProgress[difficulty as keyof typeof state.gameProgress].isFinished ||
        state.gameProgress[difficulty as keyof typeof state.gameProgress].currentGuess.length !== WORD_LENGTH
      ) {
        return state;
      }

      const progress = state.gameProgress[difficulty as keyof typeof state.gameProgress];
      const currentRow = progress.currentRow;
      const currentGuess = progress.currentGuess;

      // Create a new array of guesses with the current guess
      const newGuesses = [...progress.guesses];
      newGuesses[currentRow] = currentGuess.split('');

      // Process feedback for the current guess (this would be more complex in reality)
      const targetWord = progress.targetWord;
      const feedback: TileState[] = calculateFeedback(currentGuess, targetWord);

      // Update letter hints for the keyboard
      const newLetterHints = {...progress.letterHints};
      currentGuess.split('').forEach((letter: string, i: number) => {
        const feedbackState = feedback[i];
        // Only upgrade the hint state, never downgrade
        if (
          !newLetterHints[letter] ||
          getHintPriority(feedbackState) >
            getHintPriority(newLetterHints[letter])
        ) {
          newLetterHints[letter] = feedbackState;
        }
      });

      // Create new feedback array
      const newFeedback = [...progress.feedback];
      newFeedback[currentRow] = feedback;

      // Check if game is won
      const isWon = feedback.every(tileState => tileState === 'correct');

      // Check if game is finished (won or out of guesses)
      const isFinished = isWon || currentRow === MAX_GUESSES - 1;

      return {
        ...state,
        gameProgress: {
          ...state.gameProgress,
          [difficulty]: {
            ...progress,
            guesses: newGuesses,
            feedback: newFeedback,
            letterHints: newLetterHints,
            currentRow: isFinished ? currentRow : currentRow + 1,
            currentGuess: '',
            isFinished,
            won: isWon,
          },
        },
      };
    }

    case 'SET_LETTER_FEEDBACK': {
      const difficulty = state.currentDifficulty;
      if (!difficulty || !state.gameProgress[difficulty as keyof typeof state.gameProgress]) {
        return state;
      }

      const progress = state.gameProgress[difficulty as keyof typeof state.gameProgress];
      const {rowIndex, feedback} = action.payload;

      if (rowIndex < 0 || rowIndex >= progress.feedback.length) {
        return state;
      }

      const newFeedback = [...progress.feedback];
      newFeedback[rowIndex] = feedback;

      return {
        ...state,
        gameProgress: {
          ...state.gameProgress,
          [difficulty]: {
            ...progress,
            feedback: newFeedback,
          },
        },
      };
    }

    case 'RESET_GAME': {
      const difficulty = state.currentDifficulty;
      if (!difficulty) {
        return state;
      }

      return {
        ...state,
        gameProgress: {
          ...state.gameProgress,
          [difficulty]: createDefaultDifficultyState(),
        },
      };
    }

    case 'SET_GAME_COMPLETE': {
      const difficulty = state.currentDifficulty;
      if (!difficulty || !state.gameProgress[difficulty as keyof typeof state.gameProgress]) {
        return state;
      }

      const progress = state.gameProgress[difficulty as keyof typeof state.gameProgress];
      return {
        ...state,
        gameProgress: {
          ...state.gameProgress,
          [difficulty]: {
            ...progress,
            isFinished: true,
            won: action.payload.won,
          },
        },
        // Update stats as needed
        gamesPlayed: state.gamesPlayed + 1,
        gamesWon: action.payload.won ? state.gamesWon + 1 : state.gamesWon,
        lastPlayedDate: getDateString(new Date()),
        lastWinDate: action.payload.won
          ? getDateString(new Date())
          : state.lastWinDate,
        currentStreak: action.payload.won ? state.currentStreak + 1 : 0,
        maxStreak: action.payload.won
          ? Math.max(state.currentStreak + 1, state.maxStreak)
          : state.maxStreak,
      };
    }

    case 'REVEAL_HINT': {
      const difficulty = state.currentDifficulty;
      if (!difficulty || !state.gameProgress[difficulty as keyof typeof state.gameProgress]) {
        return state;
      }

      const progress = state.gameProgress[difficulty as keyof typeof state.gameProgress];
      return {
        ...state,
        gameProgress: {
          ...state.gameProgress,
          [difficulty]: {
            ...progress,
            mainHintRevealed: action.payload,
          },
        },
      };
    }

    case 'SET_HINT_LETTER': {
      const difficulty = state.currentDifficulty;
      if (!difficulty || !state.gameProgress[difficulty as keyof typeof state.gameProgress]) {
        return state;
      }

      const progress = state.gameProgress[difficulty as keyof typeof state.gameProgress];
      const hintLetters = [...(progress.hintLetters || [])];

      // Add the hint letter if it's not already in the array
      if (!hintLetters.includes(action.payload)) {
        hintLetters.push(action.payload);
      }

      return {
        ...state,
        gameProgress: {
          ...state.gameProgress,
          [difficulty]: {
            ...progress,
            hintLetters,
          },
        },
      };
    }

    case 'SET_LOSING_ANIMATION': {
      const difficulty = state.currentDifficulty;
      if (!difficulty || !state.gameProgress[difficulty as keyof typeof state.gameProgress]) {
        return state;
      }

      const progress = state.gameProgress[difficulty as keyof typeof state.gameProgress];
      return {
        ...state,
        gameProgress: {
          ...state.gameProgress,
          [difficulty]: {
            ...progress,
            isLosingAnimationActive: action.payload,
          },
        },
      };
    }

    // Handle loading initial data
    case 'LOAD_PERSISTED_DATA':
      return {
        ...initialState, // Start with a fresh initial state
        ...action.payload, // Override with persisted data
        isInitializing: false,
        isBaseDataLoaded: state.isBaseDataLoaded,
        targetWords: state.targetWords,
        gameProgress: action.payload.gameProgress || initialState.gameProgress,
      };

    case 'BASE_DATA_LOADED':
      return {
        ...state,
        isBaseDataLoaded: true,
      };

    default:
      return state;
  }
};

/**
 * Helper function to calculate feedback for a guess
 * @param guess The current guess
 * @param targetWord The target word to match
 * @returns Array of TileState values for each letter
 */
function calculateFeedback(guess: string, targetWord: string): TileState[] {
  const result = Array(guess.length).fill('absent' as TileState);

  // First pass: mark correct letters
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === targetWord[i]) {
      result[i] = 'correct';
    }
  }

  // Second pass: mark present letters (avoiding duplicates)
  const targetLetters = [...targetWord];

  // Remove letters that were already marked correct
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === 'correct') {
      targetLetters[i] = '';
    }
  }

  // Mark present letters
  for (let i = 0; i < guess.length; i++) {
    if (result[i] !== 'correct') {
      const targetIndex = targetLetters.indexOf(guess[i]);
      if (targetIndex >= 0) {
        result[i] = 'present';
        targetLetters[targetIndex] = ''; // Remove this letter to avoid duplicate matches
      }
    }
  }

  return result;
}

/**
 * Helper function to determine priority of hint states
 * @param state The hint state
 * @returns Number representing priority (higher is better)
 */
function getHintPriority(state: TileState): number {
  switch (state) {
    case 'correct':
      return 3;
    case 'present':
      return 2;
    case 'absent':
      return 1;
    default:
      return 0;
  }
}

export default gameLogicReducer;
