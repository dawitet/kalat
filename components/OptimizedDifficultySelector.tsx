// src/components/OptimizedDifficultySelector.tsx
import React, {useContext, useCallback, useMemo} from 'react';
import {View, Text, StyleSheet, Platform, Alert} from 'react-native';
import {GameContext} from '../context/GameContext';
import {useTheme} from '../providers/ThemeProvider';
import {Difficulty, ModalType} from '../types';
import Button from './common/Button';

/**
 * Optimized difficulty selector component with performance improvements
 */
const OptimizedDifficultySelector: React.FC = () => {
  // Context hooks - must be called unconditionally at the top level
  const context = useContext(GameContext);
  const {theme} = useTheme();
  
  // Safely access context values with null coalescing and proper typing
  const gameState = context?.gameState || {
    currentDifficulty: undefined as Difficulty | undefined,
    activeModal: null as ModalType,
  };
  const safeDispatch = useMemo(() => {
    return context?.dispatch || ((() => {}) as React.Dispatch<any>);
  }, [context]);
  
  // Memoized difficulty selection handler
  const handleSelectDifficulty = useCallback((difficulty: Difficulty) => {
      // Skip if context isn't loaded
      if (!context) {
        return;
      }
      
      if (
        gameState.currentDifficulty === difficulty && 
        gameState.activeModal === null
      ) {
        return;
      }
      safeDispatch({type: 'SET_CURRENT_DIFFICULTY' as any, payload: difficulty});
    },
    [context, gameState.currentDifficulty, gameState.activeModal, safeDispatch],
  );

  // Memoized game start handler
  const handleStartGame = useCallback(() => {
    // Skip if context isn't loaded
    if (!context) {
      return;
    }
    
    if (!gameState.currentDifficulty) {
      Alert.alert('ችግር ይምረጡ', 'ለመጀመር እባክዎ የችግር ደረጃ ይምረጡ።');
      return;
    }
    safeDispatch({type: 'INITIALIZE_GAME' as any});
  }, [context, gameState.currentDifficulty, safeDispatch]);

  // Memoized styles based on theme
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: theme.colors.primary,
          paddingBottom: Platform.OS === 'web' ? 70 : 20,
        },
        title: {
          fontSize: 28,
          fontWeight: 'bold',
          color: theme.colors.text,
          marginBottom: 30,
          textAlign: 'center',
        },
        buttonContainer: {
          flexDirection: Platform.OS === 'web' ? 'row' : 'column',
          justifyContent: Platform.OS === 'web' ? 'space-around' : 'center',
          width: '100%',
          maxWidth: 500,
          marginBottom: 30,
        },
        difficultyButton: {
          backgroundColor: theme.colors.secondary,
          paddingVertical: 15,
          paddingHorizontal: 25,
          borderRadius: 10,
          margin: 10,
          borderWidth: 2,
          borderColor: 'transparent',
          alignItems: 'center',
          minWidth: Platform.OS === 'web' ? 150 : undefined,
        },
        startButton: {
          backgroundColor: theme.colors.primary,
          paddingVertical: 18,
          paddingHorizontal: 40,
          borderRadius: 12,
          marginTop: 20,
        },
      }),
    [theme],
  );

  // Memoized button components
  const DifficultySelectorButtons = useMemo(() => {
    return (
      <View style={styles.buttonContainer}>
        <DifficultyButton
          label="ቀላል"
          isSelected={gameState.currentDifficulty === 'easy'}
          onPress={() => handleSelectDifficulty('easy')}
          style={styles.difficultyButton}
        />
        <DifficultyButton
          label="ከባድ"
          isSelected={gameState.currentDifficulty === 'hard'}
          onPress={() => handleSelectDifficulty('hard')}
          style={styles.difficultyButton}
        />
      </View>
    );
  }, [gameState.currentDifficulty, styles, handleSelectDifficulty]);

  // Early return if context is not available - must be after all hooks
  if (!context) {
    return <Text>Loading...</Text>;
  }

  // Main render
  return (
    <View style={styles.container}>
      <Text style={styles.title}>የችግር ደረጃ ይምረጡ</Text>
      {DifficultySelectorButtons}
      <Button
        label="ጀምር"
        variant="success"
        size="large"
        onPress={handleStartGame}
        style={styles.startButton}
      />
    </View>
  );
};

// Memoized difficulty button component
interface DifficultyButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  style?: any;
}

const DifficultyButton = React.memo(
  ({label, isSelected, onPress, style}: DifficultyButtonProps) => (
    <Button
      label={label}
      variant={isSelected ? 'primary' : 'outline'}
      onPress={onPress}
      style={style}
    />
  ),
);

export default React.memo(OptimizedDifficultySelector);
