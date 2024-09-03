// src/components/Security/AnomalyDetection.js

import React, { useState } from 'react';
import axios from 'axios';

const AnomalyDetection = () => {
    const [inputData, setInputData] = useState('');
    const [detectionResult, setDetectionResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDataChange = (e) => {
        setInputData(e.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Replace with your Theta Edge Network endpoint for anomaly detection
            const response = await axios.post('https://api.thetaedge.network/anomaly-detection', {
                data: inputData
            });

            // Process the response from the AI model
            setDetectionResult(response.data.result);
            alert('Anomaly detection completed successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to detect anomalies.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Anomaly Detection</h2>
            <input
                type="text"
                value={inputData}
                onChange={handleDataChange}
                placeholder="Enter data to analyze"
                style={styles.input}
            />
            <button 
                onClick={handleSubmit} 
                disabled={loading} 
                style={styles.button}
            >
                {loading ? 'Analyzing...' : 'Detect Anomalies'}
            </button>
            <div style={styles.resultContainer}>
                <h3 style={styles.resultHeader}>Detection Result</h3>
                <p style={styles.resultText}>{detectionResult}</p>
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
    resultContainer: {
        marginTop: '20px',
        borderTop: '1px solid #ddd',
        paddingTop: '10px',
    },
    resultHeader: {
        marginBottom: '10px',
    },
    resultText: {
        fontSize: '16px',
        color: '#333',
    },
};

export default AnomalyDetection;
