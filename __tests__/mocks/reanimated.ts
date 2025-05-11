// Mock for react-native-reanimated used in tests
import reanimatedMock from 'react-native-reanimated/mock';

// Set up the mock
reanimatedMock.default.call = () => {};

// Add additional mock implementations
const enhancedMock = {
  ...reanimatedMock,
  useSharedValue: jest.fn((initialValue) => ({ value: initialValue })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn((value) => value),
  withSpring: jest.fn((value) => value),
  withDelay: jest.fn((_, value) => value),
  withSequence: jest.fn((value) => value),
  withRepeat: jest.fn((value) => value),
  runOnJS: jest.fn((callback) => callback),
  interpolate: jest.fn(() => 0),
  Extrapolate: { CLAMP: 'clamp' },
};

export default enhancedMock;
