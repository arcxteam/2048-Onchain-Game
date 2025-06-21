import { store } from "@/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { Providers } from "@/web3/providers";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Render placeholder selama di server
  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <Providers>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </Providers>
  );
}