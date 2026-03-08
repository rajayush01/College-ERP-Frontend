import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { DatePicker } from '../common/DatePicker';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as adminApi from '@/api/admin.api';
import { formatDate } from '@/utils/formatters';
import { Search, Calendar, UserCheck, UserX, Filter } from 'lucide-react';

export const AttendanceReports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    classId: '',
    studentId: '',
    startDate: '',
    endDate: '',
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await adminApi.viewStudentAttendance(filters);
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Attendance Reports
        </h1>
        <p className="text-neutral-600">Search and analyze student attendance records</p>
      </div>

      {/* Filter Card */}
      <Card 
        title="Filter Options" 
        className="animate-slide-up shadow-lg border-2 border-white"
        style={{ animationDelay: '100ms' }}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-neutral-700 mb-4">
            <Filter size={20} className="text-blue-600" />
            <span className="font-medium">Search Parameters</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Class ID"
              value={filters.classId}
              onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
              placeholder="Enter class ID"
            />

            <Input
              label="Student ID"
              value={filters.studentId}
              onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
              placeholder="Enter student ID"
            />

            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />

            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>

          <div className="pt-4 border-t border-neutral-100">
            <Button 
              onClick={handleSearch} 
              className="flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Search size={20} />
              Search Attendance
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {loading ? (
        <LoadingSpinner />
      ) : attendanceData.length > 0 ? (
        <Card 
          title="Attendance Records" 
          className="animate-slide-up shadow-lg border-2 border-white"
          style={{ animationDelay: '200ms' }}
        >
          <div className="overflow-x-auto rounded-lg border-2 border-neutral-100">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Roll Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Marked By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-100">
                {attendanceData.map((record, idx) => (
                  <tr 
                    key={record._id} 
                    className="hover:bg-blue-50 transition-colors duration-200 animate-slide-up"
                    style={{ animationDelay: `${300 + idx * 30}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-neutral-700">
                        <Calendar size={16} className="text-blue-600" />
                        <span className="font-medium">{formatDate(record.date, 'PP')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold shadow-sm">
                          {record.student?.name?.charAt(0)}
                        </div>
                        <span className="font-medium text-neutral-800">{record.student?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-neutral-700 font-mono text-sm">{record.student?.rollNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-neutral-700">
                      {record.class?.name} - {record.class?.section}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${
                        record.status === 'PRESENT'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {record.status === 'PRESENT' ? (
                          <UserCheck size={14} />
                        ) : (
                          <UserX size={14} />
                        )}
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-neutral-700">
                      {record.markedBy?.name}
                    </td>
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