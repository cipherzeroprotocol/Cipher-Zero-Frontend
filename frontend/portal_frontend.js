
// portal_frontend.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'http://localhost:3000/api'; // Change to your API base URL

const PortalFrontend = () => {
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        const fetchDocumentation = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/documentation`);
                setDocs(response.data);
            } catch (error) {
                console.error('Error fetching documentation:', error);
            }
        };

        fetchDocumentation();
    }, []);

    return (
        <div>
            <h1>Developer Portal</h1>
            <ul>
                {docs.map((doc, index) => (
                    <li key={index}>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            {doc.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PortalFrontend;
