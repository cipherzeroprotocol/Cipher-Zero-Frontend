import { uploadFile, uploadDirectory, retrieveData } from './FileStorage';

// Function to upload a single file and return the key
export const uploadFileToEdgeStore = async (file: File, address: string): Promise<string> => {
  try {
    const key = await uploadFile(file, address);
    console.log('File uploaded successfully. Key:', key);
    return key;
  } catch (error) {
    console.error('Error uploading file to EdgeStore:', error);
    throw new Error('Failed to upload file to EdgeStore');
  }
};

// Function to upload multiple files (directory) and return the key
export const uploadDirectoryToEdgeStore = async (files: File[], address: string): Promise<string> => {
  try {
    const key = await uploadDirectory(files, address);
    console.log('Directory uploaded successfully. Key:', key);
    return key;
  } catch (error) {
    console.error('Error uploading directory to EdgeStore:', error);
    throw new Error('Failed to upload directory to EdgeStore');
  }
};

// Function to retrieve data from EdgeStore using a key
export const getDataFromEdgeStore = async (key: string): Promise<Blob> => {
  try {
    const data = await retrieveData(key);
    console.log('Data retrieved successfully.');
    return data;
  } catch (error) {
    console.error('Error retrieving data from EdgeStore:', error);
    throw new Error('Failed to retrieve data from EdgeStore');
  }
};
