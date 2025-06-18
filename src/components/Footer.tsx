import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
  ResponseEvent,
  MiniAppPaymentPayload,
} from '@worldcoin/minikit-js';
import { useEffect, useState } from 'react';
import Control from './Control';
import { useModeSelection } from '@/web3/modeSelection'; // Impor hook

const Footer: React.FC = () => {
  const [mode, setMode] = useState<'offchain' | 'onchain' | null>(null); // Placeholder untuk mode
  const { selectMode } = useModeSelection(); // Hook dari /src/web3/

  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      return;
    }

    MiniKit.subscribe(
      ResponseEvent.MiniAppPayment,
      async (payload: MiniAppPaymentPayload) => {
        if (payload.status == 'success') {
          const payment = await fetch(`/api/confirmpayment`, {
            method: 'POST',
            body: JSON.stringify(payload),
          });
          const json = await payment.json();
          if (json.success) {
            console.log('worked!');
          }
        }
      },
    );

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppPayment);
    };
  }, []);

  const startPayment = async () => {
    const res = await fetch(`/api/startpayment`);

    const payload: PayCommandInput = {
      reference: await res.text(),
      to: '0xdF0d5abC614EF45C4bCEA121624644523BAc80b7',
      tokens: [
        {
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(1, Tokens.WLD).toString(),
        },
        {
          symbol: Tokens.USDCE,
          token_toDecimals: tokenToDecimals(3, Tokens.USDCE).toString(),
        },
      ],
      description: 'Select Mode',
    };

    if (MiniKit.isInstalled()) {
      MiniKit.commands.pay(payload);
    }
  };

  const handleModeSelect = () => {
    selectMode(); // Panggil hook
    setMode(mode === 'offchain' ? 'onchain' : 'offchain');
  };

  return (
    <div className="leading-lg flex flex-col gap-y-8 text-center font-medium text-[#adadad]">
      <div className="mt-2 w-full">
        <Control />
        <button
          onClick={handleModeSelect}
          className="font-lg mt-2 w-full px-16 py-4"
        >
          Select Mode {mode ? `(${mode})` : ''}
        </button>
      </div>
      <p>
        Onchain 2048{' '}
        <a
          href="https://cuannode.greyscope.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline"
        >
          © 2025 Greyscope&Co. by;0xgr3y
        </a>
        .
      </p>
    </div>
  );
};

export default Footer;