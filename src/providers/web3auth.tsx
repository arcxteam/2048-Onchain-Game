"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { Web3AuthProvider } from "@web3auth/modal/react";
import { WagmiProvider } from "wagmi";
import { configureChains, createConfig, mainnet, sepolia, holesky} from "wagmi";
import { publicProvider } from "wagmi";

const { chains, publicClient } = configureChains(
  [
    mainnet,
    sepolia,
    holesky,
    { id: 16601, name: '0G-Galileo-Testnet', rpcUrls: { default: { http: ['https://evmrpc-testnet.0g.ai'] } } },
  ],
  [publicProvider()]
);

const wagmiConfig = createConfig({
  autoConnect: false,
  publicClient,
});

const web3AuthOptions = {
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
  web3AuthNetwork: "sapphire_devnet",
};

export function Web3AuthProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Web3AuthProvider config={web3AuthOptions}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </Web3AuthProvider>
  );
}