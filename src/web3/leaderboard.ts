"use client";

import { useContractInteractions } from "./contractInteractions";
import { formatAddress } from "./utils";
import { LeaderboardEntry } from "./types";

export const useLeaderboard = () => {
  const { getLeaderboard } = useContractInteractions();

  const formatLeaderboard = (): LeaderboardEntry[] => {
    try {
      const rawData = getLeaderboard;
      if (!Array.isArray(rawData)) return [];

      return rawData
        .map((entry: any) => ({
          player: entry.player,
          highestTile: Number(entry.highestTile ?? 0),
          moves: Number(entry.moves ?? 0)
        }))
        .sort((a, b) => b.highestTile - a.highestTile)
        .slice(0, 10)
        .map((entry, index) => ({
          rank: index + 1,
          playerId: formatAddress(entry.player),
          points: entry.highestTile,
          nftLevel: entry.highestTile >= 2048 ? entry.highestTile : "N/A"
        }));
    } catch (error) {
      console.error("Leaderboard error:", error);
      return [];
    }
  };

  return { 
    leaderboard: formatLeaderboard() 
  };
};