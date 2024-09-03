// src/components/Storage/DecentralizedStorage.js

import React, { useState } from 'react';
import axios from 'axios'; // For handling HTTP requests

const DecentralizedStorage = () => {
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    const [fetchStatus, setFetchStatus] = useState('');
    
    // Handle file selection
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Upload file to Theta EdgeStore
    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploadStatus('Uploading...');
            // Replace with actual API URL for Theta EdgeStore
            const response = await axios.post('https://your-edgestore-api-url/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setUploadStatus('Upload successful!');
            // Assuming response contains the file URL
            setFileUrl(response.data.fileUrl);
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus('Upload failed.');
        }
    };

    // Fetch file from Theta EdgeStore
    const handleFetch = async () => {
        try {
            setFetchStatus('Fetching...');
            // Replace with actual API URL for Theta EdgeStore
            const response = await axios.get('https://your-edgestore-api-url/file', {
                params: { url: fileUrl },
            });

            setFetchStatus('Fetch successful!');
            // Assuming response contains the file data
            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank'); // Opens the file in a new tab
        } catch (error) {
            console.error('Error fetching file:', error);
            setFetchStatus('Fetch failed.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Decentralized Storage</h2>
            
            <div style={styles.uploadSection}>
                <input
                    type="file"
                    onChange={handleFileChange}
                    style={styles.fileInput}
                />
                <button 
                    onClick={handleUpload}
                    style={styles.button}
                >
                    Upload File
                </button>
                <p style={styles.status}>{uploadStatus}</p>
            </div>

            <div style={styles.fetchSection}>
                <input
                    type="text"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="Enter file URL"
                    style={styles.input}
                />
                <button 
                    onClick={handleFetch}
                    style={styles.button}
                >
                    Fetch File
                </button>
                <p style={styles.status}>{fetchStatus}</p>
            </div>
        </div>
    );
};

// Basic inline styles for the component
const styles = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: 'auto',
        textAlign: 'center',
    },
    header: {
        marginBottom: '20px',
    },
    uploadSection: {
        marginBottom: '30px',
    },
    fetchSection: {
        marginTop: '30px',
    },
    fileInput: {
        marginBottom: '10px',
    },
    input: {
        width: '80%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
    },
    status: {
        marginTop: '10px',
        fontSize: '16px',
        color: '#333',
    },
};

export default DecentralizedStorage;
