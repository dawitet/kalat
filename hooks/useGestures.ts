import {useCallback} from 'react';
import {
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
} from 'react-native';

type GestureCallbacks = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
};

export const useGestures = (callbacks: GestureCallbacks) => {
  const SWIPE_THRESHOLD = 50;
  const SWIPE_VELOCITY_THRESHOLD = 0.3;
  const LONG_PRESS_DURATION = 500;

  const handlePanResponderRelease = useCallback(
    (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      const {dx, dy, vx, vy} = gestureState;

      // Handle horizontal swipes
      if (
        Math.abs(dx) > SWIPE_THRESHOLD ||
        Math.abs(vx) > SWIPE_VELOCITY_THRESHOLD
      ) {
        if (dx > 0) {
          callbacks.onSwipeRight?.();
        } else {
          callbacks.onSwipeLeft?.();
        }
        return;
      }

      // Handle vertical swipes
      if (
        Math.abs(dy) > SWIPE_THRESHOLD ||
        Math.abs(vy) > SWIPE_VELOCITY_THRESHOLD
      ) {
        if (dy > 0) {
          callbacks.onSwipeDown?.();
        } else {
          callbacks.onSwipeUp?.();
        }
        return;
      }

      // Handle tap
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
        callbacks.onTap?.();
      }
    },
    [callbacks],
  );

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // Start long press timer
      const longPressTimer = setTimeout(() => {
        callbacks.onLongPress?.();
      }, LONG_PRESS_DURATION);

      // Store timer ID for cleanup
      (panResponder as any).longPressTimer = longPressTimer;
    },
    onPanResponderRelease: handlePanResponderRelease,
    onPanResponderTerminate: () => {
      // Clear long press timer
      if ((panResponder as any).longPressTimer) {
        clearTimeout((panResponder as any).longPressTimer);
      }
    },
  });

  return panResponder;
};
