// src/__tests__/optimized-mainmenu.test.tsx
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import OptimizedMainMenu from '../components/OptimizedMainMenu';
import {ThemeProvider} from '../providers/ThemeProvider';
import {GameProvider} from '../context/GameContext';

// Mock the native modules used in animations
jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock navigation
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

// Wrapper component for tests
const TestWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
  <ThemeProvider>
    <GameProvider>{children}</GameProvider>
  </ThemeProvider>
);

describe('OptimizedMainMenu Component', () => {
  it('renders without crashing', () => {
    const {getByText} = render(
      <TestWrapper>
        <OptimizedMainMenu />
      </TestWrapper>,
    );

    // Check if the title is rendered
    expect(getByText('ቃላት')).toBeTruthy();
  });

  it('renders all menu items', () => {
    const {getByText} = render(
      <TestWrapper>
        <OptimizedMainMenu />
      </TestWrapper>,
    );

    // Check for all menu items
    expect(getByText('የዛሬ ተግዳሮት')).toBeTruthy(); // Daily challenge
    expect(getByText('ልምምድ')).toBeTruthy(); // Practice
    expect(getByText('የእኔ ጉዞ')).toBeTruthy(); // My journey/streak
    expect(getByText('ህግጋት')).toBeTruthy(); // Rules
    expect(getByText('ማስተካከያዎች')).toBeTruthy(); // Settings
    expect(getByText('ስለ እኛ')).toBeTruthy(); // About
  });

  it('handles button presses correctly', () => {
    const {getByText} = render(
      <TestWrapper>
        <OptimizedMainMenu />
      </TestWrapper>,
    );

    // Get buttons and simulate presses
    const practiceButton = getByText('ልምምድ');
    fireEvent.press(practiceButton);

    const settingsButton = getByText('ማስተካከያዎች');
    fireEvent.press(settingsButton);

    // Note: We can't easily test the actual navigation occurred
    // without a more complex mock, but at least we verify the
    // button handling doesn't crash
  });

  // Test for memoization could be added here if we have a way to count renders
});
