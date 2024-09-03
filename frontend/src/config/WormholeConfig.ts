// WormholeConfig.ts

// Define the ABI for Wormhole Bridge contract
export const WormholeBridgeABI = [
    // Add the ABI for Wormhole Bridge contract here
    {
      "constant": true,
      "inputs": [],
      "name": "bridgeFunction",
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
  
  // Define the ABI for Wormhole Relayer contract
  export const WormholeRelayerABI = [
    // Add the ABI for Wormhole Relayer contract here
    {
      "constant": true,
      "inputs": [
        {
          "name": "messageId",
          "type": "bytes32"
        }
      ],
      "name": "getMessage",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    // Add more ABI entries as needed
  ];
  
  // Define contract addresses for different chains
  export const WormholeBridgeAddress = {
    1: '0x1234567890abcdef1234567890abcdef12345678', // Ethereum Mainnet
    137: '0xabcdef1234567890abcdef1234567890abcdef12', // Polygon Mainnet
    // Add more chain addresses as needed
  };
  
  export const WormholeRelayerAddress = {
    1: '0xabcdef1234567890abcdef1234567890abcdef12', // Ethereum Mainnet
    137: '0x1234567890abcdef1234567890abcdef12345678', // Polygon Mainnet
    // Add more chain addresses as needed
  };
  