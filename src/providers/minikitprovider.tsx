// 'use client';

// import { ethers } from 'ethers';
// import { createContext, useContext, useEffect, useState } from 'react';
// import { networkConfigs, contractAddress } from '@/config/networks';

// const BlockchainContext = createContext<{
//   contract: ethers.Contract | null;
//   approvePlayer: () => Promise<void>;
//   selectMode: (isOnchain: boolean) => Promise<void>;
//   connectWallet: () => Promise<void>;
//   isConnected: boolean;
//   errorMessage: string | null;
// } | null>(null);

// export const BlockchainProvider = ({ children }) => {
//   const [contract, setContract] = useState<ethers.Contract | null>(null);
//   const [isApproved, setIsApproved] = useState(false);
//   const [abi, setAbi] = useState<any[]>([]);
//   const [isConnected, setIsConnected] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   useEffect(() => {
//     const loadAbi = async () => {
//       try {
//         const response = await fetch('/api/abi');
//         if (!response.ok) throw new Error('Failed to fetch ABI');
//         const abiData = await response.json();
//         setAbi(abiData);
//       } catch (error) {
//         console.error('Failed to load ABI:', error);
//         setErrorMessage('Failed to load ABI. Check network connection.');
//       }
//     };
//     loadAbi();
//   }, []);

//   const switchNetwork = async (network: string) => {
//     try {
//       const config = networkConfigs[network];
//       if (!config) throw new Error(`No configuration for network: ${network}`);

//       await window.ethereum?.request({
//         method: 'wallet_switchEthereumChain',
//         params: [{ chainId: `0x${config.chainId.toString(16)}` }],
//       });
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       setContract(new ethers.Contract(contractAddress, abi, signer));
//       setErrorMessage(null); // Clear error on success
//     } catch (error) {
//       console.error('Error switching network:', error);
//       setErrorMessage('Failed to switch network. Ensure your wallet is on the correct chain.');
//     }
//   };

//   const connectWallet = async () => {
//     try {
//       if (window.ethereum) {
//         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//         if (accounts.length > 0) {
//           setIsConnected(true);
//           await switchNetwork('0g-testnet');
//           await approvePlayer();
//         } else {
//           throw new Error('No accounts returned. User may have rejected the request.');
//         }
//       } else {
//         throw new Error('Ethereum provider (e.g., MetaMask) not detected.');
//       }
//     } catch (error) {
//       console.error('Error connecting wallet:', error);
//       setErrorMessage(error.message || 'Failed to connect wallet. Check console for details.');
//     }
//   };

//   const approvePlayer = async () => {
//     if (contract && !isApproved) {
//       try {
//         const tx = await contract.approvePlayer();
//         await tx.wait();
//         setIsApproved(true);
//       } catch (error) {
//         console.error('Error approving player:', error);
//         setErrorMessage('Failed to approve player. Check contract status.');
//       }
//     }
//   };

//   const selectMode = async (isOnchain: boolean) => {
//     if (contract && isApproved) {
//       try {
//         const tx = await contract.selectMode(isOnchain);
//         await tx.wait();
//         const initialBoard = [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//         const initialMoves = [0, 1, 2];
//         const gameId = ethers.utils.formatBytes32String(`game-${Date.now()}`);
//         const txStart = await contract.startGame(gameId, [initialBoard[0], 0, 0, 0], initialMoves);
//         await txStart.wait();
//         console.log('Game started with ID:', gameId);
//       } catch (error) {
//         console.error('Error selecting mode:', error);
//         setErrorMessage('Failed to select mode. Check game initialization.');
//       }
//     }
//   };

//   return (
//     <BlockchainContext.Provider value={{ contract, approvePlayer, selectMode, connectWallet, isConnected, errorMessage }}>
//       {children}
//     </BlockchainContext.Provider>
//   );
// };

// export const useBlockchain = () => {
//   const context = useContext(BlockchainContext);
//   if (!context) throw new Error('useBlockchain must be used within a BlockchainProvider');
//   return context;
// };