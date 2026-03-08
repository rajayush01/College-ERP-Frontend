import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useNotifications } from '@/hooks/useNotifications';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { formatDate } from '@/utils/formatters';
import { Bell } from 'lucide-react';

export const StudentNotifications: React.FC = () => {
  const { notifications, loading, markAsRead } = useNotifications();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-secondary-900">Notifications</h1>

      {notifications.length === 0 ? (
        <Card className="shadow-xl border-2 border-secondary-300">
          <div className="text-center py-8 text-secondary-600">
            <Bell size={48} className="mx-auto mb-4 text-secondary-400" />
            <p className="font-semibold">No notifications</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification._id}
              className={`shadow-xl border-2 border-secondary-300 hover:shadow-2xl transition-all duration-300 ${!notification.isRead ? 'border-l-4 border-l-primary-600 bg-primary-50/30' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-secondary-900">
                    {notification.notification.title}
                  </h3>
                  <p className="text-secondary-700 font-medium mt-2">{notification.notification.message}</p>
                  <p className="text-sm text-secondary-600 font-medium mt-2">
                    {formatDate(notification.createdAt, 'PPp')}
                  </p>
                </div>
                {!notification.isRead && (
                  <Button
                    variant="secondary"
                    onClick={() => markAsRead(notification._id)}
                    className="ml-4"
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};