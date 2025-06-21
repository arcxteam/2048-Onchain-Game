"use client"

import { useAppSelector } from "@/hooks/useAppSelector";
import { useEffect } from "react";
import { useContractInteractions } from "./contractInteractions";
import { useStateManagement } from "./stateManagement";

export const useGameState = () => {
  const state = useAppSelector((state) => state.app);
  const { currentGameId, initNewGame } = useStateManagement();
  const { startGame } = useContractInteractions();

  useEffect(() => {
    if (!currentGameId && state.board.length > 0) {
      const initialize = async () => {
        const newGameId = initNewGame("onchain"); // or "offchain" based on UI state
        await startGame(newGameId, state.board, []);
      };
      initialize();
    }
  }, [state.board, currentGameId]);

  return { ...state, gameId: currentGameId };
};