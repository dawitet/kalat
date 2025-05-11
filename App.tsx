import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from './context/ThemeContext';
import {GameProvider} from './context/GameContext';
import {Navigation} from './navigation';

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
