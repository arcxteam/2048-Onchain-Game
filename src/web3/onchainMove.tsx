import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { contractAddress } from './networks';
import abi from './api/abi';
import { useStateManagement } from './stateManagement';

export const useOnchainMove = (move: number, resultBoard: number[]) => {
  const { gameId } = useStateManagement();
  const { config } = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'play',
    args: [move, resultBoard],
    enabled: !!gameId,
  });

  const { write, isLoading, error } = useContractWrite(config);

  const onchainMove = () => {
    if (write && !isLoading) write();
  };

  return { onchainMove, isLoading, error };
};