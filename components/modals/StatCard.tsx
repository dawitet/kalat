// src/components/modals/StatCard.tsx
import React, {useMemo} from 'react';
import {Text, StyleSheet, Platform} from 'react-native';
import Animated from 'react-native-reanimated';
import {useTheme} from '../../providers/ThemeProvider';

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  subLabel?: string;
  animatedStyle: any;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  subLabel,
  animatedStyle,
}) => {
  const {theme} = useTheme();

  // Memoize styles to prevent re-calculation on each render
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: theme.colors.secondary,
          borderRadius: 12,
          padding: 15,
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: Platform.OS === 'web' ? 110 : '80%',
          height: Platform.OS === 'web' ? 160 : undefined,
          marginVertical: Platform.OS === 'web' ? 5 : 10,
          marginHorizontal: Platform.OS === 'web' ? 5 : 0,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        cardIcon: {
          fontSize: 28,
          marginBottom: 10,
        },
        cardValue: {
          fontSize: 22,
          fontWeight: 'bold',
          color: theme.colors.accent,
          marginBottom: 5,
        },
        cardLabel: {
          fontSize: 13,
          color: theme.colors.hint,
          textAlign: 'center',
          lineHeight: 18,
        },
        cardSubLabel: {
          fontSize: 11,
          color: theme.colors.hint,
          marginTop: 4,
          textAlign: 'center',
        },
      }),
    [theme],
  );

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
      {subLabel && <Text style={styles.cardSubLabel}>{subLabel}</Text>}
    </Animated.View>
  );
};

// Memoize the component to avoid unnecessary re-renders
export default React.memo(StatCard);
