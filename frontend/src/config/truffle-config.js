const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  // Specify the Solidity compiler version
  compilers: {
    solc: {
      version: "^0.8.7", // Adjust as needed
    }
  },

  // Mocha configuration
  mocha: {
    enableTimeouts: false,
    before_timeout: 480000
  },

  // Network configurations
  networks: {
    // Configuration for Theta Private Network
    theta_privatenet: {
      provider: () => {
        // Private keys for test wallets
        const privateKeys = [
          '1111111111111111111111111111111111111111111111111111111111111111', // Replace with actual private key
          '2222222222222222222222222222222222222222222222222222222222222222'  // Replace with actual private key
        ];
        
        return new HDWalletProvider({
          privateKeys: privateKeys,
          providerOrUrl: 'http://localhost:18888/rpc'
        });
      },
      network_id: 366, // Network ID for Theta Private Network
      gasPrice: 4000000000000 // Adjust gas price as needed
    },

    // Configuration for Theta Testnet
    theta_testnet: {
      provider: () => {
        const deployerPrivateKey = '12345'; // Replace with actual deployer private key

        return new HDWalletProvider({
          privateKeys: [deployerPrivateKey],
          providerOrUrl: 'https://eth-rpc-api-testnet.thetatoken.org/rpc'
        });
      },
      network_id: 365, // Network ID for Theta Testnet
      gasPrice: 4000000000000 // Adjust gas price as needed
    },

    // Configuration for Theta Mainnet
    theta_mainnet: {
      provider: () => {
        const deployerPrivateKey = '12345'; // Replace with actual deployer private key

        return new HDWalletProvider({
          privateKeys: [deployerPrivateKey],
          providerOrUrl: 'https://eth-rpc-api.thetatoken.org/rpc'
        });
      },
      network_id: 361, // Network ID for Theta Mainnet
      gasPrice: 4000000000000 // Adjust gas price as needed
    }
  }
};
