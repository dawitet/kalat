import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from './context/ThemeContext';
import {GameProvider} from './context/GameContext';
import {Navigation} from './navigation';
// Import the registry to ensure it's loaded
import './assets/imageRegistry';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GameProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </GameProvider>
    </ThemeProvider>
  );
};
