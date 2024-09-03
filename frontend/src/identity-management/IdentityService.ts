// frontend/src/services/IdentityService.ts

import { ethers } from 'ethers';
import { IdentityContractABI } from '../config/IdentityContractABI';
import { IdentityContractAddress } from '../config/IdentityContractAddress';

// Define the IdentityService class
export class IdentityService {
    private provider: ethers.providers.Web3Provider;
    private contract: ethers.Contract;
    private signer: ethers.Signer;

    constructor(provider: ethers.providers.Provider | ethers.providers.Web3Provider) {
        // Initialize the provider and the contract
        this.provider = new ethers.providers.Web3Provider(provider);
        this.signer = this.provider.getSigner();
        this.contract = new ethers.Contract(
            IdentityContractAddress,
            IdentityContractABI,
            this.signer
        );
    }

    // Register metadata for an identity
    public async register(metadata: string): Promise<ethers.providers.TransactionResponse> {
        try {
            const tx = await this.contract.register(metadata);
            await tx.wait(); // Wait for the transaction to be mined
            return tx;
        } catch (error) {
            console.error('Failed to register metadata:', error);
            throw error;
        }
    }

    // Get metadata of an identity
    public async getMetadata(userAddress: string): Promise<string> {
        try {
            const metadata = await this.contract.getMetadata(userAddress);
            return metadata;
        } catch (error) {
            console.error('Failed to get metadata:', error);
            throw error;
        }
    }

    // Get public key of an identity
    public async getPublicKey(userAddress: string): Promise<string> {
        try {
            const publicKey = await this.contract.getPublicKey(userAddress);
            return publicKey;
        } catch (error) {
            console.error('Failed to get public key:', error);
            throw error;
        }
    }
}
