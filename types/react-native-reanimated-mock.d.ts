// Declaration file for react-native-reanimated/mock
// This resolves the TypeScript error: "Could not find a declaration file for module 'react-native-reanimated/mock'"

declare module 'react-native-reanimated/mock' {
  const ReanimatedMock: unknown;
  export default ReanimatedMock;
  
  // Common functions used in tests
  export const useSharedValue: <T>(initialValue: T) => { value: T };
  export const useAnimatedStyle: (callback: () => Record<string, unknown>) => Record<string, unknown>;
  export const withTiming: (toValue: number, config?: Record<string, unknown>) => number;
  export const withSpring: (toValue: number, config?: Record<string, unknown>) => number;
  export const withDelay: (delay: number, animation: number) => number;
  export const runOnJS: <T extends (...args: unknown[]) => unknown>(fn: T) => T;
  export const interpolate: (value: number, config: { inputRange: number[]; outputRange: number[] }) => number;
}
