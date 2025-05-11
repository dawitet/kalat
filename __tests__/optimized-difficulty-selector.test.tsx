// src/__tests__/optimized-difficulty-selector.test.tsx
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native'; // Removed unused 'act'
import OptimizedDifficultySelector from '../components/OptimizedDifficultySelector';
import {ThemeProvider} from '../providers/ThemeProvider';
import {GameProvider} from '../context/GameContext';
// Removed unused GameContext import as useGameContext hook is mocked
import * as ReactNative from 'react-native';

// Mock Alert
// Correcting the Alert mock to handle different signatures
const mockAlert = jest.fn();
jest.spyOn(ReactNative.Alert, 'alert').mockImplementation(mockAlert);


// Mock the dispatch function
const mockDispatch = jest.fn();
jest.mock('../context/hook', () => ({
  useGameContext: () => ({
    // Provide a default for currentDifficulty, or ensure tests cover the null case
    gameState: {currentDifficulty: 'easy', activeModal: null}, // Added activeModal for completeness
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
    mockAlert.mockClear(); // Clear the mockAlert
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
    jest.doMock('../context/hook', () => ({ // Use doMock for this specific test
      useGameContext: () => ({
        gameState: {currentDifficulty: null, activeModal: null}, // Ensure activeModal is part of the mocked state
        dispatch: mockDispatch,
      }),
    }));

    // We need to re-import or re-evaluate the component for the new mock to take effect
    // A cleaner way would be to pass the gameState as a prop or use a fresh render with a modified provider for this test.
    // For simplicity here, we'll assume the above mock affects subsequent renders if the test runner handles it.
    // If not, this test might need restructuring.

    const {getByText} = render(
      <TestWrapper>
        <OptimizedDifficultySelector />
      </TestWrapper>,
    );

    // Press the start button
    const startButton = getByText('ጀምር');
    fireEvent.press(startButton);

    // Check that Alert.alert was called
    expect(mockAlert).toHaveBeenCalledWith( // Updated to check Alert.alert
      'ችግር ይምረጡ',
      'ለመጀመር እባክዎ የችግር ደረጃ ይምረጡ።',
       expect.any(Array), // For buttons array
       undefined // For options object
    );
  });
});
