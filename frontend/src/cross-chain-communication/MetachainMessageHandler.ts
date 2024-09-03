import { BridgeContractABI, BridgeContractAddress } from '../config/BridgeConfig';
// Removed Bridge__factory import as it's not exported by '@certusone/wormhole-sdk'
const thetajs = require("@thetalabs/theta-js");
require('isomorphic-fetch');

const { Wallet: ThetaWallet, providers: { HttpProvider }, Contract: ThetaContract, networks: { ChainIds } } = thetajs;

const PrivateKeyAdmin = "<ADMIN_PRIVATE_KEY>";

const thetaProvider = new HttpProvider(ChainIds.Privatenet);
const walletAdmin = new ThetaWallet(PrivateKeyAdmin, thetaProvider);

// Define a type for the MetachainMessageHandler configuration
interface MetachainMessageHandlerConfig {
  chainProviders: { [chainId: number]: typeof HttpProvider };
  defaultChainId: number;
  wallet: typeof ThetaWallet;
}

// Define the MetachainMessageHandler class
export class MetachainMessageHandler {
  private providers: { [chainId: number]: typeof HttpProvider };
  private defaultProvider: typeof HttpProvider;
  private wallet: typeof ThetaWallet;
  public defaultChainId: number;

  constructor(config: MetachainMessageHandlerConfig) {
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
  public getContract(chainId: number, address: string, abi: any): typeof ThetaContract {
    const provider = this.getProvider(chainId);
    return new ThetaContract(address, abi, provider);
  }

  // Send a message from one chain to another
  public async sendMessage(fromChainId: number, toChainId: number, message: string): Promise<any> {
    try {
      const fromContract = this.getContract(fromChainId, BridgeContractAddress, BridgeContractABI).connect(this.wallet) as typeof ThetaContract;
      const tx = await fromContract.sendMessage(toChainId, thetajs.utils.bytes32(message));
      return tx;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Handle incoming messages from another chain
  public async handleMessage(chainId: number, messageId: string): Promise<void> {
    try {
      const contract = this.getContract(chainId, BridgeContractAddress, BridgeContractABI).connect(this.wallet) as typeof ThetaContract;
      const message = await contract.getMessage(messageId);
      console.log('Received message:', thetajs.utils.toString(message));
    } catch (error) {
      console.error('Error handling message:', error);
      throw error;
    }
  }

  // Verify the integrity of a message (e.g., check signatures or data validity)
  public verifyMessage(message: string, expectedData: string): boolean {
    // Implement your message verification logic here
    return message === expectedData; // This is a placeholder; replace with actual verification logic
  }
}

// Usage Example
const chainProviders = {
  [ChainIds.Mainnet]: new HttpProvider(ChainIds.Mainnet),
  [ChainIds.Testnet]: new HttpProvider(ChainIds.Testnet),
  [ChainIds.Privatenet]: new HttpProvider(ChainIds.Privatenet),
};

const messageHandler = new MetachainMessageHandler({
  chainProviders,
  defaultChainId: ChainIds.Privatenet,
  wallet: walletAdmin
});

// Example usage
async function exampleUsage() {
  try {
    // Send a message from Privatenet to Testnet
    const txResponse = await messageHandler.sendMessage(ChainIds.Privatenet, ChainIds.Testnet, 'Hello from Privatenet!');
    console.log('Message sent:', txResponse);

    // Handle incoming messages on Testnet
    await messageHandler.handleMessage(ChainIds.Testnet, '0xMessageId');
  } catch (error) {
    console.error('Error during example usage:', error);
  }
}

exampleUsage();