import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { resetAction } from "@/store/action";
import React from "react";
import { useCallback } from "react";

const Control = () => {
  const dispatch = useAppDispatch();
  const size = useAppSelector((state) => state.app.boardSize);
  const reset = useCallback(
    () => dispatch(resetAction(size)),
    [dispatch, size],
  );
  return (
    <button
      onClick={() => dispatch(reset())}
      className="w-full text-[#47e94f] bg-black px-16 py-4"
    >
      New Game
    </button>
  );
};

export default Control;
