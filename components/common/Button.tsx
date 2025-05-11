// src/components/common/Button.tsx
import React, {useMemo} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  TouchableOpacityProps,
} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {useAnimations} from '../../hooks/useAnimations';
import {useTheme} from '../../providers/ThemeProvider';
import * as Haptics from 'expo-haptics';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'success';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /**
   * Button text content
   */
  label: string;

  /**
   * Button visual style variant
   */
  variant?: ButtonVariant;

  /**
   * Button size preset
   */
  size?: ButtonSize;

  /**
   * Loading state - shows spinner and disables button
   */
  isLoading?: boolean;

  /**
   * Optional icon to display before label
   */
  leftIcon?: React.ReactNode;

  /**
   * Optional icon to display after label
   */
  rightIcon?: React.ReactNode;

  /**
   * Custom styles for the button container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom styles for the button text
   */
  textStyle?: StyleProp<TextStyle>;

  /**
   * Whether to apply tactile feedback on press
   * @default true
   */
  hapticFeedback?: boolean;
}

/**
 * Button component that provides consistent styling, loading states,
 * animation feedback, and haptic feedback across the application.
 */
const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  hapticFeedback = true,
  onPress,
  ...rest
}) => {
  const {theme} = useTheme();
  const {bounceAnimValue, triggerBounce} = useAnimations();

  const handlePress = React.useCallback(
    (e: GestureResponderEvent) => {
      if (isLoading) {return;}

      // Apply haptic feedback on press
      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Trigger animation
      triggerBounce({duration: 150});

      // Call original onPress handler
      if (onPress) {
        onPress(e);
      }
    },
    [isLoading, hapticFeedback, triggerBounce, onPress],
  );

  // Memoize animated styles for performance
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: bounceAnimValue.value}],
    };
  }, [bounceAnimValue]);

  // Dynamically generate button styles based on variant and size
  const buttonStyles = useMemo(() => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
    };

    // Apply variant-specific styles
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = theme.colors.secondary;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 2;
        baseStyle.borderColor = theme.colors.primary;
        break;
      case 'danger':
        baseStyle.backgroundColor = theme.colors.destructive;
        break;
      case 'success':
        baseStyle.backgroundColor = theme.colors.accent;
        break;
    }

    // Apply size-specific styles
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = 8;
        baseStyle.paddingHorizontal = 12;
        break;
      case 'large':
        baseStyle.paddingVertical = 16;
        baseStyle.paddingHorizontal = 24;
        break;
      default: // medium
        baseStyle.paddingVertical = 12;
        baseStyle.paddingHorizontal = 16;
    }

    return baseStyle;
  }, [theme, variant, size]);

  // Dynamically generate text styles based on variant and size
  const textStyleComputed = useMemo(() => {
    const baseStyle: TextStyle = {
      color: theme.colors.buttonText,
      fontWeight: 'bold',
      textAlign: 'center',
    };

    // Apply variant-specific text styles
    if (variant === 'outline') {
      baseStyle.color = theme.colors.text;
    }

    // Apply size-specific text styles
    switch (size) {
      case 'small':
        baseStyle.fontSize = 14;
        break;
      case 'large':
        baseStyle.fontSize = 18;
        break;
      default: // medium
        baseStyle.fontSize = 16;
    }

    return baseStyle;
  }, [theme, variant, size]);

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.button, buttonStyles, style]}
        onPress={handlePress}
        disabled={isLoading || rest.disabled}
        activeOpacity={0.8}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{disabled: isLoading || rest.disabled}}
        testID="button"
        {...rest}>
        {isLoading ? (
          <ActivityIndicator
            color={
              variant === 'outline'
                ? theme.colors.primary
                : theme.colors.buttonText
            }
            size="small"
          />
        ) : (
          <>
            {leftIcon && <>{leftIcon}</>}
            <Text style={[styles.text, textStyleComputed, textStyle]}>
              {label}
            </Text>
            {rightIcon && <>{rightIcon}</>}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
    gap: 8,
  },
  text: {
    lineHeight: 20,
  },
});

export default React.memo(Button);
