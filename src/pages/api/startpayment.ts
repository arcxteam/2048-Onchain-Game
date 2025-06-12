import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Menghasilkan gameId unik untuk inisialisasi game
  const gameId = `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.status(200).json({ gameId });
}