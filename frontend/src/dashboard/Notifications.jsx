import React from 'react';
import './Notifications.css'; // Import CSS for styling

const notifications = [
  { id: 1, message: 'New user signed up!' },
  { id: 2, message: 'Server maintenance scheduled for tonight.' },
  { id: 3, message: 'New comment on your post.' },
];

const Notifications = () => {
  return (
    <div className="notifications">
      <h2>Notifications</h2>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
