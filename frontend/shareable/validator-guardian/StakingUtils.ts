import axios from 'axios';

export const getStakingStatus = async (address: string): Promise<string> => {
  try {
    // Replace with actual API endpoint or logic to get staking status
    const response = await axios.get(`/api/staking/status/${address}`);
    return response.data.status;
  } catch (error) {
    console.error('Error fetching staking status:', error);
    return 'Error fetching staking status';
  }
};

export const stakeTokens = async (amount: number, address: string): Promise<string> => {
  try {
    // Replace with actual API endpoint or logic to stake tokens
    return `Successfully staked ${amount} tokens to address: ${address}`;
  } catch (error) {
    console.error('Error staking tokens:', error);
    return 'Error staking tokens';
  }
};
