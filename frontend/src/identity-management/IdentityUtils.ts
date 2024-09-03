// frontend/src/utils/IdentityUtils.ts

import { Wallet, Contract , providers} from '@thetalabs/theta-js';
import { ethers } from 'ethers'; // If you're using ethers.js for additional utility
//import { IdentityContractABI } from '../config'; // Adjust paths based on your setup
//export { IdentityContractABI };
//import { IdentityContractAddress } from '../config'; // Adjust paths based on your setup
//export { IdentityContractAddress };
const providers = require('@thetalabs/theta-js');
interface Identity {
    address: string;
    publicKey: string;
    metadata: string; // Any additional metadata you store with the identity
}

// Function to create a new wallet
export function createWallet(): Wallet {
    const wallet = Wallet.createRandom();
    return wallet;
}

// Function to import a wallet from a mnemonic phrase
export function importWalletFromMnemonic(mnemonic: string): Wallet {
    return Wallet.fromMnemonic(mnemonic);
}

// Function to import a wallet from a private key
export function importWalletFromPrivateKey(privateKey: string): Wallet {
    return new Wallet(privateKey);
}

// Function to verify a message signature
export async function verifySignature(message: string, signature: string, address: string): Promise<boolean> {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
}

// Function to interact with the identity smart contract
export async function getIdentityMetadata(address: string): Promise<Identity | null> {
    try {
        const provider = new ethers.JsonRpcProvider('https://your-rpc-endpoint'); // Replace with your provider
        const identityContractAddress = '0x...'; // Replace with the actual contract address
        const identityContractABI = [/* actual contract ABI here */];
        
        const identityContract = new ethers.Contract(identityContractAddress, identityContractABI, provider);

        const metadata = await identityContract.getMetadata(address);
        return {
            address,
            publicKey: await identityContract.getPublicKey(address),
            metadata
        };
    } catch (error) {
        console.error('Error fetching identity metadata:', error);
        return null;
    }
}

// Function to register a new identity
export async function registerIdentity(wallet: Wallet, metadata: string): Promise<string> {
    try {
        const provider = new ethers.JsonRpcProvider('https://your-rpc-endpoint'); // Replace with your provider
        const signer = wallet.connect(provider);
        const identityContractAddress = '0x...'; // Replace with the actual contract address
        const identityContractABI = [/* actual contract ABI here */];
        const identityContract = new ethers.Contract(identityContractAddress, identityContractABI, signer);

        const tx = await identityContract.register(metadata);
        await tx.wait();
        return tx.hash;
    } catch (error) {
        console.error('Error registering identity:', error);
        throw new Error('Failed to register identity');
    }
}
