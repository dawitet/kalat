// src/components/OptimizedComponents.tsx
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {GameContext} from '../context/GameContext';
import OptimizedGrid from './OptimizedGrid';
import OptimizedKeyboard from './OptimizedKeyboard';
import OptimizedTile from './OptimizedTile';
import OptimizedGridRow from './OptimizedGridRow';
import OptimizedSuggestionArea from './OptimizedSuggestionArea';
import OptimizedMainMenu from './OptimizedMainMenu';
import OptimizedDifficultySelector from './OptimizedDifficultySelector';
import OptimizedLoadingScreen from './OptimizedLoadingScreen';
import {useTheme} from '../providers/ThemeProvider';
import Container from './common/Container';
import Button from './common/Button';
import LoadingState from './common/LoadingState';

/**
 * A collection of optimized components that can be imported
 * and used throughout the app
 */
export const OptimizedComponents = {
  // Base optimized components
  Grid: OptimizedGrid,
  Keyboard: OptimizedKeyboard,
  Tile: OptimizedTile,
  GridRow: OptimizedGridRow,
  SuggestionArea: OptimizedSuggestionArea,
  MainMenu: OptimizedMainMenu,
  DifficultySelector: OptimizedDifficultySelector,
  LoadingScreen: OptimizedLoadingScreen,

  // Reusable common components
  Button,
  LoadingState,
  Container,

  /**
   * An optimized version of the game's keyboard area
   */
  KeyboardArea: React.memo(
    ({
      onKeyPress,
      letterHints,
      disabled,
    }: {
      onKeyPress: (key: string) => void;
      letterHints: Record<string, any>;
      disabled?: boolean;
    }) => {
      return (
        <View style={styles.keyboardArea}>
          <OptimizedKeyboard
            onKeyPress={onKeyPress}
            letterHints={letterHints}
            disabled={disabled}
          />
        </View>
      );
    },
  ),

  /**
   * An optimized game header component
   */
  GameHeader: React.memo(
    ({title, difficulty}: {title: string; difficulty: string}) => {
      const {theme} = useTheme();

      return (
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.gameTitle, {color: theme.colors.text}]}>
              {title} - {difficulty === 'easy' ? 'ቀላል' : 'ከባድ'}
            </Text>
          </View>
        </View>
      );
    },
  ),

  /**
   * Optimized action buttons component
   */
  GameActions: React.memo(
    ({
      onHintPress,
      onNewGamePress,
      hintDisabled,
      newGameDisabled,
    }: {
      onHintPress: () => void;
      onNewGamePress: () => void;
      hintDisabled: boolean;
      newGameDisabled: boolean;
    }) => {
      return (
        <View style={styles.actionsContainer}>
          <Button
            label="ፍንጭ አሳይ"
            variant="secondary"
            onPress={onHintPress}
            disabled={hintDisabled}
            style={styles.actionButton}
          />
          <Button
            label="አዲስ ጨዋታ"
            variant="primary"
            onPress={onNewGamePress}
            disabled={newGameDisabled}
            style={styles.actionButton}
          />
        </View>
      );
    },
  ),
};

const styles = StyleSheet.create({
  keyboardArea: {
    width: '100%',
    marginTop: 8,
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
