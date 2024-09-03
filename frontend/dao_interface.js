import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const daoContractAddress = '0xYourDAOContractAddress';
const daoABI = [/* ABI array here */];

const daoContract = new web3.eth.Contract(daoABI, daoContractAddress);

export const createProposal = async (fromAddress, description) => {
    try {
        const receipt = await daoContract.methods.createProposal(description).send({ from: fromAddress });
        console.log('Proposal created:', receipt);
        return receipt;
    } catch (error) {
        console.error('Error creating proposal:', error);
        throw error;
    }
};

export const voteOnProposal = async (fromAddress, proposalId, vote) => {
    try {
        const receipt = await daoContract.methods.vote(proposalId, vote).send({ from: fromAddress });
        console.log('Voted on proposal:', receipt);
        return receipt;
    } catch (error) {
        console.error('Error voting on proposal:', error);
        throw error;
    }
};

export const getProposalStatus = async (proposalId) => {
    try {
        const status = await daoContract.methods.getProposalStatus(proposalId).call();
        console.log('Proposal status:', status);
        return status;
    } catch (error) {
        console.error('Error getting proposal status:', error);
        throw error;
    }
};
