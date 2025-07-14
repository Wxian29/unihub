import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead, clearError } from '../features/notification/notificationSlice';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notification);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, isAuthenticated]);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId));
  };

  const getNotificationIcon = (type) => {
    const icons = {
      system: '🔔',
      community: '👥',
      event: '📅',
      other: '📢',
    };
    return icons[type] || '📢';
  };

  const getNotificationTypeText = (type) => {
    const types = {
      system: 'System',
      community: 'Community',
      event: 'Event',
      other: 'Other',
    };
    return types[type] || 'Other';
  };

  if (!isAuthenticated) {
    return (
      <div className="notifications-page">
        <div className="container">
          <div className="auth-required">
            <h1>Notify</h1>
            <p>Please log in to view notifications</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="container">
        <div className="page-header">
          <h1>Notify</h1>
        </div>

        {error && (
          <div className="error-message" onClick={() => dispatch(clearError())}>
            {error}
          </div>
        )}

        {loading && <div className="loading">Loading...</div>}

        {!loading && notifications.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No notifications</p>
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-header">
                    <span className="notification-type">
                      {getNotificationTypeText(notification.type)}
                    </span>
                    <span className="notification-time">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="notification-text">{notification.content}</div>
                </div>
                {!notification.is_read && (
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage; 