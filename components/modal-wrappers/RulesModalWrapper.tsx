// src/components/modal-wrappers/RulesModalWrapper.tsx
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import RulesModal from '../modals/RulesModal';

/**
 * Wrapper for RulesModal that adapts it to work with navigation
 */
const RulesModalWrapper: React.FC = () => {
  const navigation = useNavigation();

  return <RulesModal visible={true} onClose={() => navigation.goBack()} />;
};

export default RulesModalWrapper;
