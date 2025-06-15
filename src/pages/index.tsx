import Board from '@/components/Board';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { moveAction, resetAction } from '@/store/action';
import { initializeBoard } from '@/utils/board';
import { useCallback, useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { contractAddress } from '@/config/networks';
import ABI from '@/pages/api/ABI.json';
import { ethers } from 'ethers';

export default function Home() {
  const dispatch = useDispatch();
  const { board, isActive, mode, gameId } = useSelector((state: any) => state.app);
  const { isConnected, address } = useAccount();
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: boardData } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'getBoard',
    args: gameId ? [gameId] : undefined,
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
  const { write: startGame } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'startGame',
  });

  useEffect(() => {
    if (isConnected && address && !isInitialized) {
      approvePlayer()
        .then(() => setIsInitialized(true))
        .catch((error) => console.error('Error approving player:', error));
    }
  }, [isConnected, address, approvePlayer, isInitialized]);

  useEffect(() => {
    if (isConnected && !gameId && isInitialized) {
      const newGameId = ethers.utils.formatBytes32String(`game-${Date.now()}`);
      const initialBoard = initializeBoard(4).board;
      const initialMoves = [0, 1, 2];
      startGame({ args: [newGameId, [initialBoard[0], 0, 0, 0], initialMoves] })
        .then(() => dispatch({ type: 'setGameId', payload: newGameId }))
        .catch((error) => console.error('Error starting game:', error));
    }
  }, [isConnected, gameId, isInitialized, dispatch, startGame]);

  useEffect(() => {
    if (boardData && mode === 'onchain') {
      dispatch({ type: 'updateBoard', payload: boardData[0] });
    }
  }, [boardData, mode, dispatch]);

  useEffect(() => {
    if (!board.length && !isConnected) {
      const { board: initialBoard } = initializeBoard(4);
      dispatch({ type: 'updateBoard', payload: initialBoard });
      dispatch({ type: 'setActive', payload: true });
    }
  }, [dispatch, board, isConnected]);

  const handleMove = useCallback((direction: number) => {
    if (!isActive || !gameId) return;
    dispatch(moveAction(direction));
    if (isConnected && mode === 'onchain' && playContract) {
      playContract({ args: [gameId, direction, 0] }).catch(console.error);
    }
  }, [isActive, dispatch, isConnected, mode, playContract, gameId]);

  const handleGameOver = useCallback(async () => {
    if (!isConnected || !isActive || !gameId) return;
    try {
      if (mode === 'offchain') {
        const moves = useSelector((state: any) => state.app.moves);
        const resultBoards = useSelector((state: any) => state.app.resultBoards);
        await submitBatchMoves({ args: [gameId, moves, resultBoards] });
      }
      dispatch({ type: 'endGame' });
    } catch (error) {
      console.error('Game over error:', error);
    }
  }, [isConnected, isActive, mode, dispatch, submitBatchMoves, gameId]);

  return (
    <>
      <Head>
        <title>2048</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <main className="mx-auto grid h-screen max-w-lg items-center p-4 py-8 overflow-hidden font-geist-mono">
        <Header onConnect={() => {}} />
        <Board onMove={handleMove} />
        <Footer onEndGame={handleGameOver} />
      </main>
    </>
  );
}