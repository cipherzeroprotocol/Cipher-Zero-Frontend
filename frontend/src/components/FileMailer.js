import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, Alert } from 'react-bootstrap'; // Using react-bootstrap for UI components

const FileMailer = () => {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !email || !subject || !message) {
      setError('All fields are required.');
      return;
    }

    setError(null);
    setStatus(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);

    try {
      const response = await axios.post('/api/send-email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStatus('Email sent successfully.');
    } catch (err) {
      setError('Failed to send email.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Send File via Email</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {status && <Alert variant="success">{status}</Alert>}
      <div>
        <Input
          type="file"
          onChange={handleFileChange}
        />
        <Input
          type="email"
          placeholder="Recipient Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <Input
          as="textarea"
          rows={3}
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Sending...' : 'Send Email'}
      </Button>
    </div>
  );
};

export default FileMailer;
