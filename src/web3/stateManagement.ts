"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useContractInteractions } from "./contractInteractions";

export const useStateManagement = () => {
  const { address } = useAccount();
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [gameHistory, setGameHistory] = useState<Array<{
    gameId: string;
    mode: "onchain" | "offchain";
    result: "win" | "lose" | "ongoing";
  }>>([]);

  // Initialize new game
  const initNewGame = (mode: "onchain" | "offchain") => {
    const newGameId = `${address}-${Date.now()}`;
    setCurrentGameId(newGameId);
    setGameHistory(prev => [...prev, {
      gameId: newGameId,
      mode,
      result: "ongoing"
    }]);
    return newGameId;
  };

  // End current game
  const endCurrentGame = (result: "win" | "lose") => {
    if (!currentGameId) return;
    
    setGameHistory(prev => 
      prev.map(game => 
        game.gameId === currentGameId 
          ? { ...game, result } 
          : game
      )
    );
    setCurrentGameId(null);
  };

  return {
    currentGameId,
    gameHistory,
    initNewGame,
    endCurrentGame,
    getCurrentGame: () => 
      gameHistory.find(game => game.gameId === currentGameId)
  };
};