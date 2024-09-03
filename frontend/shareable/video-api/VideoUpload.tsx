import React, { useState } from 'react';

interface VideoUploadProps {
    onUpload: (file: File) => void;  // Callback function to handle file upload
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type and size
            const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
            const maxSize = 100 * 1024 * 1024; // 100 MB

            if (!allowedTypes.includes(file.type)) {
                setError('Invalid file type. Please select a video file.');
                setSelectedFile(null);
                return;
            }

            if (file.size > maxSize) {
                setError('File size exceeds the 100 MB limit.');
                setSelectedFile(null);
                return;
            }

            setSelectedFile(file);
            setError(null);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            onUpload(selectedFile);
        } else {
            setError('No file selected.');
        }
    };

    return (
        <div className="upload-container">
            <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="upload-input"
            />
            {selectedFile && (
                <div className="file-info">
                    <p>Selected file: {selectedFile.name}</p>
                    <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            )}
            <button onClick={handleUpload} className="upload-button">
                Upload
            </button>
            {error && <p className="error-message">{error}</p>}
            <style>{`
                .upload-container {
                    margin: 20px auto;
                    max-width: 500px;
                    text-align: center;
                }

                .upload-input {
                    display: block;
                    margin: 20px auto;
                }

                .file-info {
                    margin: 10px 0;
                }

                .upload-button {
                    padding: 10px 20px;
                    font-size: 16px;
                    background-color: #007bff;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .upload-button:hover {
                    background-color: #0056b3;
                }

                .error-message {
                    color: red;
                    margin-top: 10px;
                }
            `}</style>
        </div>
    );
};

export default VideoUpload;
