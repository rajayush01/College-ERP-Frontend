import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useNotifications } from '@/hooks/useNotifications';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { formatDate } from '@/utils/formatters';
import { Bell } from 'lucide-react';

export const TeacherNotifications: React.FC = () => {
  const { notifications, loading, markAsRead } = useNotifications();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-secondary-50 via-primary-50 to-accent-50 min-h-screen">
      <div className="animate-slide-up">
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">Notifications</h1>
        <p className="text-secondary-700 font-semibold">Stay updated with important messages</p>
      </div>
      {notifications.length === 0 ? (
        <Card className="animate-slide-up shadow-xl border-2 border-secondary-300">
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto mb-4 text-secondary-400" />
            <p className="text-secondary-600 font-semibold">No notifications</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((n, idx) => (
            <Card key={n._id} className={`animate-slide-up shadow-xl border-2 hover:shadow-2xl transition-all duration-300 ${!n.isRead ? 'border-l-4 border-l-primary-600 bg-primary-50/30' : 'border-secondary-300'}`} style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-secondary-900">{n.notification.title}</h3>
                  <p className="text-secondary-700 font-medium mt-2">{n.notification.message}</p>
                  <p className="text-sm text-secondary-600 font-medium mt-2">{formatDate(n.createdAt, 'PPp')}</p>
                </div>
                {!n.isRead && <Button variant="secondary" onClick={() => markAsRead(n._id)} className="ml-4">Mark as Read</Button>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};