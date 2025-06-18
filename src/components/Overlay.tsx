import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { dismissAction, resetAction } from '@/store/action';
import { useCallback } from 'react';
import { useNFTClaim } from '@/web3/nftClaim'; // Impor hook

const Overlay: React.FC = () => {
  const dispatch = useAppDispatch();
  const boardSize = useAppSelector((state) => state.app.boardSize);
  const reset = useCallback(() => dispatch(resetAction(boardSize)), [dispatch, boardSize]);
  const dismiss = useCallback(() => dispatch(dismissAction()), [dispatch]);
  const { handleClaim } = useNFTClaim();

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
          <button className="rounded-md bg-gray-300 px-3 py-2" onClick={handleClaim}>
            Claim NFT
          </button>
        </div>
      </div>
    );
  }

  if (defeat) {
    return (
      <div className="z-999 absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-center bg-[#4ee480] bg-opacity-50 text-center align-middle">
        <h1 className="text-2xl font-bold">GAME OVER!</h1>
        <div>
          <button className="rounded-md bg-gray-300 px-3 py-2" onClick={handleClaim}>
            Claim NFT
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Overlay;