import {useCallback, useState} from 'react';

export type LeaderboardEntry = {
  id: string;
  playerName: string;
  score: number;
  date: string;
  difficulty: string;
  timeSpent: number;
};

export const useLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/leaderboard');
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const addEntry = useCallback(async (entry: Omit<LeaderboardEntry, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
      if (!response.ok) {
        throw new Error('Failed to add leaderboard entry');
      }
      const newEntry = await response.json();
      setEntries(prev => [...prev, newEntry].sort((a, b) => b.score - a.score));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const getTopScores = useCallback(
    (limit: number = 10) => {
      return entries.sort((a, b) => b.score - a.score).slice(0, limit);
    },
    [entries],
  );

  const getPlayerRank = useCallback(
    (playerId: string) => {
      const sortedEntries = [...entries].sort((a, b) => b.score - a.score);
      const rank = sortedEntries.findIndex(entry => entry.id === playerId) + 1;
      return rank > 0 ? rank : null;
    },
    [entries],
  );

  const getPlayerStats = useCallback(
    (playerId: string) => {
      const playerEntries = entries.filter(entry => entry.id === playerId);
      if (playerEntries.length === 0) {
        return null;
      }

      const totalGames = playerEntries.length;
      const totalScore = playerEntries.reduce(
        (sum, entry) => sum + entry.score,
        0,
      );
      const averageScore = totalScore / totalGames;
      const highestScore = Math.max(...playerEntries.map(entry => entry.score));
      const totalTimeSpent = playerEntries.reduce(
        (sum, entry) => sum + entry.timeSpent,
        0,
      );

      return {
        totalGames,
        totalScore,
        averageScore,
        highestScore,
        totalTimeSpent,
        rank: getPlayerRank(playerId),
      };
    },
    [entries, getPlayerRank],
  );

  return {
    entries,
    loading,
    error,
    fetchLeaderboard,
    addEntry,
    getTopScores,
    getPlayerRank,
    getPlayerStats,
  };
};
