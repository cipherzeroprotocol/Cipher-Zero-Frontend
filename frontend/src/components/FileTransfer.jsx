import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, Alert, Spinner } from 'react-bootstrap'; // Using react-bootstrap for UI components

const FileTransfer = () => {
    const [file, setFile] = useState(null);
    const [destination, setDestination] = useState('');
    const [transferStatus, setTransferStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleDestinationChange = (e) => {
        setDestination(e.target.value);
    };

    const handleSubmit = async () => {
        if (!file || !destination) {
            setError('File and destination are required.');
            return;
        }

        setError(null);
        setTransferStatus(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('destination', destination);

        try {
            const response = await axios.post('/api/transfer-file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setTransferStatus('File transferred successfully.');
        } catch (err) {
            setError('Failed to transfer file.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="file-transfer">
            <h2>File Transfer</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {transferStatus && <Alert variant="success">{transferStatus}</Alert>}
            <div className="file-transfer-form">
                <Input
                    type="file"
                    onChange={handleFileChange}
                    className="mb-2"
                />
                <Input
                    type="text"
                    placeholder="Destination Address"
                    value={destination}
                    onChange={handleDestinationChange}
                    className="mb-2"
                />
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Transfer File'}
                </Button>
            </div>
        </div>
    );
};

export default FileTransfer;
