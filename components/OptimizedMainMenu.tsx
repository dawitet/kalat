// src/components/OptimizedMainMenu.tsx
import React, {useContext, useCallback, useMemo} from 'react';
import {Text, StyleSheet, View, ViewStyle, TextStyle} from 'react-native';
import {GameContext} from '../context/GameContext';
import {useTheme} from '../providers/ThemeProvider';
import {Difficulty} from '../types';
import Container from './common/Container';
import Button from './common/Button';
import {GameAction, UIAction} from '../context/actions';

/**
 * Optimized main menu component with performance improvements
 */
const OptimizedMainMenu: React.FC = () => {
  // Context hooks - must be called unconditionally at the top level
  const context = useContext(GameContext);
  const {theme} = useTheme();

  // Memoized dispatch function to avoid changing on every render
  const safeDispatch = useMemo(() => {
    return context?.dispatch || ((() => {}) as React.Dispatch<GameAction | UIAction>);
  }, [context]);

  // Define the navigation params type
  interface NavigationParams {
    difficulty?: Difficulty;
    [key: string]: unknown;
  }
  // Memoized navigation handler - must be called regardless of context availability
  const handleNavigation = useCallback(
    (screen: string, params?: NavigationParams) => {
      // Skip if context isn't loaded
      if (!context) {
        return;
      }

      if (screen === 'GameView') {
        if (params?.difficulty) {
          safeDispatch({
            type: 'SET_CURRENT_DIFFICULTY',
            payload: params.difficulty,
          });
          safeDispatch({type: 'INITIALIZE_GAME'}); // Corrected action type
        }
      } else if (screen === 'Settings') {
        safeDispatch({type: 'SET_ACTIVE_MODAL', payload: 'settings'});
      } else if (screen === 'Rules') {
        safeDispatch({type: 'SET_ACTIVE_MODAL', payload: 'rules'});
      } else if (screen === 'Credits') {
        safeDispatch({type: 'SET_ACTIVE_MODAL', payload: 'credits'});
      } else if (screen === 'Streak') {
        safeDispatch({type: 'SET_ACTIVE_MODAL', payload: 'streak'});
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

  // Simplified menu item renderer
  const renderMenuItems = useCallback(
    () => (
      <View style={styles.menuGrid}>
        {menuItems.map(item => (
          <MenuItemButton
            key={item.id}
            id={item.id}
            label={item.label}
            variant={item.fullWidth ? 'primary' : 'outline'}
            size={item.fullWidth ? 'large' : undefined}
            onPress={item.action}
            style={[
              styles.menuButton,
              item.fullWidth ? styles.fullWidthButton : {},
            ]}
            icon={item.icon}
            buttonIconStyle={styles.buttonIcon}
          />
        ))}
      </View>
    ),
    [menuItems, styles],
  );

  // Early return after all hooks if context is not available
  if (!context) {
    return <Text>Loading context...</Text>;
  }

  // Main render
  return (
    <Container useSafeArea scrollable centerHorizontal>
      <View style={styles.logoContainer}>
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
  style: ViewStyle | ViewStyle[];
  icon: string;
  buttonIconStyle: TextStyle | TextStyle[];
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
