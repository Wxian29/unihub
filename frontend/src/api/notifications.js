import api from './index';

export const getNotifications = (params = {}) => {
  return api.get('/notifications/', { params });
};

export const markNotificationAsRead = (notificationId) => {
  return api.post(`/notifications/${notificationId}/read/`);
};

export const getUnreadCount = () => {
  return api.get('/notifications/', { params: { unread: 'true' } });
}; 