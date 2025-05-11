// src/types.ts
export type TileState = 'empty' | 'absent' | 'present' | 'correct' | 'filled';

export type ModalType =
  | 'difficulty'
  | 'settings'
  | 'rules'
  | 'streak'
  | 'credits'
  | null;

export type Difficulty = 'easy' | 'hard';

export type ThemePreference = 'system' | 'light' | 'dark';

export enum WordSource {
  Unknown = 'unknown',
  Daily = 'daily',
  Practice = 'practice',
  Backup = 'backup',
}

// UI State interface for uiReducer
export interface UIState {
  activeModal: ModalType | null;
  errorMessage?: string | null;
  shouldShakeGrid?: boolean;
  shouldShowWinAnimation?: boolean;
  activeSuggestionFamily?: string[] | null; // Changed from string | null
  flippingRowIndex?: number | null; // This is the UI-specific flipping row
  themePreference?: ThemePreference;
  hintsEnabled?: boolean;
  isMuted?: boolean;
}

// Represents the state managed by the gameLogicReducer
export interface GameLogicState {
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
  preferredDifficulty: Difficulty;
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
  isSubmitting: boolean;
}

// GameState is the combination of GameLogicState and UIState
export interface GameState extends GameLogicState, UIState {
  flippingRowIndex?: number | null; // Ensuring GameState has this, as UIState does.
}

