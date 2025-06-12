export const networkConfigs = {
  '0g-testnet': {
    chainId: 16601,
    rpcUrl: 'https://evmrpc-testnet.0g.ai',
  },
  // add other network (sepolia, holesky)
};

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xdF0d5abC614EF45C4bCEA121624644523BAc80b7';
export const abi = []; // Placeholder, akan diimpor dari src/pages/api/ABI.json di minikitprovider.tsx