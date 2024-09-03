import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

const CrossChainValidation = () => {
  const [transactionId, setTransactionId] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/validateCrossChain', { transactionId });
      setResult(response.data);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Cross-Chain Validation - BitThetaSecure</title>
      </Head>
      <div>
        <h1>Validate Cross-Chain Transaction</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Transaction ID"
          />
          <button type="submit">Validate</button>
        </form>
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </div>
    </>
  );
};

export default CrossChainValidation;
