// Declaration file for react-native-reanimated/mock
// This resolves the TypeScript error: "Could not find a declaration file for module 'react-native-reanimated/mock'"

interface ReanimatedMockModule {
  useSharedValue: <T>(initialValue: T) => { value: T };
  useAnimatedStyle: (callback: () => Record<string, unknown>) => Record<string, unknown>;
  withTiming: (toValue: number, config?: Record<string, unknown>) => number;
  withSpring: (toValue: number, config?: Record<string, unknown>) => number;
  withDelay: (delay: number, animation: number) => number;
  runOnJS: <T extends (...args: unknown[]) => unknown>(fn: T) => T;
  interpolate: (value: number, config: { inputRange: number[]; outputRange: number[] }) => number;
  Extrapolate?: { CLAMP: string };
  default?: {
    call?: () => void;
    // Other properties that might be on 'default'
  };
  // Add any other properties that the base mock object might have
}

declare module 'react-native-reanimated/mock' {
  const mock: ReanimatedMockModule;
  export default mock;

  // Optionally, re-export individuals if the mock module also provides them as named exports
  export const useSharedValue: ReanimatedMockModule['useSharedValue'];
  export const useAnimatedStyle: ReanimatedMockModule['useAnimatedStyle'];
  export const withTiming: ReanimatedMockModule['withTiming'];
  export const withSpring: ReanimatedMockModule['withSpring'];
  export const withDelay: ReanimatedMockModule['withDelay'];
  export const runOnJS: ReanimatedMockModule['runOnJS'];
  export const interpolate: ReanimatedMockModule['interpolate'];
  export const Extrapolate: ReanimatedMockModule['Extrapolate'];
}
