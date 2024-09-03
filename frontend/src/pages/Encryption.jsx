import React, { useState } from 'react';
import CryptoJS from 'crypto-js'; // Assuming you're using CryptoJS for encryption/decryption

const Encryption = () => {
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');

  const handleEncrypt = () => {
    if (key && message) {
      const ciphertext = CryptoJS.AES.encrypt(message, key).toString();
      setEncryptedMessage(ciphertext);
    } else {
      alert('Please provide both message and key.');
    }
  };

  const handleDecrypt = () => {
    if (key && encryptedMessage) {
      const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
      const originalMessage = bytes.toString(CryptoJS.enc.Utf8);
      setDecryptedMessage(originalMessage);
    } else {
      alert('Please provide both key and encrypted message.');
    }
  };

  return (
    <div className="encryption-container">
      <h1>Encryption and Decryption</h1>
      <div className="encryption-section">
        <h2>Encrypt Message</h2>
        <textarea
          rows="4"
          cols="50"
          placeholder="Enter message to encrypt"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <input
          type="text"
          placeholder="Enter encryption key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button onClick={handleEncrypt}>Encrypt</button>
        {encryptedMessage && (
          <div>
            <h3>Encrypted Message:</h3>
            <p>{encryptedMessage}</p>
          </div>
        )}
      </div>
      <div className="decryption-section">
        <h2>Decrypt Message</h2>
        <textarea
          rows="4"
          cols="50"
          placeholder="Enter encrypted message"
          value={encryptedMessage}
          onChange={(e) => setEncryptedMessage(e.target.value)}
        ></textarea>
        <input
          type="text"
          placeholder="Enter decryption key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button onClick={handleDecrypt}>Decrypt</button>
        {decryptedMessage && (
          <div>
            <h3>Decrypted Message:</h3>
            <p>{decryptedMessage}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .encryption-container {
          width: 80%;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }
        .encryption-section,
        .decryption-section {
          margin-bottom: 30px;
        }
        textarea {
          width: 100%;
          margin-bottom: 10px;
          padding: 10px;
        }
        input {
          margin-bottom: 10px;
          padding: 10px;
          width: 100%;
          max-width: 500px;
        }
        button {
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #005bb5;
        }
        h1 {
          color: #333;
        }
        h2 {
          color: #0070f3;
        }
        h3 {
          color: #333;
        }
        p {
          background-color: #f4f4f4;
          padding: 10px;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default Encryption;
