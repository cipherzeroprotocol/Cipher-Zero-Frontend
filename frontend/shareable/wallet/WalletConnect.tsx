import { ethers } from "ethers";

// Define types and interfaces
interface WalletProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  isThetaWallet?: boolean;
}

interface CustomWindow extends Window {
  ethereum?: WalletProvider;
}

declare const window: CustomWindow;

// Detect if the Theta Wallet provider is available
export function isThetaWalletProvider(): boolean {
  return Boolean(window.ethereum && window.ethereum.isThetaWallet);
}

// Initialize the provider
export function getProvider(): ethers.BrowserProvider | null {
  if (isThetaWalletProvider()) {
    return new ethers.BrowserProvider(window.ethereum as any);
  }
  console.warn('Theta Wallet provider is not available');
  return null;
}

// Get accounts from the Theta Wallet
export async function getAccounts(): Promise<string[]> {
  const provider = getProvider();
  if (provider) {
    try {
      const accounts = await provider.send('eth_requestAccounts', []);
      return accounts;
    } catch (error) {
      console.error('Error requesting accounts:', error);
      return [];
    }
  }
  return [];
}

// Sign a message using the Theta Wallet
export async function signMessage(message: string): Promise<string | null> {
  const provider = getProvider();
  if (provider) {
    try {
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      return null;
    }
  }
  return null;
}

// Sign a transaction using the Theta Wallet
export async function signTransaction(contractAddress: string, contractABI: ethers.InterfaceAbi, functionName: string, ...args: any[]): Promise<ethers.TransactionResponse | null> {
  const provider = getProvider();
  if (provider) {
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract[functionName](...args);
      return tx;
    } catch (error) {
      console.error('Error signing transaction:', error);
      return null;
    }
  }
  return null;
}

// Example usage function to demonstrate the usage of the wallet methods
export async function exampleUsage() {
  if (isThetaWalletProvider()) {
    console.log('Theta Wallet provider is available');

    // Auto-connect and show the user as logged in
    const accounts = await getAccounts();
    if (accounts.length > 0) {
      console.log('User is connected with account:', accounts[0]);
      // TODO: Implement logic to show the user as logged in on your site
    } else {
      console.log('No accounts found. User may need to connect their wallet.');
    }

    // Example: Sign a message
    const message = 'Hello, Theta Wallet!';
    const signature = await signMessage(message);
    console.log('Signature:', signature);

    // Example: Sign a transaction
    // Replace with actual contract address, ABI, function name, and arguments
    const contractAddress = 'YOUR_CONTRACT_ADDRESS';
    const contractABI = []; // Replace with actual ABI
    const functionName = 'someFunctionInYourContract';

    const transactionResponse = await signTransaction(contractAddress, contractABI, functionName /* arguments */);
    if (transactionResponse) {
      console.log('Transaction Hash:', transactionResponse.hash);
      await transactionResponse.wait(); // Wait for the transaction to be mined
      console.log('Transaction confirmed');
    } else {
      console.log('Transaction failed');
    }
  } else {
    console.log('Theta Wallet provider is not available');
  }
}