import React, { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useAlert } from 'react-alert';
import WormholeTransfer from '../components/WormholeTransfer';
import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { useAlert } from 'react-alert';

// Remove the duplicate declaration of 'Transfer' variable
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!toAddress || !amount) {
      alert.error('Please enter recipient address and amount.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/transfer', { toAddress, amount });
      alert.success('Transfer successful.');
    } catch (error) {
      alert.error('Failed to transfer.');
    } finally {
      setLoading(false);
    }


  return (
    <>
      <Head>
        <title>Token Transfer - BitThetaSecure</title>
      </Head>
      <div>
        <h1>Transfer Tokens</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="Recipient Address"
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
          <button type="submit" disabled={loading}>{loading ? 'Transferring...' : 'Transfer'}</button>
        </form>
      </div>
    </>
  );
};

// Remove the duplicate default export
// export default Transfer;
const Transfer = () => {
  const [file, setFile] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !recipient) {
      alert.error('Please select a file and provide a recipient address.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('recipient', recipient);

    try {
      // Upload file to the server
      const uploadResponse = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { guid } = uploadResponse.data;

      // Use the WormholeTransfer component to handle cross-chain transfer
      const wormholeResponse = await axios.post('/api/transfer-wormhole', {
        guid,
        recipient,
      });

      if (wormholeResponse.data.success) {
        alert.success('File transfer initiated successfully.');
        setFile(null);
        setRecipient('');
      } else {
        alert.error('Failed to initiate file transfer.');
      }
    } catch (error) {
      console.error('Error transferring file:', error);
      alert.error('Failed to initiate file transfer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>File Transfer - BitThetaSecure</title>
        <meta name="description" content="Initiate a file transfer using Wormhole." />
      </Head>

      <div className="transfer-container">
        <h1>Transfer File</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="file">Select File:</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              accept=".zip, .tar, .gz" // Modify accepted file types as needed
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

        <WormholeTransfer />

        <style jsx>{`
          .transfer-container {
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

export default Transfer;
