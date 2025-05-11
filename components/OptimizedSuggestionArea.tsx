// src/components/OptimizedSuggestionArea.tsx
import React, {memo, useCallback, useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useGameContext} from '../context/hook';
import OptimizedKey from './OptimizedKey';
import * as Haptics from 'expo-haptics';
import {useTheme} from '../providers/ThemeProvider';
import {useCardAnimation} from '../hooks/useCardAnimation';
import Animated from 'react-native-reanimated';

interface OptimizedSuggestionAreaProps {}

/**
 * Optimized suggestion area component with animations and performance improvements
 */
const OptimizedSuggestionArea: React.FC<OptimizedSuggestionAreaProps> = () => {
  const {gameState, dispatch} = useGameContext();
  const {theme} = useTheme();
  const {activeSuggestionFamily, isSubmitting} = gameState;

  // Animation for suggestion area appearance
  const {animStyle: entryAnimStyle} = useCardAnimation(true, {
    delay: 150,
    useNativeDriver: true,
  });

  // Memoized handler for suggestion clicks
  const handleSuggestionClick = useCallback(
    (letter: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      dispatch({type: 'ADD_LETTER', payload: letter});
    },
    [dispatch],
  );

  // Memoized styles based on theme
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Check if we have suggestions to display
  const hasSuggestions = useMemo(
    () => activeSuggestionFamily && activeSuggestionFamily.length > 0,
    [activeSuggestionFamily],
  );

  // Memoize the suggestion keys to prevent unnecessary re-renders
  const suggestionKeys = useMemo(() => {
    if (!hasSuggestions || !activeSuggestionFamily) {return null;}

    return activeSuggestionFamily.map((letter, index) => (
      <OptimizedKey
        key={`suggestion-${letter}`}
        value={letter}
        onClick={handleSuggestionClick}
        isDisabled={isSubmitting}
        isSuggestion={true}
      />
    ));
  }, [
    activeSuggestionFamily,
    handleSuggestionClick,
    isSubmitting,
    hasSuggestions,
  ]);

  // Render placeholder when no suggestions
  if (!hasSuggestions) {
    return (
      <Animated.View
        style={[styles.container, entryAnimStyle]}
        accessibilityLabel="Letter Suggestions">
        <Text style={styles.placeholderText}>🌼</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[styles.container, entryAnimStyle]}
      accessibilityLabel="Letter Suggestions"
      accessible>
      {suggestionKeys}
    </Animated.View>
  );
};

// Move style creation outside component for performance
const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 10,
      minHeight: 60,
      backgroundColor: theme.colors.primary,
      marginVertical: 5,
      borderRadius: 8,
    },
    placeholderText: {
      fontSize: 24,
      color: theme.colors.hint,
      opacity: 0.8,
    },
  });

export default memo(OptimizedSuggestionArea);
