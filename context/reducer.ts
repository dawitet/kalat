// src/context/reducer.ts

import { GameState, GameAction, WordSource, TileState } from '../types'; // Removed Difficulty
import { WORD_LENGTH, MAX_GUESSES } from '../game-state';
import { getDateString } from '../core/utils/calendar';
import { initialState, createDefaultDifficultyState } from './initialState';

export const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'SET_INITIALIZING':
            return { ...state, isInitializing: action.payload };
        case 'LOAD_PERSISTED_DATA':
            // Carefully merge persisted data, prioritizing it but falling back to initial for missing fields
            return {
                ...initialState, // Start with a fresh initial state to avoid merging issues
                ...action.payload, // Override with persisted data
                isInitializing: false, // Ensure this is set after loading
                isBaseDataLoaded: state.isBaseDataLoaded, // Preserve potentially already loaded base data state
                targetWords: state.targetWords, // Preserve potentially fetched words if any
                // Ensure gameProgress is re-initialized if not part of persisted or needs fresh start
                gameProgress: action.payload.gameProgress ? action.payload.gameProgress : initialState.gameProgress,
            };
        case 'BASE_DATA_LOADED':
            // Assuming payload contains targetWords, hints, etc.
            // This needs to be more specific based on actual baseData structure
            return {
                ...state,
                // targetWords: action.payload.targetWords || state.targetWords, // Example
                isBaseDataLoaded: true,
            };
        case 'SET_USER_ID':
            return { ...state, userId: action.payload };
        case 'SET_TARGET_WORDS':
            return {
                ...state,
                targetWords: action.payload,
                // When new words are set, reset progress for those difficulties if a game was active
                // This is a simple reset; more complex logic might be needed to preserve unfinished games
                gameProgress: {
                    easy: state.targetWords.easy.word !== action.payload.easy.word ? createDefaultDifficultyState() : state.gameProgress.easy,
                    hard: state.targetWords.hard.word !== action.payload.hard.word ? createDefaultDifficultyState() : state.gameProgress.hard,
                },
                wordSourceInfo: { // Update word source info when new words are set
                    easy: { source: WordSource.Daily, date: getDateString(new Date()) }, // Assuming daily for now
                    hard: { source: WordSource.Daily, date: getDateString(new Date()) },
                },
            };
        case 'SET_DAILY_STATUS':
            return { ...state, dailyStatus: action.payload };
        case 'SET_CURRENT_DIFFICULTY':
            if (!action.payload) { return state; } // Added curly braces
            return {
                ...state,
                currentDifficulty: action.payload,
                activeModal: null, // Close any open modals when difficulty is selected
            };
        case 'INITIALIZE_GAME': { // Added block scope for clarity
            const difficulty = state.currentDifficulty;
            if (!difficulty || !state.targetWords[difficulty]?.word) {
                // This case should ideally be prevented by UI logic (e.g., disabled start button)
                return { ...state, errorMessage: 'Game cannot start: Word not loaded or difficulty not set.' };
            }
            return {
                ...state,
                gameProgress: {
                    ...state.gameProgress,
                    [difficulty]: {
                        ...createDefaultDifficultyState(),
                        targetWord: state.targetWords[difficulty].word,
                        currentHint: state.targetWords[difficulty].hint,
                        gameStartTime: Date.now(), // Record game start time
                    },
                },
                activeModal: null, // Close modals
                errorMessage: null, // Clear previous errors
            };
        }
        case 'ADD_LETTER': {
            const difficulty = state.currentDifficulty;
            if (!difficulty || !state.gameProgress[difficulty] || state.gameProgress[difficulty].isFinished) { return state; } // Added curly braces

            const progress = state.gameProgress[difficulty];
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
                    shouldShakeGrid: false, // Reset shake on new input
                    errorMessage: null, // Clear error on valid input
                };
            }
            return state;
        }
        case 'DELETE_LETTER': {
            const difficulty = state.currentDifficulty;
            if (!difficulty || !state.gameProgress[difficulty] || state.gameProgress[difficulty].isFinished) { return state; } // Added curly braces

            const progress = state.gameProgress[difficulty];
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
                shouldShakeGrid: false,
                errorMessage: null,
            };
        }
        case 'SUBMIT_GUESS': {
            const difficulty = state.currentDifficulty;
            if (!difficulty || !state.gameProgress[difficulty] || state.gameProgress[difficulty].isFinished) { return state; } // Added curly braces

            const progress = state.gameProgress[difficulty];
            if (progress.currentGuess.length !== WORD_LENGTH) {
                return {
                    ...state,
                    shouldShakeGrid: true,
                    errorMessage: 'ቃሉ ሙሉ መሆን አለበት።', // Changed to single quotes
                };
            }

            // Basic feedback logic (needs actual word checking algorithm)
            const newFeedbackRow: TileState[] = Array(WORD_LENGTH).fill('absent');
            const targetWord = progress.targetWord.split('');
            const guessLetters = progress.currentGuess.split('');
            const newLetterHints = { ...progress.letterHints };

            // Mark correct letters (green)
            for (let i = 0; i < WORD_LENGTH; i++) {
                if (guessLetters[i] === targetWord[i]) {
                    newFeedbackRow[i] = 'correct';
                    newLetterHints[guessLetters[i]] = 'correct';
                    targetWord[i] = '#'; // Mark as used to prevent re-matching for present
                    guessLetters[i] = '$'; // Mark as processed
                }
            }

            // Mark present letters (yellow)
            for (let i = 0; i < WORD_LENGTH; i++) {
                if (guessLetters[i] !== '$') { // If not already marked correct
                    const letterIndexInTarget = targetWord.indexOf(guessLetters[i]);
                    if (letterIndexInTarget !== -1) {
                        newFeedbackRow[i] = 'present';
                        if (newLetterHints[guessLetters[i]] !== 'correct') {
                            newLetterHints[guessLetters[i]] = 'present';
                        }
                        targetWord[letterIndexInTarget] = '#'; // Mark as used
                    } else {
                        if (!newLetterHints[guessLetters[i]]) { // Only mark absent if not already correct/present
                            newLetterHints[guessLetters[i]] = 'absent';
                        }
                    }
                }
            }

            const newGuesses = [...progress.guesses];
            newGuesses[progress.currentRow] = progress.currentGuess.split('');
            const newFeedback = [...progress.feedback];
            newFeedback[progress.currentRow] = newFeedbackRow;

            const didWin = newFeedbackRow.every(f => f === 'correct');
            const isLastGuess = progress.currentRow === MAX_GUESSES - 1;
            const isFinished = didWin || isLastGuess;

            let updatedStats = {};
            if (isFinished) {
                const gameEndTime = Date.now();
                const timeTaken = progress.gameStartTime ? (gameEndTime - progress.gameStartTime) / 1000 : null;
                updatedStats = {
                    gamesPlayed: state.gamesPlayed + 1,
                    lastPlayedDate: getDateString(new Date()),
                    ...(didWin && {
                        gamesWon: state.gamesWon + 1,
                        currentStreak: state.currentStreak + 1,
                        maxStreak: Math.max(state.maxStreak, state.currentStreak + 1),
                        lastWinDate: getDateString(new Date()),
                    }),
                    ...(!didWin && { currentStreak: 0 }),
                };
                if (difficulty === 'easy') {
                    updatedStats = {
                        ...updatedStats,
                        gamesPlayedEasy: state.gamesPlayedEasy + 1,
                        totalGuessesEasy: state.totalGuessesEasy + (progress.currentRow + 1),
                        ...(didWin && { gamesWonEasy: state.gamesWonEasy + 1 }),
                    };
                } else if (difficulty === 'hard') {
                    updatedStats = {
                        ...updatedStats,
                        gamesPlayedHard: state.gamesPlayedHard + 1,
                        ...(didWin && {
                            gamesWonHard: state.gamesWonHard + 1,
                            totalTimePlayedHard: state.totalTimePlayedHard + (timeTaken || 0),
                            ...(timeTaken && (!state.bestTimeHard || timeTaken < state.bestTimeHard) && {
                                bestTimeHard: timeTaken,
                                guessesInBestTimeHardGame: progress.currentRow + 1,
                            }),
                        }),
                    };
                }
                // Update daily completion status
                if (didWin && state.dailyStatus.date === getDateString(new Date())) {
                    if (difficulty === 'easy') {
                        updatedStats = { ...updatedStats, dailyStatus: { ...state.dailyStatus, easyCompleted: true } };
                    } else if (difficulty === 'hard') {
                        updatedStats = { ...updatedStats, dailyStatus: { ...state.dailyStatus, hardCompleted: true } };
                    }
                }
            }

            return {
                ...state,
                gameProgress: {
                    ...state.gameProgress,
                    [difficulty]: {
                        ...progress,
                        guesses: newGuesses,
                        feedback: newFeedback,
                        letterHints: newLetterHints,
                        currentRow: isFinished ? progress.currentRow : progress.currentRow + 1,
                        currentGuess: '',
                        isFinished: isFinished,
                        won: didWin,
                        flippingRowIndex: progress.currentRow, // Trigger flip animation for the submitted row
                        isLosingAnimationActive: !didWin && isFinished, // Trigger losing animation if lost
                    },
                },
                shouldShakeGrid: false,
                errorMessage: null,
                shouldShowWinAnimation: didWin,
                ...updatedStats,
            };
        }
        case 'REVEAL_MAIN_HINT': {
            const difficulty = state.currentDifficulty;
            if (!difficulty || !state.gameProgress[difficulty] || state.gameProgress[difficulty].mainHintRevealed) { return state; } // Added curly braces

            return {
                ...state,
                gameProgress: {
                    ...state.gameProgress,
                    [difficulty]: {
                        ...state.gameProgress[difficulty],
                        mainHintRevealed: true,
                    },
                },
            };
        }
        case 'START_NEW_GAME': { // This action might be dispatched from GameView or a modal
            const difficultyToStart = action.payload?.difficulty || state.preferredDifficulty || 'easy';
            if (!state.targetWords[difficultyToStart]?.word) {
                return { ...state, errorMessage: `Cannot start new ${difficultyToStart} game: Word not loaded.` };
            }
            return {
                ...state,
                currentDifficulty: difficultyToStart,
                gameProgress: {
                    ...state.gameProgress,
                    [difficultyToStart]: {
                        ...createDefaultDifficultyState(),
                        targetWord: state.targetWords[difficultyToStart].word,
                        currentHint: state.targetWords[difficultyToStart].hint,
                        gameStartTime: Date.now(),
                    },
                },
                activeModal: null,
                errorMessage: null,
                shouldShowWinAnimation: false,
                isSubmitting: false,
            };
        }
        case 'GO_HOME':
            return {
                ...state,
                currentDifficulty: null, // Clear current difficulty to show selection screen
                activeModal: null, // Close any modals
                errorMessage: null,
            };
        case 'OPEN_MODAL':
            return { ...state, activeModal: action.payload, errorMessage: null };
        case 'CLOSE_MODAL':
            return { ...state, activeModal: null };
        case 'SET_THEME_PREFERENCE':
            return { ...state, themePreference: action.payload };
        case 'SET_HINTS_ENABLED':
            return { ...state, hintsEnabled: action.payload };
        case 'SET_MUTED_STATE':
            return { ...state, isMuted: action.payload };
        case 'SET_DAILY_REMINDER_ENABLED':
            return { ...state, dailyReminderEnabled: action.payload };
        case 'RESET_USER_DATA':
            // Preserve essential non-resettable data like base data, target words if needed
            return {
                ...initialState, // Reset to initial state
                userId: state.userId, // Keep the same user ID
                isBaseDataLoaded: state.isBaseDataLoaded, // Keep base data loaded status
                targetWords: state.targetWords, // Keep currently fetched words to avoid immediate re-fetch if not desired
                isInitializing: false, // Ensure not stuck in initializing
            };
        case 'SET_ERROR_MESSAGE':
            return { ...state, errorMessage: action.payload, isSubmitting: false };
        case 'CLEAR_ERROR_MESSAGE':
            return { ...state, errorMessage: null };
        case 'SET_SUBMITTING':
            return { ...state, isSubmitting: action.payload };
        case 'SET_FLIPPING_ROW': {
            const difficulty = state.currentDifficulty;
            if (!difficulty) { return state; } // Added curly braces
            return {
                ...state,
                gameProgress: {
                    ...state.gameProgress,
                    [difficulty]: {
                        ...state.gameProgress[difficulty],
                        flippingRowIndex: action.payload,
                    },
                },
            };
        }
        case 'ANIMATION_COMPLETED': {
            const difficulty = state.currentDifficulty;
            if (!difficulty) { return state; } // Added curly braces
            const progress = state.gameProgress[difficulty];
            let nextActiveModal = state.activeModal;
            if (progress.won && progress.flippingRowIndex === action.payload.rowIndex) {
                // Show win modal or confetti after win animation completes
                // This could be a specific modal type or a flag
            } else if (!progress.won && progress.isFinished && progress.flippingRowIndex === action.payload.rowIndex) {
                // Show lose modal or feedback after lose animation completes
            }

            return {
                ...state,
                gameProgress: {
                    ...state.gameProgress,
                    [difficulty]: {
                        ...progress,
                        flippingRowIndex: null, // Reset after animation
                        // Potentially set isLosingAnimationActive to false here if it was a losing row
                    },
                },
                activeModal: nextActiveModal,
            };
        }
        case 'SET_APP_STATE':
            // Optionally, handle app state elsewhere or add to GameState if needed
            return state;
        case 'LOG_ANALYTICS_EVENT':
            return { ...state, lastAnalyticsEvent: action.payload };
        case 'UPDATE_PREFERENCE': { // Generic preference update
            const { key, value } = action.payload;
            if (key in state) {
                return { ...state, [key]: value };
            }
            return state;
        }
        default:
            return state;
    }
};
