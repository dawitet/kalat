// src/__tests__/modals.test.tsx
import React from 'react';
import {render, fireEvent, act} from '@testing-library/react-native';
import {ThemeProvider} from '../providers/ThemeProvider';
import {GameProvider} from '../context/provider';
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
  const Reanimated = require('react-native-reanimated/mock');
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

// Mock Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(() => Promise.resolve()),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
}));

// Wrap component with necessary providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <GameProvider>{ui}</GameProvider>
    </ThemeProvider>,
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

      const Linking = require('react-native/Libraries/Linking/Linking');
      expect(Linking.canOpenURL).toHaveBeenCalled();
      expect(Linking.openURL).toHaveBeenCalled();
    });
  });
});
