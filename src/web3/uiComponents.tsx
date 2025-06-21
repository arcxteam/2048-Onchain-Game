"use client"

import { LeaderboardEntry } from "./types";

export const LeaderboardModal = ({ leaderboard }: { leaderboard: LeaderboardEntry[] }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md">
        <h2 className="text-lg font-bold">Leaderboard</h2>
        <ul>
          {leaderboard.map(entry => (
            <li key={entry.rank}>
              {entry.rank}. {entry.playerId} - {entry.points} XP - {entry.nftLevel}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};