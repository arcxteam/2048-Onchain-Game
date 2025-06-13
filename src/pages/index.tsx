import Board from '@/components/Board';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { move, setGameId, endGame, resetGame, setActive, updateBoard, addMove, setHighestTile, setMode } from '@/store/game';
import { useCallback, useEffect } from 'react';
import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { initializeBoard, slideBoard, calculateHighestTile } from '@/utils/board';
import { contractAddress } from '@/config/networks';
import ABI from '@/pages/api/ABI.json';

export default function Home() {
  const dispatch = useDispatch();
  const { board, isActive, mode } = useSelector((state) => state.app);
  const { connect } = useWeb3AuthConnect();
  const { isConnected, address } = useAccount();
  const { data: boardData } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'getBoard', // Fungsi untuk membaca board dari kontrak
    enabled: isConnected && mode === 'onchain',
  });
  const { write: approvePlayer } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'approvePlayer', // Fungsi untuk otorisasi pemain
  });
  const { write: selectMode } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'selectMode', // Fungsi untuk memilih mode
  });
  const { write: startGame } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'startGame', // Fungsi untuk memulai permainan
  });
  const { write: playContract } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'play', // Fungsi untuk gerakan
  });

  useEffect(() => {
    if (isConnected && !gameId) {
      approvePlayer().then(() => {
        selectMode({ args: [mode === 'onchain'] }); // Argumen berdasarkan mode
        startGame({ args: [initializeBoard(4).board] }).then(() => {
          dispatch(setGameId("game-1")); // Ganti dengan ID dari kontrak jika tersedia
        });
      });
    }
    if (boardData && mode === 'onchain') {
      dispatch(updateBoard(boardData as number[]));
    }
  }, [isConnected, approvePlayer, selectMode, startGame, dispatch, boardData, mode, gameId]);

  useEffect(() => {
    if (!board.length) {
      const { board: initialBoard } = initializeBoard(4);
      dispatch(updateBoard(initialBoard));
      dispatch(setActive(true));
      if (mode === 'offchain') {
        dispatch(setMode('offchain'));
      }
    }
  }, [dispatch, board, mode]);

  const handleMove = useCallback((direction: number) => {
    if (isActive) {
      const newBoard = slideBoard(board, direction);
      dispatch(updateBoard(newBoard));
      dispatch(addMove(direction));
      dispatch(setHighestTile(calculateHighestTile(newBoard)));
      if (isConnected && mode === 'onchain' && playContract) {
        playContract({ args: [address, direction, newBoard[0]] }).catch(console.error);
      }
    }
  }, [isActive, board, dispatch, isConnected, mode, playContract, address]);

  const handleGameOver = useCallback(async () => {
    if (isConnected && isActive && mode === 'onchain') {
      try {
        // Ganti dengan fungsi endGame di kontrak jika ada
        dispatch(endGame());
      } catch (error) {
        console.error('Game over error:', error);
      }
    }
  }, [isConnected, isActive, mode, dispatch]);

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