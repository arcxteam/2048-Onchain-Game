import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type Animation } from '@/types/Animations';
import { type Direction } from '@/types/Direction';
import { initializeBoard, type BoardType, movePossible, calculateHighestTile, slideBoard, updateBoard as updateBoardUtil } from '@/utils/board'; // Aliaskan updateBoard menjadi updateBoardUtil

export interface GameState {
  /** Board size. Currently always 4. */
  boardSize: number;
  /** Current board. */
  board: BoardType;
  /** Previous board. */
  previousBoard?: BoardType;
  /** Game ID from smart contract. */
  gameId: string | null;
  /** List of moves for off-chain mode. */
  moves: number[];
  /** Is game active? */
  isActive: boolean;
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
  /** Game mode (onchain or offchain). */
  mode: 'onchain' | 'offchain';
  /** Highest tile achieved. */
  highestTile: number;
}

const initialState: GameState = {
  boardSize: 4,
  board: initializeBoard(4).board,
  gameId: null,
  moves: [],
  isActive: false,
  victory: false,
  defeat: false,
  victoryDismissed: false,
  score: 0,
  best: 0,
  moveId: new Date().getTime().toString(),
  animations: initializeBoard(4).animations,
  mode: 'offchain', // Default mode
  highestTile: 0,
};

const gameSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setGameId: (state, action: PayloadAction<string | null>) => {
      state.gameId = action.payload;
    },
    updateBoard: (state, action: PayloadAction<BoardType>) => {
      state.board = action.payload;
      state.highestTile = calculateHighestTile(action.payload);
      state.animations = []; // Reset animations
    },
    addMove: (state, action: PayloadAction<number>) => {
      state.moves.push(action.payload);
    },
    setActive: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload;
    },
    setMode: (state, action: PayloadAction<'onchain' | 'offchain'>) => {
      state.mode = action.payload;
    },
    move: {
      reducer(state, action) {
        if (state.defeat) return;
        const { direction, execute } = action.payload;
        const update = updateBoardUtil(state.board, direction);
        state.previousBoard = [...state.board];
        state.board = update.board;
        state.score += update.scoreIncrease || 0;
        state.animations = update.animations || [];
        state.scoreIncrease = update.scoreIncrease;
        state.moveId = new Date().getTime().toString();
        state.highestTile = calculateHighestTile(state.board);
        state.defeat = !movePossible(state.board);
        state.victory = state.highestTile >= 11; // 2048 = 2^11
        if (state.score > state.best) state.best = state.score;
        if (execute && state.gameId) {
          execute(); // Eksekusi logika kontrak jika ada
        }
      },
      prepare(direction: Direction, execute?: () => void) {
        return { payload: { direction, execute } };
      },
    },
    endGame: (state) => {
      state.isActive = false;
      state.moves = [];
    },
    resetGame: (state) => {
      state.gameId = null;
      state.board = initializeBoard(4).board;
      state.moves = [];
      state.isActive = false;
      state.victory = false;
      state.defeat = false;
      state.victoryDismissed = false;
      state.score = 0;
      state.best = 0;
      state.moveId = new Date().getTime().toString();
      state.animations = initializeBoard(4).animations;
      state.highestTile = 0;
    },
    setHighestTile: (state, action: PayloadAction<number>) => {
      state.highestTile = action.payload;
    },
    dismissAction: (state) => {
      state.victoryDismissed = true;
    },
  },
});

export const { setGameId, updateBoard, addMove, setActive, setMode, move, endGame, resetGame, setHighestTile, dismissAction } = gameSlice.actions;
export default gameSlice.reducer;