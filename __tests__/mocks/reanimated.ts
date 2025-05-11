// Mock for react-native-reanimated used in tests
import originalReanimatedMock from 'react-native-reanimated/mock';

// Create an enhanced mock object
const enhancedMock = {
  // Spread the original mock to get all its properties
  ...originalReanimatedMock,
  // Ensure default and default.call are defined
  default: {
    ...(originalReanimatedMock.default || {}),
    call: () => {},
  },
  // Add or override other mock implementations as needed
  useSharedValue: jest.fn((initialValue) => ({ value: initialValue })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn((value) => value),
  withSpring: jest.fn((value) => value),
  withDelay: jest.fn((_, value) => value),
  withSequence: jest.fn((value) => value),
  withRepeat: jest.fn((value) => value),
  runOnJS: jest.fn((callback) => callback),
  interpolate: jest.fn(() => 0),
  Extrapolate: { ...(originalReanimatedMock.Extrapolate || {}), CLAMP: 'clamp' },
};

export default enhancedMock;
