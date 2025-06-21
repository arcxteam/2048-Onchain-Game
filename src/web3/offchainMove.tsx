"use client"

import { useContractInteractions } from "./contractInteractions";
import { useStateManagement } from "./stateManagement";
import { handleError } from "./errorHandler";

export const useOffchainMove = () => {
  const { submitBatchMoves } = useContractInteractions();
  const { currentGameId, getCurrentGame } = useStateManagement();

  const executeBatch = async (moves: number[], resultBoards: number[][]) => {
    try {
      const game = getCurrentGame();
      if (!currentGameId || game?.mode !== "offchain") {
        throw new Error("Offchain game not active");
      }
      return await submitBatchMoves(moves, resultBoards);
    } catch (error) {
      return handleError(error);
    }
  };

  return { executeBatch };
};