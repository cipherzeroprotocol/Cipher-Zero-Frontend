import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { contractConfig } from '../config/contractConfig';
import { networkConfigs } from '../config/NetworkConfig'; // Make sure to create this file

// Define the shape of the context state
interface ThetaContextType {
  provider: ethers.JsonRpcProvider | null;
  signer: ethers.Signer | null;
  contract: ethers.Contract | null;
  initializeTheta: () => Promise<void>;
}

// Create the context
const ThetaContext = createContext<ThetaContextType | undefined>(undefined);

// Context provider component
export const ThetaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // Initialize Theta provider, signer, and contract
  useEffect(() => {
    const initializeTheta = async () => {
      try {
        // Create a new provider using the configured URL
        const newProvider = new ethers.JsonRpcProvider(networkConfigs.mainnet.providerUrl);
        setProvider(newProvider);

        // Create a signer instance
        const newSigner = await newProvider.getSigner();
        setSigner(newSigner);

        // Create a contract instance using the ABI and contract address
        const contractInstance = new ethers.Contract(
          contractConfig.thetaContractAddress,
          ['function someFunction() view returns (string)'], // Replace with your contract ABI
          newSigner
        );
        setContract(contractInstance);
      } catch (error) {
        console.error('Error connecting to the provider or contract:', error);
      }
    };

    initializeTheta();
  }, []);

  // Function to re-initialize provider, signer, and contract
  const reinitializeTheta = async () => {
    try {
      const newProvider = new ethers.JsonRpcProvider(networkConfigs.mainnet.providerUrl);
      setProvider(newProvider);

      const newSigner = await newProvider.getSigner();
      setSigner(newSigner);

      const contractInstance = new ethers.Contract(
        contractConfig.thetaContractAddress,
        ['function someFunction() view returns (string)'], // Replace with your contract ABI
        newSigner
      );
      setContract(contractInstance);
    } catch (error) {
      console.error('Error re-initializing the provider or contract:', error);
    }
  };

  // Context value
  const value = {
    provider,
    signer,
    contract,
    initializeTheta: reinitializeTheta,
  };

  return <ThetaContext.Provider value={value}>{children}</ThetaContext.Provider>;
};

// Custom hooks to use the context
export const useThetaProvider = () => {
  const context = useContext(ThetaContext);
  if (context === undefined) {
    throw new Error('useThetaProvider must be used within a ThetaProvider');
  }
  return context.provider;
};

export const useThetaSigner = () => {
  const context = useContext(ThetaContext);
  if (context === undefined) {
    throw new Error('useThetaSigner must be used within a ThetaProvider');
  }
  return context.signer;
};

export const useThetaContract = () => {
  const context = useContext(ThetaContext);
  if (context === undefined) {
    throw new Error('useThetaContract must be used within a ThetaProvider');
  }
  return context.contract;
};