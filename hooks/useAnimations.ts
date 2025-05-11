import {useCallback, useEffect} from 'react';
import {
  useSharedValue,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  useAnimatedStyle,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';

interface AnimationParams {
  onComplete?: () => void;
  duration?: number;
  delay?: number;
}

interface TileAnimationParams extends AnimationParams {
  index?: number; // Index in the row for delay calculation
  rowIndex?: number; // Row index for coordinated animations
}

/**
 * Central hook for all game animations
 * Provides specialized hooks for tile, row and grid animations with consistent API
 */
export const useAnimations = () => {
  // Base shared animation values
  const shakeAnim = useSharedValue(0);
  const flipAnim = useSharedValue(0);
  const popInAnim = useSharedValue(0);
  const bounceAnim = useSharedValue(0);

  // Basic animations that manipulate shared values
  const shakeAnimation = useCallback(
    (params?: AnimationParams) => {
      shakeAnim.value = 0; // Reset before animation
      shakeAnim.value = withSequence(
        withTiming(-5, {duration: (params?.duration || 600) / 6}),
        withRepeat(
          withTiming(5, {duration: (params?.duration || 600) / 6}),
          5,
          true,
        ),
        withTiming(0, {duration: (params?.duration || 600) / 6}, () => {
          if (params?.onComplete) {
            runOnJS(params.onComplete)();
          }
        }),
      );
    },
    [shakeAnim],
  );

  const flipAnimation = useCallback(
    (params?: AnimationParams) => {
      flipAnim.value = 0;
      flipAnim.value = withTiming(
        1,
        {
          duration: params?.duration || 600,
          easing: Easing.inOut(Easing.ease),
        },
        () => {
          if (params?.onComplete) {
            runOnJS(params.onComplete)();
          }
        },
      );
    },
    [flipAnim],
  );

  const popInAnimation = useCallback(
    (params?: AnimationParams) => {
      popInAnim.value = 0;
      popInAnim.value = withSpring(
        1,
        {
          damping: 15,
          stiffness: 150,
          mass: 0.5,
        },
        () => {
          if (params?.onComplete) {
            runOnJS(params.onComplete)();
          }
        },
      );
    },
    [popInAnim],
  );

  const bounceAnimation = useCallback(
    (params?: AnimationParams) => {
      bounceAnim.value = 0;
      bounceAnim.value = withSequence(
        withTiming(1.2, {duration: (params?.duration || 300) / 3}),
        withTiming(0.95, {duration: (params?.duration || 300) / 3}),
        withTiming(1, {duration: (params?.duration || 300) / 3}, () => {
          if (params?.onComplete) {
            runOnJS(params.onComplete)();
          }
        }),
      );
    },
    [bounceAnim],
  );

  // Component-specific animation hooks

  /**
   * Hook for tile flip animation
   * @param isFlipping Whether the tile should be flipping
   * @param params Animation parameters like delay, onComplete callback
   * @returns Animated styles for the tile
   */
  const useTileFlip = (isFlipping: boolean, params?: TileAnimationParams) => {
    const tileFlip = useSharedValue(0);

    useEffect(() => {
      if (isFlipping) {
        const animationFn = () => {
          tileFlip.value = 0; // Reset
          tileFlip.value = withDelay(
            params?.delay || (params?.index || 0) * 300,
            withTiming(
              1,
              {
                duration: params?.duration || 600,
                easing: Easing.inOut(Easing.ease),
              },
              () => {
                if (params?.onComplete) {
                  runOnJS(params.onComplete)();
                }
              },
            ),
          );
        };
        animationFn();
      }
    }, [
      isFlipping,
      params?.index,
      params?.delay,
      params?.duration,
      params?.onComplete,
      tileFlip,
    ]);

    const animatedStyles = useAnimatedStyle(() => {
      const rotateY = interpolate(
        tileFlip.value,
        [0, 0.5, 1],
        [0, 90, 0], // Full flip animation
      );

      const scale = interpolate(
        tileFlip.value,
        [0, 0.5, 1],
        [1, 1.1, 1], // Slight scale up during flip
      );

      return {
        transform: [{perspective: 800}, {rotateY: `${rotateY}deg`}, {scale}],
      };
    });

    return {animatedStyles, isAnimating: tileFlip.value !== 0};
  };

  /**
   * Hook for row shake animation (for invalid inputs)
   * @param shouldShake Whether the row should be shaking
   * @param params Animation parameters
   * @returns Animated styles for the row
   */
  const useRowShake = (shouldShake: boolean, params?: AnimationParams) => {
    const rowShake = useSharedValue(0);

    useEffect(() => {
      if (shouldShake) {
        rowShake.value = 0; // Reset
        rowShake.value = withSequence(
          withTiming(-10, {duration: (params?.duration || 500) / 6}),
          withRepeat(
            withTiming(10, {duration: (params?.duration || 500) / 6}),
            4,
            true,
          ),
          withTiming(0, {duration: (params?.duration || 500) / 6}, () => {
            if (params?.onComplete) {
              runOnJS(params.onComplete)();
            }
          }),
        );
      }
    }, [shouldShake, params?.duration, params?.onComplete, rowShake]);

    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{translateX: rowShake.value}],
      };
    });

    return {animatedStyles, isAnimating: rowShake.value !== 0};
  };

  /**
   * Hook for grid pop animation (for win/lose reveals)
   * @param shouldPop Whether the grid should pop
   * @param params Animation parameters
   * @returns Animated styles for grid
   */
  const useGridPop = (shouldPop: boolean, params?: AnimationParams) => {
    const gridPop = useSharedValue(0);

    useEffect(() => {
      if (shouldPop) {
        gridPop.value = 0; // Reset
        gridPop.value = withSequence(
          withTiming(1.05, {duration: (params?.duration || 400) / 2}),
          withTiming(
            1,
            {
              duration: (params?.duration || 400) / 2,
              easing: Easing.bounce,
            },
            () => {
              if (params?.onComplete) {
                runOnJS(params.onComplete)();
              }
            },
          ),
        );
      }
    }, [shouldPop, params?.duration, params?.onComplete, gridPop]);

    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{scale: gridPop.value}],
      };
    });

    return {animatedStyles, isAnimating: gridPop.value !== 0};
  };

  /**
   * Hook that creates styled keyframes for letter input feedback
   */
  const useKeyFeedback = (pressed: boolean) => {
    const keyFeedback = useSharedValue(0);

    useEffect(() => {
      if (pressed) {
        keyFeedback.value = withSequence(
          withTiming(1, {duration: 50}),
          withTiming(0, {duration: 100}),
        );
      }
    }, [pressed, keyFeedback]);

    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{scale: interpolate(keyFeedback.value, [0, 1], [1, 0.9])}],
        opacity: interpolate(keyFeedback.value, [0, 1], [1, 0.7]),
      };
    });

    return animatedStyles;
  };

  // Return all animation utilities
  return {
    // Basic animations that manipulate shared values
    shakeAnimValue: shakeAnim,
    flipAnimValue: flipAnim,
    popInAnimValue: popInAnim,
    bounceAnimValue: bounceAnim,

    // Animation triggers
    triggerShake: shakeAnimation,
    triggerFlip: flipAnimation,
    triggerPopIn: popInAnimation,
    triggerBounce: bounceAnimation,

    // Component-specific animation hooks
    useTileFlip,
    useRowShake,
    useGridPop,
    useKeyFeedback,
  };
};
