import { useState } from 'react';

export const useStateManagement = () => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [isApproved, setApproved] = useState(false);

  return { gameId, setGameId, isApproved, setApproved };
};