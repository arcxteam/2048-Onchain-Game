import { useWeb3Modal } from '@web3auth/modal/react';
import { useAccount, useDisconnect } from 'wagmi';

export const useWalletConnect = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const connectWallet = () => open();
  const disconnectWallet = () => disconnect();

  return { connectWallet, disconnectWallet, address, isConnected };
};