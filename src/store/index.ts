import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './game';

export const store = configureStore({
  reducer: {
    app: gameReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Update type to reflect new GameState structure from store/game.ts
export type AppDispatch = typeof store.dispatch;