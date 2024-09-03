// WormholeUtils.ts
import { ethers } from 'ethers';
import { WormholeBridgeABI, WormholeBridgeAddress, WormholeRelayerABI, WormholeRelayerAddress } from '../config/WormholeConfig';

// Define types for WormholeUtils configuration
interface WormholeUtilsConfig {
  providers: { [chainId: number]: ethers.Provider };
  defaultChainId: number;
  wallet: ethers.Wallet;
}

// Define WormholeUtils class
export class WormholeUtils {
  private providers: { [chainId: number]: ethers.Provider };
  private defaultProvider: ethers.Provider;
  private wallet: ethers.Wallet;
  defaultChainId: number;

  constructor(config: WormholeUtilsConfig) {
    this.providers = config.providers;
    this.defaultChainId = config.defaultChainId;
    this.defaultProvider = this.providers[this.defaultChainId];
    this.wallet = config.wallet;
  }

  // Get a provider for a specific chain ID
  public getProvider(chainId: number): ethers.Provider {
    const provider = this.providers[chainId];
    if (!provider) {
      throw new Error(`Provider for chain ID ${chainId} not found.`);
    }
    return provider;
  }

  // Initialize a Wormhole Bridge contract
  public getWormholeBridgeContract(chainId: number): ethers.Contract {
    const provider = this.getProvider(chainId);
    const address = WormholeBridgeAddress[chainId as keyof typeof WormholeBridgeAddress];
    if (!address) {
      throw new Error(`Wormhole Bridge address for chain ID ${chainId} not found.`);
    }
    return new ethers.Contract(address, WormholeBridgeABI, provider);
  }

  // Initialize a Wormhole Relayer contract
  public getWormholeRelayerContract(chainId: number): ethers.Contract {
    const provider = this.getProvider(chainId);
    const address = WormholeRelayerAddress[chainId as keyof typeof WormholeRelayerAddress];
    if (!address) {
      throw new Error(`Wormhole Relayer address for chain ID ${chainId} not found.`);
    }
    return new ethers.Contract(address, WormholeRelayerABI, provider);
  }

  // Send a cross-chain message via Wormhole
  public async sendMessage(
    fromChainId: number,
    toChainId: number,
    message: string,
    nonce: number
  ): Promise<ethers.TransactionResponse> {
    try {
      const bridgeContract = this.getWormholeBridgeContract(fromChainId).connect(this.wallet) as ethers.Contract;
      
      // Convert message to bytes
      const messageBytes = ethers.toUtf8Bytes(message);
      
      // Use a generic method call (replace 'sendMessage' with the actual method name from your ABI)
      const tx = await bridgeContract['sendMessage'](toChainId, messageBytes, nonce);
      return tx;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Handle incoming cross-chain messages
  public async handleMessage(chainId: number, messageId: string): Promise<void> {
    try {
      const relayerContract = this.getWormholeRelayerContract(chainId).connect(this.wallet);
      
      // Use a generic method call (replace 'getMessage' with the actual method name from your ABI)
      const message = await (relayerContract as ethers.Contract)['getMessage'](messageId);
      
      // Process the message (custom logic here)
      console.log('Received message:', ethers.toUtf8String(message));
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

  // Utility function to convert a string message to bytes
  public stringToBytes(message: string): Uint8Array {
    return ethers.toUtf8Bytes(message);
  }

  // Utility function to convert bytes to a string message
  public bytesToString(bytes: Uint8Array): string {
    return ethers.toUtf8String(bytes);
  }
}

// Usage Example
const chainProviders: { [chainId: number]: ethers.JsonRpcProvider } = {
  1: new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'),
  137: new ethers.JsonRpcProvider('https://polygon-rpc.com/'),
  // Add more chains as needed
};

const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY');

const wormholeUtils = new WormholeUtils({
  providers: chainProviders,
  defaultChainId: 1,
  wallet
});

// Example usage
async function exampleUsage() {
  try {
    // Send a message from Ethereum (chain ID 1) to Polygon (chain ID 137)
    const txResponse = await wormholeUtils.sendMessage(1, 137, 'Hello from Ethereum!', 12345);
    console.log('Message sent:', txResponse);

    // Handle incoming messages on Polygon
    await wormholeUtils.handleMessage(137, '0xMessageId');
  } catch (error) {
    console.error('Error during example usage:', error);
  }
}

exampleUsage();