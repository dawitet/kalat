import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import type {Theme} from '../styles/theme';

export interface LeaderboardEntry {
  id: string;
  name: string;
  rank: number;
  score: number;
  date: string;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  limit?: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries = [],
  limit = 10,
}) => {
  const theme = useTheme() as unknown as Theme;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    list: {
      flexGrow: 1,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      marginBottom: 8,
      borderRadius: 8,
      backgroundColor: theme.colors.border,
    },
    text: {
      fontSize: 16,
      color: theme.colors.text,
    },
    errorText: {
      fontSize: 16,
      textAlign: 'center',
      color: theme.colors.destructive,
    },
    highlightedScore: {
      fontWeight: 'bold',
      color: theme.colors.accent,
    },
  });

  const renderItem = ({item}: {item: LeaderboardEntry}) => (
    <View style={styles.row}>
      <Text style={styles.text}>
        {item.rank}. {item.name}
      </Text>
      <Text style={styles.text}>{item.score}</Text>
    </View>
  );

  if (!entries.length) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.primary}]}>
        <Text style={styles.errorText}>No entries found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.secondary}]}>
      <FlatList
        data={entries.slice(0, limit)}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default Leaderboard;
