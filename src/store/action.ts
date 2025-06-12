import { type Direction } from '@/types/Direction';
import { ActionType } from '@/types/ActionType';
import { type ActionModel } from '@/types/Models';
import { slideBoard } from '@/utils/board';

function resetAction(size: number): ActionModel {
  return {
    type: ActionType.RESET,
    value: size,
  };
}

function moveAction(direction: Direction): ActionModel {
  return {
    type: ActionType.MOVE,
    value: direction,
    async execute(contract: ethers.Contract, gameId: string, board: number[]) {
      if (contract && gameId) {
        const newBoard = slideBoard(board, direction);
        if (newBoard) {
          await contract.play(gameId, direction, newBoard[0]); // Send the first element as uint128
          return newBoard;
        }
      }
    },
  };
}

function endGameAction(gameId: string): ActionModel {
  return {
    type: 'END_GAME',
    value: gameId,
    async execute(contract: ethers.Contract) {
      if (contract && gameId) {
        const tx = await contract.endGame(gameId);
        await tx.wait();
      }
    },
  };
}

function claimNFTAction(gameId: string): ActionModel {
  return {
    type: 'CLAIM_NFT',
    value: gameId,
    async execute(contract: ethers.Contract) {
      if (contract && gameId) {
        const tx = await contract.claimNFT(gameId);
        await tx.wait();
      }
    },
  };
}

export { resetAction, moveAction, endGameAction, claimNFTAction };