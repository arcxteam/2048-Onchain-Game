"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { Web3AuthProvider } from "@web3auth/modal/react";
import { WagmiProvider } from "@web3auth/modal/react/wagmi";

type Props = {
  children: ReactNode;
};

export function Web3AuthProviders({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Web3AuthProvider
      config={{
        web3AuthOptions: {
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
          web3AuthNetwork: "sapphire_devnet",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </Web3AuthProvider>
  );
}