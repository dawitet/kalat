// src/components/LoadingScreen.tsx
import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../providers/ThemeProvider'; // Adjust path
// import { Theme } from '../styles/theme'; // Type if needed

// --- Props Interface ---
interface LoadingScreenProps {
  style?: ViewStyle; // Allow parent to pass style (e.g., for absolute positioning)
}

// --- LoadingScreen Component ---
const LoadingScreen: React.FC<LoadingScreenProps> = React.memo(({style}) => {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();

  // --- Animation Setup ---
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current; // For potential fade out

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true, // Rotation is supported by native driver
      }),
    );
    spinAnimation.start();

    // Optional: Cleanup animation on unmount
    return () => spinAnimation.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Dynamic styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary, // Use theme background
      position: 'absolute', // Often used as an overlay
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000, // Ensure it's on top
    },
    contentContainer: {
      alignItems: 'center',
      // Adjust vertical position if needed, e.g., padding bottom for footer
      paddingBottom: 80, // Make space for footer
    },
    title: {
      fontSize: 42, // Larger title
      fontWeight: 'bold',
      color: theme.colors.text, // Use theme text color
      marginBottom: 30, // Increased space
    },
    spinnerImage: {
      width: 70, // Adjust size
      height: 70,
      marginBottom: 40, // Space above footer
    },
    footerContainer: {
      position: 'absolute',
      bottom: 0, // Position at the very bottom
      left: 0,
      right: 0,
      paddingHorizontal: 20,
      // Adjust bottom padding to include safe area and desired spacing
      paddingBottom: insets.bottom + 20,
      alignItems: 'center', // Center footer content
    },
    footerLogo: {
      // Optional logo style
      width: 30,
      height: 30,
      marginBottom: 8,
    },
    footerText: {
      textAlign: 'center',
      fontSize: 13,
      color: theme.colors.hint, // Use theme hint color
      lineHeight: 18,
    },
  });

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}, style]}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>ቃላት</Text>
        <Animated.Image
          source={require('../assets/images/icons/adey.png')}
          style={[styles.spinnerImage, {transform: [{rotate: spin}]}]}
          resizeMode="contain"
        />
      </View>

      <View style={styles.footerContainer}>
        {/* <Image
                     source={require('../assets/images/icons/dog.png')}
                     style={styles.footerLogo}
                     resizeMode="contain"
                 /> */}
        <Text style={styles.footerText}>
          ቡቺ ስቱዲዮ | የዳዊት ስራ | © {new Date().getFullYear()}
        </Text>
      </View>
    </Animated.View>
  );
});

export default LoadingScreen;
