import Board from '@/components/Board';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { move, setGameId, endGame, resetGame, setActive, updateBoard, addMove, setHighestTile } from '@/store/game';
import { useCallback, useEffect, useState } from 'react';
import { useWeb3Auth } from "@web3auth/modal";
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { initializeBoard, slideBoard, calculateHighestTile } from '@/utils/board';
import { contractAddress } from '@/config/networks';
import ABI from '@/pages/api/ABI.json';
import { ethers } from 'ethers';

export default function Home() {
  const dispatch = useDispatch();
  const { board, isActive, mode, gameId } = useSelector((state: any) => state.app);
  const { web3auth } = useWeb3Auth();
  const { isConnected, address } = useAccount();
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: boardData } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'getBoard',
    args: [gameId || ethers.utils.formatBytes32String('game-1')],
    enabled: isConnected && mode === 'onchain' && !!gameId,
  });
  const { write: approvePlayer } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'approvePlayer',
  });
  const { write: playContract } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'play',
  });
  const { write: submitBatchMoves } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'submitBatchMoves',
  });

  const connectWallet = useCallback(async () => {
    if (!web3auth) return;
    try {
      await web3auth.connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  }, [web3auth]);

  useEffect(() => {
    if (isConnected && address && !isInitialized) {
      approvePlayer().then(() => {
        setIsInitialized(true);
      }).catch((error) => {
        console.error('Error approving player:', error);
      });
    }
  }, [isConnected, address, approvePlayer, isInitialized]);

  useEffect(() => {
    if (boardData && mode === 'onchain') {
      dispatch(updateBoard(boardData[0] as number[]));
    }
  }, [boardData, mode, dispatch]);

  useEffect(() => {
    if (!board.length) {
      const { board: initialBoard } = initializeBoard(4);
      dispatch(updateBoard(initialBoard));
      dispatch(setActive(true));
    }
  }, [dispatch, board]);

  const handleMove = useCallback((direction: number) => {
    if (!isActive || !gameId) return;
    const newBoard = slideBoard(board, direction);
    dispatch(updateBoard(newBoard));
    dispatch(addMove(direction));
    dispatch(setHighestTile(calculateHighestTile(newBoard)));
    if (isConnected && mode === 'onchain' && playContract) {
      playContract({ args: [gameId, direction, newBoard[0]] }).catch(console.error);
    }
  }, [isActive, board, dispatch, isConnected, mode, playContract, gameId]);

  const handleGameOver = useCallback(async () => {
    if (!isConnected || !isActive || !gameId) return;
    try {
      if (mode === 'offchain') {
        const moves = useSelector((state: any) => state.app.moves);
        const resultBoards = useSelector((state: any) => state.app.resultBoards);
        await submitBatchMoves({ args: [gameId, moves, resultBoards] });
      }
      dispatch(endGame());
    } catch (error) {
      console.error('Game over error:', error);
    }
  }, [isConnected, isActive, mode, dispatch, submitBatchMoves, gameId]);

  return (
    <>
      <Head>
        <title>Onchain Game 2048</title>
      </Head>
      <main className="mx-auto grid h-screen max-w-lg items-center p-4 py-8">
        <Header onConnect={connectWallet} />
        <Board onMove={handleMove} />
        <Footer onEndGame={handleGameOver} />
      </main>
    </>
  );
}
