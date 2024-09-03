// frontend/src/config/DIDContractABI.ts

export const DIDContractABI = [
    // Add your DID contract ABI here
    {
        "constant": false,
        "inputs": [
            {
                "name": "did",
                "type": "string"
            },
            {
                "name": "metadata",
                "type": "string"
            }
        ],
        "name": "registerDID",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "did",
                "type": "string"
            }
        ],
        "name": "resolveDID",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "did",
                "type": "string"
            },
            {
                "name": "metadata",
                "type": "string"
            }
        ],
        "name": "updateDIDMetadata",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "did",
                "type": "string"
            }
        ],
        "name": "revokeDID",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
