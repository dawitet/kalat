import React, {
  createContext,
  useReducer,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import {AppState, AppStateStatus, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DailyChallenge,
  WordData,
  PersistedData,
  AnalyticsEvent,
  GameContextType,
  GameActionType,
  UIAction,
  GameState,
} from '../types';
import {rootReducer} from './reducers/rootReducer';
import {initialState} from './initialState';
import {API_BASE_URL} from '../game-state';
import {getDateString} from '../core/utils/calendar';
import * as Notifications from 'expo-notifications';

export const GameContext = createContext<GameContextType | undefined>(
  undefined,
);

export const GameProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [gameState, dispatch] = useReducer(rootReducer, initialState as GameState);
  const {
    userId,
    dailyStatus,
    lastPlayedDate,
    lastAnalyticsEvent,
    dailyReminderEnabled,
  } = gameState;

  // Initial Data Loading Effect
  useEffect(() => {
    const loadPersistedData = async () => {
      dispatch({type: 'SET_INITIALIZING', payload: true});
      try {
        const storedData = await AsyncStorage.getItem('kalatoch_user_data_v4');
        if (storedData) {
          const parsedData: PersistedData = JSON.parse(storedData);
          dispatch({type: 'LOAD_PERSISTED_DATA', payload: parsedData} as UIAction | GameActionType);
        } else {
          const newUserId = `kalatUser_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 7)}`;
          dispatch({type: 'SET_USER_ID', payload: newUserId});
          await AsyncStorage.setItem(
            'kalatoch_user_data_v4',
            JSON.stringify({...initialState, userId: newUserId}),
          );
        }
      } catch (error) {
        console.error('Failed to load persisted data:', error);
        if (!userId) {
          const newUserId = `kalatUser_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 7)}`;
          dispatch({type: 'SET_USER_ID', payload: newUserId});
        }
      }

      try {
        const response = await fetch(`${API_BASE_URL}/base-data`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const baseData = await response.json();
        dispatch({type: 'BASE_DATA_LOADED', payload: baseData} as GameActionType);
      } catch (error) {
        console.error('Failed to fetch base data:', error);
        dispatch({
          type: 'SET_ERROR_MESSAGE',
          payload:
            'Failed to load essential game data. Please check your connection.',
        } as GameActionType);
      }
      dispatch({type: 'SET_INITIALIZING', payload: false});
    };
    loadPersistedData();
  }, [dispatch, userId]);

  // Daily Word Fetching & Status Update Effect
  useEffect(() => {
    const today = getDateString(new Date());
    const needsDailyUpdate = !dailyStatus || dailyStatus.date !== today;
    const easyWordMissing = !gameState.targetWords.easy.word;
    const hardWordMissing = !gameState.targetWords.hard.word;

    const fetchDailyWords = async () => {
      if (!userId) {
        return;
      }
      dispatch({type: 'SET_USER_DATA_LOADING', payload: true});
      try {
        const response = await fetch(
          `${API_BASE_URL}/daily-words?userId=${userId}&date=${today}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: {
          easy: WordData;
          hard: WordData;
          dailyChallenge?: DailyChallenge;
        } = await response.json();
        dispatch({
          type: 'SET_TARGET_WORDS',
          payload: {easy: data.easy, hard: data.hard},
        });
        if (data.dailyChallenge) {
          dispatch({
            type: 'SET_DAILY_CHALLENGE_INFO',
            payload: data.dailyChallenge,
          });
        }
        if (needsDailyUpdate) {
          dispatch({
            type: 'SET_DAILY_STATUS',
            payload: {date: today, easyCompleted: false, hardCompleted: false},
          });
        }
      } catch (error) {
        console.error('Failed to fetch daily words:', error);
        dispatch({
          type: 'SET_ERROR_MESSAGE',
          payload: (error as Error).message || 'Could not fetch daily words.',
        } as GameActionType);
      }
      dispatch({type: 'SET_USER_DATA_LOADING', payload: false});
    };

    if (userId && (needsDailyUpdate || easyWordMissing || hardWordMissing)) {
      fetchDailyWords();
    }
  }, [
    userId,
    dailyStatus,
    gameState.targetWords.easy.word,
    gameState.targetWords.hard.word,
    dispatch,
  ]);

  // User Data Persistence Effect
  useEffect(() => {
    const persistData = async () => {
      if (gameState.isInitializing || gameState.isUserDataLoading) {
        return;
      }

      const dataToPersist: PersistedData = {
        userId: userId,
        preferredDifficulty: gameState.preferredDifficulty,
        themePreference: gameState.themePreference || 'system', // Provide default
        hintsEnabled: gameState.hintsEnabled !== undefined ? gameState.hintsEnabled : true, // Provide default
        isMuted: gameState.isMuted !== undefined ? gameState.isMuted : false, // Provide default
        gamesPlayed: gameState.gamesPlayed,
        gamesWon: gameState.gamesWon,
        currentStreak: gameState.currentStreak,
        maxStreak: gameState.maxStreak,
        lastPlayedDate: gameState.lastPlayedDate,
        lastWinDate: gameState.lastWinDate,
        gamesPlayedEasy: gameState.gamesPlayedEasy,
        gamesWonEasy: gameState.gamesWonEasy,
        totalGuessesEasy: gameState.totalGuessesEasy,
        gamesPlayedHard: gameState.gamesPlayedHard,
        gamesWonHard: gameState.gamesWonHard,
        totalTimePlayedHard: gameState.totalTimePlayedHard,
        bestTimeHard: gameState.bestTimeHard,
        guessesInBestTimeHardGame: gameState.guessesInBestTimeHardGame,
        dailyStatus: gameState.dailyStatus,
        wordSourceInfo: gameState.wordSourceInfo,
        dailyReminderEnabled: gameState.dailyReminderEnabled,
      };
      try {
        dispatch({type: 'SET_USER_DATA_SAVING', payload: true});
        await AsyncStorage.setItem(
          'kalatoch_user_data_v4',
          JSON.stringify(dataToPersist),
        );
        dispatch({type: 'SET_USER_DATA_SAVING', payload: false});
      } catch (error) {
        console.error('Failed to save user data:', error);
        dispatch({type: 'SET_USER_DATA_SAVING', payload: false});
        dispatch({
          type: 'SET_ERROR_MESSAGE',
          payload: 'Could not save your progress.',
        } as GameActionType);
      }
    };

    if (userId) {
      persistData();
    }
  }, [
    userId,
    gameState.preferredDifficulty,
    gameState.themePreference,
    gameState.hintsEnabled,
    gameState.isMuted,
    gameState.gamesPlayed,
    gameState.gamesWon,
    gameState.currentStreak,
    gameState.maxStreak,
    gameState.lastPlayedDate,
    gameState.lastWinDate,
    gameState.gamesPlayedEasy,
    gameState.gamesWonEasy,
    gameState.totalGuessesEasy,
    gameState.gamesPlayedHard,
    gameState.gamesWonHard,
    gameState.totalTimePlayedHard,
    gameState.bestTimeHard,
    gameState.guessesInBestTimeHardGame,
    gameState.dailyStatus,
    gameState.wordSourceInfo,
    gameState.dailyReminderEnabled,
    gameState.isInitializing,
    gameState.isUserDataLoading,
    dispatch,
  ]);

  // App State Change Handler
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      dispatch({type: 'SET_APP_STATE', payload: nextAppState});
    };
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, [lastPlayedDate, dispatch]);

  const logAnalyticsEvent = useCallback(
    (event: AnalyticsEvent) => {
      if (lastAnalyticsEvent && lastAnalyticsEvent.event === event.event) {
        return;
      }
      console.log('Analytics Event:', event.event, event.data);
      dispatch({type: 'LOG_ANALYTICS_EVENT', payload: event});
    },
    [lastAnalyticsEvent, dispatch],
  );

  // Daily Reminder Notification Effect
  useEffect(() => {
    const scheduleDailyReminder = async () => {
      if (Platform.OS === 'web') {
        return;
      }
      const {status} = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'ቃላት ይጫወቱ!',
          body: 'የዛሬው የቃላት ጨዋታ ይጠብቅዎታል!',
          sound: true,
        },
        trigger: {
          hour: 8,
          minute: 0,
          repeats: true,
        },
      });
    };

    const cancelReminders = async () => {
      if (Platform.OS === 'web') {
        return;
      }
      await Notifications.cancelAllScheduledNotificationsAsync();
    };

    if (dailyReminderEnabled) {
      scheduleDailyReminder();
    } else {
      cancelReminders();
    }
  }, [dailyReminderEnabled]);

  const contextValue = useMemo(
    () => ({
      gameState,
      dispatch: dispatch as React.Dispatch<GameActionType | UIAction>,
      logAnalyticsEvent,
    }),
    [gameState, dispatch, logAnalyticsEvent],
  );

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
