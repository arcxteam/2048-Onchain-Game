import Image from 'next/image';
import Control from './Control';
import useAppSelector from '@/hooks/useAppSelector';
import React, { useEffect, useState } from 'react';
import { useBlockchain } from '@/minikitprovider'; // Perbaiki path impor

const Header = () => {
  const score = useAppSelector((state) => state.app.score);
  const best = useAppSelector((state) => state.app.best);
  const { contract } = useBlockchain();
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    const getPlayerId = async () => {
      if (contract && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          setPlayerId(accounts?.[0] || 'Not Connected');
        } catch (error) {
          setPlayerId('Not Connected');
        }
      }
    };
    getPlayerId();
    window.ethereum?.on('accountsChanged', getPlayerId);
    return () => window.ethereum?.removeListener('accountsChanged', getPlayerId);
  }, [contract]);

  return (
    <>
      <div className="flex justify-between align-middle">
        <div className="grid grid-cols-1 items-center gap-x-3">
          <Image src="/2048-color.png" width={300} height={300} alt="logo" />
        </div>
        <div className="flex gap-5">
          <div className="m-auto flex gap-x-2 rounded-md bg-black p-3 text-center font-bold text-[#ff833b]">
            <div className="font-bold uppercase">Score: </div>
            <div>{score}</div>
          </div>
          <div className="m-auto flex gap-x-2 rounded-md border-2 bg-black p-3 text-center font-bold text-[#47e94f]">
            <div className="font-bold uppercase">Best: </div>
            <div>{best}</div>
          </div>
          <div className="m-auto flex gap-x-2 rounded-md bg-black p-3 text-center font-bold text-white">
            <div className="font-bold uppercase">Wallet: </div>
            <div>{playerId ? `${playerId.slice(0, 6)}...${playerId.slice(-4)}` : 'Connect'}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;