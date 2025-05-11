// src/components/Grid.tsx
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import GridRow, {GridRowProps} from './GridRow';
import {useAnimations} from '../hooks/useAnimations';
import {TileState} from '../types';

interface GridProps {
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

const Grid: React.FC<GridProps> = ({
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
  const handleRowFlipComplete = (rowIndex: number) => {
    // Clear the flipping state for this row
    setIsFlippingRow(null);

    // Notify parent component that animation is complete
    if (onFlipComplete) {
      onFlipComplete(rowIndex);
    }
  };

  // Generate rows based on guesses and fill in empty rows
  const emptyRows =
    maxGuesses - guesses.length > 0
      ? Array.from({length: maxGuesses - guesses.length})
      : [];

  return (
    <View style={[styles.gridContainer, style, popAnimStyles]}>
      {guesses.map((guess, rowIndex) => {
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

        return <GridRow key={`guess-${rowIndex}`} {...gridRowProps} />;
      })}

      {/* Empty rows to fill the grid */}
      {emptyRows.map((_, rowIndex) => {
        const gridRowProps: GridRowProps = {
          letters: Array(wordLength).fill(''),
          feedback: Array(wordLength).fill('empty'),
          rowIndex: rowIndex + guesses.length,
        };

        return (
          <GridRow
            key={`empty-${rowIndex + guesses.length}`}
            {...gridRowProps}
          />
        );
      })}
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

export default Grid;
