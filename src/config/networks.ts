export const networkConfigs = {
  sepolia: { chainId: 11155111, rpcUrl: 'https://eth-sepolia.public.blastapi.io' },
  holesky: { chainId: 17000, rpcUrl: 'https://ethereum-holesky-rpc.publicnode.com' },
  '0g-testnet': { chainId: 16601, rpcUrl: 'https://evmrpc-testnet.0g.ai' },
};

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xdF0d5abC614EF45C4bCEA121624644523BAc80b7';