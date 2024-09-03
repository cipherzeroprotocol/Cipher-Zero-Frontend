import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

const Authentication = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/authenticate', { address });
      alert('Authenticated successfully');
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Authentication - BitThetaSecure</title>
      </Head>
      <div>
        <h1>Authenticate with Theta Wallet</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Theta Wallet address"
          />
          <button type="submit" disabled={loading}>{loading ? 'Authenticating...' : 'Authenticate'}</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </>
  );
};

export default Authentication;
