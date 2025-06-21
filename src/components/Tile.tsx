import React, { type CSSProperties, useMemo, useState, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";

import {
  type Animation,
  type AnimationMerge,
  type AnimationMove,
  type AnimationNew,
  AnimationType,
} from "@/types/Animations";
import { Direction } from "@/types/Direction";

export interface TileProps {
  value: number;
  animations?: Animation[];
}

function tileTranslate(axis: "X" | "Y", value: number) {
  return `translate${axis}(calc(${value} * (1rem + 100%))`;
}

function findAnimation<T extends Animation>(
  animations: Animation[] | undefined,
  type: AnimationType,
): T {
  return animations?.find((animation) => animation.type === type) as T;
}

const Tile: React.FC<TileProps> = ({ value, animations }) => {
  const [previousValue, setPreviousValue] = useState(value);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (value !== previousValue) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setPreviousValue(value);
        setIsTransitioning(false);
      }, 150); // Increased to 150ms to match Tailwind"s default transition duration
      return () => clearTimeout(timer);
    }
  }, [value, previousValue]);

  const moveAnimation = useMemo(
    () => findAnimation<AnimationMove>(animations, AnimationType.MOVE),
    [animations],
  );
  const newAnimation = useMemo(
    () => findAnimation<AnimationNew>(animations, AnimationType.NEW),
    [animations],
  );
  const mergeAnimation = useMemo(
    () => findAnimation<AnimationMerge>(animations, AnimationType.MERGE),
    [animations],
  );

  const style = useMemo(() => {
    if (!moveAnimation) {
      return {};
    }

    const value: CSSProperties = {
      transition: "transform 150ms ease-in-out", // Adjusted to match Tailwind"s duration
    };

    switch (moveAnimation.direction) {
      case Direction.UP:
        value.transform = tileTranslate("Y", -1 * moveAnimation.value);
        break;
      case Direction.DOWN:
        value.transform = tileTranslate("Y", moveAnimation.value);
        break;
      case Direction.LEFT:
        value.transform = tileTranslate("X", -1 * moveAnimation.value);
        break;
      case Direction.RIGHT:
        value.transform = tileTranslate("X", moveAnimation.value);
        break;
    }

    return value;
  }, [moveAnimation]);

  function tileImage(value: number): string {
    switch (value) {
      case 2:
        return "/game-assets/2.jpg";
      case 4:
        return "/game-assets/4.jpg";
      case 8:
        return "/game-assets/8.jpg";
      case 16:
        return "/game-assets/16.jpg";
      case 32:
        return "/game-assets/32.jpg";
      case 64:
        return "/game-assets/64.jpg";
      case 128:
        return "/game-assets/128.jpg";
      case 256:
        return "/game-assets/256.jpg";
      case 512:
        return "/game-assets/512.jpg";
      case 1024:
        return "/game-assets/1024.jpg";
      case 2048:
        return "/game-assets/2048.jpg";
      default:
        return "/game-assets/2.jpg";
    }
  }

  return (
    <div className="relative rounded-md bg-white pb-[100%] text-lg">
      {value !== 0 && (
        <div
          className={clsx(
            "absolute inset-0 flex items-center justify-center overflow-hidden rounded-md bg-[#ffffff] text-sm font-bold text-black",
            {
              "animate-appear": !!newAnimation,
              "animate-pop": !!mergeAnimation,
            },
          )}
          style={style}
        >
          <Image
            key={previousValue}
            src={tileImage(previousValue)}
            alt={previousValue.toString()}
            height={400}
            width={400}
            className={clsx(
              "rounded-md transition-opacity duration-150 ease-in-out",
              isTransitioning ? "opacity-0" : "opacity-100",
            )}
          />
          {isTransitioning && (
            <Image
              key={value}
              src={tileImage(value)}
              alt={value.toString()}
              height={400}
              width={400}
              className="absolute inset-0 rounded-md"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Tile;