// UI Action interface for uiReducer
export type UIAction =
  | { type: 'SET_ACTIVE_MODAL'; payload: ModalType | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_THEME_PREFERENCE'; payload: ThemePreference }
  | { type: 'SET_SHAKE_GRID'; payload: boolean }
  | { type: 'SET_SHOW_WIN_ANIMATION'; payload: boolean }
  | { type: 'SET_ACTIVE_SUGGESTION_FAMILY'; payload: string[] | null }
  | { type: 'SET_ACTIVE_SUGGESTION'; payload: string[] | null }
  | { type: 'SET_HINTS_ENABLED'; payload: boolean }
  | { type: 'SET_MUTED'; payload: boolean }
  | { type: 'SET_FLIPPING_ROW'; payload: number | null }
  | { type: 'LOAD_PERSISTED_DATA'; payload: any };

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

export interface SetTargetWordsAction {
  type: 'SET_TARGET_WORDS';
  payload: {
    easy: { word: string; hint: string };
    hard: { word: string; hint: string };
  };
}

export interface SetDailyStatusAction {
  type: 'SET_DAILY_STATUS';
  payload: MobileDailyStatus;
}

export interface SetInitializingAction {
  type: 'SET_INITIALIZING';
  payload: boolean;
}

export interface AddLetterAction {
  type: 'ADD_LETTER';
  payload: string;
}

export interface DeleteLetterAction {
  type: 'DELETE_LETTER';
}

export interface SubmitGuessAction {
  type: 'SUBMIT_GUESS';
}

export interface StartNewGameAction {
  type: 'START_NEW_GAME';
  payload: { difficulty: Difficulty };
}

export interface GoHomeAction {
  type: 'GO_HOME';
}

export interface SetUserIdAction {
  type: 'SET_USER_ID';
  payload: string | null;
}

export interface BaseDataLoadedAction {
  type: 'BASE_DATA_LOADED';
}

export interface LoadUserDataStartAction {
  type: 'LOAD_USER_DATA_START';
}

export interface LoadUserDataSuccessAction {
  type: 'LOAD_USER_DATA_SUCCESS';
  payload: Partial<GameState>;
}

export interface LoadUserDataFailureAction {
  type: 'LOAD_USER_DATA_FAILURE';
  payload: string;
}

export interface ResumeGameAction {
  type: 'RESUME_GAME';
  payload: { difficulty: Difficulty };
}

export interface ShowSuggestionsAction {
  type: 'SHOW_SUGGESTIONS';
  payload: string[];
}

export interface ClearSuggestionsAction {
  type: 'CLEAR_SUGGESTIONS';
}

export interface ClearFlipAnimationAction {
  type: 'CLEAR_FLIP_ANIMATION';
}

export interface TriggerShakeAction {
  type: 'TRIGGER_SHAKE';
  payload?: string;
}

export interface ClearShakeAnimationAction {
  type: 'CLEAR_SHAKE_ANIMATION';
}

export interface ShowWinAnimationAction {
  type: 'SHOW_WIN_ANIMATION';
}

export interface HideWinAnimationAction {
  type: 'HIDE_WIN_ANIMATION';
}

export interface UpdatePreferenceAction {
  type: 'UPDATE_PREFERENCE';
  payload: { key: keyof GameState; value: any };
}

export interface SaveUserDataStartAction {
  type: 'SAVE_USER_DATA_START';
}

export interface SaveUserDataSuccessAction {
  type: 'SAVE_USER_DATA_SUCCESS';
}

export interface SaveUserDataFailureAction {
  type: 'SAVE_USER_DATA_FAILURE';
  payload: { error: string };
}

export interface ResetUserDataStartAction {
  type: 'RESET_USER_DATA_START';
}

export interface ResetUserDataSuccessAction {
  type: 'RESET_USER_DATA_SUCCESS';
}

export interface ResetUserDataFailureAction {
  type: 'RESET_USER_DATA_FAILURE';
  payload: string;
}

export interface ShowModalAction {
  type: 'SHOW_MODAL';
  payload: ModalType;
}

export interface CloseModalAction {
  type: 'CLOSE_MODAL';
}

export interface SetErrorAction {
  type: 'SET_ERROR';
  payload: string | null;
}

export interface RevealMainHintAction {
  type: 'REVEAL_MAIN_HINT';
}

export interface SetCurrentDifficultyAction {
  type: 'SET_CURRENT_DIFFICULTY';
  payload: Difficulty | null;
}

export interface LogAnalyticsEventAction {
  type: 'LOG_ANALYTICS_EVENT';
  payload: { event: string; data?: object };
}

export interface ClearAnalyticsEventAction {
  type: 'CLEAR_ANALYTICS_EVENT';
}

export interface SetDailyReminderEnabledAction {
  type: 'SET_DAILY_REMINDER_ENABLED';
  payload: boolean;
}

export interface LoadPersistedDataAction {
  type: 'LOAD_PERSISTED_DATA';
  payload: PersistedData;
}

export interface InitializeGameAction {
  type: 'INITIALIZE_GAME';
}

export interface OpenModalAction {
  type: 'OPEN_MODAL';
  payload: ModalType;
}

export interface SetThemePreferenceAction {
  type: 'SET_THEME_PREFERENCE';
  payload: ThemePreference;
}

export interface SetHintsEnabledAction {
  type: 'SET_HINTS_ENABLED';
  payload: boolean;
}

export interface SetMutedStateAction {
  type: 'SET_MUTED_STATE';
  payload: boolean;
}

export interface ResetUserDataAction {
  type: 'RESET_USER_DATA';
}

export interface SetErrorMessageAction {
  type: 'SET_ERROR_MESSAGE';
  payload: string;
}

export interface ClearErrorMessageAction {
  type: 'CLEAR_ERROR_MESSAGE';
}

export interface SetSubmittingAction {
  type: 'SET_SUBMITTING';
  payload: boolean;
}

export interface SetFlippingRowAction {
  type: 'SET_FLIPPING_ROW';
  payload: number | null;
}

export interface AnimationCompletedAction {
  type: 'ANIMATION_COMPLETED';
  payload: { rowIndex: number };
}

export interface SetAppStateAction {
  type: 'SET_APP_STATE';
  payload: any;
}

// Added for provider.tsx
export interface SetUserDataLoadingAction {
  type: 'SET_USER_DATA_LOADING';
  payload: boolean;
}

export interface SetUserDataSavingAction {
  type: 'SET_USER_DATA_SAVING';
  payload: boolean;
}

export interface SetDailyChallengeInfoAction {
  type: 'SET_DAILY_CHALLENGE_INFO';
  payload: DailyChallenge; // Assuming DailyChallenge is the correct type
}
// End added for provider.tsx

// Need to add missing types used in actions.ts
export interface AddLetterInputAction {
  type: 'ADD_LETTER';
  payload: string;
}

export interface DeleteLetterInputAction {
  type: 'DELETE_LETTER';
}

export interface SubmitGuessInputAction {
  type: 'SUBMIT_GUESS';
}

export interface SetLetterFeedbackAction {
  type: 'SET_LETTER_FEEDBACK';
  payload: { rowIndex: number; feedback: TileState[] };
}

export interface SetShakeGridAction {
  type: 'SET_SHAKE_GRID';
  payload: boolean;
}

export interface SetShowWinAnimationAction {
  type: 'SET_SHOW_WIN_ANIMATION';
  payload: boolean;
}

export interface SetLosingAnimationAction {
  type: 'SET_LOSING_ANIMATION';
  payload: boolean;
}

export interface RevealHintAction {
  type: 'REVEAL_HINT';
  payload: boolean;
}

export interface SetHintLetterAction {
  type: 'SET_HINT_LETTER';
  payload: string;
}

export type GameActionType =
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
  | SetCurrentDifficultyAction
  | InitializeGameAction
  | SetSubmittingAction
  | AnimationCompletedAction
  | RevealMainHintAction
  | UpdatePreferenceAction
  | ResetUserDataAction
  | SetUserDataLoadingAction
  | SetUserDataSavingAction
  | SetDailyReminderEnabledAction
  | SetDailyChallengeInfoAction
  | SetErrorMessageAction
  | ShowModalAction
  | SetMutedStateAction
  | LoadPersistedDataAction
  | OpenModalAction
  | CloseModalAction
  | SetThemePreferenceAction
  | SetHintsEnabledAction
  | ClearErrorMessageAction
  | SetFlippingRowAction
  | SetAppStateAction
  | LogAnalyticsEventAction
  | SetAppStateAction
  | LogAnalyticsEventAction;

export interface GameContextType {
  gameState: GameState;
  dispatch: React.Dispatch<GameActionType | UIAction>; // Updated dispatch type
}
