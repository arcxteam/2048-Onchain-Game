import { useCallback, useEffect, useRef, useState } from 'react';
import Tile from './Tile';
import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { type Point } from '@/types/Models';
import { Direction } from '@/types/Direction';
import { moveAction } from '@/store/action';
import { type BoardType } from '@/utils/board';
import { type Animation, AnimationType } from '@/types/Animations';
import Overlay from './Overlay';
import { useAccount, useContractWrite } from 'wagmi';
import { contractAddress } from '@/config/networks';
import ABI from '@/pages/api/ABI.json';

const Board = ({ onMove }: { onMove: (direction: number) => void }) => {
  const dispatch = useAppDispatch();
  const { board, boardSize, animations, isActive, gameId } = useAppSelector((state) => state.app);
  const { address } = useAccount();
  const { write: playContract } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: ABI,
    functionName: 'play',
  });
  const startPointerLocation = useRef<Point>();
  const currentPointerLocation = useRef<Point>();
  const animationDuration = 180;

  const handleMove = useCallback(
    (direction: Direction) => {
      if (isActive && gameId) {
        dispatch(moveAction(direction));
        onMove(direction);
      }
    },
    [dispatch, isActive, gameId, onMove],
  );

  const [renderedBoard, setRenderedBoard] = useState<BoardType>(board);
  const [renderedAnimations, setRenderedAnimations] = useState<Animation[]>([]);
  const lastBoard = useRef<BoardType>([...board]);
  const animationTimeout = useRef<number>();

  useEffect(() => {
    const keydownListener = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowDown': handleMove(Direction.DOWN); break;
        case 'ArrowUp': handleMove(Direction.UP); break;
        case 'ArrowLeft': handleMove(Direction.LEFT); break;
        case 'ArrowRight': handleMove(Direction.RIGHT); break;
      }
    };
    window.addEventListener('keydown', keydownListener);
    return () => window.removeEventListener('keydown', keydownListener);
  }, [handleMove]);

  const finishPointer = useCallback(
    (a: Point, b: Point) => {
      const distance = Math.sqrt((b.y - a.y) ** 2 + (b.x - a.x) ** 2);
      if (distance < 20) return;
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      if (angle < -135 || angle > 135) handleMove(Direction.LEFT);
      else if (angle < -45) handleMove(Direction.UP);
      else if (angle < 45) handleMove(Direction.RIGHT);
      else if (angle < 135) handleMove(Direction.DOWN);
    },
    [handleMove],
  );

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) startPointerLocation.current = { x: touch.pageX, y: touch.pageY };
  }, []);
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) currentPointerLocation.current = { x: touch.pageX, y: touch.pageY };
  }, []);
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (startPointerLocation.current && currentPointerLocation.current)
      finishPointer(startPointerLocation.current, currentPointerLocation.current);
    startPointerLocation.current = undefined;
    currentPointerLocation.current = undefined;
  }, [finishPointer]);
  const onMouseStart = useCallback((e: React.MouseEvent) => {
    startPointerLocation.current = { x: e.pageX, y: e.pageY };
  }, []);
  const onMouseEnd = useCallback((e: React.MouseEvent) => {
    if (startPointerLocation.current)
      finishPointer(startPointerLocation.current, { x: e.pageX, y: e.pageY });
    startPointerLocation.current = undefined;
  }, [finishPointer]);

  useEffect(() => {
    if (!animations) {
      setRenderedBoard([...board]);
      return;
    }
    const moveAnimations = animations.filter((a) => a.type === AnimationType.MOVE);
    const otherAnimations = animations.filter((a) => a.type !== AnimationType.MOVE);
    if (moveAnimations.length > 0) {
      setRenderedBoard(lastBoard.current);
      setRenderedAnimations(moveAnimations);
      clearTimeout(animationTimeout.current);
      animationTimeout.current = setTimeout(() => {
        setRenderedAnimations(otherAnimations);
        setRenderedBoard([...board]);
      }, animationDuration) as unknown as number;
    } else {
      setRenderedAnimations(otherAnimations);
      setRenderedBoard([...board]);
    }
    lastBoard.current = [...board];
  }, [animations, board]);

  return (
    <div className="relative">
      <div
        className="grid touch-none select-none gap-2.5 rounded-md border-2 bg-black p-2.5"
        onMouseDown={onMouseStart}
        onMouseUp={onMouseEnd}
        onMouseLeave={onMouseEnd}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)` }}
      >
        {renderedBoard.map((value, i) => (
          <Tile
            value={value}
            key={i}
            animations={renderedAnimations?.filter((a) => a.index === i)}
          />
        ))}
      </div>
      <Overlay />
    </div>
  );
};

export default Board;
