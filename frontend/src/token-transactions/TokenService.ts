// frontend/src/token-transaction/TokenService.ts

import { TokenContract } from '../smart-contracts/TokenContract';
import { Wallet } from '@thetalabs/theta-js';
import { MetaChainUtils } from '../smart-contracts/MetachainUtils';
import { Transaction } from 'ethers';
import { HttpProvider } from 'web3/providers';

export async function getTransactionHistory(walletAddress: string): Promise<Transaction[]> {
    // Implementation of fetching transaction history...
    return [];
}

    // Implementation of fetching transaction history...


interface TokenServiceConfig {
    tokenAddress: string;
    tokenAbi: string;
    providerUrl: string;
    walletPrivateKey: string;
}

export class TokenService {
    private tokenContract: TokenContract;
    private provider: HttpProvider;

    constructor(config: TokenServiceConfig) {
        this.provider = new HttpProvider();
        const wallet = new Wallet(config.walletPrivateKey, this.provider);
        this.tokenContract = new TokenContract({
            address: config.tokenAddress,
            abi: config.tokenAbi,
            provider: this.provider
        }, wallet);
    }

    /**
     * Gets the balance of a given address.
     * @param address The address to check
     * @returns The balance in Ether
     */
    async getBalance(address: string): Promise<string> {
        try {
            return await this.tokenContract.getBalance(address);
        } catch (error) {
            console.error('Error getting balance:', error);
            throw error;
        }
    }

    /**
     * Transfers tokens from the wallet to another address.
     * @param to The recipient address
     * @param amount The amount of tokens to send (in Ether)
     * @returns The transaction hash
     */
    async transferTokens(to: string, amount: string): Promise<string> {
        try {
            return await this.tokenContract.transfer(to, amount);
        } catch (error) {
            console.error('Error transferring tokens:', error);
            throw error;
        }
    }

    /**
     * Approves another address to spend tokens on behalf of the wallet.
     * @param spender The address allowed to spend tokens
     * @param amount The amount of tokens allowed (in Ether)
     * @returns The transaction hash
     */
    async approveSpender(spender: string, amount: string): Promise<string> {
        try {
            return await this.tokenContract.approve(spender, amount);
        } catch (error) {
            console.error('Error approving spender:', error);
            throw error;
        }
    }

    /**
     * Gets the allowance of a spender on behalf of an owner.
     * @param owner The address of the token owner
     * @param spender The address of the spender
     * @returns The allowance in Ether
     */
    async getAllowance(owner: string, spender: string): Promise<string> {
        try {
            return await this.tokenContract.getAllowance(owner, spender);
        } catch (error) {
            console.error('Error getting allowance:', error);
            throw error;
        }
    }

    /**
     * Gets the name of the token.
     * @returns The token name
     */
    async getTokenName(): Promise<string> {
        try {
            return await this.tokenContract.getName();
        } catch (error) {
            console.error('Error getting token name:', error);
            throw error;
        }
    }

    /**
     * Gets the symbol of the token.
     * @returns The token symbol
     */
    async getTokenSymbol(): Promise<string> {
        try {
            return await this.tokenContract.getSymbol();
        } catch (error) {
            console.error('Error getting token symbol:', error);
            throw error;
        }
    }

    /**
     * Gets the total supply of the token.
     * @returns The total supply in Ether
     */
    async getTotalSupply(): Promise<string> {
        try {
            return await this.tokenContract.getTotalSupply();
        } catch (error) {
            console.error('Error getting total supply:', error);
            throw error;
        }
    }
}

// Example usage
const config: TokenServiceConfig = {
    tokenAddress: '<TOKEN_CONTRACT_ADDRESS>',
    tokenAbi: '<TOKEN_CONTRACT_ABI>',
    providerUrl: '<PROVIDER_URL>',
    walletPrivateKey: '<WALLET_PRIVATE_KEY>'
};

const tokenService = new TokenService(config);

// Example calls
(async () => {
    try {
        const balance = await tokenService.getBalance('<ADDRESS>');
        console.log(`Balance: ${balance} ETH`);

        const transferHash = await tokenService.transferTokens('<RECIPIENT_ADDRESS>', '1.0');
        console.log(`Transfer hash: ${transferHash}`);

        const approveHash = await tokenService.approveSpender('<SPENDER_ADDRESS>', '1.0');
        console.log(`Approve hash: ${approveHash}`);

        const allowance = await tokenService.getAllowance('<OWNER_ADDRESS>', '<SPENDER_ADDRESS>');
        console.log(`Allowance: ${allowance} ETH`);

        const name = await tokenService.getTokenName();
        console.log(`Token name: ${name}`);

        const symbol = await tokenService.getTokenSymbol();
        console.log(`Token symbol: ${symbol}`);

        const totalSupply = await tokenService.getTotalSupply();
        console.log(`Total supply: ${totalSupply} ETH`);
    } catch (error) {
        console.error('Error:', error);
    }
})();
