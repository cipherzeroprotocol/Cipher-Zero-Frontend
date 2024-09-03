import message from 'antd/es/message';
import type { NextApiRequest, NextApiResponse } from 'next';
//import { ThetaWallet } from 'theta-wallet-sdk'; // Hypothetical SDK
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

export default async function authenticate(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { address } = req.body;
      await Wallet.connect(address);
      res.status(200).json({ message: 'Authenticated successfully', address });
    } catch (error) {
      res.status(500).json({ error: 'Authentication failed', details: message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
