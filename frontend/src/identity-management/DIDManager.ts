// frontend/src/services/DIDManager.ts

import { ethers, Provider } from 'ethers';
import { DIDContractABI } from '../config/DIDContractABI';
import { DIDContractAddress } from '../config/DIDContractAddress';

// Define the DIDManager class
export class DIDManager {
    private provider: ethers.providers.Web3Provider;
    private contract: ethers.Contract;
    private signer: ethers.Signer;

    constructor(provider: Provider | ethers.providers.Web3Provider) {
        // Initialize the provider and the contract
        this.provider = new ethers.providers.Web3Provider(provider);
        this.signer = this.provider.getSigner();
        this.contract = new ethers.Contract(
            DIDContractAddress,
            DIDContractABI,
            this.signer
        );
    }

    // Register a new DID with associated metadata
    public async registerDID(did: string, metadata: string): Promise<ethers.providers.TransactionResponse> {
        try {
            const tx = await this.contract.registerDID(did, metadata);
            await tx.wait(); // Wait for the transaction to be mined
            return tx;
        } catch (error) {
            console.error('Failed to register DID:', error);
            throw error;
        }
    }

    // Resolve a DID to get associated metadata
    public async resolveDID(did: string): Promise<string> {
        try {
            const metadata = await this.contract.resolveDID(did);
            return metadata;
        } catch (error) {
            console.error('Failed to resolve DID:', error);
            throw error;
        }
    }

    // Update metadata for an existing DID
    public async updateDIDMetadata(did: string, metadata: string): Promise<ethers.providers.TransactionResponse> {
        try {
            const tx = await this.contract.updateDIDMetadata(did, metadata);
            await tx.wait(); // Wait for the transaction to be mined
            return tx;
        } catch (error) {
            console.error('Failed to update DID metadata:', error);
            throw error;
        }
    }

    // Revoke a DID
    public async revokeDID(did: string): Promise<ethers.providers.TransactionResponse> {
        try {
            const tx = await this.contract.revokeDID(did);
            await tx.wait(); // Wait for the transaction to be mined
            return tx;
        } catch (error) {
            console.error('Failed to revoke DID:', error);
            throw error;
        }
    }
}
