// src/__tests__/reducer.test.ts
import {rootReducer} from '../context/reducers/rootReducer';
import {initialState} from '../context/initialState';
import {
  Difficulty,
  ThemePreference,
  ModalType,
} from '../types';

// First, let's create some helper functions for test actions that match
// what the rootReducer expects exactly
const createAddLetterAction = (letter: string) => ({
  type: 'ADD_LETTER' as const,
  payload: letter,
});

const createDeleteLetterAction = () => ({
  type: 'DELETE_LETTER' as const,
});

const createSetCurrentDifficultyAction = (difficulty: Difficulty | null) => ({
  type: 'SET_CURRENT_DIFFICULTY' as const,
  payload: difficulty,
});

const createSetActiveModalAction = (modalType: ModalType) => ({
  type: 'SET_ACTIVE_MODAL' as const,
  payload: modalType,
});

const createSetThemePreferenceAction = (theme: ThemePreference) => ({
  type: 'SET_THEME_PREFERENCE' as const,
  payload: theme,
});

const createSetShakeGridAction = (shake: boolean) => ({
  type: 'SET_SHAKE_GRID' as const,
  payload: shake,
});

describe('Root Reducer', () => {
  test('should handle ADD_LETTER action (game logic)', () => {
    const state = {
      ...initialState,
      currentDifficulty: 'easy' as Difficulty,
      gameProgress: {
        ...initialState.gameProgress,
        easy: {
          ...initialState.gameProgress.easy,
          currentGuess: 'hel',
        },
      },
    };

    const action = createAddLetterAction('l');
    const newState = rootReducer(state, action);

    expect(newState.gameProgress.easy.currentGuess).toBe('hell');
  });

  test('should handle DELETE_LETTER action (game logic)', () => {
    const state = {
      ...initialState,
      currentDifficulty: 'easy' as Difficulty,
      gameProgress: {
        ...initialState.gameProgress,
        easy: {
          ...initialState.gameProgress.easy,
          currentGuess: 'hell',
        },
      },
    };

    const action = createDeleteLetterAction();
    const newState = rootReducer(state, action);

    expect(newState.gameProgress.easy.currentGuess).toBe('hel');
  });

  test('should handle SET_CURRENT_DIFFICULTY action (game logic)', () => {
    const state = {
      ...initialState,
      currentDifficulty: 'easy' as Difficulty,
    };

    const action = createSetCurrentDifficultyAction('hard' as Difficulty);
    const newState = rootReducer(state, action);

    expect(newState.currentDifficulty).toBe('hard');
  });

  test('should handle SET_ACTIVE_MODAL action (UI state)', () => {
    const state = {
      ...initialState,
      activeModal: null,
    };

    const action = createSetActiveModalAction('settings');
    const newState = rootReducer(state, action);

    expect(newState.activeModal).toBe('settings');
  });

  test('should handle SET_THEME_PREFERENCE action (UI state)', () => {
    const state = {
      ...initialState,
      themePreference: 'light' as ThemePreference,
    };

    const action = createSetThemePreferenceAction('dark' as ThemePreference);
    const newState = rootReducer(state, action);

    expect(newState.themePreference).toBe('dark');
  });

  test('should handle SET_SHAKE_GRID action (UI state)', () => {
    const state = {
      ...initialState,
      shouldShakeGrid: false,
    };

    const action = createSetShakeGridAction(true);
    const newState = rootReducer(state, action);

    expect(newState.shouldShakeGrid).toBe(true);
  });

  // Add more tests for combined state updates
  test('should combine UI and game logic state updates properly', () => {
    let state = initialState;

    // Update game logic state
    state = rootReducer(state, createSetCurrentDifficultyAction('hard' as Difficulty));
    expect(state.currentDifficulty).toBe('hard');

    // Update UI state
    state = rootReducer(state, createSetActiveModalAction('settings'));
    expect(state.activeModal).toBe('settings');

    // Ensure both parts of state are preserved
    expect(state.currentDifficulty).toBe('hard'); // Game logic state preserved
    expect(state.activeModal).toBe('settings');   // UI state preserved
  });
});

// Example of how to use memoization for performance
describe('Memoization examples', () => {
  test('Memoization pattern example', () => {
    // This is just a demonstration, not an actual test
    const memoizedFn = <T extends unknown[], R>(fn: (...args: T) => R, dependencies: unknown[]) => {
      let lastArgs: T = [] as unknown as T;
      let lastResult: R;
      let lastDependencies: unknown[] = [];
      let hasResult = false;

      return (...args: T): R => {
        const argsChanged = args.some((arg, i) => arg !== lastArgs[i]);
        const depsChanged = dependencies.some(
          (dep, i) => dep !== lastDependencies[i],
        );

        if (argsChanged || depsChanged || !hasResult) {
          lastResult = fn(...args);
          lastArgs = [...args] as T;
          lastDependencies = [...dependencies];
          hasResult = true;
        }

        return lastResult;
      };
    };

    // This would be actual code in your application
    const calculateExpensiveValue = (a: number, b: number) => a + b;
    const memoizedCalculate = memoizedFn(calculateExpensiveValue, []);

    expect(memoizedCalculate(1, 2)).toBe(3);
    expect(memoizedCalculate(1, 2)).toBe(3); // Should use cached result
  });
});
