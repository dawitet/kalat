// src/hooks/useAnimatedMemo.ts
import React from 'react';
import {
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';

/**
 * Hook that memoizes animated styles with proper dependencies
 * to prevent unnecessary re-renders and style recalculations
 *
 * @param styleFactory Function that creates animated styles
 * @param deps Array of values that the animated style depends on (SharedValues are handled automatically)
 * @returns Memoized animated style object
 */
export function useAnimatedMemo<T extends Record<string, unknown>>(
  styleFactory: () => T,
  deps: React.DependencyList = [],
): T {
  // Filter out shared values from deps as they are tracked by Reanimated internally
  const filteredDeps = deps.filter(
    dep => !(dep && typeof dep === 'object' && 'value' in (dep as SharedValue<unknown>)),
  );

  // Create the animated style with Reanimated's useAnimatedStyle
  return useAnimatedStyle(styleFactory, filteredDeps);
}

/**
 * Hook that creates an animated style dependent on a shared value
 * Automatically handles adding the shared value to dependencies
 */
export function useAnimatedDependentStyle<T, S extends Record<string, unknown>>(
  styleFactory: () => S,
  value: SharedValue<T>,
  deps: React.DependencyList = [],
): S {
  return useAnimatedMemo(styleFactory, [value, ...deps]);
}
