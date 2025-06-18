import { ethers } from 'ethers';

export const formatAddress = (address: string) => {
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
};

export const toBoardArray = (board: number[]) => {
  return board.map(num => BigInt(num));
};

export const generateGameId = () => {
  return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};