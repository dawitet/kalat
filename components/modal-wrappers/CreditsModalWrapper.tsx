// src/components/modal-wrappers/CreditsModalWrapper.tsx
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import CreditsModal from '../modals/CreditsModal';

/**
 * Wrapper for CreditsModal that adapts it to work with navigation
 */
const CreditsModalWrapper: React.FC = () => {
  const navigation = useNavigation();

  return <CreditsModal visible={true} onClose={() => navigation.goBack()} />;
};

export default CreditsModalWrapper;
