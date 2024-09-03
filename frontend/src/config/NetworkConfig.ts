// src/config/networkConfig.ts

import { FetchRequest } from "ethers/utils";

// Define a type for network configurations
export interface NetworkConfig {
    providerUrl: string | FetchRequest | undefined;
    chainId: number;
    rpcUrl: string;
    explorerUrl: string;
    contractAddresses?: {
      [key: string]: string;
    };
  }
  
  // Define network configurations for various networks
  export const networkConfigs: Record<string, NetworkConfig> = {
    mainnet: {
      chainId: 1, // Mainnet Chain ID
      rpcUrl: 'https://mainnet.theta.network/rpc', // Replace with your mainnet RPC URL
      explorerUrl: 'https://explorer.theta.network', // Replace with your mainnet explorer URL
      contractAddresses: {
        wormholeBridge: '0xYourWormholeBridgeContractAddress', // Replace with actual Wormhole Bridge contract address
        thetaContract: '0xYourThetaContractAddress', // Replace with actual Theta contract address
      },
      providerUrl: undefined
    },
    testnet: {
      chainId: 2, // Testnet Chain ID
      rpcUrl: 'https://testnet.theta.network/rpc', // Replace with your testnet RPC URL
      explorerUrl: 'https://testnet-explorer.theta.network', // Replace with your testnet explorer URL
      contractAddresses: {
        wormholeBridge: '0xYourTestnetWormholeBridgeContractAddress', // Replace with actual testnet Wormhole Bridge contract address
        thetaContract: '0xYourTestnetThetaContractAddress', // Replace with actual testnet Theta contract address
      },
      providerUrl: undefined
    },
    // Add more networks as needed
  };
  
  // Optionally, add functions to retrieve specific configurations
  export const getNetworkConfig = (network: string): NetworkConfig | undefined => {
    return networkConfigs[network];
  };
  
  export const getRpcUrl = (network: string): string => {
    const config = networkConfigs[network];
    if (!config) {
      throw new Error(`Network config for ${network} not found.`);
    }
    return config.rpcUrl;
  };
  
  export const getExplorerUrl = (network: string): string => {
    const config = networkConfigs[network];
    if (!config) {
      throw new Error(`Network config for ${network} not found.`);
    }
    return config.explorerUrl;
  };
  
  export const getContractAddress = (network: string, contractName: string): string => {
    const config = networkConfigs[network];
    if (!config || !config.contractAddresses || !config.contractAddresses[contractName]) {
      throw new Error(`Contract address for ${contractName} on ${network} not found.`);
    }
    return config.contractAddresses[contractName];
  };
  