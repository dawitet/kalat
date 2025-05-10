// src/types.ts 
export type TileState = 'empty' | 'absent' | 'present' | 'correct' | 'filled';

export type ModalType = 'difficulty' | 'settings' | 'rules' | 'streak' | 'credits' | null;

export type Difficulty = 'easy' | 'hard';

export type ThemePreference = 'system' | 'light' | 'dark';

export enum WordSource {
  Unknown = 'unknown',
  Daily = 'daily',
  Practice = 'practice',
  Backup = 'backup',
}

// Removed duplicate declaration of RootStackParamList.

export interface MobileDifficultyProgress {
  guesses: string[][];
  feedback: TileState[][];
  letterHints: { [key: string]: TileState };
  currentRow: number;
  currentGuess: string;
  isFinished: boolean;
  won: boolean;
  gameStartTime?: number;
  targetWord: string;
  currentHint: string;
  mainHintRevealed?: boolean;
  hintLetters?: string[];
  isLosingAnimationActive?: boolean;
  flippingRowIndex?: number | null;
}

export interface MobileDailyStatus {
  date: string; // YYYY-MM-DD
  hardCompleted: boolean;
  easyCompleted: boolean;
}

export interface DailyChallenge {
  id: string;
  date: string;
  // ...other fields
}

export interface WordData {
  word: string;
  hint: string;
  // ...other fields if needed
}

export interface PersistedData {
  userId: string | null;
  preferredDifficulty: Difficulty;
  themePreference: ThemePreference;
  hintsEnabled: boolean;
  isMuted: boolean;
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string | null;
  lastWinDate: string | null;
  gamesPlayedEasy: number;
  gamesWonEasy: number;
  totalGuessesEasy: number;
  gamesPlayedHard: number;
  gamesWonHard: number;
  totalTimePlayedHard: number;
  bestTimeHard: number | null;
  guessesInBestTimeHardGame: number;
  dailyStatus: MobileDailyStatus;
  wordSourceInfo: {
    easy: { source: WordSource; date: string };
    hard: { source: WordSource; date: string };
  };
  dailyReminderEnabled?: boolean;
  gameProgress?: {
    easy: MobileDifficultyProgress;
    hard: MobileDifficultyProgress;
  };
}

export interface AnalyticsEvent {
  event: string;
  data?: object;
}

// Define RootStackParamList for navigation typings
export type RootStackParamList = {
  MainMenu: undefined;
  Game: { initialDifficulty: Difficulty };
  Leaderboard: undefined;
  Settings: undefined;
  Loading: undefined;
  Rules: undefined;
  Credits: undefined;
  Feedback: undefined;
  Invite: undefined;
  Streaks: undefined;
  Wip: undefined;
};

interface SetTargetWordsAction {
  type: 'SET_TARGET_WORDS';
  payload: { easy: { word: string; hint: string; }; hard: { word: string; hint: string; }; };
}

interface SetDailyStatusAction {
  type: 'SET_DAILY_STATUS';
  payload: MobileDailyStatus;
}

interface SetInitializingAction {
  type: 'SET_INITIALIZING';
  payload: boolean;
}

interface AddLetterAction { type: 'ADD_LETTER'; payload: string; }
interface DeleteLetterAction { type: 'DELETE_LETTER'; }
interface SubmitGuessAction { type: 'SUBMIT_GUESS'; }
interface StartNewGameAction { type: 'START_NEW_GAME'; payload: { difficulty: Difficulty }; }
interface GoHomeAction { type: 'GO_HOME'; }
interface SetUserIdAction { type: 'SET_USER_ID'; payload: string | null; }
interface BaseDataLoadedAction { type: 'BASE_DATA_LOADED'; }
interface LoadUserDataStartAction { type: 'LOAD_USER_DATA_START'; }
interface LoadUserDataSuccessAction { type: 'LOAD_USER_DATA_SUCCESS'; payload: Partial<GameState>; }
interface LoadUserDataFailureAction { type: 'LOAD_USER_DATA_FAILURE'; payload: string; }
interface ResumeGameAction { type: 'RESUME_GAME'; payload: { difficulty: Difficulty }; }
interface ShowSuggestionsAction { type: 'SHOW_SUGGESTIONS'; payload: string[]; }
interface ClearSuggestionsAction { type: 'CLEAR_SUGGESTIONS'; }
interface ClearFlipAnimationAction { type: 'CLEAR_FLIP_ANIMATION'; }
interface TriggerShakeAction { type: 'TRIGGER_SHAKE'; payload?: string; }
interface ClearShakeAnimationAction { type: 'CLEAR_SHAKE_ANIMATION'; }
interface ShowWinAnimationAction { type: 'SHOW_WIN_ANIMATION'; }
interface HideWinAnimationAction { type: 'HIDE_WIN_ANIMATION'; }
interface UpdatePreferenceAction { type: 'UPDATE_PREFERENCE'; payload: { key: keyof GameState; value: any }; }
interface SaveUserDataStartAction { type: 'SAVE_USER_DATA_START'; }
interface SaveUserDataSuccessAction { type: 'SAVE_USER_DATA_SUCCESS'; }
interface SaveUserDataFailureAction { type: 'SAVE_USER_DATA_FAILURE'; payload: { error: string }; }
interface ResetUserDataStartAction { type: 'RESET_USER_DATA_START'; }
interface ResetUserDataSuccessAction { type: 'RESET_USER_DATA_SUCCESS'; }
interface ResetUserDataFailureAction { type: 'RESET_USER_DATA_FAILURE'; payload: string; }
interface ShowModalAction { type: 'SHOW_MODAL'; payload: ModalType; }
interface CloseModalAction { type: 'CLOSE_MODAL'; }
interface SetErrorAction { type: 'SET_ERROR'; payload: string | null; }
interface RevealMainHintAction { type: 'REVEAL_MAIN_HINT'; }
interface SetCurrentDifficultyAction { type: 'SET_CURRENT_DIFFICULTY'; payload: Difficulty; }
interface LogAnalyticsEventAction { type: 'LOG_ANALYTICS_EVENT'; payload: { event: string; data?: object } }
interface ClearAnalyticsEventAction { type: 'CLEAR_ANALYTICS_EVENT' }
interface SetDailyReminderEnabledAction { type: 'SET_DAILY_REMINDER_ENABLED'; payload: boolean }
interface LoadPersistedDataAction {
  type: 'LOAD_PERSISTED_DATA';
  payload: PersistedData;
}
interface InitializeGameAction {
  type: 'INITIALIZE_GAME';
}
interface OpenModalAction {
  type: 'OPEN_MODAL';
  payload: ModalType;
}
interface SetThemePreferenceAction {
  type: 'SET_THEME_PREFERENCE';
  payload: ThemePreference;
}
interface SetHintsEnabledAction {
  type: 'SET_HINTS_ENABLED';
  payload: boolean;
}
interface SetMutedStateAction {
  type: 'SET_MUTED_STATE';
  payload: boolean;
}
interface ResetUserDataAction {
  type: 'RESET_USER_DATA';
}
interface SetErrorMessageAction {
  type: 'SET_ERROR_MESSAGE';
  payload: string;
}
interface ClearErrorMessageAction {
  type: 'CLEAR_ERROR_MESSAGE';
}
interface SetSubmittingAction {
  type: 'SET_SUBMITTING';
  payload: boolean;
}
interface SetFlippingRowAction {
  type: 'SET_FLIPPING_ROW';
  payload: number;
}
interface AnimationCompletedAction {
  type: 'ANIMATION_COMPLETED';
  payload: { rowIndex: number };
}
interface SetAppStateAction {
  type: 'SET_APP_STATE';
  payload: any;
}

