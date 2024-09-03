import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

const ContractInteraction = () => {
  const [functionName, setFunctionName] = useState('');
  const [params, setParams] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/contract', { functionName, params });
      setResult(response.data);
    } catch (error) {
      console.error('Failed to call contract function:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Contract Interaction - BitThetaSecure</title>
      </Head>
      <div>
        <h1>Interact with Smart Contract</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
            placeholder="Function Name"
          />
          <input
            type="text"
            value={params}
            onChange={(e) => setParams(e.target.value)}
            placeholder="Parameters (comma separated)"
          />
          <button type="submit">Call Function</button>
        </form>
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </div>
    </>
  );
};

export default ContractInteraction;
