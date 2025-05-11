/* eslint-disable @typescript-eslint/no-var-requires */
// Custom React Native Reanimated mock to avoid hook errors
const Reanimated = require('react-native-reanimated/mock');
const { View } = require('react-native');

module.exports = {
  ...Reanimated,
  useSharedValue: (init) => ({ value: init }),
  useAnimatedStyle: (fn) => fn(),
  View,
  Easing: {
    linear: (x) => x,
    ease: (x) => x,
    in: (x) => x,
    out: (x) => x,
    inOut: (x) => x,
    cubic: 1,
  },
  withTiming: (value) => value,
  withSpring: (value) => value,
  withSequence: (...args) => args[args.length - 1],
  withRepeat: (value) => value,
  withDelay: (_time, value) => value,
  interpolate: (value) => value,
};
