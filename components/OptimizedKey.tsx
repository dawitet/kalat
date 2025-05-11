// src/components/OptimizedKey.tsx
import React, {useMemo} from 'react';
import {StyleSheet, ViewStyle, TextStyle} from 'react-native';
import Button from './common/Button';
import {TileState} from '../types';
import {useTheme} from '../providers/ThemeProvider';

interface KeyProps {
  value: string;
  state?: TileState | 'default';
  onClick: (value: string) => void;
  isDisabled?: boolean;
  isSuggestion?: boolean;
  style?: ViewStyle;
  isFunctionKey?: boolean;
}

/**
 * Optimized keyboard key component using the reusable Button component
 * with memoization for improved performance
 */
const OptimizedKey: React.FC<KeyProps> = React.memo(
  ({
    value,
    state = 'default',
    onClick,
    isDisabled = false,
    isSuggestion = false,
    style,
    isFunctionKey = false,
  }) => {
    const {theme} = useTheme();

    // Create memoized styles based on theme
    const styles = useMemo(() => createStyles(theme), [theme]);

    // Create memoized button variant based on key state
    const buttonVariant = useMemo(() => {
      if (isSuggestion) {return 'outline';}
      if (isFunctionKey) {return 'secondary';}

      switch (state) {
        case 'correct':
          return 'success';
        case 'present':
          return 'warning'; // Custom variant - we'll handle it in style overrides
        case 'absent':
          return 'danger';
        default:
          return 'default'; // Custom variant - we'll handle it in style overrides
      }
    }, [state, isSuggestion, isFunctionKey]);

    // Create memoized style overrides based on state
    const styleOverrides = useMemo((): ViewStyle => {
      const overrideStyle: ViewStyle = {};

      if (state === 'present') {
        overrideStyle.backgroundColor = theme.colors.tile.present;
      } else if (state === 'default' && !isFunctionKey && !isSuggestion) {
        overrideStyle.backgroundColor = theme.colors.keyboard.key.background;
      }

      if (isFunctionKey) {
        overrideStyle.flex = 1.5;
      } else {
        overrideStyle.flex = 1;
      }

      return overrideStyle;
    }, [state, theme, isFunctionKey, isSuggestion]);

    // Create memoized text style overrides based on state
    const textStyleOverrides = useMemo((): TextStyle => {
      const overrideTextStyle: TextStyle = {};

      if (state === 'correct' || state === 'present' || state === 'absent') {
        overrideTextStyle.color = theme.colors.tile.feedbackText;
      } else if (isSuggestion) {
        overrideTextStyle.color = theme.colors.text;
      } else if (isFunctionKey) {
        overrideTextStyle.color = theme.colors.keyboard.key.specialText;
      } else {
        overrideTextStyle.color = theme.colors.keyboard.key.text;
      }

      if (value.length > 1) {
        overrideTextStyle.fontSize = 14;
      }

      return overrideTextStyle;
    }, [state, theme, isFunctionKey, isSuggestion, value.length]);

    // Handle key press with the correct value
    const handlePress = useMemo(() => {
      return () => onClick(value);
    }, [onClick, value]);

    // Display backspace icon instead of text when needed
    const displayText = value === 'BACKSPACE' ? '⌫' : value;

    return (
      <Button
        label={displayText}
        onPress={handlePress}
        style={[styles.keyBase, styleOverrides, style]}
        textStyle={textStyleOverrides}
        disabled={isDisabled}
        hapticFeedback={true}
        variant={buttonVariant as any} // Type assertion needed because we have custom variants
        // Using our Button's built-in accessibility props
        accessibilityLabel={
          value === 'ENTER'
            ? 'Enter guess'
            : value === 'BACKSPACE'
            ? 'Delete last letter'
            : `Type letter ${value}`
        }
      />
    );
  },
);

// Extract styles creation to a function for memoization
const createStyles = (theme: any) =>
  StyleSheet.create({
    keyBase: {
      height: 52,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 3,
      marginVertical: 3,
      paddingHorizontal: 5,
      minWidth: 35,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
  });

export default OptimizedKey;
