import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { dismissAction, resetGame, setGameId } from '@/store/game';
import { useCallback, useEffect } from 'react';
import { useAccount, useContractWrite } from 'wagmi';
import { contractAddress } from '@/config/networks';
import ABI from '@/pages/api/ABI.json';
import { ethers } from 'ethers';
import { initializeBoard } from '@/utils/board';

const Overlay: React.FC = () => {
  const dispatch = useAppDispatch();
  const { defeat, victory, victoryDismissed, gameId, mode } = useAppSelector((state) => state.app);
  const { address } = useAccount();
  const { write: endGame } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'endGame',
  });
  const { write: claimNFT } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'claimNFT',
  });
  const { write: startGame } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'startGame',
  });

  const reset = useCallback(() => {
    dispatch(resetGame());
    // Mulai game baru otomatis
    const newGameId = ethers.utils.formatBytes32String(`game-${Date.now()}`);
    const initialBoard = initializeBoard(4).board;
    const initialMoves = [0, 1, 2];
    startGame({ args: [newGameId, [initialBoard[0], 0, 0, 0], initialMoves] }).then(() => {
      dispatch(setGameId(newGameId));
    }).catch(console.error);
  }, [dispatch, startGame]);

  const dismiss = useCallback(() => dispatch(dismissAction()), [dispatch]);

  const handleClaimNFT = useCallback(async () => {
    if (!address || !gameId) return;
    try {
      await endGame({ args: [gameId] });
      await claimNFT({ args: [gameId] });
      reset(); // Mulai game baru setelah klaim
    } catch (error) {
      console.error('Error claiming NFT:', error);
      alert('Failed to claim NFT.');
    }
  }, [address, gameId, endGame, claimNFT, reset]);

  return (
    <>
      {victory && !victoryDismissed && (
        <div className="z-50 absolute inset-0 flex flex-col justify-center bg-[#eb3fb7] bg-opacity-80 text-center">
          <h1 className="text-2xl font-bold">You win!</h1>
          <div className="flex justify-center gap-2 mt-4">
            <button onClick={dismiss} className="px-4 py-2 bg-gray-500 text-white rounded">
              Keep going
            </button>
            <button onClick={reset} className="px-4 py-2 bg-blue-500 text-white rounded">
              Try Level again
            </button>
          </div>
        </div>
      )}
      {defeat && (
        <div className="z-50 absolute inset-0 flex flex-col justify-center bg-[#4ee480] bg-opacity-50 text-center">
          <h1 className="text-2xl font-bold">GAME OVER!</h1>
          <div className="flex justify-center gap-2 mt-4">
            <button onClick={reset} className="px-4 py-2 bg-gray-500 text-white rounded">
              Try Level again
            </button>
            <button onClick={handleClaimNFT} className="px-4 py-2 bg-blue-500 text-white rounded">
              Claim NFT
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Overlay;
