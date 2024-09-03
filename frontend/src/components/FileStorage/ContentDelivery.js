// src/components/ContentDelivery/ContentDelivery.js

import React, { useState } from 'react';
import axios from 'axios'; // For handling HTTP requests

const ContentDelivery = () => {
    const [contentUrl, setContentUrl] = useState('');
    const [content, setContent] = useState(null);
    const [fetchStatus, setFetchStatus] = useState('');
    
    // Fetch content from Theta EdgeStore CDN
    const handleFetchContent = async () => {
        if (!contentUrl) {
            alert('Please provide a content URL.');
            return;
        }

        try {
            setFetchStatus('Fetching...');
            // Replace with actual API URL for Theta EdgeStore CDN
            const response = await axios.get(contentUrl, {
                responseType: 'arraybuffer', // Handle binary content if needed
            });

            // Assuming response data is an image, convert it to URL for display
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = URL.createObjectURL(blob);
            setContent(url);
            setFetchStatus('Fetch successful!');
        } catch (error) {
            console.error('Error fetching content:', error);
            setFetchStatus('Fetch failed.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Content Delivery via Theta EdgeStore CDN</h2>

            <div style={styles.inputSection}>
                <input
                    type="text"
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    placeholder="Enter content URL"
                    style={styles.input}
                />
                <button 
                    onClick={handleFetchContent}
                    style={styles.button}
                >
                    Fetch Content
                </button>
                <p style={styles.status}>{fetchStatus}</p>
            </div>

            {content && (
                <div style={styles.contentSection}>
                    <h3>Content Preview</h3>
                    <img src={content} alt="Content Preview" style={styles.image} />
                </div>
            )}
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
    contentSection: {
        marginTop: '30px',
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
    image: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '5px',
    },
};

export default ContentDelivery;
