import { ethers } from 'ethers';

// Utility functions for wallet operations
export class WalletUtils {
  // Check if the Theta Wallet provider is available
  public static isThetaWalletProvider(): boolean {
    return Boolean((window as any).ethereum && (window as any).ethereum.isThetaWallet);
  }

  // Create a BrowserProvider instance if Theta Wallet is available
  public static createProvider(): ethers.BrowserProvider | null {
    if (WalletUtils.isThetaWalletProvider()) {
      return new ethers.BrowserProvider((window as any).ethereum);
    }
    console.warn('Theta Wallet provider is not available');
    return null;
  }

  // Get the account address of the currently connected wallet
  public static async getAccount(): Promise<string | null> {
    const provider = WalletUtils.createProvider();
    if (provider) {
      try {
        const accounts = await provider.send('eth_requestAccounts', []);
        return accounts[0] || null;
      } catch (error) {
        console.error('Error requesting accounts:', error);
        return null;
      }
    }
    return null;
  }

  // Sign a message using the wallet
  public static async signMessage(message: string): Promise<string | null> {
    const provider = WalletUtils.createProvider();
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

  // Sign a transaction and execute it on the smart contract
  public static async signTransaction(
    contractAddress: string,
    contractABI: ethers.InterfaceAbi,
    functionName: string,
    ...args: any[]
  ): Promise<ethers.TransactionResponse | null> {
    const provider = WalletUtils.createProvider();
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

  // Example function to check if the wallet is connected and return its account address
  public static async checkConnection(): Promise<string | null> {
    const account = await WalletUtils.getAccount();
    if (account) {
      console.log('Wallet is connected with account:', account);
      return account;
    } else {
      console.log('No account found. Please connect your wallet.');
      return null;
    }
  }
}