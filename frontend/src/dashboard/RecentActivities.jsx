import React from 'react';
import './RecentActivities.css'; // Import CSS for styling

const activities = [
  { id: 1, activity: 'Logged in' },
  { id: 2, activity: 'Updated profile' },
  { id: 3, activity: 'Posted a new update' },
];

const RecentActivities = () => {
  return (
    <div className="recent-activities">
      <h2>Recent Activities</h2>
      <ul>
        {activities.map(activity => (
          <li key={activity.id}>{activity.activity}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;
