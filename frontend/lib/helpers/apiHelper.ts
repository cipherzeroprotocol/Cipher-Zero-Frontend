// apiHelper.ts

import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Add other API methods as needed

// zkSync API Helper Functions
const zkSyncAPIBase = 'https://api.zksync.io/api/v0.2';

interface ZkSyncTransaction {
  from: string;
  to: string;
  amount: number;
  fee: number;
  nonce: number;
  signature: string;
}

export const zkSyncAPI = {
  // Get zkSync account state
  async getAccountState(address: string) {
    try {
      const response = await axios.get(`${zkSyncAPIBase}/accounts/${address}/state`);
      return response.data;
    } catch (error) {
      console.error('Error fetching zkSync account state:', error);
      throw error;
    }
  },

  // Submit a transaction to zkSync
  async submitTransaction(transaction: ZkSyncTransaction) {
    try {
      const response = await axios.post(`${zkSyncAPIBase}/transactions`, transaction);
      return response.data;
    } catch (error) {
      console.error('Error submitting zkSync transaction:', error);
      throw error;
    }
  },

  // Get zkSync transaction status
  async getTransactionStatus(txHash: string) {
    try {
      const response = await axios.get(`${zkSyncAPIBase}/transactions/${txHash}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching zkSync transaction status:', error);
      throw error;
    }
  }
};

// Theta Network API Helper Functions
const thetaAPIBase = 'https://api.theta.tv/v1';

interface ThetaContent {
  content: string;
  title: string;
  description: string;
}

export const thetaAPI = {
  // Upload content to Theta Network
  async uploadContent(content: ThetaContent) {
    try {
      const response = await axios.post(`${thetaAPIBase}/content/upload`, content);
      return response.data;
    } catch (error) {
      console.error('Error uploading content to Theta Network:', error);
      throw error;
    }
  },

  // Get content from Theta Network by content ID
  async getContent(contentID: string) {
    try {
      const response = await axios.get(`${thetaAPIBase}/content/${contentID}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching content from Theta Network:', error);
      throw error;
    }
  },

  // Get status of content upload
  async getUploadStatus(uploadID: string) {
    try {
      const response = await axios.get(`${thetaAPIBase}/content/upload/${uploadID}/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upload status from Theta Network:', error);
      throw error;
    }
  }
};