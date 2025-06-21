import Image from "next/image";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useWalletConnect } from "@/web3/useWalletConnect";
import { useLeaderboard } from "@/web3/leaderboard";
import { formatAddress } from "@/web3/utils";
import React, { useState } from "react";

const Header = () => {
  const score = useAppSelector((state) => state.app.score);
  const best = useAppSelector((state) => state.app.best);
  
  const { 
    connectWallet, 
    disconnectWallet, 
    address, 
    isConnected,
    isInitializing,
    isConnecting
  } = useWalletConnect();
  
  const { leaderboard } = useLeaderboard();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  const handleWalletClick = async () => {
    setErrorMessage(null);
    
    if (isConnected) {
      await disconnectWallet();
    } else {
      try {
        await connectWallet();
      } catch (error) {
        console.error("Connection error:", error);
        setErrorMessage("Failed to connect wallet. Please try again.");
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }
  };

  return (
    <div className="flex w-full bg-white shadow-sm px-2 sm:px-4 py-2">
      {/* Logo - Left */}
      <div className="flex-shrink-0 mr-2">
        {logoError ? (
          <h4 className="text-xl sm:text-2xl font-bold text-[#ff6270]">2048</h4>
        ) : (
          <Image 
            src="/2048-logo.svg" 
            width={250} 
            height={100} 
            alt="2048 Logo"
            className="object-contain"
            onError={() => setLogoError(true)}
          />
        )}
      </div>
      
      {/* Controls - Right */}
      <div className="flex flex-1 justify-end items-center gap-2">
        {/* Score & Best Container */}
        <div className="flex gap-2">
          <div className="flex flex-col items-center bg-[#ff6270] rounded px-2 py-1 text-white">
            <span className="text-[10px] font-bold">SCORE</span>
            <span className="font-bold text-sm">{score}</span>
          </div>
          
          <div className="flex flex-col items-center bg-[#47e94f] rounded px-2 py-1 text-white">
            <span className="text-[10px] font-bold">BEST</span>
            <span className="font-bold text-sm">{best}</span>
          </div>
        </div>
        
        {/* Wallet & Leaderboard Container */}
        <div className="flex gap-2">
          {/* Wallet Button */}
          <div className="relative">
            <button
              className={`flex items-center justify-center rounded px-2 py-1 min-w-[90px] sm:min-w-[110px] text-xs sm:text-sm transition-all
                ${
                  isConnected 
                    ? "bg-[#4a86e8] text-white" 
                    : "bg-[#FF833B] text-white"
                }
                ${(isInitializing || isConnecting) ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
              onClick={handleWalletClick}
              disabled={isInitializing || isConnecting}
            >
              {isInitializing ? (
                "Initializing.."
              ) : isConnecting ? (
                "Connecting.."
              ) : isConnected ? (
                <span className="truncate">{formatAddress(address || "")}</span>
              ) : (
                "Connect"
              )}
            </button>
          </div>
          
          {/* Leaderboard Button */}
          <div className="relative">
            <button
              className="flex items-center justify-center rounded bg-[#4a86e8] px-2 py-1 text-white text-xs sm:text-sm min-w-[80px] hover:opacity-90"
              onClick={() => setShowLeaderboard(!showLeaderboard)}
            >
              <span>Leaderboard</span>
            </button>
            
            {showLeaderboard && leaderboard && leaderboard.length > 0 && (
              <div className="absolute right-0 z-10 mt-1 w-64 rounded bg-white border border-gray-300 p-2 shadow-lg">
                <h3 className="mb-1 font-bold text-[#ff6270] text-xs">TOP PLAYERS</h3>
                <ul className="max-h-60 overflow-y-auto space-y-1">
                  {leaderboard.map((entry) => (
                    <li key={entry.rank} className="py-1 px-2 bg-gray-100 rounded">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-gray-700">#{entry.rank}</span>
                        <span className="font-mono truncate max-w-[100px]">{entry.playerId}</span>
                      </div>
                      <div className="flex justify-between mt-0.5 text-[9px]">
                        <span className="text-green-600">{entry.points} XP</span>
                        <span className="text-purple-600">Level {entry.nftLevel}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="fixed top-2 right-2 bg-red-600 text-white px-3 py-1 rounded text-xs z-50">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default Header;