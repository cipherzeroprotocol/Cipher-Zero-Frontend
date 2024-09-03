import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const rewardsContractAddress = '0xYourRewardsContractAddress';
const rewardsABI = [/* ABI array here */];

const rewardsContract = new web3.eth.Contract(rewardsABI, rewardsContractAddress);

export const getRewardBalance = async (address) => {
    try {
        const balance = await rewardsContract.methods.getBalance(address).call();
        console.log('Reward balance:', balance);
        return balance;
    } catch (error) {
        console.error('Error getting reward balance:', error);
        throw error;
    }
};

export const claimReward = async (fromAddress) => {
    try {
        const receipt = await rewardsContract.methods.claimReward().send({ from: fromAddress });
        console.log('Reward claimed:', receipt);
        return receipt;
    } catch (error) {
        console.error('Error claiming reward:', error);
        throw error;
    }
};
