import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { dismissAction, resetGame } from '@/store/game';
import { useCallback, useEffect } from 'react';
import { useAccount, useContract } from 'wagmi';
import { contractAddress } from '@/config/networks';
import ABI from '@/pages/api/ABI.json';

const Overlay: React.FC = () => {
  const dispatch = useAppDispatch();
  const { defeat, victory, victoryDismissed } = useAppSelector((state) => state.app);
  const { address } = useAccount();
  const { data: contract } = useContract({
    address: contractAddress as `0x${string}`,
    abi: ABI,
  });

  const reset = useCallback(() => dispatch(resetGame()), [dispatch]);
  const dismiss = useCallback(() => dispatch(dismissAction()), [dispatch]);

  const claimNFT = useCallback(async () => {
    if (contract && address && !defeat) {
      try {
        const tx = await contract.claimNFT(address);
        await tx.wait();
        dispatch(resetGame());
      } catch (error) {
        console.error('Error claiming NFT:', error);
      }
    }
  }, [contract, address, defeat, dispatch]);

  return (
    <>
      {victory && !victoryDismissed && (
        <div className="z-999 absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-center bg-[#eb3fb7] bg-opacity-80 text-center align-middle">
          <h1 className="text-2xl font-bold">You win!</h1>
          <div className="flex justify-center gap-2">
            <button onClick={dismiss}>Keep going</button>
            <button onClick={reset}>Try Level again</button>
          </div>
        </div>
      )}
      {defeat && (
        <div className="z-999 absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-center bg-[#4ee480] bg-opacity-50 text-center align-middle">
          <h1 className="text-2xl font-bold">GAME OVER!</h1>
          <div className="flex justify-center gap-2">
            <button onClick={reset} className="opacity-100">
              Try Level again
            </button>
            <button onClick={claimNFT} className="bg-blue-500 text-white px-4 py-2 rounded">
              Claim NFT
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Overlay;