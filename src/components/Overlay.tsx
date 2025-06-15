import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { dismissAction, resetAction } from '@/store/action';
import { useCallback } from 'react';
import { useAccount, useContractWrite } from 'wagmi';
import { contractAddress } from '@/config/networks';
import ABI from '@/pages/api/ABI.json';

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
  const reset = useCallback(() => dispatch(resetAction(4)), [dispatch]);
  const dismiss = useCallback(() => dispatch(dismissAction()), [dispatch]);

  const handleClaimNFT = useCallback(async () => {
    if (!address || !gameId) return;
    try {
      await endGame({ args: [gameId] });
      await claimNFT({ args: [gameId] });
      reset();
    } catch (error) {
      console.error('Error claiming NFT:', error);
      alert('Failed to claim NFT.');
    }
  }, [address, gameId, endGame, claimNFT, reset]);

  return (
    <>
      {victory && !victoryDismissed && (
        <div className="z-999 absolute inset-0 flex flex-col justify-center bg-[#eb3fb7] bg-opacity-80 text-center font-geist-mono">
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
        <div className="z-999 absolute inset-0 flex flex-col justify-center bg-[#4ee480] bg-opacity-50 text-center font-geist-mono">
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