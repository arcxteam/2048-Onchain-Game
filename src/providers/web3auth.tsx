"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { Web3AuthProvider } from "@web3auth/modal/react";
import { WagmiProvider } from "wagmi";
import { configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains([mainnet], [publicProvider]);

const { web3AuthOptions } = {
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!, // Dapat dari dashboard.web3auth.io
  web3AuthNetwork: "sapphire_devnet", // Gunakan testnet untuk pengujian
};

const wagmiConfig = {
  autoConnect: false, // Nonaktifkan koneksi otomatis
  provider,
};

export function Web3AuthProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Web3AuthProvider config={web3AuthOptions}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <div className="container">{children}</div>
        </WagmiProvider>
      </QueryClientProvider>
    </Web3AuthProvider>
  );
}