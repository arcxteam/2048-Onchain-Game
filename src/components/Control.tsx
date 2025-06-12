import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { resetGame } from '@/store/game'; // Ubah dari resetAction ke resetGame
import React from 'react';
import { useCallback } from 'react';

const Control = () => {
  const dispatch = useAppDispatch();
  const size = useAppSelector((state) => state.app.boardSize);
  const reset = useCallback(
    () => dispatch(resetGame()), // Gunakan resetGame dari store/game
    [dispatch],
  );
  return (
    <button
      onClick={reset} // Ubah dari dispatch(reset()) ke reset
      className="w-full text-[#47e94f] bg-black px-16 py-4"
    >
      New Game
    </button>
  );
};

export default Control;