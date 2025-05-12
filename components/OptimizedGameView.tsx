// src/components/OptimizedGameView.tsx
import React, {useMemo, useCallback, memo} from 'react';
import {View, StyleSheet, Animated as RNAnimated} from 'react-native';
import {useGameContext} from '../context/hook';
import Grid from './Grid';
import Keyboard from './Keyboard';
import {
  selectCurrentProgress,
  selectIsGameFinished,
} from '../context/selectors';

interface OptimizedGameViewProps {
  animValue: RNAnimated.Value;
}

/**
 * Optimized version of GameView that uses React.memo, useMemo, and useCallback
 * for better performance and reduced re-renders
 */
const OptimizedGameView: React.FC<OptimizedGameViewProps> = ({animValue: _animValue}) => {
  const {gameState, addLetter, deleteLetter, submitGuess} = useGameContext();

  // Use selectors to extract only the data we need
  const currentProgress = useMemo(
    () => selectCurrentProgress(gameState),
    [gameState],
  );
  const isGameFinished = useMemo(
    () => selectIsGameFinished(gameState),
    [gameState],
  );

  // Memoize event handlers to prevent unnecessary re-renders
  const handleKeyPress = useCallback(
    (key: string) => {
      if (isGameFinished) {return;}

      if (key === 'delete') {
        deleteLetter();
      } else if (key === 'enter') {
        submitGuess();
      } else {
        addLetter(key);
      }
    },
    [isGameFinished, deleteLetter, submitGuess, addLetter],
  );

  // Only re-render when these specific props change
  const gridProps = useMemo(
    () => ({
      guesses: currentProgress?.guesses || [],
      feedback: currentProgress?.feedback || [],
      currentRow: currentProgress?.currentRow || 0,
      currentGuess: currentProgress?.currentGuess || '',
      targetWord: currentProgress?.targetWord || '',
      isFinished: currentProgress?.isFinished || false,
      won: currentProgress?.won || false,
      flippingRowIndex: currentProgress?.flippingRowIndex,
      shouldShakeGrid: gameState.shouldShakeGrid,
      // Add required props from game-state.tsx constants
      wordLength: 4, // WORD_LENGTH from game-state.tsx
      maxGuesses: 3, // MAX_GUESSES from game-state.tsx
    }),
    [
      currentProgress?.guesses,
      currentProgress?.feedback,
      currentProgress?.currentRow,
      currentProgress?.currentGuess,
      currentProgress?.targetWord,
      currentProgress?.isFinished,
      currentProgress?.won,
      currentProgress?.flippingRowIndex,
      gameState.shouldShakeGrid,
    ],
  );

  // Only re-render when these specific props change
  const keyboardProps = useMemo(
    () => ({
      letterHints: currentProgress?.letterHints || {},
      onKeyPress: handleKeyPress,
      isGameFinished: currentProgress?.isFinished || false,
    }),
    [currentProgress?.letterHints, handleKeyPress, currentProgress?.isFinished],
  );

  return (
    <View style={styles.container}>
      <Grid {...gridProps} />
      <Keyboard {...keyboardProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});

// Use React.memo to prevent unnecessary re-renders
export default memo(OptimizedGameView);
