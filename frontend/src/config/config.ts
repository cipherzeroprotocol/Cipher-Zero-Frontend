// Define a type for network configurations
export interface NetworkConfig {
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
}



// Define a type for contract configurations
export interface ContractConfig {
  wormholeBridgeContractAddress: string;
  thetaContractAddress: string;
}

// Define a type for general project settings
export interface ProjectSettings {
  environment: 'development' | 'staging' | 'production';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// Network configurations for Theta and other networks
export const networkConfigs: Record<string, NetworkConfig> = {
  mainnet: {
    chainId: 1, // Example Chain ID for mainnet
    rpcUrl: 'https://mainnet.theta.network/rpc',
    explorerUrl: 'https://explorer.theta.network',
  },
  testnet: {
    chainId: 2, // Example Chain ID for testnet
    rpcUrl: 'https://testnet.theta.network/rpc',
    explorerUrl: 'https://testnet-explorer.theta.network',
  },
};



// Contract addresses for Wormhole and Theta contracts
export const contractConfig: ContractConfig = {
  wormholeBridgeContractAddress: '0xYourWormholeBridgeContractAddress',// add addres
  thetaContractAddress: '0xYourThetaContractAddress',// add address
};

// General project settings
export const projectSettings: ProjectSettings = {
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  logLevel: (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
};


