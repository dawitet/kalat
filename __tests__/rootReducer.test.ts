// src/__tests__/rootReducer.test.ts
import {rootReducer} from '../context/reducers/rootReducer';
import {initialState} from '../context/initialState';
import {actionCreators as actions} from '../context/actions';
import {Difficulty, TileState, GameActionType, UIAction} from '../types';

describe('rootReducer', () => {
  it('should handle UI actions correctly', () => {
    // Test SET_ACTIVE_MODAL
    const modalAction = actions.setActiveModal('settings') as UIAction;
    const modalState = rootReducer(initialState, modalAction);
    expect(modalState.activeModal).toBe('settings');

    // Test SET_THEME_PREFERENCE
    const themeAction = actions.setThemePreference('dark') as UIAction;
    const themeState = rootReducer(initialState, themeAction);
    expect(themeState.themePreference).toBe('dark');

    // Test SET_ERROR
    const errorAction = actions.setError('Test error message') as UIAction;
    const errorState = rootReducer(initialState, errorAction);
    expect(errorState.errorMessage).toBe('Test error message');

    // Test SET_ACTIVE_SUGGESTION_FAMILY
    const suggestionAction = actions.setActiveSuggestionFamily(['test']) as UIAction;
    const suggestionState = rootReducer(initialState, suggestionAction);
    expect(suggestionState.activeSuggestionFamily).toEqual(['test']);
  });

  it('should handle game logic actions correctly', () => {
    // Setup initial game state with selected difficulty
    let gameState = initialState;
    const difficultyAction = actions.setCurrentDifficulty('easy' as Difficulty) as GameActionType;
    gameState = rootReducer(gameState, difficultyAction);
    expect(gameState.currentDifficulty).toBe('easy');

    // Initialize game with target words
    const targetWordsAction = actions.setTargetWords({
      easy: {word: 'test', hint: 'A unit test'},
      hard: {word: 'hard', hint: 'Difficult'},
    }) as GameActionType;
    gameState = rootReducer(gameState, targetWordsAction);
    expect(gameState.targetWords.easy.word).toBe('test');

    // Initialize game
    const initAction = actions.initializeGame() as GameActionType;
    gameState = rootReducer(gameState, initAction);
    expect(gameState.gameProgress.easy.targetWord).toBe('test');
    expect(gameState.gameProgress.easy.currentHint).toBe('A unit test');

    // Add letters to current guess
    const addT = actions.addLetter('t') as GameActionType;
    gameState = rootReducer(gameState, addT);
    const addE = actions.addLetter('e') as GameActionType;
    gameState = rootReducer(gameState, addE);
    const addS = actions.addLetter('s') as GameActionType;
    gameState = rootReducer(gameState, addS);
    const addT2 = actions.addLetter('t') as GameActionType;
    gameState = rootReducer(gameState, addT2);

    expect(gameState.gameProgress.easy.currentGuess).toBe('test');

    // Submit guess
    const submitAction = actions.submitGuess() as GameActionType;
    gameState = rootReducer(gameState, submitAction);

    // Expect the guess to be correct and game to be won
    expect(gameState.gameProgress.easy.isFinished).toBe(true);
    expect(gameState.gameProgress.easy.won).toBe(true);
    expect(gameState.gameProgress.easy.guesses[0]).toEqual([
      't',
      'e',
      's',
      't',
    ]);
    expect(gameState.gameProgress.easy.feedback[0]).toEqual([
      'correct',
      'correct',
      'correct',
      'correct',
    ] as TileState[]);
  });

  it('should handle combined state updates correctly', () => {
    let state = initialState;

    // Set up the game
    state = rootReducer(
      state,
      actions.setCurrentDifficulty('hard' as Difficulty) as GameActionType,
    );
    state = rootReducer(
      state,
      actions.setTargetWords({
        easy: {word: 'easy', hint: 'Simple'},
        hard: {word: 'hard', hint: 'Difficult'},
      }) as GameActionType,
    );
    state = rootReducer(state, actions.initializeGame() as GameActionType);

    // Make an incorrect guess
    state = rootReducer(state, actions.addLetter('e') as GameActionType);
    state = rootReducer(state, actions.addLetter('a') as GameActionType);
    state = rootReducer(state, actions.addLetter('s') as GameActionType);
    state = rootReducer(state, actions.addLetter('y') as GameActionType);
    state = rootReducer(state, actions.submitGuess() as GameActionType);

    // Check game logic state
    expect(state.gameProgress.hard.currentRow).toBe(1); // Moved to next row
    expect(state.gameProgress.hard.isFinished).toBe(false); // Game not finished

    // Now trigger UI action while game is in progress
    state = rootReducer(state, actions.setActiveModal('rules') as UIAction);
    expect(state.activeModal).toBe('rules');

    // Verify game state is maintained
    expect(state.gameProgress.hard.guesses[0]).toEqual(['e', 'a', 's', 'y']);
    expect(state.currentDifficulty).toBe('hard');

    // Close modal and continue game
    state = rootReducer(state, actions.setActiveModal(null) as UIAction);
    expect(state.activeModal).toBe(null);

    // Make correct guess
    state = rootReducer(state, actions.addLetter('h') as GameActionType);
    state = rootReducer(state, actions.addLetter('a') as GameActionType);
    state = rootReducer(state, actions.addLetter('r') as GameActionType);
    state = rootReducer(state, actions.addLetter('d') as GameActionType);
    state = rootReducer(state, actions.submitGuess() as GameActionType);

    // Verify game won
    expect(state.gameProgress.hard.isFinished).toBe(true);
    expect(state.gameProgress.hard.won).toBe(true);

    // Show win animation (UI action)
    state = rootReducer(state, actions.setShowWinAnimation(true) as unknown as GameActionType | UIAction);
    expect(state.shouldShowWinAnimation).toBe(true);

    // Verify final state has both game logic and UI state updated
    expect(state.gameProgress.hard.won).toBe(true);
    expect(state.shouldShowWinAnimation).toBe(true);
    expect(state.activeModal).toBe(null);
  });
});
