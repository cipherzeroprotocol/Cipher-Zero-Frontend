import React, { FC, useEffect, useCallback } from 'react';
//import { useWallet, WalletContextState } from '@thetablockchain/wallet-adapter-react';
//import { useWalletModal } from '@theta-blockchain/wallet-adapter-react';
import { Button, Spinner, Toast } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary } from './ErrorBoundary'; // Custom Error Boundary Component
import { useWallet } from '@solana/wallet-adapter-react';
import error from 'next/error';

interface ConnectWalletProps {
  onUseWalletClick: () => void;
}

/**
 * ConnectWallet component provides an interface to connect a Theta wallet.
 * It handles connecting, displaying connection status, and error management.
 */
export const ConnectWallet: FC<ConnectWalletProps> = ({ onUseWalletClick }) => {
  const { setVisible } = useWalletModal();
  const { wallet, connect, connecting, publicKey, disconnect } = useWallet();

  // Effect to auto-connect if publicKey is not available but wallet exists
    useEffect(() => {
      const autoConnect = async () => {
        if (!publicKey && wallet) {
          try {
            await connect();
            toast.error(`Error connecting to wallet: ${error.toString()}`);
            console.error('Error connecting to the wallet:', error);
            toast.error(`Error connecting to wallet: ${error.toString()}`);
          } catch (error: any) {
            console.error('Error connecting to the wallet:', error);
            toast.error(`Error connecting to wallet: ${error.toString()}`);
          }
        }
      };
  
      autoConnect();
    }, [wallet, publicKey, connect]);

  // Handle wallet click actions
  const handleWalletClick = useCallback(() => {
    try {
      if (!wallet) {
        setVisible(true);
      } else {
        connect();
      }
      onUseWalletClick();
    } catch (error: any) {
      console.error('Error handling wallet click:', error);
      toast.error(`Error handling wallet click: ${error.message}`);
    }
  }, [wallet, connect, setVisible, onUseWalletClick]);

  return (
    <ErrorBoundary>
      <Button
        variant="primary"
        size="lg"
        onClick={handleWalletClick}
        disabled={connecting}
      >
        {connecting ? (
          <div>
            <Spinner animation="border" size="sm" /> Connecting...
          </div>
        ) : publicKey ? (
          <div>Wallet Connected: {publicKey.toBase58()}</div>
        ) : (
          <div>Connect Wallet</div>
        )}
      </Button>
    </ErrorBoundary>
  );
};
function useWalletModal(): { setVisible: any; } {
  throw new Error('Function not implemented.');
}

