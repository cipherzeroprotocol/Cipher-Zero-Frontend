// CrossChainService.ts
import { Contract, JsonRpcProvider, Provider, TransactionResponse, Wallet, parseUnits } from 'ethers';
import { BridgeContractABI, BridgeContractAddress } from '../config/BridgeConfig';

// Define a type for the service's configuration
interface CrossChainServiceConfig {
  provider: Provider;
  wallet: Wallet;
}

// Define the CrossChainService class
export class CrossChainService {
  private contract: Contract;

  constructor(private config: CrossChainServiceConfig) {
    this.contract = new Contract(BridgeContractAddress, BridgeContractABI, config.provider);
  }

  // Initialize the contract with a wallet
  public withSigner(signer: Wallet): CrossChainService {
    this.contract = this.contract.connect(signer) as Contract;
    return this;
  }

  // Example method to get some data from the contract
  public async getSomeData(): Promise<any> {
    try {
      const data = await this.contract['myFunction'](); // Replace 'myFunction' with your contract's function
      return data;
    } catch (error) {
      console.error('Error getting data from contract:', error);
      throw error;
    }
  }

  // Example method to send a transaction
  public async sendTransaction(to: string, amount: string): Promise<TransactionResponse> {
    try {
      const tx = await this.contract['someTransactionFunction'](to, amount); // Replace with actual transaction function
      return tx;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  // Example method for handling cross-chain operations
  public async crossChainTransfer(destinationChainId: number, amount: string): Promise<TransactionResponse> {
    try {
      const tx = await this.contract['crossChainTransfer'](destinationChainId, amount); // Replace with actual cross-chain function
      return tx;
    } catch (error) {
      console.error('Error during cross-chain transfer:', error);
      throw error;
    }
  }
}

// Usage Example
const provider = new JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
const wallet = new Wallet('YOUR_PRIVATE_KEY', provider);

const crossChainService = new CrossChainService({
  provider,
  wallet
});

// Interact with the service
async function exampleUsage() {
  try {
    const data = await crossChainService.getSomeData();
    console.log('Data from contract:', data);

    const txResponse = await crossChainService.sendTransaction('0xRecipientAddress', parseUnits('1.0', 18).toString());
    console.log('Transaction sent:', txResponse);

    const crossChainTxResponse = await crossChainService.crossChainTransfer(2, parseUnits('1.0', 18).toString());
    console.log('Cross-chain transfer initiated:', crossChainTxResponse);
  } catch (error) {
    console.error('Error during example usage:', error);
  }
}

exampleUsage();