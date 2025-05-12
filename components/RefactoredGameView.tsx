// src/components/RefactoredGameView.tsx
import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react';
import {View, StyleSheet, Text, BackHandler} from 'react-native';
import {useGameContext} from '../context/hook';
import {
  selectCurrentProgress,
  selectIsGameFinished,
} from '../context/selectors';
import OptimizedKeyboard from './OptimizedKeyboard';
import OptimizedGrid from './OptimizedGrid';
import {WORD_LENGTH, MAX_GUESSES} from '../game-state';
import {Difficulty} from '../types';
import SuggestionArea from './SuggestionArea';
import {useTheme} from '../providers/ThemeProvider';
import Button from './common/Button';
import Container from './common/Container';
import LoadingState from './common/LoadingState';

interface GameViewProps {
  initialDifficulty: Difficulty;
}

/**
 * RefactoredGameView component with improved performance, reusable components,
 * and optimization techniques.
 */
const RefactoredGameView: React.FC<GameViewProps> = ({initialDifficulty}) => {
  const {
    gameState,
    // Removed unused dispatch
    addLetter,
    deleteLetter,
    submitGuess,
    revealHint,
    startNewGame,
    goHome,
  } = useGameContext();
  const {theme} = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use selectors for accessing state with memoization
  const currentProgress = useMemo(
    () => selectCurrentProgress(gameState),
    [gameState],
  );

  const isGameFinished = useMemo(
    () => selectIsGameFinished(gameState),
    [gameState],
  );

  // Track active timers for cleanup
  const activeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function to be used in useEffect
  const cleanupTimers = useCallback(() => {
    if (activeTimerRef.current) {
      clearTimeout(activeTimerRef.current);
      activeTimerRef.current = null;
    }
  }, []);

  // Fetch initial word with error handling
  const fetchInitialWord = useCallback(async (_difficulty: Difficulty) => {
    setIsLoading(true);
    setError(null);

    // Clean up any existing timer
    cleanupTimers();

    try {
      // Word fetching logic would go here
      // For now, we're just simulating the loading state
      activeTimerRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load word. Please try again.');
      setIsLoading(false);
    }
  }, [cleanupTimers]);

  // Initialize game on component mount
  useEffect(() => {
    if (initialDifficulty) {
      fetchInitialWord(initialDifficulty);
    }

    // Clean up any timers when component unmounts
    return () => {
      if (activeTimerRef.current) {
        clearTimeout(activeTimerRef.current);
      }
    };
  }, [initialDifficulty, fetchInitialWord, cleanupTimers]);

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      goHome();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [goHome]);

  // Optimized key press handler with useCallback
  const handleKeyPress = useCallback(
    (key: string) => {
      if (isGameFinished) {return;}

      if (key === 'ENTER') {
        submitGuess();
      } else if (key === 'BACKSPACE') {
        deleteLetter();
      } else {
        addLetter(key);
      }
    },
    [isGameFinished, submitGuess, deleteLetter, addLetter],
  );

  // Memoize event handlers to prevent unnecessary re-renders
  const handleRevealHint = useCallback(() => {
    if (isGameFinished || !currentProgress || currentProgress.mainHintRevealed)
      {return;}
    revealHint();
  }, [isGameFinished, currentProgress, revealHint]);

  const handleNewGame = useCallback(() => {
    if (!isGameFinished) {return;}
    startNewGame(initialDifficulty);
  }, [isGameFinished, startNewGame, initialDifficulty]);

  // Grid props memoized for performance
  const gridProps = useMemo(
    () => ({
      guesses: currentProgress?.guesses || [],
      feedback: currentProgress?.feedback || [],
      currentRow: currentProgress?.currentRow || 0,
      currentGuess: currentProgress?.currentGuess || '',
      wordLength: WORD_LENGTH,
      maxGuesses: MAX_GUESSES,
      shouldShake: gameState.shouldShakeGrid,
      flippingRowIndex: currentProgress?.flippingRowIndex,
    }),
    [
      currentProgress?.guesses,
      currentProgress?.feedback,
      currentProgress?.currentRow,
      currentProgress?.currentGuess,
      currentProgress?.flippingRowIndex,
      gameState.shouldShakeGrid,
    ],
  );

  // If context is loading or not available
  if (!gameState) {
    return (
      <Container centerVertical centerHorizontal>
        <LoadingState isLoading={true} loadingMessage="Loading Game..." />
      </Container>
    );
  }

  return (
    <Container withPadding={false} style={styles.container}>
      {/* Loading and error states */}
      <LoadingState
        isLoading={isLoading && !currentProgress?.targetWord}
        loadingMessage="Loading Game..."
        hasError={!!error}
        errorMessage={error || undefined}
        onRetry={() => fetchInitialWord(initialDifficulty)}
      />

      {/* Game Title */}
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={[styles.gameTitle, {color: theme.colors.text}]}>
             ቃላት - {gameState.currentDifficulty === 'easy' ? 'ቀላል' : 'ከባድ'}
          </Text>
        </View>
      </View>

      {/* Game Grid */}
      <OptimizedGrid {...gridProps} />

      {/* Keyboard */}
      <OptimizedKeyboard
        onKeyPress={handleKeyPress}
        letterHints={currentProgress?.letterHints || {}}
        disabled={isLoading || isGameFinished}
      />

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <Button
          label="ፍንጭ አሳይ"
          variant="secondary"
          onPress={handleRevealHint}
          disabled={
            !currentProgress ||
            currentProgress.mainHintRevealed ||
            isGameFinished
          }
          style={styles.actionButton}
        />
        <Button
          label="አዲስ ጨዋታ"
          variant="primary"
          onPress={handleNewGame}
          disabled={!isGameFinished}
          style={styles.actionButton}
        />
      </View>

      {/* Suggestions Area */}
      {currentProgress && <SuggestionArea />}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  actionButton: {
    minWidth: 120,
  },
});

export default React.memo(RefactoredGameView);
