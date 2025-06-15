"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { Web3AuthProvider } from "@web3auth/modal/react";
import { WagmiProvider, createConfig } from "wagmi";
import { http } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { defineChain } from "viem";

const ogGalileoTestnet = defineChain({
  id: 16601,
  name: "OG-Galileo-Testnet",
  network: "og-galileo-testnet",
  nativeCurrency: { name: "OG", symbol: "OG", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://evmrpc-testnet.0g.ai"] },
  },
  blockExplorers: {
    default: { name: "Galileo Explorer", url: "https://chainscan-galileo.0g.ai" },
  },
});

const config = createConfig({
  chains: [ogGalileoTestnet],
  connectors: [metaMask()],
  transports: {
    [ogGalileoTestnet.id]: http(),
  },
});

type Props = {
  children: ReactNode;
};

export function MiniKitProvider({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <Web3AuthProvider
      config={{
        web3AuthOptions: {
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
          web3AuthNetwork: "sapphire_devnet",
        },
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </Web3AuthProvider>
  );
}