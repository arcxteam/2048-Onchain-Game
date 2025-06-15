import { store } from '@/store';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { MiniKitProvider } from '@/minikitprovider';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Provider store={store}>
      <MiniKitProvider>
        <Component {...pageProps} />
      </MiniKitProvider>
    </Provider>
  );
}