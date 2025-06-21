"use client";

import { useAppSelector } from "@/hooks/useAppSelector";
import { useContractInteractions } from "./contractInteractions";
import { useStateManagement } from "./stateManagement";
import { handleError } from "./errorHandler";

export const useNFTClaim = () => {
  const { currentGameId } = useStateManagement();
  const highestTile = useAppSelector((state) => Math.max(...state.app.board));
  const { claimNFT } = useContractInteractions();

  const claim = async () => {
    try {
      if (!currentGameId) throw new Error("No active game");
      return await claimNFT(currentGameId);
    } catch (error) {
      return handleError(error);
    }
  };

  return { claim, highestTile };
};