import type { NextApiRequest, NextApiResponse } from 'next';
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
// Define interface for the configuration options
interface ThetaClientConfig {
  apiKey: string; // Assuming an API key is needed for authentication
  baseUrl: string; // Base URL for the Theta content delivery network
}

// Define interface for a generic content response
interface ContentResponse {
  success: boolean;
  data?: any; // Data type can be adjusted based on the expected response
  error?: string;
}

class ThetaContentDeliveryClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: ThetaClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }

  // Method to fetch content. The specifics will depend on the API's capabilities
  async fetchContent(contentId: string): Promise<ContentResponse> {
    const url = `${this.baseUrl}/content/${contentId}?apiKey=${this.apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch content");
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Additional methods can be added here, such as for authentication or posting content
}

export { ThetaContentDeliveryClient, ThetaClientConfig, ContentResponse };
// Import the ThetaContentDeliveryClient type


const contentClient = new ThetaContentDeliveryClient({
  apiKey: "<YOUR_API_KEY>",
  baseUrl: "<YOUR_BASE_URL>",
});

export default async function contentHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { contentId } = req.body;
    try {
      const content = await contentClient.fetchContent(contentId);
      res.status(200).json(content);
    } catch (error) {
      res.status(500).json({ error: 'Content retrieval failed', details: (error as Error).message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
