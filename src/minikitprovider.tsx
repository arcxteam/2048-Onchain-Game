// src/minikit-provider.tsx
'use client';

import { ethers } from 'ethers';
import { createContext, useContext, useEffect, useState } from 'react';
import { networkConfigs, contractAddress, abi } from '../config/networks';
import ABI from './api/ABI.json';

const BlockchainContext = createContext<{
  contract: ethers.Contract | null;
  approvePlayer: () => Promise<void>;
  selectMode: (isOnchain: boolean) => Promise<void>;
} | null>(null);

export const BlockchainProvider = ({ children }) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isApproved, setIsApproved] = useState(false);

  const switchNetwork = async (network: string) => {
    await window.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ethers.utils.hexValue(networkConfigs[network].chainId) }],
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    setContract(new ethers.Contract(contractAddress, ABI, signer));
  };

  const approvePlayer = async () => {
    if (contract && !isApproved) {
      const tx = await contract.approvePlayer();
      await tx.wait();
      setIsApproved(true);
    }
  };

  const selectMode = async (isOnchain: boolean) => {
    if (contract && isApproved) {
      const tx = await contract.selectMode(isOnchain);
      await tx.wait();
      // Next to start game after chosing mode
      const initialBoard = [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const initialMoves = [0, 1, 2];
      const gameId = ethers.utils.formatBytes32String(`game-${Date.now()}`);
      const startTx = await contract.startGame(gameId, [initialBoard[0], 0, 0, 0], initialMoves);
      await startTx.wait();
      // Dispatch to Redux for gameId & board
      console.log('Game started with ID:', gameId);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        await switchNetwork('0g-testnet'); // Default ke 0G Testnet
        await approvePlayer(); // Approval otomatis
      }
    };
    init();
  }, []);

  return (
    <BlockchainContext.Provider value={{ contract, approvePlayer, selectMode }}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) throw new Error('useBlockchain must be used within a BlockchainProvider');
  return context;
};