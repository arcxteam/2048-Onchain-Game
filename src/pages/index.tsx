import Board from '@/components/Board';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { move, setGameId, endGame, resetGame, setActive, updateBoard, addMove, setHighestTile } from '@/store/game';
import { useCallback, useEffect } from 'react';
import { useBlockchain } from '@/src/minikitprovider';
import { slideBoard, calculateHighestTile } from '@/utils/board';

export default function Home() {
  const dispatch = useDispatch();
  const { gameId, board, moves, isActive, highestTile, defeat, victory } = useSelector((state) => state.app);
  const { contract, approvePlayer, selectMode } = useBlockchain();

  useEffect(() => {
    const initGame = async () => {
      if (contract && !gameId) {
        await approvePlayer();
        // Mode default off-chain, can choose on button colom (via footer)
        await selectMode(false);
      }
    };
    initGame();
  }, [contract, gameId, approvePlayer, selectMode]);

  const handleMove = useCallback((direction: number) => {
    if (contract && gameId && isActive) {
      const newBoard = slideBoard(board, direction);
      dispatch(updateBoard(newBoard));
      dispatch(addMove(direction));
      dispatch(setHighestTile(calculateHighestTile(newBoard)));
      if (gameId) {
        // On mode on-chain, send tx/id from move tiles
        contract.play(gameId, direction, newBoard[0]).catch(console.error);
      }
    }
  }, [contract, gameId, isActive, board, dispatch]);

  const handleGameOver = useCallback(async () => {
    if (contract && gameId && isActive) {
      if (moves.length > 0) {
        const resultBoards = moves.map(() => board[0]); // Sederhana, perlu disesuaikan
        await contract.submitBatchMoves(gameId, moves, resultBoards);
      }
      await contract.endGame(gameId);
      dispatch(endGame());
    }
  }, [contract, gameId, isActive, moves, board, dispatch]);

  return (
    <>
      <Head>
        <title>Onchain Game 2048</title>
      </Head>
      <main className="mx-auto grid h-screen max-w-lg items-center p-4 py-8">
        <Header />
        <Board onMove={handleMove} />
        <Footer onEndGame={handleGameOver} />
        {defeat || victory ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <button onClick={() => dispatch(resetGame())} className="bg-green-500 text-white px-4 py-2 rounded">
              New Game
            </button>
          </div>
        ) : null}
      </main>
    </>
  );
}