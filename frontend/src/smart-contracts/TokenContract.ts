// frontend/src/meta-chain/TokenContract.ts

import { Contract, ContractFactory, Wallet } from '@thetalabs/theta-js';
import { MetaChainUtils } from './MetachainUtils';
import { BigNumber } from 'bignumber.js';
import { HttpProvider } from 'web3/providers';

interface TokenContractConfig {
    address: string;
    abi: string;
    provider: any; // Replace with specific provider type if available
}

export class TokenContract {
    private contract: Contract;
    private wallet: Wallet;

    constructor(config: TokenContractConfig, wallet: Wallet) {
        this.contract = new Contract(config.address, config.abi, config.provider);
        this.wallet = wallet;
    }

    /**
     * Gets the balance of a given address.
     * @param address The address to check
     * @returns The balance in Ether
     */
    async getBalance(address: string): Promise<string> {
        try {
            const balanceWei = await this.contract.methods.balanceOf(address).call();
            return MetaChainUtils.weiToEther(balanceWei);
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
    async transfer(to: string, amount: string): Promise<string> {
        try {
            const amountWei = MetaChainUtils.etherToWei(amount);
            const transaction = this.contract.methods.transfer(to, amountWei);
            const result = await this.wallet.sendTransaction(transaction);
            return result.hash;
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
    async approve(spender: string, amount: string): Promise<string> {
        try {
            const amountWei = MetaChainUtils.etherToWei(amount);
            const transaction = this.contract.methods.approve(spender, amountWei);
            const result = await this.wallet.sendTransaction(transaction);
            return result.hash;
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
            const allowanceWei = await this.contract.methods.allowance(owner, spender).call();
            return MetaChainUtils.weiToEther(allowanceWei);
        } catch (error) {
            console.error('Error getting allowance:', error);
            throw error;
        }
    }

    /**
     * Gets the name of the token.
     * @returns The token name
     */
    async getName(): Promise<string> {
        try {
            return await this.contract.methods.name().call();
        } catch (error) {
            console.error('Error getting token name:', error);
            throw error;
        }
    }

    /**
     * Gets the symbol of the token.
     * @returns The token symbol
     */
    async getSymbol(): Promise<string> {
        try {
            return await this.contract.methods.symbol().call();
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
            const totalSupplyWei = await this.contract.methods.totalSupply().call();
            return MetaChainUtils.weiToEther(totalSupplyWei);
        } catch (error) {
            console.error('Error getting total supply:', error);
            throw error;
        }
    }
}

// Example usage
const config: TokenContractConfig = {
    address: '<TOKEN_CONTRACT_ADDRESS>',
    abi: '<TOKEN_CONTRACT_ABI>',
    provider: new HttpProvider() // Adjust provider URL as needed
};

const wallet = new Wallet('<PRIVATE_KEY>', config.provider);
const tokenContract = new TokenContract(config, wallet);

// Example calls
(async () => {
    try {
        const balance = await tokenContract.getBalance('<ADDRESS>');
        console.log(`Balance: ${balance} ETH`);

        const transferHash = await tokenContract.transfer('<RECIPIENT_ADDRESS>', '1.0');
        console.log(`Transfer hash: ${transferHash}`);

        const approveHash = await tokenContract.approve('<SPENDER_ADDRESS>', '1.0');
        console.log(`Approve hash: ${approveHash}`);

        const allowance = await tokenContract.getAllowance('<OWNER_ADDRESS>', '<SPENDER_ADDRESS>');
        console.log(`Allowance: ${allowance} ETH`);

        const name = await tokenContract.getName();
        console.log(`Token name: ${name}`);

        const symbol = await tokenContract.getSymbol();
        console.log(`Token symbol: ${symbol}`);

        const totalSupply = await tokenContract.getTotalSupply();
        console.log(`Total supply: ${totalSupply} ETH`);
    } catch (error) {
        console.error('Error:', error);
    }
})();
