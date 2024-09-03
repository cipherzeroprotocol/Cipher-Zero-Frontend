// src/utils/metachain.js

import { ethers } from 'ethers';

// Theta Metachain provider URL
const METACHAIN_PROVIDER_URL = 'https://metachain.thin.net'; // Replace with actual Metachain endpoint

// Connect to the Theta Metachain
export const connectToMetachain = () => {
    if (!window.ethereum) {
        throw new Error('MetaMask is required to connect to Theta Metachain.');
    }
    
    const provider = new ethers.providers.JsonRpcProvider(METACHAIN_PROVIDER_URL);
    return provider;
};

// Create a subchain
export const createSubchain = async (provider, subchainParams) => {
    try {
        const { name, chainId, tokenAddress } = subchainParams;
        
        // Assuming you have a deployed Metachain contract that handles subchain creation
        const metachainContractAddress = '0xYourMetachainContractAddress'; // Replace with your contract address
        const metachainContractABI = [ /* ABI array */ ]; // Replace with your Metachain contract ABI
        
        const contract = new ethers.Contract(metachainContractAddress, metachainContractABI, provider);
        
        // Create subchain through smart contract call
        const tx = await contract.createSubchain(name, chainId, tokenAddress);
        await tx.wait(); // Wait for transaction confirmation
        
        console.log('Subchain created successfully');
    } catch (error) {
        console.error('Error creating subchain:', error);
        throw new Error('Failed to create subchain');
    }
};

// Send message to another chain
export const sendMessage = async (provider, messageParams) => {
    try {
        const { toChainId, message, senderAddress } = messageParams;

        // Assuming you have a deployed Metachain contract that handles messaging
        const metachainContractAddress = '0xYourMetachainContractAddress'; // Replace with your contract address
        const metachainContractABI = [ /* ABI array */ ]; // Replace with your Metachain contract ABI
        
        const contract = new ethers.Contract(metachainContractAddress, metachainContractABI, provider);
        
        // Send message through smart contract call
        const tx = await contract.sendMessage(toChainId, message, senderAddress);
        await tx.wait(); // Wait for transaction confirmation
        
        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error);
        throw new Error('Failed to send message');
    }
};

// Receive message from another chain
export const receiveMessage = async (provider, fromChainId) => {
    try {
        // Assuming you have a deployed Metachain contract that handles message reception
        const metachainContractAddress = '0xYourMetachainContractAddress'; // Replace with your contract address
        const metachainContractABI = [ /* ABI array */ ]; // Replace with your Metachain contract ABI
        
        const contract = new ethers.Contract(metachainContractAddress, metachainContractABI, provider);
        
        // Fetch messages from another chain
        const messages = await contract.getMessages(fromChainId);
        
        console.log('Messages received:', messages);
        return messages;
    } catch (error) {
        console.error('Error receiving messages:', error);
        throw new Error('Failed to receive messages');
    }
};
