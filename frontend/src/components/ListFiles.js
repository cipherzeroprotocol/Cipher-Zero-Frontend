import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'; // Assuming you use axios for API requests

// Utility function to handle file actions (e.g., view, delete)
const handleFileAction = (action, fileId) => {
  // Implement action logic here, e.g., API calls
  console.log(`Performing ${action} on file with ID: ${fileId}`);
};

const ListFiles = ({ apiEndpoint }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the list of files from the API
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>File List</h2>
      {files.length === 0 ? (
        <p>No files available</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file.id}>
              <span>{file.name}</span>
              <button onClick={() => handleFileAction('view', file.id)}>View</button>
              <button onClick={() => handleFileAction('delete', file.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Prop types for validation
ListFiles.propTypes = {
  apiEndpoint: PropTypes.string.isRequired,
};

export default ListFiles;
