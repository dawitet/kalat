import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types';

// Screens and Components
import MainMenuWrapper from '../components/MainMenuWrapper';
import RefactoredGameView from '../components/RefactoredGameView';
import Leaderboard from '../components/Leaderboard';
import SettingsPanel from '../components/SettingsPanel';
import LoadingScreenWrapper from '../components/LoadingScreenWrapper';
import WipScreen from '../components/WipView';

// Modal Wrappers
import RulesModalWrapper from '../components/modal-wrappers/RulesModalWrapper';
import CreditsModalWrapper from '../components/modal-wrappers/CreditsModalWrapper';
import StreakModalWrapper from '../components/modal-wrappers/StreakModalWrapper';
// import FeedbackModal from '../components/modals/FeedbackModal';
// import InviteModal from '../components/modals/InviteModal';

// Import required types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Wrap RefactoredGameView and Leaderboard to provide required props for navigation
const GameViewScreen = (props: NativeStackScreenProps<RootStackParamList, 'Game'>) => (
  <RefactoredGameView
    initialDifficulty={props.route?.params?.initialDifficulty ?? 'easy'}
    {...props}
  />
);
const LeaderboardScreen = (props: NativeStackScreenProps<RootStackParamList, 'Leaderboard'>) => (
  <Leaderboard entries={[]} {...props} />
);

const Stack = createNativeStackNavigator<RootStackParamList>();

const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  gestureEnabled: true,
};

const modalScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_bottom',
  gestureEnabled: true,
  presentation: 'modal',
};

export const Navigation: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="MainMenu" component={MainMenuWrapper} />
      <Stack.Screen name="Game" component={GameViewScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen
        name="Settings"
        component={SettingsPanel}
        options={modalScreenOptions}
      />
      <Stack.Screen name="Loading" component={LoadingScreenWrapper} />
      <Stack.Screen
        name="Rules"
        component={RulesModalWrapper}
        options={modalScreenOptions}
      />
      <Stack.Screen
        name="Credits"
        component={CreditsModalWrapper}
        options={modalScreenOptions}
      />
      {/* <Stack.Screen name="Feedback" component={FeedbackModal} /> */}
      {/* <Stack.Screen name="Invite" component={InviteModal} /> */}
      <Stack.Screen name="Streaks" component={StreakModalWrapper} />
      <Stack.Screen
        name="Wip"
        component={WipScreen}
        options={modalScreenOptions}
      />
    </Stack.Navigator>
  );
};
