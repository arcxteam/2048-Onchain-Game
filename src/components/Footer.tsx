import { useCallback, useEffect, useState } from 'react';
import Control from './Control';
import { useAccount, useContractWrite } from 'wagmi';
import { contractAddress } from '@/config/networks';
import ABI from '@/pages/api/ABI.json';
import { ethers } from 'ethers';
import useAppDispatch from '@/hooks/useAppDispatch';
import { setMode, setGameId } from '@/store/game';

const Footer: React.FC = () => {
  const { address } = useAccount();
  const dispatch = useAppDispatch();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { write: selectMode } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'selectMode',
  });
  const { write: startGame } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'startGame',
  });

  useEffect(() => {
    setIsWalletConnected(!!address);
    if (address) {
      dispatch(setMode('offchain'));
    }
  }, [address, dispatch]);

  const handleModeSelect = useCallback(
    async (mode: 'onchain' | 'offchain') => {
      if (!isWalletConnected) {
        alert('Please connect your wallet first!');
        return;
      }
      try {
        await selectMode({ args: [mode === 'onchain'] });
        const gameId = ethers.utils.formatBytes32String(`game-${Date.now()}`);
        const initialBoard = [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const initialMoves = [0, 1, 2];
        await startGame({ args: [gameId, [initialBoard[0], 0, 0, 0], initialMoves] });
        dispatch(setMode(mode));
        dispatch(setGameId(gameId));
      } catch (error) {
        console.error('Error selecting mode or starting game:', error);
        alert('Failed to select mode or start game.');
      }
    },
    [isWalletConnected, selectMode, startGame, dispatch],
  );

  return (
    <div className="leading-lg flex flex-col gap-y-8 text-center font-medium text-[#adadad]">
      <div className="mt-2 w-full flex gap-4 justify-center">
        <Control />
        <button
          onClick={() => handleModeSelect('onchain')}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={!isWalletConnected}
        >
          Onchain
        </button>
        <button
          onClick={() => handleModeSelect('offchain')}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          disabled={!isWalletConnected}
        >
          Offchain
        </button>
      </div>
      <p>
        Onchain 2048{' '}
        <a
          href="https://cuannode.greyscope.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline"
        >
          © 2025 Greyscope&Co. by;@0xgr3y
        </a>
        .
      </p>
    </div>
  );
};

export default Footer;
