import React, { useState } from 'react';
import { Button, Input, Alert } from 'react-bootstrap'; // Assuming you use react-bootstrap for UI components
import crypto from 'crypto'; // Node.js crypto module for encryption/decryption

// Utility functions for encryption and decryption
const encryptText = (text, key) => {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decryptText = (encryptedText, key) => {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

const Encryption = () => {
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEncrypt = () => {
    try {
      if (!text || !key) {
        setError('Text and key are required for encryption.');
        return;
      }
      setError(null);
      const encrypted = encryptText(text, key);
      setEncryptedText(encrypted);
    } catch (err) {
      setError('Encryption failed.');
    }
  };

  const handleDecrypt = () => {
    try {
      if (!encryptedText || !key) {
        setError('Encrypted text and key are required for decryption.');
        return;
      }
      setError(null);
      const decrypted = decryptText(encryptedText, key);
      setDecryptedText(decrypted);
    } catch (err) {
      setError('Decryption failed.');
    }
  };

  return (
    <div>
      <h2>Encryption/Decryption Tool</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <div>
        <Input
          type="text"
          placeholder="Enter text to encrypt"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Enter encryption key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </div>
      <Button onClick={handleEncrypt}>Encrypt</Button>
      <Button onClick={handleDecrypt} disabled={!encryptedText}>Decrypt</Button>
      <div>
        <h3>Encrypted Text</h3>
        <p>{encryptedText}</p>
      </div>
      <div>
        <h3>Decrypted Text</h3>
        <p>{decryptedText}</p>
      </div>
    </div>
  );
};

export default Encryption;
