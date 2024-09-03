// src/config/contractConfig.ts

// Define a type for contract configurations
export interface ContractConfig {
    wormholeBridgeContractAddress: string;
    thetaContractAddress: string;
  }
  
  // Contract addresses for Wormhole and Theta contracts
  export const contractConfig: ContractConfig = {
    wormholeBridgeContractAddress: '0xYourWormholeBridgeContractAddress', // Replace with actual Wormhole Bridge contract address
    thetaContractAddress: '0xYourThetaContractAddress', // Replace with actual Theta contract address
  };
  
  // Export types for use in other files
 
  