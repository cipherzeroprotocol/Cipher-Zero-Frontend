import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Upload File - BitThetaSecure</title>
      </Head>
      <div>
        <h1>Upload File to Theta</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
        </form>
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </div>
    </>
  );
};

export default Upload;
