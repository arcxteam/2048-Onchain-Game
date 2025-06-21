"use client"

import { useContractInteractions } from "./contractInteractions";
import { useStateManagement } from "./stateManagement";
import { handleError } from "./errorHandler";

export const useOnchainMove = () => {
  const { play } = useContractInteractions();
  const { currentGameId, getCurrentGame } = useStateManagement();

  const executeMove = async (move: number, resultBoard: number[]) => {
    try {
      const game = getCurrentGame();
      if (!currentGameId || game?.mode !== "onchain") {
        throw new Error("Onchain game not active");
      }
      return await play(move, resultBoard);
    } catch (error) {
      return handleError(error);
    }
  };

  return { executeMove };
};