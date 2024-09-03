import React from 'react';
import { Web3ReactProvider, Web3ReactProviderProps } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

// Function to get the library instance
function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

// Configure the connectors
const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42], // Add or remove chain IDs as needed
});

const rpcUrl = process.env.REACT_APP_RPC_URL_1 || ''; // Provide a default value if the environment variable is undefined
const walletconnect = new WalletConnectConnector({
  rpc: { 1: rpcUrl }, // Add RPC URLs for the networks you want to support
  bridge: 'https://bridge.walletconnect.org', // return these link placeholder
  qrcode: true,
});

export const connectors = {
  injected: injected,
  walletConnect: walletconnect,
};

interface ClientWalletProviderProps {
  children: React.ReactNode;
}

// Create a typed version of Web3ReactProvider
const TypedWeb3ReactProvider: React.FC<Web3ReactProviderProps> = Web3ReactProvider;

export function ClientWalletProvider({ children }: ClientWalletProviderProps): JSX.Element {
  return (
    <TypedWeb3ReactProvider connectors={[]} >      
      {children}
    </TypedWeb3ReactProvider>
  );
}

export default ClientWalletProvider;