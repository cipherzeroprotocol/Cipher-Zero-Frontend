// src/components/Compute/DecentralizedComputeTasks.js

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useThetaProvider, useThetaContract } from '../../contexts/ThetaContext'; // Custom hooks for Theta integration
import axios from 'axios'; // For handling HTTP requests

const DecentralizedComputeTasks = () => {
    const [computePower, setComputePower] = useState('');
    const [taskStatus, setTaskStatus] = useState('');
    const [reward, setReward] = useState('');
    const [loading, setLoading] = useState(false); // Loading state for button
    const thetaProvider = useThetaProvider(); // Custom hook to get Theta provider
    const thetaContract = useThetaContract(); // Custom hook to get Theta smart contract instance

    useEffect(() => {
        // Fetch initial task status when the component mounts
        fetchTaskStatus();
    }, [thetaProvider]);

    const handleSubmit = async () => {
        setLoading(true); // Set loading state
        try {
            if (!thetaProvider || !thetaContract) {
                throw new Error('Theta provider or contract is not initialized.');
            }

            // Interact with the Theta smart contract to start or contribute to a compute task
            const tx = await thetaContract.startComputeTask(computePower);
            await tx.wait(); // Wait for the transaction to be mined

            // Fetch the updated task status and reward
            await fetchTaskStatus();
            setReward(await thetaContract.getReward());
            alert('Compute task started successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to start compute task.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const fetchTaskStatus = async () => {
        try {
            if (thetaContract) {
                const status = await thetaContract.getTaskStatus();
                setTaskStatus(status);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to fetch task status.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Decentralized Compute Tasks</h2>
            <input
                type="number"
                value={computePower}
                onChange={(e) => setComputePower(e.target.value)}
                placeholder="Enter compute power"
                style={styles.input}
            />
            <button 
                onClick={handleSubmit} 
                disabled={loading} 
                style={styles.button}
            >
                {loading ? 'Processing...' : 'Start Compute Task'}
            </button>
            <div style={styles.statusContainer}>
                <h3 style={styles.subHeader}>Task Status</h3>
                <p style={styles.statusText}>{taskStatus}</p>
            </div>
            <div style={styles.rewardContainer}>
                <h3 style={styles.subHeader}>Reward</h3>
                <p style={styles.rewardText}>{reward} TFUEL</p>
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
    input: {
        width: '80%',
        padding: '10px',
        marginBottom: '10px',
        fontSize: '16px',
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
    statusContainer: {
        marginTop: '20px',
        borderTop: '1px solid #ddd',
        paddingTop: '10px',
    },
    rewardContainer: {
        marginTop: '20px',
        borderTop: '1px solid #ddd',
        paddingTop: '10px',
    },
    subHeader: {
        marginBottom: '10px',
    },
    statusText: {
        fontSize: '16px',
        color: '#333',
    },
    rewardText: {
        fontSize: '16px',
        color: '#333',
    },
};

export default DecentralizedComputeTasks;
