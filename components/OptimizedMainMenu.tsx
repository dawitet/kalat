// src/components/OptimizedMainMenu.tsx
import React, {useContext, useCallback, useMemo} from 'react';
import {Text, StyleSheet, Image, View} from 'react-native';
import {GameContext} from '../context/GameContext';
import {useTheme} from '../providers/ThemeProvider';
import {Difficulty} from '../types';
import Container from './common/Container';
import Button from './common/Button';

/**
 * Optimized main menu component with performance improvements
 */
const OptimizedMainMenu: React.FC = () => {
  // Context hooks - must be called unconditionally at the top level
  const context = useContext(GameContext);
  const {theme} = useTheme();

  // Memoized dispatch function to avoid changing on every render
  const safeDispatch = useMemo(() => {
    return context?.dispatch || ((() => {}) as React.Dispatch<any>);
  }, [context]);

  // Memoized navigation handler - must be called regardless of context availability
  const handleNavigation = useCallback(
    (screen: string, params?: any) => {
      // Skip if context isn't loaded
      if (!context) {
        return;
      }
      
      if (screen === 'GameView') {
        if (params?.difficulty) {
          safeDispatch({
            type: 'SET_CURRENT_DIFFICULTY' as any,
            payload: params.difficulty,
          });
          safeDispatch({type: 'NAVIGATE_TO_GAME' as any});
        }
      } else if (screen === 'Settings') {
        safeDispatch({type: 'SET_ACTIVE_MODAL' as any, payload: 'Settings'});
      } else if (screen === 'Rules') {
        safeDispatch({type: 'SET_ACTIVE_MODAL' as any, payload: 'Rules'});
      } else if (screen === 'Credits') {
        safeDispatch({type: 'SET_ACTIVE_MODAL' as any, payload: 'Credits'});
      } else if (screen === 'Streak') {
        safeDispatch({type: 'SET_ACTIVE_MODAL' as any, payload: 'Streak'});
      }
    },
    [context, safeDispatch],
  );

  // Memoized menu items
  const menuItems = useMemo(
    () => [
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
    ],
    [handleNavigation],
  );

  // Memoized styles based on theme
  const styles = useMemo(
    () =>
      StyleSheet.create({
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
      }),
    [theme],
  );

  // Memoized menu item renderer
  const renderMenuItems = useCallback(() => {
    return (
      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => {
          if (item.fullWidth) {
            return (
              <MenuItemButton
                key={item.id}
                id={item.id}
                label={item.label}
                variant="primary"
                size="large"
                onPress={item.action}
                style={[styles.menuButton, styles.fullWidthButton]}
                icon={item.icon}
                buttonIconStyle={styles.buttonIcon}
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
                <MenuItemButton
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  variant="outline"
                  onPress={item.action}
                  style={styles.menuButton}
                  icon={item.icon}
                  buttonIconStyle={styles.buttonIcon}
                />
                <MenuItemButton
                  key={nextItem.id}
                  id={nextItem.id}
                  label={nextItem.label}
                  variant="outline"
                  onPress={nextItem.action}
                  style={styles.menuButton}
                  icon={nextItem.icon}
                  buttonIconStyle={styles.buttonIcon}
                />
              </React.Fragment>
            );
          } else if (index % 2 !== 0) {
            // Skip odd indices as they're handled in the previous iteration
            return null;
          }

          // Handle remaining single item
          return (
            <MenuItemButton
              key={item.id}
              id={item.id}
              label={item.label}
              variant="outline"
              onPress={item.action}
              style={styles.menuButton}
              icon={item.icon}
              buttonIconStyle={styles.buttonIcon}
            />
          );
        })}
      </View>
    );
  }, [menuItems, styles]);

  // Early return after all hooks if context is not available
  if (!context) {
    return <Text>Loading context...</Text>;
  }

  // Main render
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

// Memoized menu item button component
interface MenuItemButtonProps {
  id: string;
  label: string;
  variant: 'primary' | 'outline' | 'secondary';
  size?: 'large' | 'medium' | 'small';
  onPress: () => void;
  style: any;
  icon: string;
  buttonIconStyle: any;
}

const MenuItemButton = React.memo(
  ({
    id,
    label,
    variant,
    size,
    onPress,
    style,
    icon,
    buttonIconStyle,
  }: MenuItemButtonProps) => (
    <Button
      key={id}
      label={label}
      variant={variant}
      size={size}
      onPress={onPress}
      style={style}
      leftIcon={<Text style={buttonIconStyle}>{icon}</Text>}
    />
  ),
);

export default React.memo(OptimizedMainMenu);
