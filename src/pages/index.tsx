import Board from '@/components/Board';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { move, setGameId, endGame, resetGame, setActive, updateBoard, addMove, setHighestTile } from '@/store/game';
import { useCallback, useEffect } from 'react';
import { useWeb3AuthConnect } from '@web3auth/modal/react';
import { useAccount } from 'wagmi';
import { initializeBoard, slideBoard, calculateHighestTile } from '@/utils/board';

export default function Home() {
  const dispatch = useDispatch();
  const { board, isActive } = useSelector((state) => state.app);
  const { connect } = useWeb3AuthConnect();
  const { isConnected } = useAccount();

  // Inisialisasi papan default tanpa koneksi wallet
  useEffect(() => {
    if (!board.length) {
      const { board: initialBoard } = initializeBoard(4);
      dispatch(updateBoard(initialBoard));
      dispatch(setActive(true));
    }
  }, [dispatch, board]);

  const handleMove = useCallback((direction: number) => {
    if (isActive) {
      const newBoard = slideBoard(board, direction);
      dispatch(updateBoard(newBoard));
      dispatch(addMove(direction));
      dispatch(setHighestTile(calculateHighestTile(newBoard)));
      // Panggil kontrak hanya jika terhubung
      if (isConnected) {
        // Logika kontrak (perlu disesuaikan dengan Wagmi)
      }
    }
  }, [isActive, board, dispatch, isConnected]);

  const handleGameOver = useCallback(async () => {
    if (isConnected && isActive) {
      // Logika kontrak untuk endGame (perlu disesuaikan)
      dispatch(endGame());
    }
  }, [isConnected, isActive, dispatch]);

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