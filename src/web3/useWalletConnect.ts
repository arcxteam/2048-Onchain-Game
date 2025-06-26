"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState } from "react";

export const useWalletConnect = () => {
  const { connectAsync, connectors, status: connectStatus } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const connectWallet = async () => {
    try {
      if (isConnected) return address;
      
      // Pilih wallet pertama (MetaMask) atau bisa dibuat selector UI
      const { connector } = await connectAsync({ connector: connectors[0] });
      
      if (!connector) throw new Error("Wallet tidak terhubung");
      return address;
    } catch (error) {
      console.error("Gagal connect:", error);
      throw error;
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      console.error("Gagal disconnect:", error);
    }
  };

  return {
    connectWallet,
    disconnectWallet,
    address,
    isConnected,
    isInitializing: false, // RainbowKit handle sendiri
    isConnecting: connectStatus === "pending"
  };
};
