import { store } from '@/store';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { Web3AuthProviders } from '@/providers/web3auth';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Web3AuthProviders>
        <Component {...pageProps} />
      </Web3AuthProviders>
    </Provider>
  );
}
