import { useState, useEffect } from 'react';
import { Notification } from '@/types/common.types';
import { useAuth } from './useAuth';
import * as studentApi from '@/api/student.api';
import * as teacherApi from '@/api/teacher.api';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let response;
      if (user.role === 'STUDENT') {
        response = await studentApi.pollMyNotifications();
      } else if (user.role === 'TEACHER') {
        response = await teacherApi.pollMyNotifications();
      }
      
      if (response) {
        setNotifications(response.data);
        const unread = response.data.filter((n: Notification) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (statusId: string) => {
    try {
      if (user?.role === 'STUDENT') {
        await studentApi.markNotificationAsRead(statusId);
      } else if (user?.role === 'TEACHER') {
        await teacherApi.markNotificationAsRead(statusId);
      }
      await fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [user?.id, user?.role]); // eslint-disable-line react-hooks/exhaustive-deps

  return { notifications, unreadCount, loading, fetchNotifications, markAsRead };
};