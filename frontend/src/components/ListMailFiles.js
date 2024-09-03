import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Button, List, ListItem, ListItemText, CircularProgress, Typography } from '@mui/material'; // Using Material-UI for UI components

// Utility function to handle file actions (e.g., view, delete)
const handleFileAction = async (action, fileId) => {
  try {
    if (action === 'view') {
      // Implement view logic (e.g., open file in a new tab)
      window.open(`/view-file/${fileId}`, '_blank');
    } else if (action === 'delete') {
      // Implement delete logic
      await axios.delete(`/api/files/${fileId}`);
      alert('File deleted successfully');
    }
  } catch (error) {
    console.error(`Error performing ${action} on file with ID ${fileId}:`, error);
    alert(`Failed to ${action} the file`);
  }
};

const ListMailFiles = ({ apiEndpoint }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the list of mail files from the API
    const fetchFiles = async () => {
      try {
        const response = await axios.get(apiEndpoint);
        setFiles(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [apiEndpoint]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <div>
      <Typography variant="h6">Mail Files</Typography>
      {files.length === 0 ? (
        <Typography>No files available</Typography>
      ) : (
        <List>
          {files.map((file) => (
            <ListItem key={file.id}>
              <ListItemText primary={file.name} secondary={`Size: ${file.size} MB`} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleFileAction('view', file.id)}
                style={{ marginRight: '10px' }}
              >
                View
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleFileAction('delete', file.id)}
              >
                Delete
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

// Prop types for validation
ListMailFiles.propTypes = {
  apiEndpoint: PropTypes.string.isRequired,
};

export default ListMailFiles;
