import { ethers } from 'ethers';
import IdentityManagement from '../contracts/IdentityManagement.json';

const ContractUtils = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractAddress = 'YOUR_CONTRACT_ADDRESS';

  const getContract = () => {
    return new ethers.Contract(contractAddress, IdentityManagement.abi, signer);
  };

  return { getContract };
};

export default ContractUtils;
