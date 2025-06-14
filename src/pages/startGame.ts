import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const gameId = ethers.utils.formatBytes32String(`game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  res.status(200).json({ gameId });
}
