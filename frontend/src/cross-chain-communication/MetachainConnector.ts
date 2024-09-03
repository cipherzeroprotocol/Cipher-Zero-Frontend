// MetachainConnector.ts

import { BridgeContractABI, BridgeContractAddress } from '../config/BridgeConfig';
require('isomorphic-fetch');
const BigNumber = require('bignumber.js');
const thetajs = require('@thetalabs/theta-js');
const Wallet = thetajs.Wallet;
const { HttpProvider } = thetajs.providers;
const Contract = thetajs.Contract;
const { ChainIds } = thetajs.networks;

// Define a type for the MetachainConnector configuration
interface MetachainConnectorConfig {
  chainProviders: { [chainId: number]: typeof HttpProvider };
  defaultChainId: number;
  wallet: typeof Wallet;
}

// Define the MetachainConnector class
export class MetachainConnector {
  private providers: { [chainId: number]: typeof HttpProvider };
  private defaultProvider: typeof HttpProvider;
  private wallet: typeof Wallet;
  defaultChainId: number;

  constructor(config: MetachainConnectorConfig) {
    this.providers = config.chainProviders;
    this.defaultChainId = config.defaultChainId;
    this.defaultProvider = this.providers[this.defaultChainId];
    this.wallet = config.wallet;
  }

  // Set a different default provider based on chain ID
  public setDefaultChain(chainId: number): void {
    if (this.providers[chainId]) {
      this.defaultChainId = chainId;
      this.defaultProvider = this.providers[chainId];
    } else {
      throw new Error(`Provider for chain ID ${chainId} not found.`);
    }
  }

  // Get a provider for a specific chain ID
  public getProvider(chainId: number): typeof HttpProvider {
    const provider = this.providers[chainId];
    if (!provider) {
      throw new Error(`Provider for chain ID ${chainId} not found.`);
    }
    return provider;
  }

  // Initialize a contract on a specific chain
  public getContract(chainId: number, address: string, abi: any): typeof Contract {
    const provider = this.getProvider(chainId);
    return new Contract(address, abi, provider);
  }

  // Example method to send a transaction to a specific chain
  public async sendTransaction(chainId: number, to: string, amount: typeof BigNumber): Promise<any> {
    try {
      const contract = this.getContract(chainId, BridgeContractAddress, BridgeContractABI);
      // Replace 'yourContractFunction' with the actual name of your contract function
      const tx = await contract.methods.yourContractFunction(to, amount.toString()).send({ from: this.wallet.address });
      return tx;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  // Example method for cross-chain communication
  public async crossChainTransfer(fromChainId: number, toChainId: number, amount: typeof BigNumber): Promise<any> {
    try {
      const fromContract = this.getContract(fromChainId, BridgeContractAddress, BridgeContractABI);
      
      // Example cross-chain transfer logic (customize based on your bridge implementation)
      const tx = await fromContract.methods.crossChainTransfer(toChainId, amount.toString()).send({ from: this.wallet.address });
      return tx;
    } catch (error) {
      console.error('Error during cross-chain transfer:', error);
      throw error;
    }
  }
}

// Usage Example
const chainProviders = {
  [ChainIds.Mainnet]: new HttpProvider(ChainIds.Mainnet),
  [ChainIds.Testnet]: new HttpProvider(ChainIds.Testnet),
  // Add more chains as needed
};

const privateKey = "0x0000000000000000000000000000000000000000000000000000000000000000";
const wallet = new Wallet(privateKey);

const metachainConnector = new MetachainConnector({
  chainProviders,
  defaultChainId: ChainIds.Mainnet,
  wallet
});

// Example usage
async function exampleUsage() {
  try {
    // Set default chain to Testnet
    metachainConnector.setDefaultChain(ChainIds.Testnet);
    
    // Send transaction on Testnet
    const txResponse = await metachainConnector.sendTransaction(ChainIds.Testnet, '0xRecipientAddress', new BigNumber('1000000000000000000')); // 1 THETA
    console.log('Transaction sent:', txResponse);

    // Cross-chain transfer from Mainnet to Testnet
    const crossChainTxResponse = await metachainConnector.crossChainTransfer(ChainIds.Mainnet, ChainIds.Testnet, new BigNumber('1000000000000000000')); // 1 THETA
    console.log('Cross-chain transfer initiated:', crossChainTxResponse);
  } catch (error) {
    console.error('Error during example usage:', error);
  }
}

exampleUsage();