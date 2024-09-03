// frontend/src/config/IdentityContractABI.ts

export const IdentityContractABI = [
    {
        "inputs": [
            { "internalType": "string", "name": "metadata_", "type": "string" }
        ],
        "name": "register",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "user_", "type": "address" }
        ],
        "name": "getMetadata",
        "outputs": [
            { "internalType": "string", "name": "metadata", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "user_", "type": "address" }
        ],
        "name": "getPublicKey",
        "outputs": [
            { "internalType": "string", "name": "publicKey", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
