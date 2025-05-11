// src/components/OptimizedGrid.tsx
import React, {useState, useEffect, memo, useMemo} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import OptimizedGridRow from './OptimizedGridRow';
import {useAnimations} from '../hooks/useAnimations';
import {TileState} from '../types';

import {GridRowProps} from './GridRow';

interface OptimizedGridProps {
  guesses: string[][];
  feedback: TileState[][];
  currentRow: number;
  currentGuess: string;
  wordLength: number;
  maxGuesses: number;
  shouldShake?: boolean;
  flippingRowIndex?: number | null;
  shouldShowWinAnimation?: boolean;
  onShakeComplete?: () => void;
  onFlipComplete?: (rowIndex: number) => void;
  onWinAnimationComplete?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Optimized Grid component with memoization for better performance
 */
const OptimizedGrid: React.FC<OptimizedGridProps> = ({
  guesses,
  feedback,
  currentRow,
  currentGuess,
  wordLength,
  maxGuesses,
  shouldShake = false,
  flippingRowIndex = null,
  shouldShowWinAnimation = false,
  onShakeComplete,
  onFlipComplete,
  onWinAnimationComplete,
  style,
}) => {
  // Track which row is currently flipping
  const [isFlippingRow, setIsFlippingRow] = useState<number | null>(null);

  // Get animation utilities
  const {useGridPop} = useAnimations();

  // Apply grid pop animation for win celebration
  const {animatedStyles: popAnimStyles} = useGridPop(shouldShowWinAnimation, {
    duration: 500,
    onComplete: onWinAnimationComplete,
  });

  // Sync flipping row from props into state
  useEffect(() => {
    setIsFlippingRow(flippingRowIndex);
  }, [flippingRowIndex]);

  // Handle completion of row flip animation
  const handleRowFlipComplete = useMemo(
    () => (rowIndex: number) => {
      // Clear the flipping state for this row
      setIsFlippingRow(null);

      // Notify parent component that animation is complete
      if (onFlipComplete) {
        onFlipComplete(rowIndex);
      }
    },
    [onFlipComplete],
  );

  // Memoize completed rows to prevent unnecessary re-renders
  const completedRows = useMemo(() => {
    return guesses.map((guess, rowIndex) => {
      const isCurrentRow = rowIndex === currentRow;
      // Use current guess for current row, otherwise use the stored guess
      const displayGuess = isCurrentRow
        ? currentGuess.padEnd(wordLength, ' ')
        : guess.join('');
      const currentFeedback =
        feedback[rowIndex] || Array(wordLength).fill('empty');
      const isFlipping = rowIndex === isFlippingRow;

      const gridRowProps: GridRowProps = {
        letters: displayGuess.split(''),
        feedback: currentFeedback,
        isFlipping,
        shouldShake: isCurrentRow && shouldShake,
        rowIndex,
        onFlipComplete: () => handleRowFlipComplete(rowIndex),
        onShakeComplete: isCurrentRow ? onShakeComplete : undefined,
      };
      return (
        <OptimizedGridRow
          key={`guess-${rowIndex}`}
          letters={displayGuess.split('')}
          feedback={currentFeedback}
          isFlipping={isFlipping}
          shouldShake={isCurrentRow && shouldShake}
          rowIndex={rowIndex}
          onFlipComplete={() => handleRowFlipComplete(rowIndex)}
          onShakeComplete={isCurrentRow ? onShakeComplete : undefined}
        />
      );
    });
  }, [
    guesses,
    currentRow,
    currentGuess,
    wordLength,
    feedback,
    isFlippingRow,
    shouldShake,
    handleRowFlipComplete,
    onShakeComplete,
  ]);

  // Memoize empty rows to prevent unnecessary re-renders
  const emptyRows = useMemo(() => {
    const emptyRowsCount = maxGuesses - guesses.length;
    if (emptyRowsCount <= 0) {return [];}

    return Array.from({length: emptyRowsCount}).map((_, rowIndex) => {
      return (
        <OptimizedGridRow
          key={`empty-${rowIndex + guesses.length}`}
          letters={Array(wordLength).fill('')}
          feedback={Array(wordLength).fill('empty')}
          rowIndex={rowIndex + guesses.length}
        />
      );
    });
  }, [guesses.length, maxGuesses, wordLength]);

  return (
    <View style={[styles.gridContainer, style, popAnimStyles]}>
      {completedRows}
      {emptyRows}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default memo(OptimizedGrid);
