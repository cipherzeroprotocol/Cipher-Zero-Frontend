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
const ThetaSmartContract = thetajs.ThetaSmartContract; // Add this line

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

const contract = new ThetaSmartContract('your_contract_address');

export default async function contractHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { functionName, params } = req.body;
    try {
      const result = await contract.callFunction(functionName, params);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Contract call failed', details: (error as any).message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
