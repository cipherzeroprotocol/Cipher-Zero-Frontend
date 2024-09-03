// NotificationService.js

class NotificationService {
    notifications: { id: string; message: any; type: string; }[];
    subscribers: ((notifications: { id: string; message: any; type: string; }[]) => void)[];
    constructor() {
      this.notifications = [];
      this.subscribers = [];
    }
  
    // Subscribe to notifications
    subscribe(callback: (notifications: { id: string; message: any; type: string; }[]) => void) {
      this.subscribers.push(callback);
    }
  
    // Unsubscribe from notifications
    unsubscribe(callback: (notifications: { id: string; message: any; type: string; }[]) => void) {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }
  
    // Notify all subscribers
    notify() {
      this.subscribers.forEach(callback => callback(this.notifications));
    }
  
    // Add a notification
    addNotification(message: any, type = 'info') {
      const notification = {
        id: Date.now().toString(),
        message,
        type,
      };
      this.notifications.push(notification);
      this.notify();
    }
  
    // Remove a notification by id
    removeNotification(id: string) {
      this.notifications = this.notifications.filter(notification => notification.id !== id);
      this.notify();
    }
  
    // Get all notifications
    getNotifications() {
      return this.notifications;
    }
  }
  
  const notificationService = new NotificationService();
  export default notificationService;
  