import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { contractAddress } from './networks';
import abi from './api/abi';
import { useStateManagement } from './stateManagement';

export const useOffchainMove = (moves: number[], resultBoards: number[][]) => {
  const { gameId } = useStateManagement();
  const { config } = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'submitBatchMoves',
    args: [moves, resultBoards],
    enabled: !!gameId,
  });

  const { write, isLoading, error } = useContractWrite(config);

  const offchainMove = () => {
    if (write && !isLoading) write();
  };

  return { offchainMove, isLoading, error };
};