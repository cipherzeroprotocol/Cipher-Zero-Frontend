import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Typography, TextField, Grid, Paper, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Upload, Delete, CloudDownload } from '@mui/icons-material';

interface StorageProps {
  apiEndpoint: string; // API endpoint for file operations
}

const Storage: React.FC<StorageProps> = ({ apiEndpoint }) => {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<string[]>([]); // Store list of file URLs or names
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the list of files on component mount
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/files`);
        setFiles(response.data);
      } catch (err) {
        setError('Failed to fetch files.');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [apiEndpoint]);

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
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${apiEndpoint}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('File uploaded successfully!');
      // Refresh the file list after successful upload
      const response = await axios.get(`${apiEndpoint}/files`);
      setFiles(response.data);
    } catch (err) {
      setError('Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  // Handle file deletion
  const handleDelete = async (fileName: string) => {
    try {
      await axios.delete(`${apiEndpoint}/files/${fileName}`);
      setFiles((prevFiles) => prevFiles.filter((file) => file !== fileName));
      setSuccess('File deleted successfully!');
    } catch (err) {
      setError('Failed to delete file.');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom>
        File Storage
      </Typography>
      <form onSubmit={handleUpload}>
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
              type="submit"
              startIcon={<Upload />}
              disabled={uploading}
              fullWidth
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </Grid>
        </Grid>
        {uploading && <CircularProgress variant="determinate" value={0} style={{ marginTop: '20px' }} />}
        {error && <Typography color="error" style={{ marginTop: '20px' }}>{error}</Typography>}
        {success && <Typography color="primary" style={{ marginTop: '20px' }}>{success}</Typography>}
      </form>

      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
        Uploaded Files
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {files.map((fileName) => (
            <ListItem key={fileName} secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(fileName)}>
                <Delete />
              </IconButton>
            }>
              <ListItemText primary={fileName} />
              <IconButton edge="end" aria-label="download" href={`${apiEndpoint}/files/${fileName}`} download>
                <CloudDownload />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default Storage;
