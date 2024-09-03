// frontend/src/config/EdgeStoreConfig.ts

// Example ABI for EdgeStore Contract
export const EdgeStoreContractABI = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "fileId",
                "type": "string"
            }
        ],
        "name": "getFile",
        "outputs": [
            {
                "name": "fileData",
                "type": "bytes"
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
                "name": "fileHash",
                "type": "string"
            },
            {
                "name": "fileData",
                "type": "bytes"
            }
        ],
        "name": "uploadFile",
        "outputs": [
            {
                "name": "fileId",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Example contract address (replace with actual EdgeStore contract address)
export const EdgeStoreContractAddress = '0xYourEdgeStoreContractAddressHere';
