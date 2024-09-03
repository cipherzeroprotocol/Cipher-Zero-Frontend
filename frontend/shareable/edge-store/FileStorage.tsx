
// Function to generate authentication token
const generateAuthToken = async (address: string): Promise<string> => {
  if (!(window as any).ethereum) {
    throw new Error('Theta Wallet is not installed');
  }

  const timestamp = Date.now().toString();
  const message = `Theta EdgeStore Call ${timestamp}`;

  const signature = await (window as any).ethereum.request({
    method: 'personal_sign',
    params: [message, address],
  });

  return `${timestamp}.${address}.${signature}`;
};

// Function to upload a file to Theta EdgeStore
export const uploadFile = async (file: File, address: string): Promise<string> => {
  const authToken = await generateAuthToken(address);

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://api.thetaedgestore.com/api/v2/data', {
    method: 'POST',
    headers: {
      'x-theta-edgestore-auth': authToken,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('File upload failed');
  }

  const result = await response.json();
  return result.key;
};

// Function to upload multiple files (directory) to Theta EdgeStore
export const uploadDirectory = async (files: File[], address: string): Promise<string> => {
  const authToken = await generateAuthToken(address);

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('directory', file, file.name);
  });

  const response = await fetch('https://api.thetaedgestore.com/api/v2/data', {
    method: 'POST',
    headers: {
      'x-theta-edgestore-auth': authToken,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Directory upload failed');
  }

  const result = await response.json();
  return result.key;
};

// Function to retrieve data from Theta EdgeStore
export const retrieveData = async (key: string): Promise<Blob> => {
  const response = await fetch(`https://data.thetaedgestore.com/api/v2/data/${key}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Data retrieval failed');
  }

  return response.blob();
};
