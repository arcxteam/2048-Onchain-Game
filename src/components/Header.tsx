import Image from 'next/image';
import useAppSelector from '@/hooks/useAppSelector';
import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';

interface HeaderProps {
  onConnect: () => void;
}

const Header = ({ onConnect }: HeaderProps) => {
  const score = useAppSelector((state) => state.app.score);
  const best = useAppSelector((state) => state.app.best);
  const gameId = useSelector((state: any) => state.app.gameId);
  const { provider, connect } = useWeb3AuthConnect();
  const [isConnected, setIsConnected] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    if (provider) {
      const userInfo = provider.getUserInfo();
      setIsConnected(!!userInfo);
      setPlayerId(userInfo?.email || userInfo?.name || null);
    }
  }, [provider]);

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  const handleConnect = async () => {
    try {
      await connect();
      setIsConnected(true);
      onConnect();
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setPlayerId(null);
  };

  return (
    <div className="grid grid-cols-1 items-center gap-x-3 p-4 font-geist-mono">
      <Image
        src="/2048-color.png"
        width={300}
        height={300}
        alt="logo"
        className="mx-auto"
      />
      <div className="flex flex-col md:flex-row gap-3 justify-center">
        <button
          onClick={toggleLeaderboard}
          className="bg-green-500 text-white px-3 py-2 rounded text-sm"
        >
          Leaderboard
        </button>
        <div className="flex gap-x-2 rounded-md bg-black px-3 py-2 text-center font-bold text-[#ff833b] text-sm">
          <div className="font-bold uppercase">Score:</div>
          <div>{score}</div>
        </div>
        <div className="flex gap-x-2 rounded-md bg-black px-3 py-2 text-center font-bold text-[#47e94f] text-sm">
          <div className="font-bold uppercase">Best:</div>
          <div>{best}</div>
        </div>
        <div className="flex gap-x-2 rounded-md bg-black px-3 py-2 text-center font-bold text-white text-sm">
          <div className="font-bold uppercase">Wallet:</div>
          <div>
            {isConnected ? (
              `${playerId ? ``\({playerId.slice(0, 6)}...\)`{playerId.slice(-4)}` : 'Connected'}`
            ) : (
              <button
                onClick={handleConnect}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
              >
                Connect
              </button>
            )}
            {gameId && <span className="text-xs"> | GameID: {`${gameId.slice(0, 6)}...${gameId.slice(-4)}`}</span>}
          </div>
        </div>
      </div>
      {showLeaderboard && (
        <div className="absolute top-20 left-0 right-0 bg-gray-600 text-white p-4 rounded-md shadow-lg max-w-md mx-auto font-geist-mono">
          <h2 className="text-lg font-bold mb-2">Leaderboard</h2>
          <div className="grid gap-2">
            {Array.from({ length: 10 }, (_, i) => (
              <button
                key={i}
                className="flex justify-between p-2 bg-gray-700 rounded-md hover:bg-gray-500 transition-colors"
                onClick={() => alert(`Player ${i + 1}`)}
              >
                <span>{i + 1}. Placeholder</span>
                <span>Tile: 0</span>
              </button>
            ))}
          </div>
          <button
            onClick={toggleLeaderboard}
            className="mt-4 bg-red-500 text-white px-3 py-2 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;