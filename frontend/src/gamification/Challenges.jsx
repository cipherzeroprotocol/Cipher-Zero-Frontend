import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Mock data for challenges (Replace with actual data source or API calls)
const mockChallenges = [
  { id: 1, name: 'Complete 10 Tasks', description: 'Complete 10 tasks to earn a reward.', progress: 5, status: 'In Progress' },
  { id: 2, name: 'Achieve 100 Points', description: 'Reach 100 points to claim a badge.', progress: 85, status: 'Almost There' },
  { id: 3, name: 'Login for 7 Consecutive Days', description: 'Log in every day for a week.', progress: 3, status: 'In Progress' },
  { id: 4, name: 'Invite 5 Friends', description: 'Invite 5 friends to join the platform.', progress: 2, status: 'Started' },
];

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    // In a real application, fetch challenges from an API
    // fetch('/api/challenges').then(response => response.json()).then(data => setChallenges(data));
    setChallenges(mockChallenges);
  }, []);

  return (
    <div className="challenges">
      <h2>Challenges</h2>
      <div className="challenge-list">
        {challenges.map(challenge => (
          <div key={challenge.id} className="challenge-item">
            <h3>{challenge.name}</h3>
            <p>{challenge.description}</p>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${(challenge.progress / 10)}%` }}
              />
            </div>
            <p>Status: {challenge.status}</p>
          </div>
        ))}
      </div>
      <style jsx>{`
        .challenges {
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          margin: auto;
        }
        h2 {
          margin-top: 0;
        }
        .challenge-list {
          display: flex;
          flex-direction: column;
        }
        .challenge-item {
          background: #fff;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .progress-bar {
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          height: 20px;
          margin: 10px 0;
        }
        .progress {
          background: #4caf50;
          height: 100%;
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  );
};

Challenges.propTypes = {
  // You can define prop types here if necessary
};

export default Challenges;
