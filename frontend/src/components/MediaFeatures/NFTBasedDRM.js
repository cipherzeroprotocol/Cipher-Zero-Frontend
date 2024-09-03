// src/components/NFTBasedDRM/NFTBasedDRM.js

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useThetaProvider, useThetaContract } from '../../contexts/ThetaContext'; // Custom hooks for Theta integration

const NFTBasedDRM = () => {
    const [nftAddress, setNftAddress] = useState('');
    const [contentId, setContentId] = useState('');
    const [ownerAddress, setOwnerAddress] = useState('');
    const [message, setMessage] = useState('');
    const thetaProvider = useThetaProvider(); // Custom hook to get Theta provider
    const thetaContract = useThetaContract(); // Custom hook to get Theta smart contract instance

    useEffect(() => {
        // Fetch initial data or perform setup when the component mounts
    }, [thetaProvider]);

    const mintNFT = async () => {
        try {
            if (!thetaProvider || !thetaContract) {
                throw new Error('Theta provider or contract is not initialized.');
            }

            // Mint NFT for DRM purposes
            const tx = await thetaContract.mintNFT(contentId, ownerAddress);
            await tx.wait(); // Wait for the transaction to be mined
            setMessage('NFT minted successfully!');
        } catch (error) {
            console.error('Error minting NFT:', error);
            setMessage('Failed to mint NFT.');
        }
    };

    const verifyOwnership = async () => {
        try {
            if (!thetaProvider || !thetaContract) {
                throw new Error('Theta provider or contract is not initialized.');
            }

            // Verify ownership of the NFT
            const isOwner = await thetaContract.verifyOwnership(contentId, ownerAddress);
            setMessage(isOwner ? 'Ownership verified!' : 'Ownership verification failed.');
        } catch (error) {
            console.error('Error verifying ownership:', error);
            setMessage('Failed to verify ownership.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>NFT-Based Digital Rights Management (DRM)</h2>

            <div style={styles.inputSection}>
                <input
                    type="text"
                    value={nftAddress}
                    onChange={(e) => setNftAddress(e.target.value)}
                    placeholder="NFT Contract Address"
                    style={styles.input}
                />
                <input
                    type="text"
                    value={contentId}
                    onChange={(e) => setContentId(e.target.value)}
                    placeholder="Content ID"
                    style={styles.input}
                />
                <input
                    type="text"
                    value={ownerAddress}
                    onChange={(e) => setOwnerAddress(e.target.value)}
                    placeholder="Owner Address"
                    style={styles.input}
                />
                <button
                    onClick={mintNFT}
                    style={styles.button}
                >
                    Mint NFT
                </button>
                <button
                    onClick={verifyOwnership}
                    style={styles.button}
                >
                    Verify Ownership
                </button>
                <p style={styles.message}>{message}</p>
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
    inputSection: {
        marginBottom: '30px',
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
        marginRight: '10px',
    },
    message: {
        marginTop: '10px',
        fontSize: '16px',
        color: '#333',
    },
};

export default NFTBasedDRM;
