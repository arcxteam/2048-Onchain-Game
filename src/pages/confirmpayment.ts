import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { txHash } = req.body;
  
  if (!txHash) {
    return res.status(400).json({ success: false, error: 'Transaction hash required' });
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider('https://evmrpc-testnet.0g.ai');
    const receipt = await provider.getTransactionReceipt(txHash);

    if (receipt && receipt.status === 1) {
      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ success: false, error: 'Transaction failed or pending' });
    }
  } catch (error) {
    console.error('Error verifying transaction:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}
