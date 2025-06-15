import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { resetAction } from '@/store/action';
import React, { useCallback } from 'react';
import { useAccount, useContractWrite } from 'wagmi';
import { contractAddress } from '@/config/networks';
import ABI from '@/pages/api/ABI.json';
import { ethers } from 'ethers';
import { initializeBoard } from '@/utils/board';

const Control = () => {
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  const { write: startGame } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'startGame',
  });

  const reset = useCallback(() => {
    dispatch(resetAction(4));
    if (address) {
      const gameId = ethers.utils.formatBytes32String(`game-${Date.now()}`);
      const initialBoard = initializeBoard(4).board;
      const initialMoves = [0, 1, 2];
      startGame({ args: [gameId, [initialBoard[0], 0, 0, 0], initialMoves] }).then(() => {
        dispatch({ type: 'setGameId', payload: gameId });
      }).catch(console.error);
    }
  }, [dispatch, address, startGame]);

  return (
    <button
      onClick={reset}
      className="w-full text-[#47e94f] bg-black px-16 py-4 rounded-md font-bold font-geist-mono"
    >
      New Game
    </button>
  );
};

export default Control;