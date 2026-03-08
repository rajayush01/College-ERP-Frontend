import axios from './axios';

// Shared Documents
export const getSharedDocuments = () =>
  axios.get('/documents');

// Common Notifications
export const pollNotifications = () =>
  axios.get('/common/notifications');

export const markAsRead = (notificationStatusId: string) =>
  axios.patch(`/common/notifications/${notificationStatusId}/read`);