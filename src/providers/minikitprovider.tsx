'use client';

import { ethers } from 'ethers';
import { createContext, useContext, useEffect, useState } from 'react';
import { networkConfigs, contractAddress } from '@/config/networks';
import { WalletConnectProvider, WalletConnectProviderOptions } from '@walletconnect/web3-provider'; // Tambahkan WalletConnect

const BlockchainContext = createContext<{
  contract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
  errorMessage: string | null;
} | null>(null);

let walletConnectProvider: WalletConnectProvider | null = null;

export const BlockchainProvider = ({ children }) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [abi, setAbi] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadAbi = async () => {
      try {
        const response = await fetch('/api/abi');
        if (!response.ok) throw new Error('Failed to fetch ABI');
        const abiData = await response.json();
        setAbi(abiData);
      } catch (error) {
        console.error('Failed to load ABI:', error);
        setErrorMessage('Failed to load ABI. Check network connection.');
      }
    };
    loadAbi();
  }, []);

  const switchNetwork = async (chainId: number) => {
    try {
      const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : walletConnectProvider;
      if (!provider) throw new Error('No wallet provider detected');

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      const signer = provider.getSigner();
      setContract(new ethers.Contract(contractAddress, abi, signer));
      setErrorMessage(null); // Clear error on success
    } catch (error) {
      console.error('Error switching network:', error);
      setErrorMessage('Failed to switch network. Ensure your wallet is on the correct chain (e.g., chainId 16601).');
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          await switchNetwork(16601); // Default to 0g testnet
        } else {
          throw new Error('No accounts returned. User may have rejected the request.');
        }
      } else if (!walletConnectProvider) {
        walletConnectProvider = new WalletConnectProvider({
          infuraId: 'YOUR_INFURA_ID', // Ganti dengan Infura ID Anda
          chainId: 16601, // Default chainId
        } as WalletConnectProviderOptions);
        await walletConnectProvider.enable();
        const web3Provider = new ethers.providers.Web3Provider(walletConnectProvider);
        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          setIsConnected(true);
          await switchNetwork(16601);
        } else {
          throw new Error('WalletConnect connection failed.');
        }
      } else {
        throw new Error('No wallet provider detected. Install MetaMask or use WalletConnect.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setErrorMessage(error.message || 'Failed to connect wallet. Check console for details.');
    }
  };

  return (
    <BlockchainContext.Provider value={{ contract, connectWallet, isConnected, errorMessage }}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) throw new Error('useBlockchain must be used within a BlockchainProvider');
  return context;
};