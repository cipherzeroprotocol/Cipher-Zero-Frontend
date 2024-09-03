import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import {
  Button,
  CircularProgress,
  Typography,
  TextField,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import { Upload, Delete, CloudDownload } from '@mui/icons-material';

interface VideoTransferProps {
  apiEndpoint: string; // API endpoint for file operations
}

interface Video {
  id: string;
  name: string;
  url: string;
  size: number; // Size in bytes
}

const VideoTransfer: React.FC<VideoTransferProps> = ({ apiEndpoint }) => {
  const [file, setFile] = useState<File | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the list of videos on component mount
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/videos`);
        setVideos(response.data);
      } catch (err) {
        setError('Failed to fetch videos.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [apiEndpoint]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();

    if (!file) {
      setError('Please select a video file first.');
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
      setSuccess('Video uploaded successfully!');
      // Refresh the video list after successful upload
      const response = await axios.get(`${apiEndpoint}/videos`);
      setVideos(response.data);
    } catch (err) {
      setError('Failed to upload video.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    try {
      await axios.delete(`${apiEndpoint}/videos/${videoId}`);
      setVideos((prevVideos) => prevVideos.filter((video) => video.id !== videoId));
      setSuccess('Video deleted successfully!');
    } catch (err) {
      setError('Failed to delete video.');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Video Transfer
      </Typography>
      <form onSubmit={handleUpload}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              type="file"
              fullWidth
              variant="outlined"
              inputProps={{ accept: 'video/*' }} // Accept video files only
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
        {uploading && <CircularProgress style={{ marginTop: '20px' }} />}
        {error && <Typography color="error" style={{ marginTop: '20px' }}>{error}</Typography>}
        {success && <Typography color="primary" style={{ marginTop: '20px' }}>{success}</Typography>}
      </form>

      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
        Uploaded Videos
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {videos.map((video) => (
            <ListItem key={video.id} secondaryAction={
              <div>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(video.id)}>
                  <Delete />
                </IconButton>
                <IconButton edge="end" aria-label="download" href={video.url} download>
                  <CloudDownload />
                </IconButton>
              </div>
            }>
              <ListItemText primary={video.name} secondary={`Size: ${(video.size / (1024 * 1024)).toFixed(2)} MB`} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default VideoTransfer;
