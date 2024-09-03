// frontend/src/components/FileUpload.tsx

import React, { useState } from 'react';
import { Contract, providers, Wallet } from '@thetalabs/theta-js';
import { ethers } from 'ethers';
import { EdgeStoreContractABI, EdgeStoreContractAddress } from '../config/EdgeStoreConfig';

// Define the type for the component props
interface FileUploadProps {
    wallet: Wallet; // User's wallet to sign transactions
}

const FileUpload: React.FC<FileUploadProps> = ({ wallet }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);

    // Initialize the provider and contract
    const edgeStoreContract = new ethers.Contract(EdgeStoreContractAddress, EdgeStoreContractABI, new ethers.Wallet(wallet.privateKey, providers));

    // Handle file selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    // Convert file to base64
    const getBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Function to upload file to EdgeStore
    const uploadFile = async () => {
        if (!file) {
            setError('No file selected');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const base64File = await getBase64(file);
            const base64Data = base64File.split(',')[1]; // Remove the data URL prefix

            // Create a transaction object
            const txData = {
                fileId: file.name, // Use a unique identifier for the file
                fileData: base64Data,
            };

            // Create a new transaction
            const transaction = {
                from: wallet.getAddress(),
                to: EdgeStoreContractAddress,
                data: edgeStoreContract.encodeFunctionData('uploadFile', [txData.fileId, txData.fileData]),
            };

            // Send transaction
            const tx = await wallet.sendTransaction(transaction);
            await tx.wait(); // Wait for the transaction to be mined

            setFileId(txData.fileId);
            console.log('File uploaded successfully:', txData.fileId);

        } catch (err) {
            setError('Failed to upload file');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadFile} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload File'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {fileId && (
                <p>File uploaded successfully. File ID: {fileId}</p>
            )}
        </div>
    );
};

export default FileUpload;
