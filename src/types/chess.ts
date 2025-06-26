export interface Player {
  player_id: number;
  url: string;
  username: string;
  score: number;
  rank: number;
  country?: string;
  title?: string;
  name?: string;
  avatar?: string;
  status?: string;
  last_online?: number;
  joined?: number;
  location?: string;
  fide?: number;
}

export interface LeaderboardCategory {
  daily: Player[];
  live_rapid: Player[];
  live_blitz: Player[];
  live_bullet: Player[];
  live_bughouse: Player[];
  live_blitz960: Player[];
  live_threecheck: Player[];
  live_crazyhouse: Player[];
  live_kingofthehill: Player[];
  tactics: Player[];
  rush: Player[];
  battle: Player[];
}

export interface PlayerProfile {
  player_id: number;
  url: string;
  username: string;
  name?: string;
  title?: string;
  followers: number;
  country?: string;
  location?: string;
  last_online: number;
  joined: number;
  status: string;
  avatar?: string;
  is_streamer: boolean;
  verified: boolean;
  league?: string;
  fide?: number;
}

export interface PlayerStats {
  chess_daily?: {
    last: { rating: number; date: number };
    best: { rating: number; date: number };
    record: { win: number; loss: number; draw: number };
  };
  chess_rapid?: {
    last: { rating: number; date: number };
    best: { rating: number; date: number };
    record: { win: number; loss: number; draw: number };
  };
  chess_blitz?: {
    last: { rating: number; date: number };
    best: { rating: number; date: number };
    record: { win: number; loss: number; draw: number };
  };
  chess_bullet?: {
    last: { rating: number; date: number };
    best: { rating: number; date: number };
    record: { win: number; loss: number; draw: number };
  };
  chess960_daily?: {
    last: { rating: number; date: number };
    best: { rating: number; date: number };
    record: { win: number; loss: number; draw: number };
  };
  tactics?: {
    highest: { rating: number; date: number };
    lowest: { rating: number; date: number };
  };
  puzzle_rush?: {
    best: { total_attempts: number; score: number };
  };
}

export interface FullPlayerData {
  profile: PlayerProfile;
  stats: PlayerStats;
}