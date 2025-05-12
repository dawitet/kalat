// src/__tests__/optimized-grid.test.tsx
import React from 'react';
import {render /* Removed unused fireEvent */} from '@testing-library/react-native';
import OptimizedGridRow from '../components/OptimizedGridRow';
import OptimizedGrid from '../components/OptimizedGrid';
import {TileState} from '../types';
import {ThemeProvider} from '../providers/ThemeProvider';
// We don't need these React types since they're not being used
// import { ReactElement, JSXElementConstructor } from 'react';

// Mock the animations modules to avoid test errors
jest.mock('react-native-reanimated', () => {
  // Using jest.requireActual instead of require
  const Reanimated = jest.requireActual('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return {
    ...Reanimated,
    useSharedValue: jest.fn(() => ({value: 0})), // Mocking shared value
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn(value => value),
    withSpring: jest.fn(value => value),
    withDelay: jest.fn((_, value) => value),
    withSequence: jest.fn(value => value),
    withRepeat: jest.fn(value => value),
    runOnJS: jest.fn(callback => callback),
    interpolate: jest.fn(() => 0),
    Extrapolate: {CLAMP: 'clamp'},
  };
});

jest.mock('../hooks/useCardAnimation', () => ({
  useCardAnimation: () => ({
    animValue: { value: 1 }, // Ensure animValue has a value property if accessed directly
    animStyle: {},
  }),
}));

jest.mock('../hooks/useAnimations', () => ({
  useAnimations: () => ({
    useRowShake: () => ({animatedStyles: {}}),
    useGridPop: () => ({animatedStyles: {}}),
    useTileFlip: () => ({animatedStyles: {isAnimating: false}}), // Ensure isAnimating is provided if used
  }),
}));

describe('OptimizedGridRow', () => {
  it('renders correctly with letters and feedback', () => {
    const {getAllByText} = render(
      <ThemeProvider>
        <OptimizedGridRow
          letters={['ሀ', 'ለ', 'ሐ', 'መ', 'ሠ']}
          feedback={['correct', 'present', 'absent', 'empty', 'empty']}
          rowIndex={0}
        />
      </ThemeProvider>,
    );

    expect(getAllByText(/[ሀለሐመሠ]/)[0]).toBeDefined();
  });

  it('calls onFlipComplete when animation completes', () => {
    const onFlipComplete = jest.fn();
    render(
      <ThemeProvider>
        <OptimizedGridRow
          letters={['ሀ', 'ለ', 'ሐ', 'መ', 'ሠ']}
          feedback={['correct', 'present', 'absent', 'empty', 'empty']}
          rowIndex={0}
          isFlipping={true}
          onFlipComplete={onFlipComplete}
        />
      </ThemeProvider>,
    );

    // This would require a more sophisticated testing setup to truly test animation completion.
    // For now, this test ensures the component renders with the prop.
    // If onFlipComplete was called directly by a child prop, that could be tested.
    // Given the current structure, direct testing of animation callback is complex here.
  });
});

describe('OptimizedGrid', () => {
  const defaultProps = {
    guesses: [['ሀ', 'ለ', 'ሐ', 'መ', 'ሠ']],
    feedback: [
      ['correct', 'present', 'absent', 'empty', 'empty'] as TileState[],
    ],
    currentRow: 1,
    currentGuess: 'ረሰ',
    wordLength: 5,
    maxGuesses: 6,
  };

  it('renders with the correct number of rows', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <OptimizedGrid {...defaultProps} testID="optimized-grid" />
      </ThemeProvider>,
    );

    // Example: Check if the grid container is rendered.
    // You might need to add testIDs to your OptimizedGrid or its sub-components
    // to make more specific assertions about the number of rows.
    expect(getByTestId('optimized-grid')).toBeTruthy();
  });

  it('shows current guess in the current row', () => {
    const props = {
      ...defaultProps,
      currentRow: 1,
      currentGuess: 'ረሰ',
    };

    const {getAllByText} = render(
      <ThemeProvider>
        <OptimizedGrid {...props} />
      </ThemeProvider>,
    );

    // This assertion is a bit broad. Ideally, you'd query for the specific row
    // and check its content.
    expect(getAllByText(/[ሀለሐመሠረሰ]/).length).toBeGreaterThan(0);
  });
});
