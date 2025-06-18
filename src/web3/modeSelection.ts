import { contractInteractions } from './contractInteractions';
import { useState, useEffect } from 'react';
import { useStateManagement } from './stateManagement';

export const useModeSelection = () => {
  const [mode, setMode] = useState<'offchain' | 'onchain'>('offchain');
  const { isApproved, setApproved } = useStateManagement();

  useEffect(() => {
    const { write: approve } = contractInteractions.approvePlayer();
    if (approve && !isApproved) {
      approve().then(() => setApproved(true));
    }
  }, [isApproved]);

  const selectMode = async () => {
    if (isApproved && mode !== 'offchain') {
      await contractInteractions.selectMode(true);
      setMode('onchain');
    } else if (isApproved) {
      await contractInteractions.selectMode(false);
      setMode('offchain');
    }
  };

  return { mode, selectMode };
};