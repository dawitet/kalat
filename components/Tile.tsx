// src/components/Tile.tsx
import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, StyleProp, ViewStyle, TextStyle} from 'react-native';
import Animated from 'react-native-reanimated';
import {useTheme} from '../providers/ThemeProvider';
import {useAnimations} from '../hooks/useAnimations';
import {TileState} from '../types';

export interface TileProps {
  letter?: string;
  state?: TileState;
  isFlipping?: boolean;
  tileIndex?: number;
  rowIndex?: number;
  onFlipComplete?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Tile: React.FC<TileProps> = ({
  letter = '',
  state = 'empty',
  isFlipping = false,
  tileIndex = 0,
  rowIndex = 0,
  onFlipComplete,
  style,
  textStyle,
}) => {
  const {theme} = useTheme();
  const {useTileFlip} = useAnimations();
  const [currentState, setCurrentState] = useState(state);
  const [displayLetter, setDisplayLetter] = useState(letter);

  // Animation specific props
  const {animatedStyles, isAnimating} = useTileFlip(isFlipping, {
    index: tileIndex,
    rowIndex: rowIndex,
    duration: 600,
    onComplete: onFlipComplete,
  });

  // Handle letter and state update during flip animation
  useEffect(() => {
    // When not flipping or mid-flip, simply show current state
    if (!isFlipping || isAnimating) {
      return;
    }

    // Update letter and state only after flip completes
    setDisplayLetter(letter);
    setCurrentState(state);
  }, [letter, state, isFlipping, isAnimating]);

  const tileDynamicStyles: ViewStyle = {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.primary, // Default background
  };
  const textDynamicStyles: TextStyle = {
    color: theme.colors.text, // Default text color
  };

  switch (currentState) {
    case 'correct':
      tileDynamicStyles.backgroundColor = theme.colors.tile.correct;
      tileDynamicStyles.borderColor = theme.colors.tile.correct;
      textDynamicStyles.color = theme.colors.tile.feedbackText;
      break;
    case 'present':
      tileDynamicStyles.backgroundColor = theme.colors.tile.present;
      tileDynamicStyles.borderColor = theme.colors.tile.present;
      textDynamicStyles.color = theme.colors.tile.feedbackText;
      break;
    case 'absent':
      tileDynamicStyles.backgroundColor = theme.colors.tile.absent;
      tileDynamicStyles.borderColor = theme.colors.tile.absent;
      textDynamicStyles.color = theme.colors.tile.feedbackText;
      break;
    case 'filled':
      // For letters typed but not submitted
      tileDynamicStyles.borderColor = theme.colors.border;
      textDynamicStyles.color = theme.colors.text;
      break;
    case 'empty':
    default:
      // Empty state styling handled by default styles
      break;
  }

  return (
    <Animated.View
      style={[styles.tile, tileDynamicStyles, style, animatedStyles]}
      accessibilityLabel={letter ? `Letter ${letter}` : 'Empty tile'}
      accessibilityRole="image"
      testID="tile">
      <Text style={[styles.text, textDynamicStyles, textStyle]}>
        {displayLetter?.toUpperCase()}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    margin: 3,
    borderRadius: 5,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default Tile;
