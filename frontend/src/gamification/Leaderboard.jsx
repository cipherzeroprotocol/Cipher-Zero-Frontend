import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Mock data for leaderboard (Replace with actual data source or API calls)
const mockLeaderboardData = [
  { rank: 1, name: 'Alice', score: 1500 },
  { rank: 2, name: 'Bob', score: 1200 },
  { rank: 3, name: 'Charlie', score: 1100 },
  { rank: 4, name: 'David', score: 1050 },
  { rank: 5, name: 'Eve', score: 1000 },
];

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // Fetch leaderboard data from API
    // fetch('/api/leaderboard').then(response => response.json()).then(data => setLeaderboardData(data));
    setLeaderboardData(mockLeaderboardData);
  }, []);

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map(user => (
            <tr key={user.rank}>
              <td>{user.rank}</td>
              <td>{user.name}</td>
              <td>{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .leaderboard {
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
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f4f4f4;
        }
        tr:hover {
          background-color: #f1f1f1;
        }
      `}</style>
    </div>
  );
};

Leaderboard.propTypes = {
  // You can define prop types here if necessary
};

export default Leaderboard;
