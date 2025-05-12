// src/components/MainMenuWrapper.tsx
import React from 'react';
import {OptimizedComponents} from './OptimizedComponents';

/**
 * Wrapper component that uses the optimized MainMenu
 * This allows us to easily switch between original and optimized versions
 */
const MainMenuWrapper: React.FC = props => {
  const OptimizedMainMenu = OptimizedComponents.MainMenu;

  // We're using the optimized version
  return <OptimizedMainMenu {...props} />;
};

export default MainMenuWrapper;
