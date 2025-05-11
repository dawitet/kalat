// src/__tests__/reducer.test.ts
import {gameReducer} from '../context/reducer';
import {initialState} from '../context/initialState';
import {Difficulty} from '../types';

describe('Game Reducer', () => {
  test('should handle ADD_LETTER action', () => {
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

    const action = {type: 'ADD_LETTER', payload: 'l'};
    const newState = gameReducer(state, action);

    expect(newState.gameProgress.easy.currentGuess).toBe('hell');
  });

  test('should handle DELETE_LETTER action', () => {
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

    const action = {type: 'DELETE_LETTER'};
    const newState = gameReducer(state, action);

    expect(newState.gameProgress.easy.currentGuess).toBe('hel');
  });

  test('should handle SET_CURRENT_DIFFICULTY action', () => {
    const state = {
      ...initialState,
      currentDifficulty: 'easy' as Difficulty,
    };

    const action = {
      type: 'SET_CURRENT_DIFFICULTY',
      payload: 'hard' as Difficulty,
    };
    const newState = gameReducer(state, action);

    expect(newState.currentDifficulty).toBe('hard');
  });

  test('should handle SET_ACTIVE_MODAL action', () => {
    const state = {
      ...initialState,
      activeModal: null,
    };

    const action = {type: 'SET_ACTIVE_MODAL', payload: 'settings'};
    const newState = gameReducer(state, action);

    expect(newState.activeModal).toBe('settings');
  });

  // Add more tests for other actions
});

// Example of how to use memoization for performance
describe('Memoization examples', () => {
  test('Memoization pattern example', () => {
    // This is just a demonstration, not an actual test
    const memoizedFn = (fn: Function, dependencies: any[]) => {
      let lastArgs: any[] = [];
      let lastResult: any;

      return (...args: any[]) => {
        const argsChanged = args.some((arg, i) => arg !== lastArgs[i]);
        const depsChanged = dependencies.some(
          (dep, i) => dep !== lastDependencies[i],
        );

        if (argsChanged || depsChanged) {
          lastResult = fn(...args);
          lastArgs = args;
          lastDependencies = dependencies;
        }

        return lastResult;
      };
    };

    // This would be actual code in your application
    let lastDependencies: any[] = [];
    const calculateExpensiveValue = (a: number, b: number) => a + b;
    const memoizedCalculate = memoizedFn(calculateExpensiveValue, []);

    expect(memoizedCalculate(1, 2)).toBe(3);
    expect(memoizedCalculate(1, 2)).toBe(3); // Should use cached result
  });
});