export type GameAction =
  | SetTargetWordsAction
  | SetDailyStatusAction
  | SetInitializingAction
  | AddLetterAction
  | DeleteLetterAction
  | SubmitGuessAction
  | StartNewGameAction
  | GoHomeAction
  | SetUserIdAction
  | BaseDataLoadedAction
  | LoadUserDataStartAction
  | LoadUserDataSuccessAction
  | LoadUserDataFailureAction
  | ResumeGameAction
  | ShowSuggestionsAction
  | ClearSuggestionsAction
  | ClearFlipAnimationAction
  | TriggerShakeAction
  | ClearShakeAnimationAction
  | ShowWinAnimationAction
  | HideWinAnimationAction
  | UpdatePreferenceAction
  | SaveUserDataStartAction
  | SaveUserDataSuccessAction
  | SaveUserDataFailureAction
  | ResetUserDataStartAction
  | ResetUserDataSuccessAction
  | ResetUserDataFailureAction
  | ShowModalAction
  | CloseModalAction
  | SetErrorAction
  | RevealMainHintAction
  | SetCurrentDifficultyAction
  | LogAnalyticsEventAction
  | ClearAnalyticsEventAction
  | SetDailyReminderEnabledAction
  | LoadPersistedDataAction
  | InitializeGameAction
  | OpenModalAction
  | SetThemePreferenceAction
  | SetHintsEnabledAction
  | SetMutedStateAction
  | ResetUserDataAction
  | SetErrorMessageAction
  | ClearErrorMessageAction
  | SetSubmittingAction
  | SetFlippingRowAction
  | AnimationCompletedAction
  | SetAppStateAction;

export interface GameState {
  isInitializing: boolean;
  userId: string | null;
  isBaseDataLoaded: boolean;
  isUserDataLoading: boolean;
  isUserDataSaving: boolean;
  isUserDataResetting: boolean;
  targetWords: {
    easy: { word: string; hint: string };
    hard: { word: string; hint: string };
  };
  currentDifficulty: Difficulty | null;
  gameProgress: {
    easy: MobileDifficultyProgress;
    hard: MobileDifficultyProgress;
  };
  activeModal: ModalType | null;
  errorMessage: string | null;
  shouldShakeGrid: boolean;
  isSubmitting: boolean;
  activeSuggestionFamily: string[] | null;
  shouldShowWinAnimation: boolean;
  preferredDifficulty: Difficulty;
  themePreference: ThemePreference;
  hintsEnabled: boolean;
  isMuted: boolean;
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string | null;
  lastWinDate: string | null;
  gamesPlayedEasy: number;
  gamesWonEasy: number;
  totalGuessesEasy: number;
  gamesPlayedHard: number;
  gamesWonHard: number;
  totalTimePlayedHard: number;
  bestTimeHard: number | null;
  guessesInBestTimeHardGame: number;
  dailyStatus: MobileDailyStatus;
  wordSourceInfo: {
    easy: { source: WordSource; date: string };
    hard: { source: WordSource; date: string };
  };
  hapticType?: 'success' | 'error' | 'light' | null;
  accessibilityAnnouncement?: string | null;
  lastAnalyticsEvent?: { event: string; data?: object };
  dailyReminderEnabled?: boolean;
}

export interface GameContextType {
  gameState: GameState;
  dispatch: React.Dispatch<GameAction>;
}
