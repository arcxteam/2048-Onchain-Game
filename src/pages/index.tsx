import Board from '@/components/Board';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { move, setGameId, endGame, resetGame, setActive, updateBoard, addMove, setHighestTile } from '@/store/game';
import { useCallback, useEffect } from 'react';
import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { initializeBoard, slideBoard, calculateHighestTile } from '@/utils/board';
import { contractAddress } from '@/config/networks';
import ABI from '@/pages/api/ABI.json';

export default function Home() {
  const dispatch = useDispatch();
  const { board, isActive } = useSelector((state) => state.app);
  const { connect } = useWeb3AuthConnect();
  const { isConnected, address } = useAccount();
  const { data: contractRead } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'getBoard', // Ganti dengan fungsi read yang sesuai di kontrak Anda
  });
  const { write: playContract } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'play', // Ganti dengan fungsi write yang sesuai di kontrak Anda
  });

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
      if (isConnected && playContract) {
        playContract({ args: [address, direction, newBoard[0]] }).catch(console.error);
      }
    }
  }, [isActive, board, dispatch, isConnected, playContract, address]);

  const handleGameOver = useCallback(async () => {
    if (isConnected && isActive) {
      try {
        // Ganti dengan fungsi endGame di kontrak jika ada
        dispatch(endGame());
      } catch (error) {
        console.error('Game over error:', error);
      }
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