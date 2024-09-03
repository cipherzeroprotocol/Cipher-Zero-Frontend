// src/utils/theta.js

import { ethers } from 'ethers';

// Theta Network Provider URL (replace with actual Theta provider URL)
const THETA_PROVIDER_URL = 'https://theta-mainnet.eth.io';

// Create a new provider instance
export const createProvider = () => {
    return new ethers.JsonRpcProvider(THETA_PROVIDER_URL);
};

// Load a smart contract
export const loadContract = async (contractAddress, contractABI, provider) => {
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
};

// Convert ethers to wei
export const toWei = (value, unit = 'ether') => {
    return ethers.parseUnits(value, unit);
};

// Convert wei to ethers
export const fromWei = (value, unit = 'ether') => {
    return ethers.formatUnits(value, unit);
};

// Handle errors
export const handleError = (error) => {
    console.error('Error:', error.message);
    return error.message;
};

// Check if Ethereum is installed
export const isEthereumInstalled = () => {
    return window.ethereum !== undefined;
};

// Request Ethereum accounts
export const requestAccounts = async () => {
    if (!isEthereumInstalled()) {
        throw new Error('Please install MetaMask!');
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
};

// Setup Ethereum provider and signer
export const setupProviderAndSigner = async () => {
    if (!isEthereumInstalled()) {
        throw new Error('Please install MetaMask!');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return { provider, signer };
};
