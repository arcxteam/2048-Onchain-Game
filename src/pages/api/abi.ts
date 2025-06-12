import { NextApiRequest, NextApiResponse } from 'next';
import ABI from './ABI.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(ABI);
}
