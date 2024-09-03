import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Typography, TextField, Grid, Paper } from '@mui/material';
import { Upload, CloudUpload } from '@mui/icons-material';

// Define types for the photo transfer props and state
interface PhotoTransferProps {
  apiEndpoint: string; // API endpoint for photo upload
}

const PhotoTransfer: React.FC<PhotoTransferProps> = ({ apiEndpoint }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setError(null); // Clear any previous errors
    }
  };

  // Handle file upload
  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();

    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      });

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
        Photo Transfer
      </Typography>
      <form onSubmit={handleUpload}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              type="file"
              fullWidth
              variant="outlined"
              inputProps={{ accept: 'image/*' }}
              onChange={handleFileChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              startIcon={<CloudUpload />}
              disabled={uploading}
              fullWidth
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </Grid>
        </Grid>
        {uploading && <CircularProgress variant="determinate" value={progress} style={{ marginTop: '20px' }} />}
        {error && <Typography color="error" style={{ marginTop: '20px' }}>{error}</Typography>}
        {success && <Typography color="primary" style={{ marginTop: '20px' }}>{success}</Typography>}
      </form>
    </Paper>
  );
};

export default PhotoTransfer;
