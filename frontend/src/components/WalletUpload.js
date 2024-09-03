import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useWallet } from '@thetablockchain/wallet-adapter-react';
import { Button, CircularProgress, TextField, Typography, Paper, Grid } from '@mui/material';
import axios from 'axios';
import { Upload } from '@mui/icons-material';

const WalletUpload = ({ apiEndpoint }) => {
  const { connect, wallet, connected } = useWallet();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!connected) {
      setError('Please connect your wallet.');
      return;
    }

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // Use FormData to send file data
      const formData = new FormData();
      formData.append('file', file);

      // Add wallet-related metadata or headers if needed
      const headers = {
        'Content-Type': 'multipart/form-data',
        // Add any authentication or additional headers here
      };

      await axios.post(apiEndpoint, formData, { headers });
      setSuccess('File uploaded successfully!');
    } catch (err) {
      setError('Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Wallet Upload
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            type="file"
            fullWidth
            variant="outlined"
            inputProps={{ accept: '*/*' }} // Accept all file types
            onChange={handleFileChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            startIcon={<Upload />}
            disabled={uploading}
            fullWidth
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Grid>
      </Grid>
      {uploading && <CircularProgress style={{ marginTop: '20px' }} />}
      {error && <Typography color="error" style={{ marginTop: '20px' }}>{error}</Typography>}
      {success && <Typography color="primary" style={{ marginTop: '20px' }}>{success}</Typography>}
    </Paper>
  );
};

export default WalletUpload;
