import React, { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useAlert } from 'react-alert';

const VideoTransfer = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !recipient) {
      alert.error('Please select a video file and provide a recipient address.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('recipient', recipient);

    try {
      await axios.post('/api/video-transfer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert.success('Video transfer initiated successfully.');
      setVideoFile(null);
      setRecipient('');
    } catch (error) {
      console.error('Error transferring video:', error);
      alert.error('Failed to initiate video transfer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Video Transfer - BitThetaSecure</title>
        <meta name="description" content="Initiate a video file transfer." />
      </Head>

      <div className="video-transfer-container">
        <h1>Transfer Video</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="video-file">Select Video:</label>
            <input
              type="file"
              id="video-file"
              onChange={handleFileChange}
              accept="video/*" // Accept all video files
            />
          </div>
          <div className="form-group">
            <label htmlFor="recipient">Recipient Address:</label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={handleRecipientChange}
              placeholder="Enter recipient address"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Transferring...' : 'Transfer'}
          </button>
        </form>

        <style jsx>{`
          .video-transfer-container {
            width: 80%;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
          }
          h1 {
            font-size: 2rem;
            color: #0070f3;
          }
          .form-group {
            margin-bottom: 15px;
          }
          label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }
          input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
          }
          button {
            background-color: #0070f3;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            font-size: 1rem;
            cursor: pointer;
          }
          button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </>
  );
};

export default VideoTransfer;
