import { Address } from 'wagmi';

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  points: number;
  nftLevel: string | number;
}

export interface GameMove {
  move: number;
  resultBoard: number[];
}

export interface GameState {
  gameId?: string;
  isApproved?: boolean;
}