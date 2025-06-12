import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { dismissAction, resetGame } from '@/store/game'; // Ubah resetAction ke resetGame
import { useCallback } from 'react';
import { useBlockchain } from '@/src/minikitprovider'; // Tambahkan untuk klaim NFT

const Overlay: React.FC = () => {
  const dispatch = useAppDispatch();
  const boardSize = useAppSelector((state) => state.app.boardSize);
  const gameId = useAppSelector((state) => state.app.gameId);
  const isActive = useAppSelector((state) => state.app.isActive);
  const { contract } = useBlockchain();

  const reset = useCallback(
    () => dispatch(resetGame()),
    [dispatch],
  );
  const dismiss = useCallback(() => dispatch(dismissAction()), [dispatch]);

  const claimNFT = useCallback(async () => {
    if (contract && gameId && !isActive) {
      try {
        const tx = await contract.claimNFT(gameId);
        await tx.wait();
        dispatch(resetGame());
      } catch (error) {
        console.error('Error claiming NFT:', error);
      }
    }
  }, [contract, gameId, isActive, dispatch]);

  const defeat = useAppSelector((state) => state.app.defeat);
  const victory = useAppSelector(
    (state) => state.app.victory && !state.app.victoryDismissed,
  );

  if (victory) {
    return (
      <div className="z-999 absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-center bg-[#eb3fb7] bg-opacity-80 text-center align-middle">
        <h1 className="text-2xl font-bold">You win!</h1>
        <div className="flex justify-center gap-2">
          <button onClick={dismiss}>Keep going</button>
          <button onClick={reset}>Try Level again</button>
        </div>
      </div>
    );
  }

  if (defeat) {
    return (
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
    );
  }

  return null;
};

export default Overlay;