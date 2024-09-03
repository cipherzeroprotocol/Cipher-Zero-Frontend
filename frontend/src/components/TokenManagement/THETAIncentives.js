// src/components/THETAIncentives/THETAIncentives.js

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useThetaProvider, useThetaContract } from '../../contexts/ThetaContext'; // Custom hooks for Theta integration

const THETAIncentives = () => {
    const [stakingAmount, setStakingAmount] = useState('');
    const [reward, setReward] = useState('');
    const [message, setMessage] = useState('');
    const thetaProvider = useThetaProvider(); // Custom hook to get Theta provider
    const thetaContract = useThetaContract(); // Custom hook to get Theta smart contract instance

    useEffect(() => {
        // Fetch initial data or perform setup when the component mounts
        fetchRewards();
    }, [thetaProvider]);

    const handleStake = async () => {
        try {
            if (!thetaProvider || !thetaContract) {
                throw new Error('Theta provider or contract is not initialized.');
            }

            // Interact with the Theta smart contract to stake THETA tokens
            const tx = await thetaContract.stakeTHETA(ethers.utils.parseUnits(stakingAmount, 'ether'));
            await tx.wait(); // Wait for the transaction to be mined

            setMessage('Staking successful!');
            fetchRewards(); // Update rewards after staking
        } catch (error) {
            console.error('Error staking THETA:', error);
            setMessage('Failed to stake THETA.');
        }
    };

    const fetchRewards = async () => {
        try {
            if (thetaContract) {
                // Fetch rewards for the current account
                const rewardAmount = await thetaContract.getReward();
                setReward(ethers.utils.formatUnits(rewardAmount, 'ether'));
            }
        } catch (error) {
            console.error('Error fetching rewards:', error);
            setMessage('Failed to fetch rewards.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>THETA Token Incentives</h2>

            <div style={styles.inputSection}>
                <input
                    type="number"
                    value={stakingAmount}
                    onChange={(e) => setStakingAmount(e.target.value)}
                    placeholder="Amount to Stake (THETA)"
                    style={styles.input}
                />
                <button
                    onClick={handleStake}
                    style={styles.button}
                >
                    Stake THETA
                </button>
                <p style={styles.message}>{message}</p>
                <div style={styles.rewardSection}>
                    <h3>Current Reward</h3>
                    <p>{reward} THETA</p>
                </div>
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
    },
    message: {
        marginTop: '10px',
        fontSize: '16px',
        color: '#333',
    },
    rewardSection: {
        marginTop: '20px',
    },
};

export default THETAIncentives;
