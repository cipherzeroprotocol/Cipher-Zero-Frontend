// src/components/TFUELStaking/TFUELStaking.js

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useThetaProvider, useTFUELContract } from '../../contexts/ThetaContext'; // Custom hooks for Theta integration

const TFUELStaking = () => {
    const [stakeAmount, setStakeAmount] = useState('');
    const [stakingStatus, setStakingStatus] = useState('');
    const [reward, setReward] = useState('');
    const [message, setMessage] = useState('');
    const thetaProvider = useThetaProvider(); // Custom hook to get Theta provider
    const tfuelContract = useTFUELContract(); // Custom hook to get TFUEL staking smart contract instance

    useEffect(() => {
        // Fetch initial staking status and rewards when the component mounts
        fetchStakingStatus();
        fetchRewards();
    }, [thetaProvider]);

    const handleStake = async () => {
        try {
            if (!thetaProvider || !tfuelContract) {
                throw new Error('Theta provider or TFUEL contract is not initialized.');
            }

            // Convert stake amount to the correct format
            const amountInWei = ethers.utils.parseUnits(stakeAmount, 'ether');
            
            // Interact with the TFUEL smart contract to stake TFUEL tokens
            const tx = await tfuelContract.stakeTFUEL(amountInWei);
            await tx.wait(); // Wait for the transaction to be mined

            setMessage('Staking successful!');
            fetchStakingStatus(); // Update staking status after staking
            fetchRewards(); // Update rewards after staking
        } catch (error) {
            console.error('Error staking TFUEL:', error);
            setMessage('Failed to stake TFUEL.');
        }
    };

    const fetchStakingStatus = async () => {
        try {
            if (tfuelContract) {
                // Fetch staking status for the current account
                const status = await tfuelContract.getStakingStatus();
                setStakingStatus(status);
            }
        } catch (error) {
            console.error('Error fetching staking status:', error);
            setMessage('Failed to fetch staking status.');
        }
    };

    const fetchRewards = async () => {
        try {
            if (tfuelContract) {
                // Fetch rewards for the current account
                const rewardAmount = await tfuelContract.getReward();
                setReward(ethers.utils.formatUnits(rewardAmount, 'ether'));
            }
        } catch (error) {
            console.error('Error fetching rewards:', error);
            setMessage('Failed to fetch rewards.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>TFUEL Staking</h2>

            <div style={styles.inputSection}>
                <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="Amount to Stake (TFUEL)"
                    style={styles.input}
                />
                <button
                    onClick={handleStake}
                    style={styles.button}
                >
                    Stake TFUEL
                </button>
                <p style={styles.message}>{message}</p>
                <div style={styles.stakingStatusSection}>
                    <h3>Staking Status</h3>
                    <p>{stakingStatus}</p>
                </div>
                <div style={styles.rewardSection}>
                    <h3>Current Reward</h3>
                    <p>{reward} TFUEL</p>
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
    stakingStatusSection: {
        marginTop: '20px',
    },
    rewardSection: {
        marginTop: '20px',
    },
};

export default TFUELStaking;
