import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const votingContractAddress = '0xYourVotingContractAddress';
const votingABI = [/* ABI array here */];

const votingContract = new web3.eth.Contract(votingABI, votingContractAddress);

export const startVote = async (fromAddress, issue) => {
    try {
        const receipt = await votingContract.methods.startVote(issue).send({ from: fromAddress });
        console.log('Vote started:', receipt);
        return receipt;
    } catch (error) {
        console.error('Error starting vote:', error);
        throw error;
    }
};

export const castVote = async (fromAddress, voteId, vote) => {
    try {
        const receipt = await votingContract.methods.castVote(voteId, vote).send({ from: fromAddress });
        console.log('Vote casted:', receipt);
        return receipt;
    } catch (error) {
        console.error('Error casting vote:', error);
        throw error;
    }
};

export const getVoteResults = async (voteId) => {
    try {
        const results = await votingContract.methods.getVoteResults(voteId).call();
        console.log('Vote results:', results);
        return results;
    } catch (error) {
        console.error('Error getting vote results:', error);
        throw error;
    }
};