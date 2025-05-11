// src/components/OptimizedTile.tsx
import React, {useEffect, useState, memo, useMemo} from 'react';
import {Text, StyleSheet, StyleProp, ViewStyle, TextStyle} from 'react-native';
import Animated from 'react-native-reanimated';
import {useTheme} from '../providers/ThemeProvider';
import {useAnimations} from '../hooks/useAnimations';
import {useCardAnimation} from '../hooks/useCardAnimation';
import {TileState} from '../types';

export interface OptimizedTileProps {
  letter?: string;
  state?: TileState;
  position?: number; // Position in the row for calculating delay
  isFlipping?: boolean;
  onFlipComplete?: () => void;
  delay?: number; // Manual delay override
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Optimized tile component with improved animations and rendering performance
 */
const OptimizedTile: React.FC<OptimizedTileProps> = ({
  letter = '',
  state = 'empty',
  position = 0,
  isFlipping = false,
  onFlipComplete,
  delay,
  style,
  textStyle,
}) => {
  const {theme} = useTheme();
  const {useTileFlip} = useAnimations();
  const [currentState, setCurrentState] = useState(state);
  const [displayLetter, setDisplayLetter] = useState(letter);

  // Calculate the proper delay based on position or provided delay
  const actualDelay = delay !== undefined ? delay : position * 180;

  // Animation for tile entry
  const {animStyle: entryAnimStyle} = useCardAnimation(true, {
    delay: actualDelay / 2,
    useNativeDriver: true,
  });

  // Animation for tile flipping
  const {animatedStyles: flipAnimStyles, isAnimating} = useTileFlip(
    isFlipping,
    {
      index: position,
      duration: 600,
      delay: actualDelay,
      onComplete: onFlipComplete,
    },
  );

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

  // Memoize the tile styles based on current state and theme
  const tileStyles = useMemo(() => {
    const styleObj: ViewStyle = {
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.primary, // Default background
    };

    switch (currentState) {
      case 'correct':
        styleObj.backgroundColor = theme.colors.tile.correct;
        styleObj.borderColor = theme.colors.tile.correct;
        break;
      case 'present':
        styleObj.backgroundColor = theme.colors.tile.present;
        styleObj.borderColor = theme.colors.tile.present;
        break;
      case 'absent':
        styleObj.backgroundColor = theme.colors.tile.absent;
        styleObj.borderColor = theme.colors.tile.absent;
        break;
      case 'filled':
        // For letters typed but not submitted
        styleObj.borderColor = theme.colors.border;
        break;
      case 'empty':
      default:
        // Empty state styling handled by default styles
        break;
    }

    return styleObj;
  }, [currentState, theme.colors]);

  // Memoize the text styles based on current state and theme
  const textStyles = useMemo(() => {
    const styleObj: TextStyle = {
      color: theme.colors.text, // Default text color
    };

    if (
      currentState === 'correct' ||
      currentState === 'present' ||
      currentState === 'absent'
    ) {
      styleObj.color = theme.colors.tile.feedbackText;
    }

    return styleObj;
  }, [currentState, theme.colors]);

  // Combine all animation styles
  const combinedAnimStyles = useMemo(() => {
    return [entryAnimStyle, flipAnimStyles];
  }, [entryAnimStyle, flipAnimStyles]);

  return (
    <Animated.View
      style={[styles.tile, tileStyles, style, combinedAnimStyles]}
      accessibilityLabel={letter ? `Letter ${letter}` : 'Empty tile'}
      accessibilityRole="image"
      testID="optimized-tile">
      <Text style={[styles.text, textStyles, textStyle]}>
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

export default memo(OptimizedTile);
