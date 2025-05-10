import { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
// import { useTheme } from '../context/ThemeContext'; // Removed unused theme import

// type SoundEffect = { // Removed unused SoundEffect type
//   play: () => void;
//   stop: () => void;
// };

export const useSound = () => {
  // const { theme } = useTheme(); // Removed unused theme variable
  const sounds = useRef<{ [key: string]: any /* HTMLAudioElement */ }>({}); // Changed HTMLAudioElement to any for now

  const loadSound = useCallback((name: string, url: string) => {
    if (Platform.OS === 'web') {
      // const audio = new Audio(url); // Commented out Web Audio API specific code
      // audio.preload = 'auto';
      // sounds.current[name] = audio;
      console.log(`Web sound loading (mock): ${name} from ${url}`);
    }
    // For React Native, you would use expo-av or similar here
    // Example with expo-av:
    // const { sound } = await Audio.Sound.createAsync({ uri: url });
    // sounds.current[name] = sound;
  }, []);

  const playSound = useCallback((name: string) => {
    if (Platform.OS === 'web' && sounds.current[name]) {
      // sounds.current[name].currentTime = 0;
      // sounds.current[name].play().catch(error => {
      //   console.warn('Error playing sound:', error);
      // });
      console.log(`Web sound playing (mock): ${name}`);
    }
    // Example with expo-av:
    // await sounds.current[name]?.setPositionAsync(0);
    // await sounds.current[name]?.playAsync();
  }, []);

  const stopSound = useCallback((name: string) => {
    if (Platform.OS === 'web' && sounds.current[name]) {
      // sounds.current[name].pause();
      // sounds.current[name].currentTime = 0;
      console.log(`Web sound stopping (mock): ${name}`);
    }
    // Example with expo-av:
    // await sounds.current[name]?.stopAsync();
    // await sounds.current[name]?.setPositionAsync(0);
  }, []);

  const playHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'medium') => {
    const nav = (globalThis as any).navigator as { vibrate?: (pattern: number | number[]) => boolean };
    if (Platform.OS === 'web' && nav.vibrate) {
      // Comment out navigator.vibrate usage (not available in React Native)
      // switch (type) { // Commented out navigator.vibrate calls
      //   case 'light':
      //     // navigator.vibrate(10); // Commented out
      //     break;
      //   case 'medium':
      //     // navigator.vibrate(20); // Commented out
      //     break;
      //   case 'heavy':
      //     // navigator.vibrate(30); // Commented out
      //     break;
      // }
      console.log(`Web haptic (mock): ${type}`);
    }
    // For React Native haptics, you'd use expo-haptics
    // import * as Haptics from 'expo-haptics';
    // if (type === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // etc.
  }, []);

  useEffect(() => {
    return () => {
      if (Platform.OS === 'web') {
        Object.values(sounds.current).forEach((_sound: any) => { // Marked sound as unused
          // _sound.pause(); // Commented out Web Audio API specific code
          // _sound.src = '';
        });
        sounds.current = {};
      }
      // Example with expo-av:
      // Object.values(sounds.current).forEach(sound => sound?.unloadAsync());
    };
  }, []);

  return {
    loadSound,
    playSound,
    stopSound,
    playHapticFeedback,
  };
};
