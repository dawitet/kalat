import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

// Screens
import MainMenu from '../components/MainMenu';
import GameView from '../components/GameView';
import Leaderboard from '../components/Leaderboard';
import SettingsPanel from '../components/SettingsPanel';
import LoadingScreen from '../components/LoadingScreen';
import RulesModal from '../components/modals/RulesModal';
import CreditsModal from '../components/modals/CreditsModal';
// import FeedbackModal from '../components/modals/FeedbackModal';
// import InviteModal from '../components/modals/InviteModal';
import StreakModal from '../components/modals/StreakModal';
import WipScreen from '../components/WipView';

// Wrap GameView and Leaderboard to provide required props for navigation
const GameViewScreen = (props: any) => <GameView initialDifficulty={props.route?.params?.initialDifficulty ?? 'easy'} {...props} />;
const LeaderboardScreen = (props: any) => <Leaderboard entries={[]} {...props} />;

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
      <Stack.Screen name="MainMenu" component={MainMenu} />
      <Stack.Screen name="Game" component={GameViewScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="Settings" component={SettingsPanel} options={modalScreenOptions} />
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Rules" component={RulesModal} options={modalScreenOptions} />
      <Stack.Screen name="Credits" component={CreditsModal} options={modalScreenOptions} />
      {/* <Stack.Screen name="Feedback" component={FeedbackModal} /> */}
      {/* <Stack.Screen name="Invite" component={InviteModal} /> */}
      <Stack.Screen name="Streaks" component={StreakModal} />
      <Stack.Screen name="Wip" component={WipScreen} options={modalScreenOptions} />
    </Stack.Navigator>
  );
};
