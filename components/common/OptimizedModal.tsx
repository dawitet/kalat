// src/components/OptimizedModal.tsx
import React, { useEffect, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme as useAppTheme } from '../../providers/ThemeProvider';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

export interface OptimizedModalProps {
  /**
   * Whether the modal is visible
   */
  visible: boolean;

  /**
   * Callback when modal is requested to close (via backdrop press or close button)
   */
  onClose: () => void;

  /**
   * Modal content
   */
  children: React.ReactNode;

  /**
   * Should the modal close when backdrop is pressed
   * @default true
   */
  closeOnBackdropPress?: boolean;

  /**
   * Animation duration in milliseconds
   * @default 300
   */
  animationDuration?: number;

  /**
   * Custom style for the modal container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom style for the modal content wrapper
   */
  contentStyle?: StyleProp<ViewStyle>;

  /**
   * Whether the modal should avoid the keyboard
   * @default true
   */
  avoidKeyboard?: boolean;

  /**
   * Whether to use slide-in animation instead of fade-in
   * @default false
   */
  slideAnimation?: boolean;

  /**
   * Test ID for the modal component
   */
  testID?: string;
}

/**
 * Optimized modal component with improved performance and animations
 * - Uses memoization for styles and animations
 * - Optimized with useCallback for event handlers
 * - Uses native driver for animations when possible
 */
const OptimizedModal: React.FC<OptimizedModalProps> = ({
  visible,
  onClose,
  children,
  closeOnBackdropPress = true,
  animationDuration = 300,
  style,
  contentStyle,
  avoidKeyboard = true,
  slideAnimation = false,
  testID,
}) => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  // Animation values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(WINDOW_HEIGHT);

  // Handle backdrop press - memoized to prevent recreation
  const handleBackdropPress = useCallback(() => {
    if (closeOnBackdropPress) {
      onClose();
    }
  }, [closeOnBackdropPress, onClose]);

  // Handle visibility changes with animations
  useEffect(() => {
    if (visible) {
      // Show modal with animation
      opacity.value = withTiming(1, {
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
      });

      if (slideAnimation) {
        translateY.value = withTiming(0, {
          duration: animationDuration,
          easing: Easing.out(Easing.cubic),
        });
      }
    } else {
      // Hide modal with animation
      opacity.value = withTiming(0, {
        duration: animationDuration,
        easing: Easing.in(Easing.cubic),
      });

      if (slideAnimation) {
        translateY.value = withTiming(WINDOW_HEIGHT, {
          duration: animationDuration,
          easing: Easing.in(Easing.cubic),
        });
      }
    }
  }, [visible, opacity, translateY, animationDuration, slideAnimation]);

  // Memoized animated styles for the backdrop
  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Memoized animated styles for the content
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: slideAnimation ? [{ translateY: translateY.value }] : [],
  }));

  // Memoized styles to prevent recreation on each render
  const styles = useMemo(() => StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    contentContainer: {
      width: '85%',
      maxWidth: 500,
      maxHeight: '80%',
      backgroundColor: theme.colors.modal.background, // Corrected theme property
      borderRadius: 12,
      overflow: 'hidden',
      marginTop: insets.top,
      marginBottom: insets.bottom,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    content: {
      padding: 20,
    },
  }), [theme.colors, insets.top, insets.bottom]);

  // Don't render anything when not visible and fully hidden
  if (!visible && opacity.value === 0) {
    return null;
  }

  const ModalContent = (
    <Animated.View
      style={[styles.contentContainer, contentAnimatedStyle, contentStyle]}
      testID={testID}
    >
      <View style={styles.content}>
        {children}
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container} pointerEvents={visible ? 'auto' : 'none'}>
      <StatusBar translucent backgroundColor="rgba(0,0,0,0.5)" />

      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} />
      </TouchableWithoutFeedback>

      {avoidKeyboard && Platform.OS !== 'web' ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={style}
        >
          {ModalContent}
        </KeyboardAvoidingView>
      ) : ModalContent}
    </View>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default React.memo(OptimizedModal);
