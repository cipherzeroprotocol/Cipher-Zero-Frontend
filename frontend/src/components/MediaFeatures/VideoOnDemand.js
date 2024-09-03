// src/components/VideoOnDemand/VideoOnDemand.js

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For handling HTTP requests

const VideoOnDemand = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [videoData, setVideoData] = useState(null);
    const [fetchStatus, setFetchStatus] = useState('');

    // Fetch video data from Theta Video API
    const fetchVideo = async () => {
        if (!videoUrl) {
            alert('Please provide a video URL.');
            return;
        }

        try {
            setFetchStatus('Fetching...');
            // Replace with actual API endpoint or method to get video data from Theta
            const response = await axios.get(videoUrl);

            // Assuming response data contains the video URL or stream data
            setVideoData(response.data.videoUrl || response.data.streamUrl);
            setFetchStatus('Fetch successful!');
        } catch (error) {
            console.error('Error fetching video:', error);
            setFetchStatus('Fetch failed.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Video on Demand via Theta Video API</h2>

            <div style={styles.inputSection}>
                <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Enter video URL"
                    style={styles.input}
                />
                <button 
                    onClick={fetchVideo}
                    style={styles.button}
                >
                    Fetch Video
                </button>
                <p style={styles.status}>{fetchStatus}</p>
            </div>

            {videoData && (
                <div style={styles.videoSection}>
                    <h3>Video Player</h3>
                    <video controls style={styles.videoPlayer}>
                        <source src={videoData} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
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
    videoSection: {
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
    videoPlayer: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '5px',
    },
};

export default VideoOnDemand;
