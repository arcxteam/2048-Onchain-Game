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

// Tambahkan tipe Address khusus jika diperlukan
export type Address = `0x${string}`;