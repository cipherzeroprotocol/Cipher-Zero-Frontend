import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useAlert } from 'react-alert';

const Storage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const alert = useAlert();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('/api/files'); // Fetch the list of files
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
        alert.error('Failed to load files.');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/files/${id}`); // Send delete request
      setFiles(files.filter(file => file.id !== id));
      alert.success('File deleted successfully.');
    } catch (error) {
      console.error('Error deleting file:', error);
      alert.error('Failed to delete file.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>Storage - BitThetaSecure</title>
        <meta name="description" content="Manage your stored files." />
      </Head>

      <div className="storage-container">
        <h1>My Storage</h1>
        {files.length > 0 ? (
          <ul>
            {files.map(file => (
              <li key={file.id} className="file-item">
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.name}
                </a>
                <button onClick={() => handleDelete(file.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No files found.</p>
        )}

        <style jsx>{`
          .storage-container {
            width: 80%;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
          }
          h1 {
            font-size: 2rem;
            color: #0070f3;
          }
          ul {
            list-style: none;
            padding: 0;
          }
          .file-item {
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .file-item a {
            color: #0070f3;
            text-decoration: none;
            font-size: 1rem;
          }
          .file-item a:hover {
            text-decoration: underline;
          }
          button {
            background-color: #ff4d4d;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
          }
          button:hover {
            background-color: #cc0000;
          }
        `}</style>
      </div>
    </>
  );
};

export default Storage;
