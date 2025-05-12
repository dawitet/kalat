// src/components/modal-wrappers/StreakModalWrapper.tsx
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import StreakModal from '../modals/StreakModal';

/**
 * Wrapper for StreakModal that adapts it to work with navigation
 */
const StreakModalWrapper: React.FC = () => {
  const navigation = useNavigation();

  return <StreakModal visible={true} onClose={() => navigation.goBack()} />;
};

export default StreakModalWrapper;
