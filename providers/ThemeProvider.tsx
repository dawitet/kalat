// src/providers/ThemeProvider.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  useColorScheme,
  Appearance,
  ColorSchemeName,
  StatusBar,
  Platform,
} from 'react-native';
import {ThemeContextType, lightTheme, darkTheme, Theme} from '../styles/theme'; // Adjust path

// Create the theme context with a default value
const defaultThemeContext: ThemeContextType = {
  theme: lightTheme, // Default to light theme initially
  isDark: false,
  toggleTheme: () => console.warn('ThemeProvider not found'),
  setThemePreference: () => console.warn('ThemeProvider not found'),
};
const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

// Theme provider props
interface ThemeProviderProps {
  children: React.ReactNode;
  initialPreference?: 'light' | 'dark' | 'system'; // Optional initial preference
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialPreference = 'system', // Default preference is system
}) => {
  const [themePreference, setThemePreferenceState] = useState<
    'light' | 'dark' | 'system'
  >(initialPreference);
  const systemColorScheme = useColorScheme();

  // Determine if dark mode is active
  const isDark = useMemo(() => {
    if (themePreference === 'system') {
      return systemColorScheme === 'dark';
    }
    return themePreference === 'dark';
  }, [themePreference, systemColorScheme]);

  const theme: Theme = useMemo(
    () => (isDark ? darkTheme : lightTheme),
    [isDark],
  );

  // Toggle between light/dark manual preference
  const toggleTheme = useCallback(() => {
    const newPreference = isDark ? 'light' : 'dark';
    setThemePreferenceState(newPreference);
    // TODO: Persist newPreference to AsyncStorage
  }, [isDark]);

  // Set specific preference
  const setThemePreference = useCallback(
    (preference: 'light' | 'dark' | 'system') => {
      setThemePreferenceState(preference);
      // TODO: Persist preference to AsyncStorage
    },
    [],
  );

  // Update status bar
  useEffect(() => {
    StatusBar.setBarStyle(theme.colors.statusBar, true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(theme.colors.primary, true); // Match primary background
    }
  }, [theme]);

  // Listen for system changes when preference is 'system'
  useEffect(() => {
    const listener = ({colorScheme}: {colorScheme: ColorSchemeName}) => {
      if (themePreference === 'system') {
        // The isDark memo recalculates automatically because systemColorScheme changes
        console.log('ThemeProvider: System color scheme changed:', colorScheme);
      }
    };
    const subscription = Appearance.addChangeListener(listener);
    return () => subscription.remove();
  }, [themePreference]);

  // Load preference from AsyncStorage on mount (example)
  // useEffect(() => {
  //     const loadPreference = async () => {
  //         const storedPref = await AsyncStorage.getItem('themePreference');
  //         if (storedPref === 'light' || storedPref === 'dark' || storedPref === 'system') {
  //             setThemePreferenceState(storedPref);
  //         }
  //     };
  //     loadPreference();
  // }, []);

  const contextValue = useMemo(
    () => ({
      theme,
      isDark,
      toggleTheme,
      setThemePreference,
    }),
    [theme, isDark, toggleTheme, setThemePreference],
  ); // Dependencies updated

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context easily
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  return context;
};
