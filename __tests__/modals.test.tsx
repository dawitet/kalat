// src/__tests__/modals.test.tsx
import React from 'react';
import {render, fireEvent, act} from '@testing-library/react-native';
import {ThemeProvider} from '../providers/ThemeProvider';
import {GameContext} from '../context/GameContext';
import {initialState} from '../context/initialState';
import {GameContextType, GameState, GameActionType, UIAction} from '../types';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RulesModal from '../components/modals/RulesModal';
import StreakModal from '../components/modals/StreakModal';
import CreditsModal from '../components/modals/CreditsModal';

// Mock Haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return {
    ...Reanimated,
    useSharedValue: jest.fn(() => ({value: 0})),
    withSpring: jest.fn(() => 1),
    withDelay: jest.fn(() => 1),
    useAnimatedStyle: jest.fn(() => ({})),
    interpolate: jest.fn(() => 0),
    Extrapolate: {CLAMP: 'clamp'},
  };
});

// Mock only the Linking module to avoid native DevMenu error
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(() => Promise.resolve()),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  getInitialURL: jest.fn(() => Promise.resolve(null)),
}));

// Wrap component with necessary providers
const renderWithProviders = (ui: React.ReactElement) => {
  const mockGameState: GameState = {
    ...initialState, // Spread initial state
    userId: 'test-user', // Provide userId so modal renders properly
    // Add specific streak data for StreakModal tests
    currentStreak: 5,
    maxStreak: 10,
    bestTimeHard: 120000, // Example time in ms
    gamesPlayed: 20,
    // Ensure other necessary fields from GameState are present if StreakModal uses them
  };
  const mockDispatch = jest.fn();
  const mockContextValue: GameContextType = {
    gameState: mockGameState,
    dispatch: mockDispatch as React.Dispatch<GameActionType | UIAction>,
  };

  return render(
    <SafeAreaProvider initialMetrics={{frame: {x: 0, y: 0, width: 0, height: 0}, insets: {top: 0, left: 0, right: 0, bottom: 0}}}>
      <ThemeProvider>
        <GameContext.Provider value={mockContextValue}>
          {ui}
        </GameContext.Provider>
      </ThemeProvider>
    </SafeAreaProvider>,
  );
};

describe('Modal Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('RulesModal', () => {
    it('renders correctly when visible', () => {
      const onClose = jest.fn();
      const {getByText} = renderWithProviders(
        <RulesModal visible={true} onClose={onClose} />,
      );

      // Test modal content rendering
      expect(
        getByText('ግብዎ አራት ፊደል ያለውን የተደበቀ ቃል በሶስት ወይም ከዚያ ባነሰ ሙከራ መገመት ነው።'),
      ).toBeTruthy();
      expect(getByText('የደረጃ ልዩነቶች')).toBeTruthy();

      // Test close button
      const closeButton = getByText('ዝጋ');
      expect(closeButton).toBeTruthy();

      fireEvent.press(closeButton);
      expect(onClose).toHaveBeenCalled();
    });

    it('does not render when not visible', () => {
      const {queryByText} = renderWithProviders(
        <RulesModal visible={false} onClose={jest.fn()} />,
      );

      expect(
        queryByText('ግብዎ አራት ፊደል ያለውን የተደበቀ ቃል በሶስት ወይም ከዚያ ባነሰ ሙከራ መገመት ነው።'),
      ).toBeNull();
    });
  });

  describe('StreakModal', () => {
    it('renders correctly when visible', () => {
      const onClose = jest.fn();
      const {getByText} = renderWithProviders(
        <StreakModal visible={true} onClose={onClose} />,
      );

      // Test modal content rendering
      expect(getByText('ማጋራት')).toBeTruthy();
      expect(getByText('ዝጋ')).toBeTruthy();

      // Test close button
      const closeButton = getByText('ዝጋ');
      fireEvent.press(closeButton);
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('CreditsModal', () => {
    it('renders correctly when visible', () => {
      const onClose = jest.fn();
      const {getByText} = renderWithProviders(
        <CreditsModal visible={true} onClose={onClose} />,
      );

      // Test modal content rendering
      expect(getByText('የቃላት ፈጣሪዎች')).toBeTruthy();
      expect(getByText('Dawit Sahle')).toBeTruthy();
      expect(getByText('ግብረመልስ ይስጡ')).toBeTruthy();

      // Test close button
      const closeButton = getByText('ዝጋ');
      fireEvent.press(closeButton);
      expect(onClose).toHaveBeenCalled();
    });

    it('opens feedback link when feedback button is pressed', async () => {
      const {getByText} = renderWithProviders(
        <CreditsModal visible={true} onClose={jest.fn()} />,
      );

      const feedbackButton = getByText('ግብረመልስ ይስጡ');

      await act(async () => {
        fireEvent.press(feedbackButton);
      });

      // Using jest.requireMock instead of require
      const Linking = jest.requireMock('react-native/Libraries/Linking/Linking');
      expect(Linking.canOpenURL).toHaveBeenCalled();
      expect(Linking.openURL).toHaveBeenCalled();
    });
  });
});
