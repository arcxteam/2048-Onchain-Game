import { useContractRead, useContractWrite } from 'wagmi';
import { contractAddress } from './networks';
import abi from './api/abi';

export const contractInteractions = {
  approvePlayer: () => useContractWrite({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'approvePlayer',
  }),
  selectMode: (isOnchain: boolean) => useContractWrite({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'selectMode',
    args: [isOnchain],
  }),
  startGame: (gameId: string, boards: number[], moves: number[]) => useContractWrite({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'startGame',
    args: [gameId, boards, moves],
  }),
  play: (move: number, resultBoard: number[]) => useContractWrite({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'play',
    args: [move, resultBoard],
  }),
  submitBatchMoves: (moves: number[], resultBoards: number[][]) => useContractWrite({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'submitBatchMoves',
    args: [moves, resultBoards],
  }),
  endGame: (gameId: string) => useContractWrite({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'endGame',
    args: [gameId],
  }),
  claimNFT: (gameId: string) => useContractWrite({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'claimNFT',
    args: [gameId],
  }),
  getLeaderboard: () => useContractRead({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getLeaderboard',
  }),
};