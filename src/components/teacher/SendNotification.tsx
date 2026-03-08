import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import * as teacherApi from '@/api/teacher.api';
import { Bell, Send, Users } from 'lucide-react';

export const SendNotification: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', message: '', classId: '', section: '' });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await teacherApi.getAssignedStudents();
        setClasses(response.data);
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      }
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await teacherApi.sendNotificationToStudents(formData);
      alert('Notification sent successfully');
      setFormData({ title: '', message: '', classId: '', section: '' });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send notification');
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-blue-50 to-cyan-50 min-h-screen">
      <div className="animate-slide-up">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">Send Notification</h1>
        <p className="text-neutral-600">Broadcast messages to your students</p>
      </div>

      <Card className="animate-slide-up shadow-lg border-2 border-white" style={{ animationDelay: '100ms' }}>
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-lg shadow-md">
              <Bell size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Notification Composer</h3>
              <p className="text-sm text-blue-700">Send instant messages to your class</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter notification title" required />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Message</label>
            <textarea
              className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Type your message here..."
              required
            />
          </div>

          <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
            <Users size={20} className="text-green-600 mb-2" />
            <Select
              label="Select Class"
              value={formData.classId}
              onChange={(e) => {
                const cls = classes.find((c) => c.classId === e.target.value);
                setFormData({ ...formData, classId: e.target.value, section: cls?.section || '' });
              }}
              options={classes.map((cls) => ({
                value: cls.classId,
                label: `Class ${cls.className} - Section ${cls.section}`,
              }))}
              required
            />
          </div>

          <Button type="submit" className="w-full flex items-center justify-center gap-2 shadow-lg">
            <Send size={20} />
            Send Notification
          </Button>
        </form>
      </Card>

      <Card className="animate-slide-up bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-xl border-none" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Quick Tips 💡</h3>
            <ul className="space-y-1 text-blue-100 text-sm">
              <li>• Keep messages clear and concise</li>
              <li>• Use descriptive titles</li>
              <li>• Check spelling before sending</li>
            </ul>
          </div>
          <div className="hidden md:block text-8xl opacity-20">📨</div>
        </div>
      </Card>
    </div>
  );
};