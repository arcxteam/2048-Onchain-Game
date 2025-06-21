"use client";

import { useWriteContract, useReadContract } from "wagmi";
import { contractAddress } from "./networks";
import abi from "./api/abi";

export const useContractInteractions = () => {
  const { writeContractAsync } = useWriteContract();
  
  // Read functions
  const { data: leaderboard } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: "getLeaderboard",
  });

  // Generic contract call function
  const callContract = async (
    functionName: string, 
    args?: any[],
    overrides?: any
  ) => {
    return writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi,
      functionName,
      args,
      ...overrides
    });
  };

  return {
    // Player management
    approvePlayer: () => callContract("approvePlayer"),
    selectMode: (isOnchain: boolean) => callContract("selectMode", [isOnchain]),
    
    // Game actions
    startGame: (gameId: string, boards: number[], moves: number[]) => 
      callContract("startGame", [gameId, boards, moves]),
    
    play: (move: number, resultBoard: number[]) => 
      callContract("play", [move, resultBoard]),
    
    submitBatchMoves: (moves: number[], resultBoards: number[][]) => 
      callContract("submitBatchMoves", [moves, resultBoards]),
    
    endGame: (gameId: string) => 
      callContract("endGame", [gameId]),
    
    claimNFT: (gameId: string) => 
      callContract("claimNFT", [gameId]),
    
    // View functions
    getLeaderboard: () => leaderboard,
    
    // Additional utility functions
    getPlayerStatus: (playerAddress: string) => ({
      approved: useReadContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: "approvedPlayers",
        args: [playerAddress]
      }),
      mode: useReadContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: "playerMode",
        args: [playerAddress]
      })
    })
  };
};