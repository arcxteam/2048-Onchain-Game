"use client";

import { useContractInteractions } from "./contractInteractions";
import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { contractAddress } from "./networks";
import abi from "./api/abi";

export const useModeSelection = () => {
  const { address } = useAccount();
  const { approvePlayer, selectMode } = useContractInteractions();
  const [currentMode, setCurrentMode] = useState<"onchain" | "offchain" | null>(null);
  const [isApproved, setIsApproved] = useState(false);

  // Check approval and mode status on load
  const { data: approvedStatus } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: "approvedPlayers",
    args: [address]
  });

  const { data: playerMode } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: "playerMode",
    args: [address]
  });

  useEffect(() => {
    if (approvedStatus) {
      setIsApproved(approvedStatus as boolean);
    }
    if (playerMode !== undefined) {
      setCurrentMode(playerMode ? "onchain" : "offchain");
    }
  }, [approvedStatus, playerMode]);

  const handleApprove = async () => {
    if (!address || isApproved) return;
    await approvePlayer();
    setIsApproved(true);
  };

  const handleSelectMode = async (mode: "onchain" | "offchain") => {
    if (!address) return;
    
    if (!isApproved) {
      await handleApprove();
    }

    await selectMode(mode === "onchain");
    setCurrentMode(mode);
  };

  return {
    currentMode,
    selectMode: handleSelectMode,
    isApproved,
    approvePlayer: handleApprove
  };
};