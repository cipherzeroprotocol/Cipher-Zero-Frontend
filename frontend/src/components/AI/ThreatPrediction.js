// src/components/Security/ThreatPrediction.js

import React, { useState } from 'react';
import axios from 'axios'; // For handling HTTP requests

const ThreatPrediction = () => {
    const [inputData, setInputData] = useState('');
    const [prediction, setPrediction] = useState('');
    const [loading, setLoading] = useState(false); // Loading state for API requests

    const handleSubmit = async () => {
        setLoading(true); // Set loading state
        try {
            // Replace with the actual URL of your threat prediction AI model API
            // maybe I can use theta ai
            
            const response = await axios.post('https://your-ai-model-api-url/predict', { data: inputData });
            
            // Assume the response contains a prediction field
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error('Error predicting threat:', error);
            setPrediction('Error predicting threat.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Threat Prediction</h2>
            <textarea
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="Enter data for threat prediction"
                style={styles.textarea}
            />
            <button 
                onClick={handleSubmit} 
                disabled={loading} 
                style={styles.button}
            >
                {loading ? 'Predicting...' : 'Predict Threat'}
            </button>
            <div style={styles.resultContainer}>
                <h3 style={styles.subHeader}>Prediction Result</h3>
                <p style={styles.resultText}>{prediction}</p>
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
    textarea: {
        width: '80%',
        height: '150px',
        padding: '10px',
        fontSize: '16px',
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
    resultContainer: {
        marginTop: '20px',
        borderTop: '1px solid #ddd',
        paddingTop: '10px',
    },
    subHeader: {
        marginBottom: '10px',
    },
    resultText: {
        fontSize: '16px',
        color: '#333',
    },
};

export default ThreatPrediction;
