import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

// Create a context for notifications
const NotificationsContext = createContext();

// Custom hook to use notifications
export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('retroverse_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [toast, setToast] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);

  // Show toast notification
  const showToast = useCallback((notification) => {
    setToast(notification);
    setToastVisible(true);
    
    // Hide toast after 5 seconds
    setTimeout(() => {
      setToastVisible(false);
    }, 5000);
  }, []);
  
  // Add a new notification wrapped in useCallback
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
    
    // Show notification toast
    if (newNotification.showToast !== false) {
      showToast(newNotification);
    }
    
    return newNotification.id;
  }, [showToast]);

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Remove a notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Update unread count when notifications change
  useEffect(() => {
    const unread = notifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
    
    // Save to localStorage
    localStorage.setItem('retroverse_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Notification Toast Component
  const NotificationToast = () => {
    if (!toast) return null;
    
    // Define icon based on notification type
    const getIcon = () => {
      switch (toast.type) {
        case 'achievement': return '🏆';
        case 'challenge': return '🎯';
        case 'level_up': return '⬆️';
        case 'game': return '🎮';
        case 'system': return '⚙️';
        default: return '📢';
      }
    };
    
    // Define colors based on notification type
    const getColors = () => {
      switch (toast.type) {
        case 'achievement': return { bg: '#FF00FF', text: 'white' };
        case 'challenge': return { bg: '#FFFF00', text: 'black' };
        case 'level_up': return { bg: '#00FF00', text: 'black' };
        case 'game': return { bg: '#00FFFF', text: 'black' };
        case 'system': return { bg: '#FF0000', text: 'white' };
        default: return { bg: '#0000FF', text: 'white' };
      }
    };
    
    const colors = getColors();
    
    return (
      <div className={`fixed top-20 right-4 z-50 transition-all duration-500 ${toastVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <div 
          className="p-4 rounded-lg shadow-xl max-w-sm flex items-start"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          <div className="text-2xl mr-3">{getIcon()}</div>
          <div className="flex-1">
            <div className="font-bold">{toast.title}</div>
            <div className="text-sm opacity-90">{toast.message}</div>
          </div>
          <button 
            onClick={() => setToastVisible(false)}
            className="ml-2 opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };
  
  // Notification Panel Component
  const NotificationPanel = () => {
    if (!showNotificationPanel) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Click away area */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50" 
          onClick={() => setShowNotificationPanel(false)}
        ></div>
        
        {/* Notification panel */}
        <div className="relative bg-gray-900 w-full max-w-md h-full overflow-y-auto border-l-4 border-[#00FFFF]">
          <div className="p-4 bg-black sticky top-0 z-10 flex justify-between items-center border-b border-gray-800">
            <h2 className="text-[#00FFFF] text-xl font-bold">NOTIFICATIONS</h2>
            <div className="flex space-x-2">
              {notifications.length > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Mark All Read
                </button>
              )}
              <button 
                onClick={() => setShowNotificationPanel(false)}
                className="text-white hover:text-[#FF00FF]"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="p-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No notifications yet
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map(notification => {
                  // Format relative time
                  const formatTime = () => {
                    const now = new Date();
                    const notifTime = new Date(notification.timestamp);
                    const diffMinutes = Math.floor((now - notifTime) / (1000 * 60));
                    
                    if (diffMinutes < 1) return 'just now';
                    if (diffMinutes < 60) return `${diffMinutes}m ago`;
                    
                    const diffHours = Math.floor(diffMinutes / 60);
                    if (diffHours < 24) return `${diffHours}h ago`;
                    
                    const diffDays = Math.floor(diffHours / 24);
                    if (diffDays === 1) return 'yesterday';
                    return `${diffDays}d ago`;
                  };
                  
                  // Get icon and color based on notification type
                  const getIcon = () => {
                    switch (notification.type) {
                      case 'achievement': return '🏆';
                      case 'challenge': return '🎯';
                      case 'level_up': return '⬆️';
                      case 'game': return '🎮';
                      case 'system': return '⚙️';
                      default: return '📢';
                    }
                  };
                  
                  const getColor = () => {
                    switch (notification.type) {
                      case 'achievement': return '#FF00FF';
                      case 'challenge': return '#FFFF00';
                      case 'level_up': return '#00FF00';
                      case 'game': return '#00FFFF';
                      case 'system': return '#FF0000';
                      default: return '#FFFFFF';
                    }
                  };
                  
                  return (
                    <div 
                      key={notification.id} 
                      className={`border p-3 rounded ${notification.read ? 'border-gray-800 bg-gray-900' : 'border-gray-700 bg-black'}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center mr-3 text-xl"
                          style={{ backgroundColor: notification.read ? '#333' : getColor() }}
                        >
                          {getIcon()}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className={`font-bold ${notification.read ? 'text-gray-400' : 'text-white'}`}>
                              {notification.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime()}
                            </div>
                          </div>
                          <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-300'}`}>
                            {notification.message}
                          </p>
                          
                          {notification.action && (
                            <button 
                              className="mt-2 text-xs text-[#00FFFF] hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                notification.action.onClick();
                                markAsRead(notification.id);
                              }}
                            >
                              {notification.action.label}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Notification Bell Component
  const NotificationBell = () => {
    return (
      <button 
        className="relative p-2 text-white hover:text-[#00FFFF] transition-colors"
        onClick={() => setShowNotificationPanel(true)}
        aria-label="Open notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-[#FF00FF] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>
    );
  };
  
  // Test notifications on first load
  useEffect(() => {
    if (notifications.length === 0) {
      // Add some sample notifications for demo
      addNotification({
        type: 'system',
        title: 'Welcome to RetroVerse',
        message: 'Explore the retro gaming universe and earn achievements!',
        showToast: false
      });
      
      addNotification({
        type: 'challenge',
        title: 'Daily Challenges Available',
        message: 'New challenges are ready for you to tackle today.',
        showToast: false,
        action: {
          label: 'VIEW CHALLENGES',
          onClick: () => window.scrollTo({ top: document.getElementById('daily-challenges')?.offsetTop - 100, behavior: 'smooth' })
        }
      });
    }
  }, [addNotification, notifications.length]);
  
  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        NotificationBell,
        NotificationPanel,
        NotificationToast
      }}
    >
      {children}
      <NotificationPanel />
      <NotificationToast />
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;