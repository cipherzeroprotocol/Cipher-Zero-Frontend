import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { computeHash } from '../utils/hashUtils'; // Assume you have a utility for hashing

const MessageIntegrityChecker = ({ algorithm }) => {
  const [message, setMessage] = useState('');
  const [hash, setHash] = useState('');
  const [computedHash, setComputedHash] = useState('');
  const [isValid, setIsValid] = useState(null);

  // Function to handle message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Function to handle hash input change
  const handleHashChange = (e) => {
    setHash(e.target.value);
  };

  // Function to compute and validate hash
  const checkIntegrity = () => {
    const computed = computeHash(message, algorithm);
    setComputedHash(computed);
    setIsValid(computed === hash);
  };

  return (
    <div className="message-integrity-checker">
      <h2>Message Integrity Checker</h2>
      <div className="form-group">
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          value={message}
          onChange={handleMessageChange}
          rows="4"
          cols="50"
          placeholder="Enter your message here"
        />
      </div>
      <div className="form-group">
        <label htmlFor="hash">Expected Hash:</label>
        <input
          id="hash"
          type="text"
          value={hash}
          onChange={handleHashChange}
          placeholder="Enter the expected hash"
        />
      </div>
      <button onClick={checkIntegrity}>Check Integrity</button>
      {isValid !== null && (
        <div className={`result ${isValid ? 'valid' : 'invalid'}`}>
          <p>{isValid ? 'Message integrity verified successfully!' : 'Message integrity verification failed.'}</p>
          <p>Computed Hash: {computedHash}</p>
        </div>
      )}
      <style jsx>{`
        .message-integrity-checker {
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: auto;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
        }
        textarea, input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        button {
          padding: 10px 20px;
          background: #007bff;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background: #0056b3;
        }
        .result {
          margin-top: 20px;
          padding: 10px;
          border-radius: 4px;
        }
        .valid {
          background: #d4edda;
          color: #155724;
        }
        .invalid {
          background: #f8d7da;
          color: #721c24;
        }
      `}</style>
    </div>
  );
};

MessageIntegrityChecker.propTypes = {
  algorithm: PropTypes.string.isRequired,
};

export default MessageIntegrityChecker;
