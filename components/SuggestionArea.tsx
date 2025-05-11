// src/components/SuggestionArea.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useGameContext} from '../context/hook'; // Adjust path
import Key from './Key'; // Import RN Key component
import * as Haptics from 'expo-haptics';
import {useTheme} from '../providers/ThemeProvider'; // Adjust path

interface SuggestionAreaProps {}

const SuggestionArea: React.FC<SuggestionAreaProps> = () => {
  const {gameState, dispatch} = useGameContext();
  const {theme} = useTheme();
  const {activeSuggestionFamily, isSubmitting} = gameState;

  const handleSuggestionClick = (letter: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch({type: 'ADD_LETTER', payload: letter});
  };

  const styles = StyleSheet.create({
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
    },
    placeholderText: {
      fontSize: 24,
      color: theme.colors.hint,
      opacity: 0.8,
    },
  });

  if (!activeSuggestionFamily || activeSuggestionFamily.length === 0) {
    return (
      <View style={styles.container} accessibilityLabel="Letter Suggestions">
        <Text style={styles.placeholderText}>🌼</Text>
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      accessibilityLabel="Letter Suggestions"
      accessible>
      {activeSuggestionFamily.map(letter => (
        <Key
          key={`suggestion-${letter}`}
          value={letter}
          onClick={() => handleSuggestionClick(letter)}
          isDisabled={isSubmitting}
        />
      ))}
    </View>
  );
};

export default React.memo(SuggestionArea);
