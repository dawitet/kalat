import {useNavigation as useRNNavigation} from '@react-navigation/native';
import type {RootStackParamList} from '../types';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useNavigation = () => {
  return useRNNavigation<NavigationProp>();
};

export const navigationHelpers = {
  navigateToGame: (
    navigation: NavigationProp,
    difficulty?: 'easy' | 'medium' | 'hard',
    _isResume?: boolean,
  ) => {
    const mappedDifficulty = difficulty === 'hard' ? 'hard' : 'easy';
    navigation.navigate('Game', {initialDifficulty: mappedDifficulty});
  },
  navigateToLeaderboard: (navigation: NavigationProp) => {
    navigation.navigate('Leaderboard');
  },
  navigateToSettings: (navigation: NavigationProp) => {
    navigation.navigate('Settings');
  },
  navigateToLoading: (navigation: NavigationProp) => {
    navigation.navigate('Loading');
  },
  navigateToWip: (navigation: NavigationProp) => {
    navigation.navigate('Wip');
  },
  goBack: (navigation: NavigationProp) => {
    navigation.goBack();
  },
};
