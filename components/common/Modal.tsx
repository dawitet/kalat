// src/components/common/Modal.tsx
import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../providers/ThemeProvider';

const {height: WINDOW_HEIGHT} = Dimensions.get('window');

export interface ModalProps {
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
   * Should the modal animate from the bottom (slide up)
   * @default true
   */
  slideAnimation?: boolean;

  /**
   * Duration of the animation in milliseconds
   * @default 300
   */
  animationDuration?: number;

  /**
   * Use keyboard avoiding view (for forms with inputs)
   * @default false
   */
  avoidKeyboard?: boolean;

  /**
   * Style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Style for the modal content container
   */
  contentStyle?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  closeOnBackdropPress = true,
  slideAnimation = true,
  animationDuration = 300,
  avoidKeyboard = false,
  style,
  contentStyle,
  testID = 'modal',
}) => {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();

  // Animation values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(slideAnimation ? WINDOW_HEIGHT : 0);
  const scale = useSharedValue(slideAnimation ? 1 : 0.95);

  useEffect(() => {
    if (visible) {
      // Show animation
      opacity.value = withTiming(1, {
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
      });

      if (slideAnimation) {
        translateY.value = withTiming(0, {
          duration: animationDuration,
          easing: Easing.out(Easing.cubic),
        });
      } else {
        scale.value = withTiming(1, {
          duration: animationDuration,
          easing: Easing.out(Easing.cubic),
        });
      }
    } else {
      // Hide animation
      opacity.value = withTiming(0, {
        duration: animationDuration,
        easing: Easing.in(Easing.cubic),
      });

      if (slideAnimation) {
        translateY.value = withTiming(WINDOW_HEIGHT, {
          duration: animationDuration,
          easing: Easing.in(Easing.cubic),
        });
      } else {
        scale.value = withTiming(0.95, {
          duration: animationDuration,
          easing: Easing.in(Easing.cubic),
        });
      }
    }
  }, [visible, animationDuration, opacity, translateY, scale, slideAnimation]);

  // Animated styles for backdrop and content
  const backdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value * 0.7, // Semi-transparent backdrop
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{translateY: translateY.value}, {scale: scale.value}],
    };
  });

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  // Don't render anything if not visible and animation is complete
  if (!visible && opacity.value === 0) {
    return null;
  }

  // Determine safe area padding
  const safeAreaPadding = {
    paddingTop: insets.top || 20,
    paddingBottom: insets.bottom || 20,
    paddingLeft: insets.left || 20,
    paddingRight: insets.right || 20,
  };

  return (
    <View style={[styles.container, style]} testID={testID}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View
          style={[styles.backdrop, backdropAnimatedStyle]}
          testID="modal-backdrop"
        />
      </TouchableWithoutFeedback>

      {/* Modal Content */}
      <KeyboardAvoidingView
        behavior={
          avoidKeyboard
            ? Platform.OS === 'ios'
              ? 'padding'
              : 'height'
            : undefined
        }
        style={styles.keyboardAvoidingView}>
        <Animated.View
          style={[
            styles.contentContainer,
            {backgroundColor: theme.colors.secondary},
            safeAreaPadding,
            contentAnimatedStyle,
            contentStyle,
          ]}>
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  contentContainer: {
    margin: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: '80%',
  },
});

export default React.memo(Modal);
