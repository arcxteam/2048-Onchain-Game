"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { http } from "wagmi";
import { defineChain } from "viem";
import { 
  metaMaskWallet, 
  okxWallet,
  trustWallet,
  coinbaseWallet,
  rainbowWallet
} from "@rainbow-me/rainbowkit/wallets";

// Chain OG Galileo
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

// Konfigurasi RainbowKit (TANPA WalletConnect)
const config = getDefaultConfig({
  appName: "2048 Game",
  projectId: "default_project_id", // Bisa diisi random, tidak dipakai
  chains: [ogGalileoTestnet],
  transports: {
    [ogGalileoTestnet.id]: http()
  },
  wallets: [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        okxWallet,
        trustWallet,
        coinbaseWallet,
        rainbowWallet
      ],
    },
  ],
  ssr: true,
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
