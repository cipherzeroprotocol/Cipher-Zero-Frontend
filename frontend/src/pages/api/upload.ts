
import fs from 'fs-extra';
import { NextApiRequest, NextApiResponse } from 'next';
const thetajs = require("@thetalabs/theta-js");

require('isomorphic-fetch');
const BigNumber = require('bignumber.js');
const { toBN } = require('web3-utils');
const Wallet = thetajs.Wallet;
const {HttpProvider} = thetajs.providers;
const Contract = thetajs.Contract;
const ContractFactory = thetajs.ContractFactory;
const {ChainIds} = thetajs.networks;

const AddressAdmin = "<ADMIN_WALLET_ADDRESS>";
const AddressUser1 = "<USER1_WALLET_ADDRESS>";
const AddressUser2 = "<USER2_WALLET_ADDRESS>";
const PrivateKeyAdmin = "<ADMIN_PRIVATE_KEY>";
const PrivateKeyUser1 = "<USER1_PRIVATE_KEY>";
const PrivateKeyUser2 = "<USER2_PRIVATE_KEY>";

var provider = new HttpProvider(ChainIds.Privatenet);
var walletAdmin = new Wallet(PrivateKeyAdmin, provider);
var walletUser1 = new Wallet(PrivateKeyUser1, provider);
var walletUser2 = new Wallet(PrivateKeyUser2, provider);
class ThetastorageClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://api.thetastorage.example.com') {
    this.baseUrl = baseUrl;
  }

  // Method to upload a file
  async uploadFile(filePath: string, fileContent: Blob | Buffer): Promise<string> {
    const url = `${this.baseUrl}/upload`;

    // Assuming the API expects a multipart/form-data request
    const formData = new FormData();
    const blob = new Blob([fileContent]);
    formData.append('file', blob, filePath);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      return data.fileUrl; // Assuming the response contains the URL of the uploaded file
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  // Method to retrieve a file
  async getFile(fileUrl: string): Promise<Blob> {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('Failed to retrieve file');
      }
      return response.blob();
    } catch (error) {
      console.error('Retrieval failed:', error);
      throw error;
    }
  }

  // Additional methods for other functionalities like listing files can be added here
}

export { ThetastorageClient };
const storageClient = new ThetastorageClient();

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing for file uploads
  },
};

export default async function upload(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new (require('formidable').IncomingForm)();
    form.keepExtensions = true;
    form.maxFileSize = 10 * 1024 * 1024; // Set max file size to 10 MB

    form.parse(req, async (err: { message: any; }, _fields: any, files: { file: any[]; }) => {
      if (err) {
        res.status(500).json({ error: 'Upload failed', details: err.message });
        return;
      }

      const file = files.file[0];
      const filePath = file.filepath;

      try {
        // Upload file to Theta Storage
        const result = await storageClient.uploadFile(filePath, file);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: 'Storage upload failed', details: (error as any).message });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
