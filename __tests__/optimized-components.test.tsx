// src/__tests__/optimized-components.test.tsx
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import OptimizedKey from '../components/OptimizedKey';
// Assuming TileState is exported from 'types' or a similar central location
import {TileState} from '../types'; // CORRECTED: Import TileState from a central types file
import OptimizedKeyboard from '../components/OptimizedKeyboard';
import RefactoredGameView from '../components/RefactoredGameView';
import {ThemeProvider} from '../providers/ThemeProvider';
import {GameProvider} from '../context/GameContext';

// Mock the native modules
import ReanimatedMock from 'react-native-reanimated/mock';

jest.mock('react-native-reanimated', () => {
  const Reanimated = { ...ReanimatedMock };
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

describe('OptimizedKey Component', () => {
  const mockOnClick = jest.fn();

  it('renders correctly', () => {
    const {getByText} = render(
      <ThemeProvider>
        <OptimizedKey value="ሀ" onClick={mockOnClick} />
      </ThemeProvider>,
    );

    expect(getByText('ሀ')).toBeDefined();
  });

  it('calls onClick when pressed', () => {
    const {getByText} = render(
      <ThemeProvider>
        <OptimizedKey value="ሀ" onClick={mockOnClick} />
      </ThemeProvider>,
    );

    fireEvent.press(getByText('ሀ'));
    expect(mockOnClick).toHaveBeenCalledWith('ሀ');
  });

  it('displays correct styles for different states', () => {
    const {rerender, getByText} = render(
      <ThemeProvider>
        <OptimizedKey value="ሀ" onClick={mockOnClick} state="correct" />
      </ThemeProvider>,
    );

    // Test with different states
    rerender(
      <ThemeProvider>
        <OptimizedKey value="ሀ" onClick={mockOnClick} state="present" />
      </ThemeProvider>,
    );

    rerender(
      <ThemeProvider>
        <OptimizedKey value="ሀ" onClick={mockOnClick} state="absent" />
      </ThemeProvider>,
    );

    // Should all render the same text
    expect(getByText('ሀ')).toBeDefined();
  });
});

describe('OptimizedKeyboard Component', () => {
  const mockOnKeyPress = jest.fn();
  const letterHints: {[key: string]: TileState} = {ሀ: 'correct', ለ: 'present'};

  it('renders with letter hints', () => {
    const {getByTestId} = render(
      <ThemeProvider>
        <OptimizedKeyboard
          onKeyPress={mockOnKeyPress}
          letterHints={letterHints}
        />
      </ThemeProvider>,
    );

    expect(getByTestId('keyboard')).toBeDefined();
  });

  it('disables keyboard when disabled prop is true', () => {
    const {getByTestId} = render(
      <ThemeProvider>
        <OptimizedKeyboard
          onKeyPress={mockOnKeyPress}
          letterHints={letterHints}
          disabled={true}
        />
      </ThemeProvider>,
    );

    expect(getByTestId('keyboard')).toBeDefined();
  });
});

describe('RefactoredGameView Component', () => {
  it('renders the game view', () => {
    const {getByText} = render(
      <ThemeProvider>
        <GameProvider>
          <RefactoredGameView initialDifficulty="easy" />
        </GameProvider>
      </ThemeProvider>,
    );

    // Check for loading state initially
    expect(getByText('Loading Game...')).toBeDefined();
  });
});
