// src/styles/theme.ts
import {Platform} from 'react-native';

// --- Color Definition Interfaces ---
interface TileColorSet {
  background: string;
  text: string;
  borderEmpty: string;
  borderFilled: string;
  correct: string;
  present: string;
  absent: string;
  feedbackText: string;
}

interface KeyColorSet {
  background: string;
  text: string;
  delete: string; // Background for special keys like Backspace/Enter
  specialText: string; // Text color for special keys
}

interface SuggestionKeyColorSet {
  background: string; // If different from normal keys
  text: string; // If different from normal keys
}

interface KeyboardColorSet {
  background: string;
  key: KeyColorSet;
  suggestion: SuggestionKeyColorSet;
}

interface ModalColorSet {
  background: string;
  border: string;
}

// --- Main Theme Color Interface ---
export interface ThemeColors {
  // Core Palette
  primary: string; // Main app background
  secondary: string; // Cards, Modals, Secondary backgrounds
  accent: string; // Buttons, active elements, highlights
  destructive: string; // Errors, destructive actions
  notification: string; // Added notification color

  // Text Palette
  text: string; // Primary text color
  textSecondary: string; // Secondary text (on primary/secondary bg)
  hint: string; // Hint text, placeholders
  link: string; // Link text color
  buttonText: string; // Text on accent-colored buttons
  textOnAccent: string; // Text on accent background (usually same as buttonText)
  textOnDestructive: string; // Text on destructive background (usually white)

  // Component-Specific Palettes
  tile: TileColorSet;
  keyboard: KeyboardColorSet;
  modal: ModalColorSet;

  // General UI Elements
  border: string; // Default border color
  shadow: string; // Shadow color (often black with opacity)
  statusBar: 'light-content' | 'dark-content'; // For status bar style
}

// --- Theme Definitions ---

export const lightThemeColors: ThemeColors = {
  primary: '#FFFFFF',
  secondary: '#F2F2F7',
  accent: '#007AFF',
  destructive: '#FF3B30',
  notification: '#FF9500', // Example notification color (orange)
  text: '#000000',
  textSecondary: '#3C3C43',
  hint: '#8A8A8E',
  link: '#007AFF',
  buttonText: '#FFFFFF',
  textOnAccent: '#FFFFFF',
  textOnDestructive: '#FFFFFF',
  tile: {
    background: '#FFFFFF',
    text: '#000000',
    borderEmpty: '#D1D1D6',
    borderFilled: '#8A8A8E',
    correct: '#4CAF50',
    present: '#FFC107',
    absent: '#9E9E9E',
    feedbackText: '#FFFFFF',
  },
  keyboard: {
    background: '#CFD8DC',
    key: {
      background: '#FFFFFF',
      text: '#000000',
      delete: '#B0BEC5',
      specialText: '#000000',
    },
    suggestion: {
      background: '#FFFFFF',
      text: '#000000',
    },
  },
  modal: {
    background: '#F2F2F7',
    border: '#D1D1D6',
  },
  border: '#C7C7CC',
  shadow: '#000000',
  statusBar: 'dark-content',
};

export const darkThemeColors: ThemeColors = {
  primary: '#000000',
  secondary: '#1C1C1E',
  accent: '#0A84FF',
  destructive: '#FF453A',
  notification: '#FF9F0A', // Example notification color for dark theme (brighter orange)
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  hint: '#8A8A8E',
  link: '#0A84FF',
  buttonText: '#FFFFFF',
  textOnAccent: '#FFFFFF',
  textOnDestructive: '#FFFFFF',
  tile: {
    background: '#121213',
    text: '#FFFFFF',
    borderEmpty: '#3A3A3C',
    borderFilled: '#565658',
    correct: '#4CAF50',
    present: '#FFC107',
    absent: '#3A3A3C',
    feedbackText: '#FFFFFF',
  },
  keyboard: {
    background: '#000000',
    key: {
      background: '#555558',
      text: '#FFFFFF',
      delete: '#3A3A3C',
      specialText: '#FFFFFF',
    },
    suggestion: {
      background: '#555558',
      text: '#FFFFFF',
    },
  },
  modal: {
    background: '#1C1C1E',
    border: '#38383A',
  },
  border: '#38383A',
  shadow: '#000000',
  statusBar: 'light-content',
};

// --- Spacing, Typography, Borders, Shadows ---
export const spacing = {xs: 4, sm: 8, md: 16, lg: 24, xl: 32};
export const borderRadius = {sm: 4, md: 8, lg: 12, xl: 16, full: 9999};
export const typography = {
  fontFamilyRegular: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  fontFamilyBold: Platform.OS === 'ios' ? 'System' : 'sans-serif-bold',
  fontSize: {xs: 12, sm: 14, md: 16, lg: 18, xl: 20, title: 24, header: 28},
};
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
};

// --- Define the final Theme structure ---
export interface Theme {
  colors: ThemeColors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
  shadows: typeof shadows;
}

// --- Export themes ---
export const lightTheme: Theme = {
  colors: lightThemeColors,
  spacing,
  borderRadius,
  typography,
  shadows,
};
export const darkTheme: Theme = {
  colors: darkThemeColors,
  spacing,
  borderRadius,
  typography,
  shadows,
};

// Define the type for the context provider value
export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setThemePreference: (preference: 'light' | 'dark' | 'system') => void;
}
