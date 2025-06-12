import Board from '@/components/Board';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { move, setGameId, endGame, resetGame, setActive, updateBoard, addMove, setHighestTile } from '@/store/game';
import { useCallback, useEffect } from 'react';
import { useBlockchain } from '@/providers/minikitprovider';
import { slideBoard, calculateHighestTile } from '@/utils/board';
import { initializeBoard } from '@/utils/board'; // Untuk inisialisasi papan default

export default function Home() {
  const dispatch = useDispatch();
  const { board, isActive } = useSelector((state) => state.app);
  const { contract, connectWallet, isConnected, errorMessage } = useBlockchain();

  // Inisialisasi papan default tanpa koneksi wallet
  useEffect(() => {
    if (!board.length) {
      const { board: initialBoard } = initializeBoard(4);
      dispatch(updateBoard(initialBoard));
      dispatch(setActive(true));
    }
  }, [dispatch, board]);

  const handleMove = useCallback((direction: number) => {
    if (contract && isActive) {
      const newBoard = slideBoard(board, direction);
      dispatch(updateBoard(newBoard));
      dispatch(addMove(direction));
      dispatch(setHighestTile(calculateHighestTile(newBoard)));
      if (contract) {
        contract.play(setGameId, direction, newBoard[0]).catch(console.error);
      }
    }
  }, [contract, isActive, board, dispatch]);

  const handleGameOver = useCallback(async () => {
    if (contract && isActive) {
      try {
        await contract.endGame(setGameId);
        dispatch(endGame());
      } catch (error) {
        console.error('Game over error:', error);
      }
    }
  }, [contract, isActive, dispatch]);

  return (
    <>
      <Head>
        <title>Onchain Game 2048</title>
      </Head>
      <main className="mx-auto grid h-screen max-w-lg items-center p-4 py-8">
        <Header />
        <Board onMove={handleMove} />
        <Footer onEndGame={handleGameOver} />
      </main>
    </>
  );
}