import React, { useState } from 'react';
import { createHash } from 'crypto'; // Node.js crypto library (can be polyfilled or use browser-compatible alternatives)
import './FileIntegrityChecker.css'; // Import CSS for styling

const FileIntegrityChecker = () => {
  const [file, setFile] = useState(null);
  const [originalHash, setOriginalHash] = useState('');
  const [currentHash, setCurrentHash] = useState('');
  const [status, setStatus] = useState('');

  // Function to compute file hash
  const computeFileHash = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const hash = createHash('sha256'); // Using SHA-256 for hashing

      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const buffer = new Uint8Array(arrayBuffer);
        hash.update(buffer);
        resolve(hash.digest('hex'));
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  // Handle file upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setFile(file);

    if (file) {
      try {
        const hash = await computeFileHash(file);
        setOriginalHash(hash);
        setStatus('File uploaded. Please verify it to ensure integrity.');
      } catch (error) {
        setStatus('Error computing file hash.');
      }
    }
  };

  // Verify file integrity
  const verifyFileIntegrity = async (event) => {
    event.preventDefault();

    if (file) {
      try {
        const hash = await computeFileHash(file);
        setCurrentHash(hash);

        if (hash === originalHash) {
          setStatus('File integrity verified: The file has not been altered.');
        } else {
          setStatus('File integrity check failed: The file has been altered.');
        }
      } catch (error) {
        setStatus('Error computing file hash.');
      }
    } else {
      setStatus('No file to verify.');
    }
  };

  return (
    <div className="file-integrity-checker">
      <h2>File Integrity Checker</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={verifyFileIntegrity}>Verify File Integrity</button>

      <div className="results">
        <p><strong>Original Hash:</strong> {originalHash}</p>
        <p><strong>Current Hash:</strong> {currentHash}</p>
        <p><strong>Status:</strong> {status}</p>
      </div>
    </div>
  );
};

export default FileIntegrityChecker;
