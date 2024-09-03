// frontend/src/smart-contracts/ContractManager.ts

import { Wallet, Contract, ContractFactory,  } from '@thetalabs/theta-js';
import { HttpProvider } from 'web3/providers';


// Define the types of contracts
type ContractConfig = {
    abi: string;
    bytecode: string;
};

export class ContractManager {
    private provider: HttpProvider;
    private wallet: Wallet;

    constructor(providerUrl: string, privateKey: string) {
        this.provider = new HttpProvider();
        this.wallet = new Wallet(privateKey, this.provider);
    }

    // Deploy a contract
    async deployContract(contractConfig: ContractConfig, ...constructorArgs: any[]): Promise<Contract> {
        const { abi, bytecode } = contractConfig;
        const contractFactory = new ContractFactory(abi, bytecode, this.wallet);
        const deployResult = await contractFactory.deploy(...constructorArgs);
        console.log(`Contract deployed at address: ${deployResult.contract_address}`);
        return new Contract(deployResult.contract_address, abi, this.wallet);
    }

    // Get an instance of a contract
    getContract(contractAddress: string, contractConfig: ContractConfig): Contract {
        const { abi } = contractConfig;
        return new Contract(contractAddress, abi, this.wallet);
    }

    // Interact with a contract's read-only methods
    async callMethod(contract: Contract, methodName: string, ...params: any[]): Promise<any> {
        try {
            const result = await contract[methodName](...params);
            return result;
        } catch (error) {
            console.error(`Error calling method ${methodName}:`, error);
            throw error;
        }
    }

    // Interact with a contract's state-changing methods
    async sendTransaction(contract: Contract, methodName: string, ...params: any[]): Promise<any> {
        try {
            const tx = await contract[methodName](...params);
            const receipt = await tx.wait();
            console.log(`Transaction successful: ${receipt.transactionHash}`);
            return receipt;
        } catch (error) {
            console.error(`Error sending transaction for method ${methodName}:`, error);
            throw error;
        }
    }
}

// Example usage
const providerUrl = 'https://your-provider-url';
const privateKey = 'your-private-key';

const contractManager = new ContractManager(providerUrl, privateKey);

// Define contract ABI and bytecode
const myContractConfig: ContractConfig = {
    abi: '[{"constant":true,"inputs":[],"name":"getValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]',
    bytecode: '0x...', // Replace with actual bytecode
};

// Deploy a contract
async function deployAndInteract() {
    try {
        const contract = await contractManager.deployContract(myContractConfig, 'constructorArg1', 'constructorArg2');
        const value = await contractManager.callMethod(contract, 'getValue');
        console.log('Value from contract:', value.toString());
    } catch (error) {
        console.error('Error:', error);
    }
}

deployAndInteract();
