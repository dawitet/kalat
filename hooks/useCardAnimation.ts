// src/hooks/useCardAnimation.ts
import {useEffect} from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

interface CardAnimationOptions {
  delay?: number;
  damping?: number;
  stiffness?: number;
  mass?: number;
  useNativeDriver?: boolean;
}

const defaultOptions = {
  delay: 0,
  damping: 12,
  stiffness: 100,
  mass: 0.8,
  useNativeDriver: true,
};

/**
 * Custom hook for card animation with scale and translateY effects
 *
 * @param visible Whether the card should be visible
 * @param options Animation configuration options
 * @returns Animation value and style
 */
export const useCardAnimation = (
  visible: boolean,
  options: CardAnimationOptions = {},
) => {
  const animValue = useSharedValue(0);
  const {delay, damping, stiffness, mass, useNativeDriver} = {
    ...defaultOptions,
    ...options,
  };

  // Initialize animation when visible status changes
  useEffect(() => {
    if (visible) {
      const springConfig = {
        damping,
        stiffness,
        mass,
        useNativeDriver,
      };

      animValue.value = withDelay(delay, withSpring(1, springConfig));
    } else {
      animValue.value = 0;
    }
  }, [visible, animValue, delay, damping, stiffness, mass, useNativeDriver]);

  // Create animated style
  const animStyle = useAnimatedStyle(() => ({
    opacity: animValue.value,
    transform: [
      {
        scale: interpolate(
          animValue.value,
          [0, 1],
          [0.8, 1],
          Extrapolate.CLAMP,
        ),
      },
      {
        translateY: interpolate(
          animValue.value,
          [0, 1],
          [20, 0],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  return {
    animValue,
    animStyle,
  };
};
