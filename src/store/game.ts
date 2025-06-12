import { createSlice } from '@reduxjs/toolkit';
import { ActionType } from '@/types/ActionType';
import { type Animation } from '@/types/Animations';
import { type Direction } from '@/types/Direction';
import { type ActionModel } from '@/types/Models';
import {
  initializeBoard,
  type BoardType,
  updateBoard,
  movePossible,
} from '@/utils/board';
import { getStoredData, setStoredData } from '@/utils/localStorage';

export interface GameState {
  /** Board size. Currently always 4. */
  boardSize: number;
  /** Current board. */
  board: BoardType;
  /** Previous board. */
  previousBoard?: BoardType;
  /** Was 2048 tile found? */
  victory: boolean;
  /** Is game over? */
  defeat: boolean;
  /** Should the victory screen be hidden? */
  victoryDismissed: boolean;
  /** Current score. */
  score: number;
  /** Score increase after last update. */
  scoreIncrease?: number;
  /** Best score. */
  best: number;
  /** Used for certain animations. Mainly as a value of the "key" property. */
  moveId?: string;
  /** Animations after last update. */
  animations?: Animation[];
  /** Game ID from blockchain. */
  gameId: string | null;
  /** List of moves for off-chain mode. */
  moves: number[];
  /** Is the game active? */
  isActive: boolean;
  /** Game mode (onchain or offchain). */
  mode: 'onchain' | 'offchain';
}

const storedData = getStoredData();

function initializeState(): GameState {
  const update = initializeBoard(4);
  return {
    boardSize: storedData.boardSize || 4,
    board: storedData.board || update.board,
    previousBoard: undefined,
    defeat: storedData.defeat || false,
    victory: false,
    victoryDismissed: storedData.victoryDismissed || false,
    score: storedData.score || 0,
    scoreIncrease: undefined,
    best: storedData.best || 0,
    moveId: new Date().getTime().toString(),
    animations: update.animations,
    gameId: null,
    moves: [],
    isActive: false,
    mode: 'offchain', // Default mode
  };
}

const initialState: GameState = initializeState();

function gameReducer(state = initialState, action: ActionModel) {
  const newState = { ...state };
  switch (action.type) {
    case ActionType.RESET:
      {
        const size = action.value || newState.boardSize;
        const update = initializeBoard(size);
        newState.boardSize = size;
        newState.board = update.board;
        newState.score = 0;
        newState.animations = update.animations;
        newState.previousBoard = undefined;
        newState.victory = false;
        newState.victoryDismissed = false;
        newState.gameId = null;
        newState.moves = [];
        newState.isActive = false;
      }
      break;
    case ActionType.MOVE:
      {
        if (newState.defeat) {
          break;
        }
        const direction = action.value as Direction;
        const update = updateBoard(newState.board, direction);
        newState.previousBoard = [...newState.board];
        newState.board = update.board;
        newState.score += update.scoreIncrease || 0;
        newState.animations = update.animations;
        newState.scoreIncrease = update.scoreIncrease;
        newState.moveId = new Date().getTime().toString();
        if (newState.mode === 'offchain' && newState.isActive) {
          newState.moves.push(direction); // save move for batch
        }
      }
      break;
    case ActionType.UNDO:
      if (!newState.previousBoard) {
        break;
      }
      newState.board = newState.previousBoard;
      newState.previousBoard = undefined;
      if (newState.scoreIncrease) {
        newState.score -= newState.scoreIncrease;
      }
      if (newState.mode === 'offchain') {
        newState.moves.pop(); // cancel moving in the end
      }
      break;
    case ActionType.DISMISS:
      newState.victoryDismissed = true;
      break;
    // Tambahan untuk blockchain
    case 'SET_GAME_ID':
      newState.gameId = action.value as string;
      break;
    case 'SET_ACTIVE':
      newState.isActive = action.value as boolean;
      break;
    case 'SET_MODE':
      newState.mode = action.value as 'onchain' | 'offchain';
      break;
    case 'END_GAME':
      newState.isActive = false;
      break;
    default:
      return state;
  }
  if (newState.score > newState.best) {
    newState.best = newState.score;
  }
  newState.defeat = !movePossible(newState.board);
  newState.victory = !!newState.board.find((value) => value === 2048);
  setStoredData(newState);
  return newState;
}

export default gameReducer;