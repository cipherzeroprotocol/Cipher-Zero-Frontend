import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'; // Ensure axios is installed for API requests
import './StakingReward.css'; // Optional: for custom styling

const StakingReward = ({ userId }) => {
  const [stakingRewards, setStakingRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReward, setSelectedReward] = useState(null);

  useEffect(() => {
    const fetchStakingRewards = async () => {
      try {
        const response = await axios.get(`/api/stakingRewards?userId=${userId}`);
        setStakingRewards(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStakingRewards();
  }, [userId]);

  const handleClaimReward = async (rewardId) => {
    try {
      const response = await axios.post(`/api/claimStakingReward`, { rewardId, userId });
      // Update staking rewards state after claiming
      setStakingRewards(prevRewards =>
        prevRewards.map(reward =>
          reward.id === rewardId ? { ...reward, claimed: true } : reward
        )
      );
      alert('Reward claimed successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewDetails = (reward) => {
    setSelectedReward(reward);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="staking-reward">
      <h1>Your Staking Rewards</h1>
      <div className="rewards-list">
        {stakingRewards.length > 0 ? (
          stakingRewards.map(reward => (
            <div key={reward.id} className="reward-item">
              <h2>{reward.title}</h2>
              <p>{reward.description}</p>
              <p><strong>Amount:</strong> {reward.amount}</p>
              {!reward.claimed ? (
                <>
                  <button onClick={() => handleClaimReward(reward.id)}>Claim Reward</button>
                  <button onClick={() => handleViewDetails(reward)}>View Details</button>
                </>
              ) : (
                <span>Claimed</span>
              )}
            </div>
          ))
        ) : (
          <p>No staking rewards available.</p>
        )}
      </div>
      {selectedReward && (
        <div className="reward-details">
          <h2>Reward Details</h2>
          <p><strong>Title:</strong> {selectedReward.title}</p>
          <p><strong>Description:</strong> {selectedReward.description}</p>
          <p><strong>Amount:</strong> {selectedReward.amount}</p>
          <p><strong>Date:</strong> {new Date(selectedReward.date).toLocaleDateString()}</p>
          <button onClick={() => setSelectedReward(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

StakingReward.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default StakingReward;
