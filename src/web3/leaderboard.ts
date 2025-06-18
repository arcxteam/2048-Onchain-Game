import { contractInteractions } from './contractInteractions';
import { formatAddress } from './utils';

export const useLeaderboard = () => {
  const { data: leaderboardData } = contractInteractions.getLeaderboard();

  const formatLeaderboard = () => {
    if (!leaderboardData) return [];
    const leaderboard = leaderboardData as { player: `0x${string}`; highestTile: number; moves: number }[];
    return leaderboard
      .sort((a, b) => b.highestTile - a.highestTile)
      .slice(0, 10)
      .map((entry, index) => ({
        rank: index + 1,
        playerId: formatAddress(entry.player),
        points: entry.highestTile,
        nftLevel: entry.highestTile >= 2048 ? entry.highestTile : 'N/A',
      }));
  };

  return { leaderboard: formatLeaderboard() };
};