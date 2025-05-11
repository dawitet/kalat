// src/screens/MainMenu.tsx
import React, {useContext, useEffect} from 'react';
import {Text, StyleSheet, Image, View} from 'react-native';
import {GameContext} from '../context/GameContext';
import {useTheme} from '../providers/ThemeProvider';
import {Difficulty, ModalType} from '../types';
import {GameSetupAction, UIAction} from '../context/actions';
import Container from './common/Container';
import Button from './common/Button';

const MainMenu: React.FC = () => {
  const context = useContext(GameContext);
  const {theme} = useTheme();

  useEffect(() => {
    // Example: Fetch dynamic data or check for updates if needed when menu loads
  }, []);

  if (!context) {
    return <Text>Loading context...</Text>;
  }

  const {dispatch} = context;

  const handleNavigation = (
    screen: 'GameView' | 'Settings' | 'Rules' | 'Credits' | 'Streak',
    params?: {difficulty?: Difficulty},
  ) => {
    console.log(`Navigating to ${screen} with params:`, params);
    if (screen === 'GameView') {
      if (params?.difficulty) {
        dispatch({
          type: 'SET_CURRENT_DIFFICULTY',
          payload: params.difficulty,
        } as GameSetupAction);
        dispatch({type: 'INITIALIZE_GAME'} as GameSetupAction);
      }
    } else if (screen === 'Settings') {
      dispatch({type: 'SET_ACTIVE_MODAL', payload: 'settings' as ModalType} as UIAction);
    } else if (screen === 'Rules') {
      dispatch({type: 'SET_ACTIVE_MODAL', payload: 'rules' as ModalType} as UIAction);
    } else if (screen === 'Credits') {
      dispatch({type: 'SET_ACTIVE_MODAL', payload: 'credits' as ModalType} as UIAction);
    } else if (screen === 'Streak') {
      dispatch({type: 'SET_ACTIVE_MODAL', payload: 'streak' as ModalType} as UIAction);
    }
  };

  // Menu items configuration
  const menuItems = [
    {
      id: 'daily',
      label: 'የዛሬ ተግዳሮት',
      action: () =>
        handleNavigation('GameView', {difficulty: 'hard' as Difficulty}),
      icon: '🌟',
      fullWidth: true,
    },
    {
      id: 'practice',
      label: 'ልምምድ',
      action: () =>
        handleNavigation('GameView', {difficulty: 'easy' as Difficulty}),
      icon: '🏃',
    },
    {
      id: 'streak',
      label: 'የእኔ ጉዞ',
      action: () => handleNavigation('Streak'),
      icon: '🔥',
    },
    {
      id: 'rules',
      label: 'ህግጋት',
      action: () => handleNavigation('Rules'),
      icon: '📝',
    },
    {
      id: 'settings',
      label: 'ማስተካከያዎች',
      action: () => handleNavigation('Settings'),
      icon: '⚙️',
    },
    {
      id: 'credits',
      label: 'ስለ እኛ',
      action: () => handleNavigation('Credits'),
      icon: 'ℹ️',
    },
  ];

  const styles = StyleSheet.create({
    logoContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    logo: {
      width: 160,
      height: 80,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginVertical: 10,
    },
    menuGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      width: '100%',
      marginTop: 20,
    },
    menuButton: {
      margin: 8,
      width: '46%',
    },
    fullWidthButton: {
      width: '100%',
    },
    buttonIcon: {
      fontSize: 20,
      marginRight: 8,
    },
  });

  const renderMenuItems = () => {
    return (
      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => {
          if (item.fullWidth) {
            return (
              <Button
                key={item.id}
                label={item.label}
                variant="primary"
                size="large"
                onPress={item.action}
                style={[styles.menuButton, styles.fullWidthButton]}
                leftIcon={<Text style={styles.buttonIcon}>{item.icon}</Text>}
              />
            );
          }

          // Pair items side by side
          if (
            index % 2 === 0 &&
            index + 1 < menuItems.length &&
            !menuItems[index + 1].fullWidth
          ) {
            const nextItem = menuItems[index + 1];
            return (
              <React.Fragment key={`pair-${item.id}`}>
                <Button
                  key={item.id}
                  label={item.label}
                  variant="outline"
                  onPress={item.action}
                  style={styles.menuButton}
                  leftIcon={<Text style={styles.buttonIcon}>{item.icon}</Text>}
                />
                <Button
                  key={nextItem.id}
                  label={nextItem.label}
                  variant="outline"
                  onPress={nextItem.action}
                  style={styles.menuButton}
                  leftIcon={
                    <Text style={styles.buttonIcon}>{nextItem.icon}</Text>
                  }
                />
              </React.Fragment>
            );
          } else if (index % 2 !== 0) {
            // Skip odd indices as they're handled in the previous iteration
            return null;
          }

          // Handle remaining single item
          return (
            <Button
              key={item.id}
              label={item.label}
              variant="outline"
              onPress={item.action}
              style={styles.menuButton}
              leftIcon={<Text style={styles.buttonIcon}>{item.icon}</Text>}
            />
          );
        })}
      </View>
    );
  };

  return (
    <Container useSafeArea scrollable centerHorizontal>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/ቃላት.svg')}
          style={styles.logo}
        />
        <Text style={styles.title}>ቃላት</Text>
      </View>
      {renderMenuItems()}
    </Container>
  );
};

export default MainMenu;
