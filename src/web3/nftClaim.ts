import { contractInteractions } from './contractInteractions';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useStateManagement } from './stateManagement';

export const useNFTClaim = () => {
  const { gameId } = useStateManagement();
  const highestTile = useAppSelector((state) => Math.max(...state.app.board));
  const { write: claimNFT } = contractInteractions.claimNFT(gameId);

  const handleClaim = () => {
    if (claimNFT) claimNFT();
  };

  return { handleClaim, highestTile };
};