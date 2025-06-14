import { type ActionModel } from '@/types/Models';
import { type Direction } from '@/types/Direction';
import { type Contract } from 'ethers';
import { setGameId, move, endGame, resetGame, setMode } from './game';

export const resetAction = () => (dispatch: any) => {
  dispatch(resetGame());
};

export const moveAction = (direction: Direction) => {
  return {
    ...move(direction),
    execute: async (contract: Contract, gameId: string, address: string) => {
      const tx = await contract.play(gameId, direction, 0); // resultBoard dihitung di kontrak
      await tx.wait();
    },
  };
};

export const endGameAction = () => (dispatch: any) => {
  dispatch(endGame());
};

export const selectModeAction = (mode: 'onchain' | 'offchain') => (dispatch: any) => {
  dispatch(setMode(mode));
};

export const claimNFTAction = (gameId: string) => {
  return {
    type: 'claimNFT',
    execute: async (contract: Contract) => {
      const tx = await contract.claimNFT(gameId);
      await tx.wait();
      return tx;
    },
  };
};
