import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import * as adminApi from '@/api/admin.api';
import { Send, Bell, Users } from 'lucide-react';
import { NOTIFICATION_TARGETS } from '@/utils/constants';

export const NotificationSender: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetType: 'ALL_STUDENTS',
    batchId: '',
    department: '',
  });

  const needsBatchId =
    formData.targetType === 'BATCH';

  const needsDepartment = formData.targetType === 'DEPARTMENT';

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      targetType: 'ALL_STUDENTS',
      batchId: '',
      department: '',
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.message) {
      return alert('Title and message are required');
    }

    setLoading(true);

    try {
      // 🔥 Clean payload (important)
      const payload: any = {
        title: formData.title,
        message: formData.message,
        targetType: formData.targetType,
      };

      if (needsBatchId) payload.batchId = formData.batchId;
      if (needsDepartment) payload.department = formData.department;

      await adminApi.sendNotification(payload);

      alert('Notification sent successfully 🚀');
      resetForm();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-secondary-50 via-primary-50 to-accent-50 min-h-screen">
      {/* HEADER */}
      <div className="animate-slide-up">
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">
          Send Notification
        </h1>
        <p className="text-secondary-700 font-semibold">
          Broadcast important messages to students and staff
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* FORM */}
        <div className="lg:col-span-2">
          <Card className="animate-slide-up shadow-xl border-2 border-secondary-300 border-l-4 border-l-primary-600">
            <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border-2 border-primary-300">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-lg shadow-lg border-2 border-primary-600">
                  <Bell size={24} className="text-primary-700" />
                </div>
                <div>
                  <h3 className="font-bold text-secondary-900">
                    Notification Composer
                  </h3>
                  <p className="text-sm text-secondary-700 font-semibold">
                    Create and send instant notifications
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSend} className="space-y-6">
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter notification title"
                required
              />

              <div>
                <label className="block text-sm font-bold text-secondary-800 mb-2">
                  Message
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border-2 border-secondary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 transition-all duration-200 text-secondary-900 font-medium"
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Type your message here..."
                  required
                />
              </div>

              <Select
                label="Target Audience"
                value={formData.targetType}
                onChange={(e) =>
                  setFormData({ ...formData, targetType: e.target.value })
                }
                options={NOTIFICATION_TARGETS}
                required
              />

              {needsBatchId && (
                <Input
                  label="Batch ID"
                  value={formData.batchId}
                  onChange={(e) =>
                    setFormData({ ...formData, batchId: e.target.value })
                  }
                  placeholder="Enter batch ID"
                  required
                />
              )}

              {needsDepartment && (
                <Input
                  label="Department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  placeholder="Enter department"
                  required
                />
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 shadow-lg"
              >
                <Send size={20} />
                {loading ? 'Sending...' : 'Send Notification'}
              </Button>
            </form>
          </Card>
        </div>

        {/* SIDE CARDS */}
        <div className="space-y-6">
          <Card className="animate-slide-up bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-xl border-2 border-primary-700">
            <div className="text-center">
              <Users size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Broadcast Reach</h3>
              <p className="text-primary-100 text-sm font-semibold">
                Send messages to specific groups or everyone at once
              </p>
            </div>
          </Card>

          <Card className="animate-slide-up bg-gradient-to-br from-accent-600 to-accent-700 text-white shadow-xl border-2 border-accent-700">
            <h3 className="text-lg font-bold mb-3">Quick Tips 💡</h3>
            <ul className="space-y-2 text-sm text-accent-50 font-medium">
              <li>• Keep messages short and clear</li>
              <li>• Use meaningful titles</li>
              <li>• Select the correct audience</li>
              <li>• Double-check before sending</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
