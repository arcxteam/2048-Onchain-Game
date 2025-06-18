import { useAppSelector } from '@/hooks/useAppSelector';
import { useEffect } from 'react';
import { contractInteractions } from './contractInteractions';
import { useStateManagement } from './stateManagement';

export const useGameState = () => {
  const state = useAppSelector((state) => state.app);
  const { gameId, setGameId } = useStateManagement();

  useEffect(() => {
    if (!gameId && state.board.length > 0) {
      const newGameId = `game_${Date.now()}`;
      contractInteractions.startGame(newGameId, state.board, []).then(() => setGameId(newGameId));
    }
  }, [state.board]);

  return { ...state, gameId };
};