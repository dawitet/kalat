// src/components/OptimizedLoadingScreen.tsx
import React, {useEffect, useRef, useMemo} from 'react';
import {View, Text, StyleSheet, Animated, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../providers/ThemeProvider';

/**
 * Props for the OptimizedLoadingScreen component
 */
interface OptimizedLoadingScreenProps {
  style?: ViewStyle; // Allow parent to pass style
}

/**
 * Optimized loading screen with improved animations and performance
 */
const OptimizedLoadingScreen: React.FC<OptimizedLoadingScreenProps> = ({
  style,
}) => {
  // Context and hooks
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();

  // Animation values with useRef to persist between renders
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Set up animation when component mounts
  useEffect(() => {
    // Create a loop animation for spinning
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true, // Use native driver for better performance
      }),
    );

    // Start the animation
    spinAnimation.start();

    // Clean up animation on unmount
    return () => spinAnimation.stop();
  }, [spinValue]);

  // Memoize spin interpolation to prevent recalculation on re-renders
  const spin = useMemo(() => {
    return spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
  }, [spinValue]);

  // Memoize styles to prevent recreation on each render
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.primary,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        },
        contentContainer: {
          alignItems: 'center',
          paddingBottom: 80,
        },
        title: {
          fontSize: 42,
          fontWeight: 'bold',
          color: theme.colors.text,
          marginBottom: 30,
        },
        spinnerImage: {
          width: 70,
          height: 70,
          marginBottom: 40,
        },
        footerContainer: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
          alignItems: 'center',
        },
        footerLogo: {
          width: 30,
          height: 30,
          marginBottom: 8,
        },
        footerText: {
          textAlign: 'center',
          fontSize: 13,
          color: theme.colors.hint,
          lineHeight: 18,
        },
      }),
    [theme, insets.bottom],
  );

  // Current year memoized to prevent recalculation
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}, style]}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>ቃላት</Text>
        <Animated.Image
          source={require('../../assets/images/adey.png')}
          style={[styles.spinnerImage, {transform: [{rotate: spin}]}]}
          resizeMode="contain"
        />
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          ቡቺ ስቱዲዮ | የዳዊት ስራ | © {currentYear}
        </Text>
      </View>
    </Animated.View>
  );
};

export default React.memo(OptimizedLoadingScreen);
