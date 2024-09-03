import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAlert } from 'react-alert';
import { wormhole, encoding, signSendWait } from '@wormhole-foundation/sdk';
import solana from '@wormhole-foundation/sdk/solana';
import { getSigner } from '../helpers/index'; // Assuming you have a helper to get the signer

const Messaging = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  useEffect(() => {
    // Handle cleanup if needed
    return () => {
      // Cleanup code here
    };
  }, []);

  const handleSendMessage = async () => {
    try {
      setLoading(true);

      // Initialize Wormhole bridge
      const wh = await wormhole('Testnet', [solana]);
      const chain = wh.getChain('Solana');
      const { signer, address } = await getSigner(chain);

      // Get a reference to the core messaging bridge
      const coreBridge = await chain.getWormholeCore();

      // Generate and send the transaction
      const publishTxs = coreBridge.publishMessage(
        address.address, // Address of sender (emitter in VAA)
        encoding.bytes.encode(message), // Message to send (payload in VAA)
        0, // Nonce
        0  // ConsistencyLevel
      );

      const txids = await signSendWait(chain, publishTxs, signer);
      const txid = txids[txids.length - 1];
      const [whm] = await chain.parseTransaction(txid.txid);
      const vaa = await wh.getVaa(whm, 'Uint8Array', 60000);

      setResponse(vaa);
      alert.success('Message sent and VAA received!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Messaging - BitThetaSecure</title>
        <meta name="description" content="Send and receive messages securely." />
      </Head>

      <div className="messaging-container">
        <h1>Send a Message</h1>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          cols="50"
          placeholder="Enter your message here"
        />
        <button onClick={handleSendMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>

        {response && (
          <div className="response">
            <h2>Response:</h2>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}

        <style jsx>{`
          .messaging-container {
            width: 80%;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
          }
          h1 {
            font-size: 2rem;
            color: #0070f3;
          }
          textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 1rem;
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
          .response {
            margin-top: 20px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          pre {
            text-align: left;
            word-wrap: break-word;
            white-space: pre-wrap;
          }
        `}</style>
      </div>
    </>
  );
};

export default Messaging;
