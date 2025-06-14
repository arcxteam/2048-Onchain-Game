"use client";

import Image from 'next/image';
import useAppSelector from '@/hooks/useAppSelector';
import React, { useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { contractAddress } from '@/config/networks';
import ABI from '@/pages/api/ABI.json';

interface HeaderProps {
  onConnect: () => void;
}

const Header = ({ onConnect }: HeaderProps) => {
  const score = useAppSelector((state) => state.app.score);
  const best = useAppSelector((state) => state.app.best);
  const { isConnected, address } = useAccount();
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const { data: leaderboardData } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'getLeaderboard',
    enabled: isConnected,
  });

  useEffect(() => {
    setPlayerId(address || null);
  }, [address, isConnected]);

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-4">
        <Image src="/2048-color.png" width={80} height={80} alt="logo" />
        <button
          onClick={toggleLeaderboard}
          className="bg-green-500 text-white px-3 py-2 rounded text-sm"
        >
          Leaderboard
        </button>
        <button
          onClick={onConnect}
          className="bg-blue-500 text-white px-3 py-2 rounded text-sm"
          disabled={isConnected}
        >
          {isConnected ? 'Connected' : 'Connect Wallet'}
        </button>
      </div>
      <div className="flex gap-3">
        <div className="flex gap-x-2 rounded-md bg-black px-3 py-2 text-center font-bold text-[#ff833b] text-sm">
          <div className="font-bold uppercase">Score:</div>
          <div>{score}</div>
        </div>
        <div className="flex gap-x-2 rounded-md bg-black px-3 py-2 text-center font-bold text-[#47e94f] text-sm">
          <div className="font-bold uppercase">Best:</div>
          <div>{best}</div>
        </div>
        <div className="flex gap-x-2 rounded-md bg-black px-3 py-2 text-center font-bold text-white text-sm">
          <div className="font-bold uppercase">Wallet:</div>
          <div>{playerId ? `${playerId.slice(0, 6)}...${playerId.slice(-4)}` : 'Not Connected'}</div>
        </div>
      </div>
      {showLeaderboard && leaderboardData && (
        <div className="absolute top-16 left-0 right-0 bg-gray-800 text-white p-4 rounded-md shadow-lg max-w-lg mx-auto">
          <h2 className="text-lg font-bold mb-2">Leaderboard</h2>
          <div className="grid gap-2">
            {leaderboardData.slice(0, 10).map((entry: any, index: number) => (
              <button
                key={index}
                className="flex justify-between p-2 bg-gray-700 rounded hover:bg-gray-600"
                onClick={() => alert(`Player: ${entry.player}`)}
              >
                <span>{index + 1}. {entry.player.slice(0, 6)}...{entry.player.slice(-4)}</span>
                <span>Tile: {entry.highestTile}</span>
              </button>
            ))}
          </div>
          <button
            onClick={toggleLeaderboard}
            className="mt-4 bg-red-500 text-white px-3 py-2 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
