import { ethers } from 'ethers';
import BridgeGetters from '../../build/contracts/BridgeGetters.json';

// Define the contract address
const BRIDGE_GETTERS_ADDRESS = "0xYourContractAddress"; // Replace with your contract address

// Initialize the provider and signer
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Create a contract instance
const bridgeGettersContract = new ethers.Contract(BRIDGE_GETTERS_ADDRESS, BridgeGetters.abi, signer);

export { provider, signer, bridgeGettersContract };
