// src/components/common/LoadingState.tsx
import React, {memo} from 'react';
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useCardAnimation} from '../../hooks/useCardAnimation';
import {useTheme} from '../../providers/ThemeProvider';
import Animated from 'react-native-reanimated';
import Button from './Button';

export interface LoadingStateProps {
  /**
   * Whether the component is in loading state
   */
  isLoading: boolean;

  /**
   * Optional message to display during loading
   */
  loadingMessage?: string;

  /**
   * Whether to show error state instead of loading
   */
  hasError?: boolean;

  /**
   * Error message to display
   */
  errorMessage?: string;

  /**
   * Function to retry after error
   */
  onRetry?: () => void;

  /**
   * Custom retry button text
   * @default "Try Again"
   */
  retryText?: string;

  /**
   * Style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Size of the loading indicator
   * @default "large"
   */
  size?: 'small' | 'large';
}

/**
 * Reusable loading and error state component
 * with smooth animations and consistent styling
 */
const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  loadingMessage,
  hasError,
  errorMessage,
  onRetry,
  retryText = 'Try Again',
  style,
  size = 'large',
}) => {
  const {theme} = useTheme();
  const {animStyle} = useCardAnimation(isLoading || !!hasError);

  if (!isLoading && !hasError) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {backgroundColor: theme.colors.primary},
        animStyle,
        style,
      ]}>
      {isLoading ? (
        <>
          <ActivityIndicator size={size} color={theme.colors.accent} />
          {loadingMessage && (
            <Text style={[styles.message, {color: theme.colors.text}]}>
              {loadingMessage}
            </Text>
          )}
        </>
      ) : hasError ? (
        <>
          <Text
            style={[
              styles.message,
              styles.errorText,
              {color: theme.colors.destructive},
            ]}>
            {errorMessage || 'Something went wrong'}
          </Text>
          {onRetry && (
            <Button
              label={retryText}
              variant="primary"
              onPress={onRetry}
              style={styles.retryButton}
            />
          )}
        </>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    marginBottom: 16,
  },
  retryButton: {
    minWidth: 120,
  },
});

export default memo(LoadingState);
