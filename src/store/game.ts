import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type Animation } from '@/types/Animations';
import { type Direction } from '@/types/Direction';
import { initializeBoard, type BoardType, movePossible, calculateHighestTile, updateBoard as updateBoardUtil } from '@/utils/board';

export interface GameState {
  boardSize: number;
  board: BoardType;
  previousBoard?: BoardType;
  gameId: string | null;
  moves: number[];
  resultBoards: number[];
  isActive: boolean;
  victory: boolean;
  defeat: boolean;
  victoryDismissed: boolean;
  score: number;
  scoreIncrease?: number;
  best: number;
  moveId?: string;
  animations?: Animation[];
  mode: 'onchain' | 'offchain';
  highestTile: number;
}

const initialState: GameState = {
  boardSize: 4,
  board: initializeBoard(4).board,
  gameId: null,
  moves: [],
  resultBoards: [],
  isActive: false,
  victory: false,
  defeat: false,
  victoryDismissed: false,
  score: 0,
  best: 0,
  moveId: new Date().getTime().toString(),
  animations: initializeBoard(4).animations,
  mode: 'offchain',
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
      state.resultBoards.push(action.payload[0]);
      state.animations = [];
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
        state.victory = state.highestTile >= 11;
        if (state.score > state.best) state.best = state.score;
        if (execute && state.gameId) {
          execute();
        }
      },
      prepare(direction: Direction, execute?: () => void) {
        return { payload: { direction, execute } };
      },
    },
    endGame: (state) => {
      state.isActive = false;
      state.moves = [];
      state.resultBoards = [];
    },
    resetGame: (state) => {
      state.gameId = null;
      state.board = initializeBoard(4).board;
      state.moves = [];
      state.resultBoards = [];
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