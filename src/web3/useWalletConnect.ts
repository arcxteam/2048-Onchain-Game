"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
// import { useState } from "react";

export const useWalletConnect = () => {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const connectWallet = async () => {
    try {
      if (isConnected) return address;
      if (!openConnectModal) throw new Error("Modal not be ready");
      
      openConnectModal(); // Trigger modal RainbowKit
      return address;
    } catch (error) {
      console.error("Connection error:", error);
      throw error;
    }
  };

  const disconnectWallet = async () => {
    await disconnectAsync();
  };

  return {
    connectWallet,
    disconnectWallet,
    address,
    isConnected,
    isInitializing: false,
    isConnecting: false
  };
};
