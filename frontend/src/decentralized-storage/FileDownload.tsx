// frontend/src/components/FileDownload.tsx

import React, { useState } from 'react';
import { providers } from '@thetalabs/theta-js';

// Define the type for the component props
interface FileDownloadProps {
    fileId: string;
}

const FileDownload: React.FC<FileDownloadProps> = ({ fileId }) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize the provider and contract
    const provider = new providers.HttpProvider('https://theta-testnet.api.theta.network'); // Use mainnet URL in production
    interface EdgeStoreContract extends Contract {
        getFile(fileId: string): Promise<string>;
    }
    
    class Contract implements EdgeStoreContract {
        // Implement the getFile method
        getFile(fileId: string): Promise<string> {
            // Add your implementation here
            return Promise.resolve('');
        }
    }
    
    const edgeStoreContract: EdgeStoreContract = new Contract();

    // Function to fetch file data from the EdgeStore
    const fetchFile = async () => {
        setLoading(true);
        setError(null);

        try {
            // Call the contract method to get file data
            const fileData: string = await edgeStoreContract.getFile(fileId);
            
            // Convert the file data (base64) to a Blob
            const byteCharacters = atob(fileData);
            const byteArrays: Uint8Array[] = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                byteArrays.push(new Uint8Array(byteNumbers));
            }
            const blob = new Blob(byteArrays, { type: 'application/octet-stream' });

            // Create a URL for the Blob and set it to state
            const url = URL.createObjectURL(blob);
            setFileUrl(url);

        } catch (err) {
            setError('Failed to fetch file');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={fetchFile} disabled={loading}>
                {loading ? 'Loading...' : 'Download File'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {fileUrl && (
                <a href={fileUrl} download={`file-${fileId}`} style={{ display: 'block', marginTop: '10px' }}>
                    Click here to download the file
                </a>
            )}
        </div>
    );
};

export default FileDownload;
