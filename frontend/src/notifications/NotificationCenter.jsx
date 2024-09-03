import React, { useEffect, useState } from 'react';
import notificationService from './NotificationService';
import './NotificationCenter.css'; // Import CSS file for styling

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Subscribe to notifications
    const handleNotifications = (newNotifications) => {
      setNotifications(newNotifications);
    };

    notificationService.subscribe(handleNotifications);

    // Clean up subscription on unmount
    return () => {
      notificationService.unsubscribe(handleNotifications);
    };
  }, []);

  const handleDismiss = (id) => {
    notificationService.removeNotification(id);
  };

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          <p>{notification.message}</p>
          <button onClick={() => handleDismiss(notification.id)}>Dismiss</button>
        </div>
      ))}
    </div>
  );
};

export default NotificationComponent;
