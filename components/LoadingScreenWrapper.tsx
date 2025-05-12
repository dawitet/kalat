// src/components/LoadingScreenWrapper.tsx
import React from 'react';
import {OptimizedComponents} from './OptimizedComponents';

/**
 * Wrapper component that uses the optimized LoadingScreen
 * This allows us to easily switch between original and optimized versions
 */
const LoadingScreenWrapper: React.FC = props => {
  const {LoadingScreen} = OptimizedComponents;

  // We're using the optimized version
  return <LoadingScreen {...props} />;
};

export default LoadingScreenWrapper;
