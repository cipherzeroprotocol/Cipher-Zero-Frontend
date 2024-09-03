const Web3 = require('web3');
const { abi, networks } = require('./DIDSystem.json'); // ABI and network details from the compiled contract

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); // Change to your provider

const contractAddress = networks['5777'].address; // Change the network ID based on your setup
const DIDSystem = new web3.eth.Contract(abi, contractAddress);

async function registerIdentity(account, did, publicKey, document) {
    try {
        await DIDSystem.methods.registerIdentity(did, publicKey, document).send({ from: account });
        console.log('Identity registered successfully');
    } catch (error) {
        console.error('Error registering identity:', error);
    }
}

async function updateIdentity(account, did, publicKey, document) {
    try {
        await DIDSystem.methods.updateIdentity(did, publicKey, document).send({ from: account });
        console.log('Identity updated successfully');
    } catch (error) {
        console.error('Error updating identity:', error);
    }
}

async function getIdentity(account) {
    try {
        const identity = await DIDSystem.methods.getIdentity(account).call();
        console.log('Identity:', identity);
        return identity;
    } catch (error) {
        console.error('Error fetching identity:', error);
    }
}

async function getIdentityByDID(did) {
    try {
        const identity = await DIDSystem.methods.getIdentityByDID(did).call();
        console.log('Identity:', identity);
        return identity;
    } catch (error) {
        console.error('Error fetching identity by DID:', error);
    }
}

// Example usage:
const account = '0xYourEthereumAccount'; // Replace with your Ethereum account
const did = 'did:example:123456789abcdefghi';
const publicKey = 'YourPublicKey';
const document = 'YourDIDDocument';

// Register a new identity
registerIdentity(account, did, publicKey, document);

// Update the identity
updateIdentity(account, did, publicKey, document);

// Fetch the identity
getIdentity(account);

// Fetch the identity by DID
getIdentityByDID(did);
