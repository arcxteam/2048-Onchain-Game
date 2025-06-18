import Image from 'next/image';
import Control from './Control';
import useAppSelector from '@/hooks/useAppSelector';
import React from 'react';
import { useWalletConnect } from '@/web3/useWalletConnect'; // Impor hook
import { useLeaderboard } from '@/web3/leaderboard'; // Impor hook
import { formatAddress } from '@/web3/utils';

const Header = () => {
  const score = useAppSelector((state) => state.app.score);
  const best = useAppSelector((state) => state.app.best);
  const { connectWallet, address, isConnected } = useWalletConnect();
  const { leaderboard } = useLeaderboard();

  return (
    <>
      <div className="flex justify-between align-middle">
        <div className="grid grid-cols-2 items-center gap-x-3">
          <Image src="/2048-color.png" width={300} height={300} alt="logo"></Image>
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
          <button
            className="m-auto rounded-md bg-gray-300 px-3 py-2"
            onClick={connectWallet}
          >
            {isConnected ? `Connected: ${formatAddress(address || '')}` : 'Connect'}
          </button>
          <button className="m-auto rounded-md bg-gray-300 px-3 py-2">
            Leaderboard
            {leaderboard.length > 0 && (
              <ul>
                {leaderboard.map(entry => (
                  <li key={entry.rank}>
                    {entry.rank}. {entry.playerId} - {entry.points} XP - {entry.nftLevel}
                  </li>
                ))}
              </ul>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;