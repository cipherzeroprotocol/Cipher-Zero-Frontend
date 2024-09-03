import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

const Content = () => {
  const [contentId, setContentId] = useState('');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/content', { contentId });
      setContent(response.data);
    } catch (err) {
      setError('Failed to retrieve content.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Content Delivery - BitThetaSecure</title>
        <meta name="description" content="Retrieve and display content from Theta Network." />
      </Head>

      <div className="content-container">
        <h1>Retrieve Content</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="contentId">Content ID:</label>
            <input
              type="text"
              id="contentId"
              value={contentId}
              onChange={(e) => setContentId(e.target.value)}
              placeholder="Enter Content ID"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Retrieve Content'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
        {content && (
          <div className="content-display">
            <h2>Content Details:</h2>
            <pre>{JSON.stringify(content, null, 2)}</pre>
          </div>
        )}

        <style jsx>{`
          .content-container {
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
          .error {
            color: red;
          }
          .content-display {
            margin-top: 20px;
            text-align: left;
          }
        `}</style>
      </div>
    </>
  );
};

export default Content;
