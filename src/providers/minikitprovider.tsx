'use client';

import { ethers } from 'ethers';
import { createContext, useContext, useEffect, useState } from 'react';
import { networkConfigs, contractAddress } from '@/config/networks';

const BlockchainContext = createContext<{
  contract: ethers.Contract | null;
  approvePlayer: () => Promise<void>;
  selectMode: (isOnchain: boolean) => Promise<void>;
} | null>(null);

export const BlockchainProvider = ({ children }) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [abi, setAbi] = useState<any[]>([]);

  useEffect(() => {
    const loadAbi = async () => {
      try {
        const response = await fetch('/api/abi'); // Ubah ke endpoint /api/abi
        if (!response.ok) throw new Error('Failed to fetch ABI');
        const abiData = await response.json();
        setAbi(abiData);
      } catch (error) {
        console.error('Failed to load ABI:', error);
      }
    };
    loadAbi();
  }, []);

  const switchNetwork = async (network: string) => {
    try {
      const config = networkConfigs[network];
      if (!config) throw new Error(`No configuration for network: ${network}`);

      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${config.chainId.toString(16)}` }], // Konversi chainId ke hex
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setContract(new ethers.Contract(contractAddress, abi, signer));
    } catch (error) {
      console.error('Error switching network:', error);
    }
  };

  const approvePlayer = async () => {
    if (contract && !isApproved) {
      try {
        const tx = await contract.approvePlayer();
        await tx.wait();
        setIsApproved(true);
      } catch (error) {
        console.error('Error approving player:', error);
      }
    }
  };

  const selectMode = async (isOnChain: boolean) => {
    if (contract && isApproved) {
      try {
        const tx = await contract.selectMode(isOnChain);
        await tx.wait();
        const initialBoard = [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const initialMoves = [0, 1, 2];
        const gameId = ethers.utils.formatBytes32String(`game-${Date.now()}`);
        const txStart = await contract.startGame(gameId, [initialBoard[0], 0, 0, 0], initialMoves);
        await txStart.wait();
        console.log('Game started with ID:', gameId);
      } catch (error) {
        console.error('Error selecting mode:', error);
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        await switchNetwork('0g-testnet');
        await approvePlayer();
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
