import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { DatePicker } from '../common/DatePicker';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as teacherApi from '@/api/teacher.api';
import { formatDate } from '@/utils/formatters';
import { Search, Calendar, UserCheck, UserX, Filter } from 'lucide-react';

export const AttendanceHistory: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [filters, setFilters] = useState({ classId: '', date: '' });

  const handleSearch = async () => {
    if (!filters.classId) {
      alert('Please select a class');
      return;
    }
    setLoading(true);
    try {
      const response = await teacherApi.getClassAttendance(filters);
      setAttendance(response.data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-cyan-50 to-blue-50 min-h-screen">
      <div className="animate-slide-up">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">Attendance History</h1>
        <p className="text-neutral-600">View past attendance records for your classes</p>
      </div>

      <Card title="Search Filters" className="animate-slide-up shadow-lg border-2 border-white" style={{ animationDelay: '100ms' }}>
        <div className="mb-4 flex items-center gap-2 text-neutral-700">
          <Filter size={20} className="text-cyan-600" />
          <span className="font-medium">Filter Attendance Records</span>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <Input label="Class ID" value={filters.classId} onChange={(e) => setFilters({ ...filters, classId: e.target.value })} placeholder="Enter class ID" required />
          </div>
          <div className="p-4 bg-cyan-50 rounded-xl border-2 border-cyan-200">
            <Calendar size={20} className="text-cyan-600 mb-2" />
            <DatePicker label="Date (Optional)" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
          </div>
          <div className="flex items-end pb-4">
            <Button onClick={handleSearch} className="w-full flex items-center justify-center gap-2 shadow-lg"><Search size={20} />Search</Button>
          </div>
        </div>
      </Card>

      {loading ? <LoadingSpinner /> : attendance.length > 0 ? (
        <Card title="Attendance Records" className="animate-slide-up shadow-lg border-2 border-white" style={{ animationDelay: '200ms' }}>
          <div className="overflow-x-auto rounded-lg border-2 border-neutral-100">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase">Enrollment Number</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-100">
                {attendance.map((record, idx) => (
                  <tr key={record._id} className="hover:bg-cyan-50 transition-colors duration-200 animate-slide-up" style={{ animationDelay: `${300 + idx * 30}ms` }}>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-2"><Calendar size={16} className="text-blue-600" /><span className="font-medium">{formatDate(record.date, 'PP')}</span></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center text-cyan-600 font-bold shadow-sm">{record.student?.name?.charAt(0)}</div><span className="font-medium text-neutral-800">{record.student?.name}</span></div></td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{record.student?.enrollmentNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${record.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{record.status === 'PRESENT' ? <UserCheck size={14} /> : <UserX size={14} />}{record.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  );
};