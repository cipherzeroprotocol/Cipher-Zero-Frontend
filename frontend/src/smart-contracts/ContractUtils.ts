// frontend/src/smart-contracts/ContractUtils.ts

import fs from 'fs';
import path from 'path';
import { HttpProvider } from 'web3/providers';
import { Contract } from '@thetalabs/theta-js';

// Define the paths to the contract artifacts
const CONTRACTS_DIR = path.resolve(__dirname, 'contracts');

export class ContractUtils {
    /**
     * Reads the ABI and bytecode of a contract from JSON files.
     * @param contractName The name of the contract
     * @returns An object containing ABI and bytecode
     */
    static getContractConfig(contractName: string): { abi: string; bytecode: string } {
        const contractPath = path.join(CONTRACTS_DIR, `${contractName}.json`);
        
        if (!fs.existsSync(contractPath)) {
            throw new Error(`Contract configuration file not found for ${contractName}`);
        }

        const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf-8'));
        return {
            abi: contractData.abi,
            bytecode: contractData.bytecode,
        };
    }

    /**
     * Formats a contract address to ensure it starts with '0x' and is in lowercase.
     * @param address The address to format
     * @returns The formatted address
     */
    static formatAddress(address: string): string {
        if (!/^0x/.test(address)) {
            address = `0x${address}`;
        }
        return address.toLowerCase();
    }

    /**
     * Retrieves the ABI of a contract from a JSON file.
     * @param contractName The name of the contract
     * @returns The ABI as a string
     */
    static getContractABI(contractName: string): string {
        const { abi } = this.getContractConfig(contractName);
        return abi;
    }

    /**
     * Retrieves the bytecode of a contract from a JSON file.
     * @param contractName The name of the contract
     * @returns The bytecode as a string
     */
    static getContractBytecode(contractName: string): string {
        const { bytecode } = this.getContractConfig(contractName);
        return bytecode;
    }

    /**
     * Checks if a contract address is valid.
     * @param address The address to check
     * @returns A boolean indicating if the address is valid
     */
    static isValidAddress(address: string): boolean {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    }

    /**
     * Retrieves a Contract instance from its address and ABI.
     * @param provider The HttpProvider instance
     * @param address The contract address
     * @param abi The ABI of the contract
     * @returns A Contract instance
     */
    static getContract(provider: HttpProvider, address: string, abi: string): Contract {
        if (!this.isValidAddress(address)) {
            throw new Error(`Invalid contract address: ${address}`);
        }
        return new Contract(address, abi, provider);
    }
}

// Example usage
const provider = new HttpProvider();
const contractName = 'MyContract';

// Retrieve ABI and bytecode
const abi = ContractUtils.getContractABI(contractName);
const bytecode = ContractUtils.getContractBytecode(contractName);

console.log('ABI:', abi);
console.log('Bytecode:', bytecode);

// Format address
const formattedAddress = ContractUtils.formatAddress('0x1234567890abcdef1234567890abcdef12345678');
console.log('Formatted Address:', formattedAddress);

// Create Contract instance
const contract = ContractUtils.getContract(provider, formattedAddress, abi);
console.log('Contract Instance:', contract);
