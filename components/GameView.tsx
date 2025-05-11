import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {GameContext} from '../context/GameContext';
import {useTheme} from '../providers/ThemeProvider';
import {WORD_LENGTH, MAX_GUESSES} from '../game-state';
import {Difficulty} from '../types';
import {OptimizedComponents} from './OptimizedComponents';

// Import optimized components
const { Grid: OptimizedGrid, Keyboard: OptimizedKeyboard } = OptimizedComponents;

interface GameViewProps {
  initialDifficulty: Difficulty;
}

const GameView: React.FC<GameViewProps> = ({initialDifficulty}) => {
  const context = useContext(GameContext);
  const {theme} = useTheme();
  const [isLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const gameState = context?.gameState;
  const dispatch = context?.dispatch;

  const activeProgress = gameState?.currentDifficulty
    ? gameState.gameProgress[gameState.currentDifficulty]
    : null;

  const fetchInitialWord = useCallback(
    async (_difficulty: Difficulty) => {
      if (!dispatch) {
        return;
      }
      try {
        // Actual API call or word fetching logic would go here
      } catch (err: any) {
        setError(err.message || 'Failed to load word. Please try again.');
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (initialDifficulty) {
      fetchInitialWord(initialDifficulty);
    }
  }, [initialDifficulty, fetchInitialWord]);

  useEffect(() => {
    if (activeProgress?.isFinished) {
      // Game finished logic
    }
  }, [activeProgress]);

  useEffect(() => {
    const backAction = () => {
      if (dispatch) {
        dispatch({type: 'GO_HOME'});
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [dispatch]);

  const handleKeyPress = (key: string) => {
    if (!dispatch || !activeProgress || activeProgress.isFinished) {
      return;
    }
    if (key === 'ENTER') {
      if (activeProgress.currentGuess.length === WORD_LENGTH) {
        dispatch({type: 'SUBMIT_GUESS'});
      }
    } else if (key === 'BACKSPACE') {
      dispatch({type: 'DELETE_LETTER'});
    } else if (activeProgress.currentGuess.length < WORD_LENGTH) {
      dispatch({type: 'ADD_LETTER', payload: key});
    }
  };

  const handleRevealHint = () => {
    if (
      !dispatch ||
      !activeProgress ||
      activeProgress.mainHintRevealed ||
      activeProgress.isFinished
    ) {
      return;
    }
    Alert.alert('Hint', activeProgress.currentHint || 'No hint available.');
    dispatch({type: 'REVEAL_MAIN_HINT'});
  };

  const handleNewGame = () => {
    if (!dispatch || !activeProgress || !activeProgress.isFinished) {
      return;
    }
    dispatch({
      type: 'START_NEW_GAME',
      payload: {difficulty: initialDifficulty},
    });
  };

  if (!context || !gameState) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {backgroundColor: theme.colors.primary},
        ]}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={[styles.loadingText, {color: theme.colors.text}]}>
          Loading Game...
        </Text>
      </View>
    );
  }

  if (isLoading && !activeProgress?.targetWord) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {backgroundColor: theme.colors.primary},
        ]}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.errorContainer,
          {backgroundColor: theme.colors.primary},
        ]}>
        <Text style={[styles.errorText, {color: theme.colors.destructive}]}>
          {error}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, {backgroundColor: theme.colors.accent}]}
          onPress={() => fetchInitialWord(initialDifficulty)}>
          <Text
            style={[styles.retryButtonText, {color: theme.colors.buttonText}]}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!activeProgress) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {backgroundColor: theme.colors.primary},
        ]}>
        <Text style={{color: theme.colors.text}}>Preparing your game...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.primary}]}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={[styles.gameTitle, {color: theme.colors.text}]}>
              ቃላት - {gameState.currentDifficulty === 'easy' ? 'ቀላል' : 'ከባድ'}
          </Text>
        </View>
      </View>

      <OptimizedGrid
        guesses={activeProgress.guesses}
        feedback={activeProgress.feedback}
        currentRow={activeProgress.currentRow}
        currentGuess={activeProgress.currentGuess}
        wordLength={WORD_LENGTH}
        maxGuesses={MAX_GUESSES}
        shouldShake={false}
        flippingRowIndex={null}
      />

      <OptimizedKeyboard
        onKeyPress={handleKeyPress}
        letterHints={activeProgress.letterHints}
      />

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {backgroundColor: theme.colors.secondary},
          ]}
          onPress={handleRevealHint}
          disabled={
            !activeProgress ||
            activeProgress.mainHintRevealed ||
            activeProgress.isFinished
          }>
          <Text style={[styles.actionButtonText, {color: theme.colors.text}]}>
              ፍንጭ አሳይ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {backgroundColor: theme.colors.secondary},
          ]}
          onPress={handleNewGame}
          disabled={!activeProgress || !activeProgress.isFinished}>
          <Text style={[styles.actionButtonText, {color: theme.colors.text}]}>
              አዲስ ጨዋታ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default GameView;
