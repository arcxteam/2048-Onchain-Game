import Image from 'next/image';
import useAppSelector from '@/hooks/useAppSelector';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface HeaderProps {
  onConnect: () => void;
}

const Header = ({ onConnect }: HeaderProps) => {
  const score = useAppSelector((state) => state.app.score);
  const best = useAppSelector((state) => state.app.best);
  const { isConnected } = useAccount();
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    const getPlayerId = async () => {
      if (isConnected) {
        const accounts = await window.ethereum?.request({ method: 'eth_accounts' });
        setPlayerId(accounts?.[0] || null);
      }
    };
    if (isConnected) getPlayerId();
    window.ethereum?.on('accountsChanged', getPlayerId);
    return () => window.ethereum?.removeListener('accountsChanged', getPlayerId);
  }, [isConnected]);

  return (
    <div className="flex justify-between align-middle p-4">
      <div className="flex items-center gap-4">
        <Image src="/2048-color.png" width={100} height={100} alt="logo" />
        <button
          onClick={onConnect}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isConnected}
        >
          {isConnected ? 'Connected' : 'Connect Wallet'}
        </button>
      </div>
      <div className="flex gap-5">
        <div className="flex gap-x-2 rounded-md bg-black p-3 text-center font-bold text-[#ff833b]">
          <div className="font-bold uppercase">Score: </div>
          <div>{score}</div>
        </div>
        <div className="flex gap-x-2 rounded-md border-2 bg-black p-3 text-center font-bold text-[#47e94f]">
          <div className="font-bold uppercase">Best: </div>
          <div>{best}</div>
        </div>
        <div className="flex gap-x-2 rounded-md bg-black p-3 text-center font-bold text-white">
          <div className="font-bold uppercase">Wallet: </div>
          <div>{playerId ? `${playerId.slice(0, 6)}...${playerId.slice(-4)}` : 'Not Connected'}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;