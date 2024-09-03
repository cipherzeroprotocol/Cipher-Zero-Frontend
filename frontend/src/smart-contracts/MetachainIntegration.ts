// frontend/src/meta-chain/MetaChainIntegration.ts

import {  Contract, Wallet, ContractFactory } from '@thetalabs/theta-js'; // Adjust imports according to your MetaChain SDK
import { BigNumber } from 'bignumber.js';
import { HttpProvider } from 'web3/providers';

const META_CHAIN_PROVIDER_URL = 'https://meta-chain-provider-url'; // Replace with your MetaChain provider URL

export class MetaChainIntegration {
    private provider: HttpProvider;
    private defaultWallet: Wallet;

    constructor(privateKey: string) {
        this.provider = new HttpProvider();
        this.defaultWallet = new Wallet(privateKey);
    }

    /**
     * Deploys a new smart contract on the MetaChain.
     * @param contractName The name of the contract
     * @param contractBytecode The bytecode of the contract
     * @param contractABI The ABI of the contract
     * @param constructorArgs Constructor arguments for the contract
     * @returns The deployed contract address
     */
    async deployContract(contractName: string, contractBytecode: string, contractABI: string, constructorArgs: any[] = []): Promise<string> {
        const contractFactory = new ContractFactory(contractABI, contractBytecode, this.defaultWallet);
        const deploymentResult = await contractFactory.deploy(...constructorArgs);
        return deploymentResult.contract_address;
    }

    /**
     * Retrieves a deployed contract instance.
     * @param contractAddress The address of the contract
     * @param contractABI The ABI of the contract
     * @returns A Contract instance
     */
    getContract(contractAddress: string, contractABI: string): Contract {
        if (!this.isValidAddress(contractAddress)) {
            throw new Error(`Invalid contract address: ${contractAddress}`);
        }
        return new Contract(contractAddress, contractABI, this.provider);
    }

    /**
     * Validates if an address is correctly formatted.
     * @param address The address to validate
     * @returns True if valid, false otherwise
     */
    isValidAddress(address: string): boolean {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    }

    /**
     * Reads data from a smart contract.
     * @param contractAddress The address of the contract
     * @param contractABI The ABI of the contract
     * @param methodName The method name to call
     * @param params The parameters to pass to the method
     * @returns The result of the method call
     */
    async readFromContract(contractAddress: string, contractABI: string, methodName: string, params: any[] = []): Promise<any> {
        const contract = this.getContract(contractAddress, contractABI);
        return await contract[methodName](...params);
    }

    /**
     * Sends a transaction to a smart contract.
     * @param contractAddress The address of the contract
     * @param contractABI The ABI of the contract
     * @param methodName The method name to call
     * @param params The parameters to pass to the method
     * @returns The transaction receipt
     */
    async sendTransaction(contractAddress: string, contractABI: string, methodName: string, params: any[]): Promise<any> {
        const contract = this.getContract(contractAddress, contractABI);
        const contractWithSigner = contract.connect(this.defaultWallet);
        const tx = await contractWithSigner[methodName](...params);
        return await tx.wait(); // Assuming you're using a similar pattern to await transactions
    }

    /**
     * Utility function to convert from Wei to Ether (or equivalent in MetaChain).
     * @param value The value in Wei
     * @returns The value in Ether
     */
    weiToEther(value: string | BigNumber): string {
        return new BigNumber(value).shiftedBy(-18).toString(); // Adjust decimal places according to MetaChain's units
    }

    /**
     * Utility function to convert from Ether to Wei (or equivalent in MetaChain).
     * @param value The value in Ether
     * @returns The value in Wei
     */
    etherToWei(value: string | BigNumber): string {
        return new BigNumber(value).shiftedBy(18).toString(); // Adjust decimal places according to MetaChain's units
    }
}

// Example usage
const metaChainIntegration = new MetaChainIntegration('0xYourPrivateKeyHere');

// Deploy a contract
const contractBytecode = '0xYourContractBytecodeHere';
const contractABI = '[{"inputs":[...],"name":"...","type":"..."}]'; // Your contract ABI
metaChainIntegration.deployContract('MyContract', contractBytecode, contractABI, ['arg1', 'arg2'])
    .then(address => console.log('Contract deployed at:', address))
    .catch(error => console.error('Deployment failed:', error));

// Read from a contract
metaChainIntegration.readFromContract('0xContractAddress', contractABI, 'methodName', ['param1'])
    .then(result => console.log('Contract read result:', result))
    .catch(error => console.error('Read failed:', error));

// Send a transaction
metaChainIntegration.sendTransaction('0xContractAddress', contractABI, 'methodName', ['param1'])
    .then(receipt => console.log('Transaction receipt:', receipt))
    .catch(error => console.error('Transaction failed:', error));
