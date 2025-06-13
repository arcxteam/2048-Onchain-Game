import { useCallback, useEffect, useState } from 'react';
import Control from './Control';
import { useAccount, useContract } from 'wagmi';
import { contractAddress } from '@/config/networks';
import ABI from '@/pages/api/ABI.json';
import { ethers } from 'ethers';

const Footer: React.FC = () => {
  const { address } = useAccount();
  const { data: contract } = useContract({
    address: contractAddress as `0x${string}`,
    abi: ABI,
  });
  const [mode, setMode] = useState<'onchain' | 'offchain' | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    setIsWalletConnected(!!address);
  }, [address]);

  const handleModeSelect = useCallback(() => {
    if (!isWalletConnected) {
      alert('Please connect your wallet first!');
      return;
    }
    if (!contract) {
      alert('Contract not initialized. Please try again.');
      return;
    }
    const selectedMode = prompt('Select mode (onchain/offchain):');
    if (selectedMode === 'onchain' || selectedMode === 'offchain') {
      setMode(selectedMode);
      const startGame = async () => {
        const initialBoard = [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const initialMoves = [0, 1, 2];
        const gameId = ethers.utils.formatBytes32String(`game-${Date.now()}`);
        const tx = await contract.startGame(gameId, [initialBoard[0], 0, 0, 0], initialMoves);
        await tx.wait();
        console.log('Game started with ID:', gameId);
      };
      startGame().catch(console.error);
    } else {
      alert('Invalid mode! Please select "onchain" or "offchain".');
    }
  }, [isWalletConnected, contract]);

  return (
    <div className="leading-lg flex flex-col gap-y-8 text-center font-medium text-[#adadad]">
      <div className="mt-2 w-full">
        <Control />
        <button
          onClick={handleModeSelect}
          className="font-lg mt-2 w-full px-16 py-4"
          disabled={!isWalletConnected || !!mode}
        >
          {mode ? `Mode: ${mode}` : 'Select Mode'}
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
          © 2025 Greyscope&Co. by@0xgr3y
        </a>
        .
      </p>
    </div>
  );
};

export default Footer;