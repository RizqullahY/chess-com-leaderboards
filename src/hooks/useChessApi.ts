import { useState, useEffect } from 'react';
import { LeaderboardCategory, FullPlayerData, PlayerProfile, PlayerStats } from '../types/chess';

export function useLeaderboards() {
  const [leaderboards, setLeaderboards] = useState<LeaderboardCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboards() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://api.chess.com/pub/leaderboards');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch leaderboards: ${response.status}`);
        }
        
        const data = await response.json();
        setLeaderboards(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboards');
        console.error('Error fetching leaderboards:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboards();
  }, []);

  return { leaderboards, loading, error };
}

export function usePlayerSearch() {
  const [playerData, setPlayerData] = useState<FullPlayerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPlayer = async (username: string) => {
    if (!username.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      // Fetch player profile and stats in parallel
      const [profileResponse, statsResponse] = await Promise.all([
        fetch(`https://api.chess.com/pub/player/${username.toLowerCase()}`),
        fetch(`https://api.chess.com/pub/player/${username.toLowerCase()}/stats`)
      ]);

      if (!profileResponse.ok) {
        if (profileResponse.status === 404) {
          throw new Error('Player not found');
        }
        throw new Error(`Failed to fetch player: ${profileResponse.status}`);
      }

      const profile: PlayerProfile = await profileResponse.json();
      let stats: PlayerStats = {};
      
      if (statsResponse.ok) {
        stats = await statsResponse.json();
      }

      const fullData: FullPlayerData = { profile, stats };
      setPlayerData(fullData);
      
      // Save to localStorage
      localStorage.setItem('lastSearchedPlayer', username.toLowerCase());
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search player');
      console.error('Error searching player:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load last searched player on mount
  useEffect(() => {
    const lastSearched = localStorage.getItem('lastSearchedPlayer');
    if (lastSearched) {
      searchPlayer(lastSearched);
    }
  }, []);

  return { playerData, loading, error, searchPlayer };
}

export function usePlayerDetails() {
  const [playerData, setPlayerData] = useState<FullPlayerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerDetails = async (username: string) => {
    if (!username.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      // Fetch player profile and stats in parallel
      const [profileResponse, statsResponse] = await Promise.all([
        fetch(`https://api.chess.com/pub/player/${username.toLowerCase()}`),
        fetch(`https://api.chess.com/pub/player/${username.toLowerCase()}/stats`)
      ]);

      if (!profileResponse.ok) {
        if (profileResponse.status === 404) {
          throw new Error('Player not found');
        }
        throw new Error(`Failed to fetch player: ${profileResponse.status}`);
      }

      const profile: PlayerProfile = await profileResponse.json();
      let stats: PlayerStats = {};
      
      if (statsResponse.ok) {
        stats = await statsResponse.json();
      }

      const fullData: FullPlayerData = { profile, stats };
      setPlayerData(fullData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch player details');
      console.error('Error fetching player details:', err);
    } finally {
      setLoading(false);
    }
  };

  return { playerData, loading, error, fetchPlayerDetails };
}