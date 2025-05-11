// src/__tests__/optimized-difficulty-selector.test.tsx
import React from 'react';
import {render, fireEvent, act} from '@testing-library/react-native';
import OptimizedDifficultySelector from '../components/OptimizedDifficultySelector';
import {ThemeProvider} from '../providers/ThemeProvider';
import {GameProvider} from '../context/GameContext';
import {GameContext} from '../context/GameContext';
import * as ReactNative from 'react-native';

// Mock Alert
jest.spyOn(ReactNative, 'Alert', 'show');

// Mock the dispatch function
const mockDispatch = jest.fn();
jest.mock('../context/hook', () => ({
  useGameContext: () => ({
    gameState: {currentDifficulty: 'easy'},
    dispatch: mockDispatch,
  }),
}));

// Wrapper component for tests
const TestWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
  <ThemeProvider>
    <GameProvider>{children}</GameProvider>
  </ThemeProvider>
);

describe('OptimizedDifficultySelector Component', () => {
  beforeEach(() => {
    // Clear any previous mock calls
    mockDispatch.mockClear();
    (ReactNative.Alert.show as jest.Mock).mockClear();
  });

  it('renders without crashing', () => {
    const {getByText} = render(
      <TestWrapper>
        <OptimizedDifficultySelector />
      </TestWrapper>,
    );

    // Check if the title is rendered
    expect(getByText('የችግር ደረጃ ይምረጡ')).toBeTruthy();
  });

  it('renders difficulty buttons', () => {
    const {getByText} = render(
      <TestWrapper>
        <OptimizedDifficultySelector />
      </TestWrapper>,
    );

    // Check for difficulty buttons
    expect(getByText('ቀላል')).toBeTruthy(); // Easy
    expect(getByText('ከባድ')).toBeTruthy(); // Hard
    expect(getByText('ጀምር')).toBeTruthy(); // Start
  });

  it('handles difficulty selection correctly', () => {
    const {getByText} = render(
      <TestWrapper>
        <OptimizedDifficultySelector />
      </TestWrapper>,
    );

    // Click the hard difficulty button
    const hardButton = getByText('ከባድ');
    fireEvent.press(hardButton);

    // Check that the dispatch was called with the correct action
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_CURRENT_DIFFICULTY',
      payload: 'hard',
    });
  });

  it('handles start button press correctly', () => {
    const {getByText} = render(
      <TestWrapper>
        <OptimizedDifficultySelector />
      </TestWrapper>,
    );

    // Press the start button
    const startButton = getByText('ጀምር');
    fireEvent.press(startButton);

    // Check that the dispatch was called with the correct action
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'INITIALIZE_GAME',
    });
  });

  it('shows alert when trying to start without selecting difficulty', () => {
    // Override the mock to return null for currentDifficulty
    jest.mock('../context/hook', () => ({
      useGameContext: () => ({
        gameState: {currentDifficulty: null},
        dispatch: mockDispatch,
      }),
    }));

    const {getByText} = render(
      <TestWrapper>
        <OptimizedDifficultySelector />
      </TestWrapper>,
    );

    // Press the start button
    const startButton = getByText('ጀምር');
    fireEvent.press(startButton);

    // Check that Alert.alert was called
    expect(ReactNative.Alert.show).toHaveBeenCalledWith(
      'ችግር ይምረጡ',
      'ለመጀመር እባክዎ የችግር ደረጃ ይምረጡ።',
    );
  });
});
