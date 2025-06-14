import Board from '@/components/Board';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { move, setGameId, endGame, resetGame, setActive, updateBoard, addMove, setHighestTile } from '@/store/game';
import { useCallback, useEffect, useState } from 'react';
import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { initializeBoard, slideBoard, calculateHighestTile } from '@/utils/board';
import { contractAddress } from '@/config/networks';
import ABI from '@/pages/api/ABI.json';
import { ethers } from 'ethers';

export default function Home() {
  const dispatch = useDispatch();
  const { board, isActive, mode, gameId } = useSelector((state: any) => state.app);
  const { connect } = useWeb3AuthConnect();
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

  // Inisialisasi awal saat wallet terkoneksi
  useEffect(() => {
    if (isConnected && address && !isInitialized) {
      approvePlayer().then(() => {
        setIsInitialized(true); // Hanya sekali
      }).catch((error) => {
        console.error('Error approving player:', error);
      });
    }
  }, [isConnected, address, approvePlayer, isInitialized]);

  // Update board dari kontrak untuk mode on-chain
  useEffect(() => {
    if (boardData && mode === 'onchain') {
      dispatch(updateBoard(boardData[0] as number[]));
    }
  }, [boardData, mode, dispatch]);

  // Inisialisasi board awal untuk off-chain
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
        const resultBoards = [board[0]]; // Sesuaikan dengan state board
        await submitBatchMoves({ args: [gameId, moves, resultBoards] });
      }
      dispatch(endGame());
    } catch (error) {
      console.error('Game over error:', error);
    }
  }, [isConnected, isActive, mode, dispatch, submitBatchMoves, gameId, board]);

  return (
    <>
      <Head>
        <title>Onchain Game 2048</title>
      </Head>
      <main className="mx-auto grid h-screen max-w-lg items-center p-4 py-8">
        <Header onConnect={connect} />
        <Board onMove={handleMove} />
        <Footer onEndGame={handleGameOver} />
      </main>
    </>
  );
}
