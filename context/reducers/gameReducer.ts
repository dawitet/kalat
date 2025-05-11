// src/context/reducers/gameReducer.ts
import {
  GameLogicState,
  GameActionType,
  TileState,
  WordSource,
} from '../../types';
import {WORD_LENGTH, MAX_GUESSES} from '../../game-state';
import {getDateString} from '../../core/utils/calendar';
import {initialState, createDefaultDifficultyState} from '../initialState';

export const gameLogicReducer = (
  state: GameLogicState,
  action: GameActionType,
): GameLogicState => {
  const currentDifficultyState = state.currentDifficulty;
  let difficultyKey: 'easy' | 'hard';

  if (currentDifficultyState) {
    difficultyKey = currentDifficultyState;
  }

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

    case 'BASE_DATA_LOADED':
      return {
        ...state,
        isBaseDataLoaded: true,
      };

    case 'SET_USER_DATA_LOADING':
      return {
        ...state,
        isUserDataLoading: action.payload,
      };

    case 'SET_USER_DATA_SAVING':
      return {
        ...state,
        isUserDataSaving: action.payload,
      };

    case 'SET_DAILY_CHALLENGE_INFO':
      return state;

    case 'LOAD_PERSISTED_DATA': {
      const persisted = action.payload;
      return {
        ...state,
        userId: persisted.userId || state.userId,
        preferredDifficulty: persisted.preferredDifficulty || state.preferredDifficulty,
        gamesPlayed: persisted.gamesPlayed || 0,
        gamesWon: persisted.gamesWon || 0,
        currentStreak: persisted.currentStreak || 0,
        maxStreak: persisted.maxStreak || 0,
        lastPlayedDate: persisted.lastPlayedDate || null,
        lastWinDate: persisted.lastWinDate || null,
        gamesPlayedEasy: persisted.gamesPlayedEasy || 0,
        gamesWonEasy: persisted.gamesWonEasy || 0,
        totalGuessesEasy: persisted.totalGuessesEasy || 0,
        gamesPlayedHard: persisted.gamesPlayedHard || 0,
        gamesWonHard: persisted.gamesWonHard || 0,
        totalTimePlayedHard: persisted.totalTimePlayedHard || 0,
        bestTimeHard: persisted.bestTimeHard || null,
        guessesInBestTimeHardGame: persisted.guessesInBestTimeHardGame || 0,
        dailyStatus: persisted.dailyStatus || state.dailyStatus,
        wordSourceInfo: persisted.wordSourceInfo || state.wordSourceInfo,
        dailyReminderEnabled: persisted.dailyReminderEnabled !== undefined ? persisted.dailyReminderEnabled : state.dailyReminderEnabled,
        gameProgress: persisted.gameProgress
          ? {
              easy: persisted.gameProgress.easy || createDefaultDifficultyState(),
              hard: persisted.gameProgress.hard || createDefaultDifficultyState(),
            }
          : state.gameProgress,
        currentDifficulty: state.currentDifficulty || persisted.preferredDifficulty || null,
        isInitializing: false,
        isBaseDataLoaded: true,
      };
    }

    case 'SET_TARGET_WORDS':
      return {
        ...state,
        targetWords: action.payload,
        gameProgress: state.currentDifficulty
          ? {
              ...state.gameProgress,
              [state.currentDifficulty]: {
                ...state.gameProgress[state.currentDifficulty],
                targetWord: action.payload[state.currentDifficulty].word,
                currentHint: action.payload[state.currentDifficulty].hint,
              },
            }
          : state.gameProgress,
      };

    case 'SET_CURRENT_DIFFICULTY': {
      const newDifficulty = action.payload;
      // Return early if newDifficulty is null
      if (newDifficulty === null) {
        return {
          ...state,
          currentDifficulty: null,
        };
      }

      // TypeScript needs help understanding newDifficulty is not null here
      const difficultyValue = newDifficulty as 'easy' | 'hard';

      return {
        ...state,
        currentDifficulty: difficultyValue,
        gameProgress: {
          ...state.gameProgress,
          [difficultyValue]: state.gameProgress[difficultyValue]?.isFinished
            ? state.gameProgress[difficultyValue]
            : {
                ...(state.gameProgress[difficultyValue] || createDefaultDifficultyState()),
                targetWord: state.targetWords[difficultyValue]?.word || '',
                currentHint: state.targetWords[difficultyValue]?.hint || '',
              },
        },
      };
    }

    case 'START_NEW_GAME': {
      const newDifficulty = action.payload.difficulty;
      if (!state.targetWords[newDifficulty]?.word) {
        console.error(`Cannot start new game: Target word for ${newDifficulty} is not loaded.`);
        return state;
      }
      return {
        ...state,
        currentDifficulty: newDifficulty,
        gameProgress: {
          ...state.gameProgress,
          [newDifficulty]: {
            ...createDefaultDifficultyState(),
            targetWord: state.targetWords[newDifficulty].word,
            currentHint: state.targetWords[newDifficulty].hint,
            gameStartTime: Date.now(),
          },
        },
      };
    }

    case 'ADD_LETTER': {
      if (!state.currentDifficulty) {
        return state;
      }
      difficultyKey = state.currentDifficulty;
      const currentProgress = state.gameProgress[difficultyKey];
      if (currentProgress.currentGuess.length < WORD_LENGTH && !currentProgress.isFinished) {
        return {
          ...state,
          gameProgress: {
            ...state.gameProgress,
            [difficultyKey]: {
              ...currentProgress,
              currentGuess: currentProgress.currentGuess + action.payload,
            },
          },
        };
      }
      return state;
    }

    case 'DELETE_LETTER': {
      if (!state.currentDifficulty) {
        return state;
      }
      difficultyKey = state.currentDifficulty;
      const currentProgress = state.gameProgress[difficultyKey];
      if (currentProgress.currentGuess.length > 0 && !currentProgress.isFinished) {
        return {
          ...state,
          gameProgress: {
            ...state.gameProgress,
            [difficultyKey]: {
              ...currentProgress,
              currentGuess: currentProgress.currentGuess.slice(0, -1),
            },
          },
        };
      }
      return state;
    }

    case 'SUBMIT_GUESS': {
      if (!state.currentDifficulty) {
        return state;
      }
      difficultyKey = state.currentDifficulty;
      const progress = state.gameProgress[difficultyKey];

      if (progress.currentGuess.length !== WORD_LENGTH || progress.isFinished || state.isSubmitting) {
        return state;
      }

      const newGuesses = [...progress.guesses];
      newGuesses[progress.currentRow] = progress.currentGuess.split('');

      const newFeedback = [...progress.feedback];
      const currentFeedbackRow: TileState[] = Array(WORD_LENGTH).fill('absent');
      const targetWord = progress.targetWord.toUpperCase();
      const guessWord = progress.currentGuess.toUpperCase();
      const letterCounts: {[key: string]: number} = {};

      for (const char of targetWord) {
        letterCounts[char] = (letterCounts[char] || 0) + 1;
      }

      for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessWord[i] === targetWord[i]) {
          currentFeedbackRow[i] = 'correct';
          letterCounts[guessWord[i]]--;
        }
      }

      for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessWord[i] !== targetWord[i] && targetWord.includes(guessWord[i]) && letterCounts[guessWord[i]] > 0) {
          currentFeedbackRow[i] = 'present';
          letterCounts[guessWord[i]]--;
        }
      }
      newFeedback[progress.currentRow] = currentFeedbackRow;

      const newLetterHints = {...progress.letterHints};
      for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = guessWord[i];
        const existingHint = newLetterHints[letter];
        const currentTileState = currentFeedbackRow[i];
        if (!existingHint ||
            (existingHint === 'absent' && (currentTileState === 'present' || currentTileState === 'correct')) ||
            (existingHint === 'present' && currentTileState === 'correct')) {
          newLetterHints[letter] = currentTileState;
        }
      }

      const won = guessWord === targetWord;
      const isFinished = won || progress.currentRow === MAX_GUESSES - 1;
      let gamesWon = state.gamesWon;
      let currentStreak = state.currentStreak;
      let maxStreak = state.maxStreak;
      let lastWinDate = state.lastWinDate;
      let gamesWonDifficulty = difficultyKey === 'easy' ? state.gamesWonEasy : state.gamesWonHard;

      if (won) {
        gamesWon += 1;
        gamesWonDifficulty += 1;
        const today = getDateString(new Date());
        if (state.lastWinDate !== today) {
          currentStreak = state.lastPlayedDate === getDateString(new Date(Date.now() - 86400000)) ? currentStreak + 1 : 1;
        }
        lastWinDate = today;
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
      } else if (isFinished) {
        currentStreak = 0;
      }

      const today = getDateString(new Date());
      let dailyStatusUpdate = {...state.dailyStatus};
      if (state.wordSourceInfo[difficultyKey].source === WordSource.Daily && state.wordSourceInfo[difficultyKey].date === today) {
        if (won) {
          dailyStatusUpdate = {
            ...dailyStatusUpdate,
            date: today,
            [difficultyKey === 'easy' ? 'easyCompleted' : 'hardCompleted']: true,
          };
        }
      }

      return {
        ...state,
        gameProgress: {
          ...state.gameProgress,
          [difficultyKey]: {
            ...progress,
            guesses: newGuesses,
            feedback: newFeedback,
            letterHints: newLetterHints,
            currentRow: progress.currentRow + 1,
            currentGuess: '',
            isFinished,
            won,
            flippingRowIndex: progress.currentRow,
            isLosingAnimationActive: isFinished && !won,
          },
        },
        gamesPlayed: isFinished ? state.gamesPlayed + 1 : state.gamesPlayed,
        gamesWon: gamesWon,
        currentStreak: currentStreak,
        maxStreak: maxStreak,
        lastPlayedDate: isFinished ? getDateString(new Date()) : state.lastPlayedDate,
        lastWinDate: lastWinDate,
        ...(difficultyKey === 'easy'
          ? {
              gamesPlayedEasy: isFinished ? state.gamesPlayedEasy + 1 : state.gamesPlayedEasy,
              gamesWonEasy: gamesWonDifficulty,
              totalGuessesEasy: state.totalGuessesEasy + (isFinished ? progress.currentRow + 1 : 0),
            }
          : {
              gamesPlayedHard: isFinished ? state.gamesPlayedHard + 1 : state.gamesPlayedHard,
              gamesWonHard: gamesWonDifficulty,
              totalTimePlayedHard: state.totalTimePlayedHard + (won && progress.gameStartTime ? Date.now() - progress.gameStartTime : 0),
              bestTimeHard: won && progress.gameStartTime ? Math.min(state.bestTimeHard || Infinity, Date.now() - progress.gameStartTime) : state.bestTimeHard,
              guessesInBestTimeHardGame: won && progress.gameStartTime && (Date.now() - progress.gameStartTime < (state.bestTimeHard || Infinity)) ? progress.currentRow + 1 : state.guessesInBestTimeHardGame,
            }),
        dailyStatus: dailyStatusUpdate,
        isSubmitting: false,
      };
    }

    case 'ANIMATION_COMPLETED': {
      if (!state.currentDifficulty) {
        return state;
      }
      difficultyKey = state.currentDifficulty;
      const progress = state.gameProgress[difficultyKey];
      if (progress.flippingRowIndex === action.payload.rowIndex) {
        return {
          ...state,
          gameProgress: {
            ...state.gameProgress,
            [difficultyKey]: {
              ...progress,
              flippingRowIndex: null,
            },
          },
        };
      }
      return state;
    }

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };

    case 'UPDATE_PREFERENCE': {
      const {key, value} = action.payload;
      if (key in state) {
        return {
          ...state,
          [key]: value,
        };
      }
      return state;
    }

    case 'RESET_USER_DATA': {
      const {userId: currentUserId} = state;
      const freshState = {
        ...initialState,
        userId: currentUserId,
        isInitializing: false,
        isBaseDataLoaded: state.isBaseDataLoaded,
        targetWords: state.targetWords,
      };
      const {
        activeModal,
        errorMessage,
        shouldShakeGrid,
        shouldShowWinAnimation,
        activeSuggestionFamily,
        themePreference,
        hintsEnabled,
        isMuted,
        flippingRowIndex,
        ...gameLogicInitialState
      } = freshState;
      return gameLogicInitialState as GameLogicState;
    }

    case 'SET_DAILY_STATUS':
      return {
        ...state,
        dailyStatus: action.payload,
      };

    case 'SET_DAILY_REMINDER_ENABLED':
      return {
        ...state,
        dailyReminderEnabled: action.payload,
      };

    default:
      return state;
  }
};

export default gameLogicReducer;
