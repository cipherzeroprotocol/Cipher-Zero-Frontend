// BridgeConfig.ts

// Define the type for the ABI
export type ABI = any[]; // You can refine this type as needed based on your ABI format

// Define the type for configuration settings
export interface BridgeConfig {
  chainId: number;
  rpcUrl: string;
  contractAddress: string;
  tokenAddress: string;
  bridgeContractABI: ABI;
  // Add other configuration properties as needed
}

// Example ABI and Contract Address
export const BridgeContractABI: ABI = [
  // Example ABI JSON array (you should replace this with your actual ABI)
  {
    "constant": true,
    "inputs": [],
    "name": "myFunction",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  // Add more ABI entries as needed
];

export const BridgeContractAddress: string = '0xYourContractAddressHere'; // Replace with your actual contract address

// Example configuration object
export const bridgeConfig: BridgeConfig = {
  chainId: 1, // Mainnet chain ID
  rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',// add your Infura project ID
  contractAddress: BridgeContractAddress,
  tokenAddress: '0xYourTokenAddressHere',
  bridgeContractABI: BridgeContractABI,
  // Add other configuration properties as needed
};

// Optional: Export types or utility functions if needed
// Remove the export statement for the type BridgeConfig
