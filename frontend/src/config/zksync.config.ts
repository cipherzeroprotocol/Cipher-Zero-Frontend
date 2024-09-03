// zksyncconfig.ts
import { Wallet, Provider } from 'zksync-web3';

interface NetworkConfig {
    chainId: number;
    providerUrl: string;
    explorerUrl: string;
    contractAddresses: {
        [key: string]: string;
    };
}

const networkConfigs: { [key: string]: NetworkConfig } = {
    mainnet: {
        chainId: 324, // zkSync Era Mainnet
        providerUrl: 'https://mainnet.era.zksync.io',
        explorerUrl: 'https://explorer.zksync.io',
        contractAddresses: {
            // Define contract addresses specific to zkSync mainnet if needed
            // Example:
            // zkSyncContractAddress: '0xYourZkSyncMainnetContractAddress',
        },
    },
    testnet: {
        chainId: 280, // zkSync Era Testnet (Goerli)
        providerUrl: 'https://testnet.era.zksync.dev',
        explorerUrl: 'https://goerli.explorer.zksync.io',
        contractAddresses: {
            // Define contract addresses specific to zkSync testnet if needed
            // Example:
            // zkSyncContractAddress: '0xYourZkSyncTestnetContractAddress',
        },
    },
};

const getProvider = (network: string = 'testnet'): Provider => {
    if (!networkConfigs[network]) {
        throw new Error(`Network configuration for ${network} not found.`);
    }
    return new Provider(networkConfigs[network].providerUrl);
};

const getWallet = async (privateKey: string, network: string = 'testnet'): Promise<Wallet> => {
    if (!networkConfigs[network]) {
        throw new Error(`Network configuration for ${network} not found.`);
    }
    const provider = getProvider(network);
    return new Wallet(privateKey, provider);
};

const getExplorerUrl = (network: string = 'testnet'): string => {
    if (!networkConfigs[network]) {
        throw new Error(`Network configuration for ${network} not found.`);
    }
    return networkConfigs[network].explorerUrl;
};

export {
    networkConfigs,
    getProvider,
    getWallet,
    getExplorerUrl,
};