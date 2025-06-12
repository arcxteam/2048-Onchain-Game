import { store } from '@/store';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { BlockchainProvider } from '@/providers/minikitprovider';

export default function App({ Component, pageProps }: AppProps) {
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    setFlag(true);
  }, []);
  return (
    flag && (
      <Provider store={store}>
        <BlockchainProvider>
          <Component {...pageProps} />
        </BlockchainProvider>
      </Provider>
    )
  );
}
