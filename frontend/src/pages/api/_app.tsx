import React from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
//import ClientWalletProvider from '../contexts/ClientWalletProvider';
// Import global styles
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import "../styles/App.css";
import ClientWalletProvider from '@/contexts/ClientWalletProvider';
// Dynamically import the ClientWalletProvider to ensure it runs on the client-side only
//const WalletProvider = dynamic(
  //() => import("../contexts/ClientWalletProvider").then((module) => module.default),
  //{ ssr: false }
//);

function MyApp({ Component, pageProps }: AppProps) {
  // Replace this with your actual endpoint value or load from environment variables
  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT || "your_default_endpoint_value";

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]}>
        <Component {...pageProps} />
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;