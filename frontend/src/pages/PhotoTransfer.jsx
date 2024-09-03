import React, { useState } from 'react';
import Head from 'next/head';
import { useAlert } from 'react-alert';
import axios from 'axios';

const PhotoTransfer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');
  const alert = useAlert();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert.error('Please select a file to upload.');
      return;
    }

    try {
      setLoading(true);

      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);

      // Post the file to the server
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setUploadUrl(response.data.url);
        alert.success('File uploaded successfully!');
      } else {
        alert.error('Failed to upload the file.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert.error('An error occurred during file upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Photo Transfer - BitThetaSecure</title>
        <meta name="description" content="Upload and transfer photos securely." />
      </Head>

      <div className="photo-transfer-container">
        <h1>Upload Your Photo</h1>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Photo'}
        </button>

        {uploadUrl && (
          <div className="upload-link">
            <h2>File Uploaded Successfully!</h2>
            <a href={uploadUrl} target="_blank" rel="noopener noreferrer">
              Download your file
            </a>
          </div>
        )}

        <style jsx>{`
          .photo-transfer-container {
            width: 80%;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
          }
          h1 {
            font-size: 2rem;
            color: #0070f3;
          }
          input[type="file"] {
            margin-bottom: 20px;
          }
          button {
            padding: 10px 20px;
            background-color: #0070f3;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }
          .upload-link {
            margin-top: 20px;
          }
          .upload-link a {
            color: #0070f3;
            text-decoration: none;
            font-size: 1.2rem;
          }
          .upload-link a:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    </>
  );
};

export default PhotoTransfer;
