import { Animated, Easing } from 'react-native';

// Fade animation
export const fadeIn = (value: Animated.Value, duration = 300) => {
  return Animated.timing(value, {
    toValue: 1,
    duration,
    easing: Easing.ease,
    useNativeDriver: true,
  });
};

export const fadeOut = (value: Animated.Value, duration = 300) => {
  return Animated.timing(value, {
    toValue: 0,
    duration,
    easing: Easing.ease,
    useNativeDriver: true,
  });
};

// Scale animation
export const scaleIn = (value: Animated.Value, duration = 300) => {
  return Animated.timing(value, {
    toValue: 1,
    duration,
    easing: Easing.elastic(1),
    useNativeDriver: true,
  });
};

export const scaleOut = (value: Animated.Value, duration = 300) => {
  return Animated.timing(value, {
    toValue: 0,
    duration,
    easing: Easing.ease,
    useNativeDriver: true,
  });
};

// Slide animation
export const slideIn = (value: Animated.Value, duration = 300) => {
  return Animated.timing(value, {
    toValue: 0,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  });
};

export const slideOut = (value: Animated.Value, duration = 300) => {
  return Animated.timing(value, {
    toValue: 100,
    duration,
    easing: Easing.in(Easing.cubic),
    useNativeDriver: true,
  });
};

// Shake animation
export const shake = (value: Animated.Value) => {
  return Animated.sequence([
    Animated.timing(value, {
      toValue: 10,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: -10,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: 10,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }),
  ]);
};

// Flip animation
export const flip = (value: Animated.Value, duration = 300) => {
  return Animated.timing(value, {
    toValue: 1,
    duration,
    easing: Easing.linear,
    useNativeDriver: true,
  });
};

// Bounce animation
export const bounce = (value: Animated.Value) => {
  return Animated.sequence([
    Animated.timing(value, {
      toValue: 1.2,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ]);
}; 