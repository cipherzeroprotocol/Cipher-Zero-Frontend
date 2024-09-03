import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'; 
import './RewardSystem.css'; // Optional: for custom styling

const RewardSystem = ({ userId }) => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get(`/api/rewards?userId=${userId}`);
        setRewards(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [userId]);

  const handleClaimReward = async (rewardId) => {
    try {
      const response = await axios.post(`/api/claimReward`, { rewardId, userId });
      // Update rewards state after claiming
      setRewards(prevRewards =>
        prevRewards.map(reward =>
          reward.id === rewardId ? { ...reward, claimed: true } : reward
        )
      );
      alert('Reward claimed successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="reward-system">
      <h1>Your Rewards</h1>
      <div className="rewards-list">
        {rewards.length > 0 ? (
          rewards.map(reward => (
            <div key={reward.id} className="reward-item">
              <h2>{reward.title}</h2>
              <p>{reward.description}</p>
              {!reward.claimed ? (
                <button onClick={() => handleClaimReward(reward.id)}>Claim Reward</button>
              ) : (
                <span>Claimed</span>
              )}
            </div>
          ))
        ) : (
          <p>No rewards available.</p>
        )}
      </div>
    </div>
  );
};

RewardSystem.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default RewardSystem;
