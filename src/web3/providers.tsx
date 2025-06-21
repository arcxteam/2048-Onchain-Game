"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState, useEffect } from "react";
import { Web3AuthProvider } from "@web3auth/modal/react";
import { WagmiProvider } from "wagmi";
import { createConfig, http } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { defineChain } from "viem";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";

// PERBAIKAN: Chain ID harus dalam format hex yang benar (0x40d9 untuk 16601)
const ogGalileoTestnet = defineChain({
  id: 16601,
  name: "OG-Galileo-Testnet",
  network: "og-galileo-testnet",
  nativeCurrency: {
    name: "OG",
    symbol: "OG", 
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ["https://evmrpc-testnet.0g.ai"]
    }
  },
  blockExplorers: {
    default: {
      name: "Galileo Explorer",
      url: "https://chainscan-galileo.0g.ai"
    }
  },
});

const config = createConfig({
  chains: [ogGalileoTestnet],
  connectors: [metaMask()],
  transports: {
    [ogGalileoTestnet.id]: http()
  }
});

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // PERBAIKAN: Chain ID dalam format hex yang benar (0x40d9)
  const web3AuthConfig = {
    web3AuthOptions: {
      clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x40d9", // Hex dari 16601 (huruf kecil)
        rpcTarget: "https://evmrpc-testnet.0g.ai",
        displayName: "OG Galileo Testnet",
        ticker: "OG",
        tickerName: "OG Token"
      }
    },
    modalConfig: {
      metamask: {
        name: "metamask",
        showOnModal: true,
        package: null
      }
    }
  };

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing wallet providers...</p>
        </div>
      </div>
    );
  }

  return (
    <Web3AuthProvider config={web3AuthConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </Web3AuthProvider>
  );
}