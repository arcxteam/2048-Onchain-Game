"use client";

import { useWeb3Auth, useWeb3AuthConnect } from "@web3auth/modal/react";
import { useAccount, useDisconnect } from "wagmi";

export const useWalletConnect = () => {
  const { isInitialized } = useWeb3Auth();
  const { connect: web3AuthConnect, loading: connecting } = useWeb3AuthConnect();
  const { address, isConnected: isWagmiConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  const connectWallet = async () => {
    try {
      if (isWagmiConnected) return address;
      
      // Pastikan Web3Auth sudah diinisialisasi
      if (!isInitialized) {
        throw new Error("Wallet provider is not initialized yet");
      }
      
      // Lakukan koneksi
      await web3AuthConnect();
      
      return address;
    } catch (error) {
      console.error("Wallet connection failed:", error);
      throw new Error("Failed to connect wallet");
    }
  };

  const disconnectWallet = async () => {
    try {
      wagmiDisconnect();
    } catch (error) {
      console.error("Wallet disconnection failed:", error);
    }
  };

  return {
    connectWallet,
    disconnectWallet,
    address,
    isConnected: isWagmiConnected,
    isInitializing: !isInitialized,
    isConnecting: connecting
  };
};