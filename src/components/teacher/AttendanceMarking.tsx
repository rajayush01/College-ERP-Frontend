import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { DatePicker } from '../common/DatePicker';
import { Select } from '../common/Select';
import * as teacherApi from '@/api/teacher.api';
import { Calendar, CheckCircle, UserCheck, Users, XCircle } from 'lucide-react';

interface BatchData {
  batchId: string;
  batchName: string;
  department: string;
  students: StudentData[];
  subjectsTaught: string[];
}

interface StudentData {
  _id: string;
  name: string;
  enrollmentNumber: string;
}

export const AttendanceMarking: React.FC = () => {
  const [classes, setClasses] = useState<BatchData[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      console.log('🔍 [AttendanceMarking] Selected class:', selectedClass);
      console.log('📚 [AttendanceMarking] Available classes:', classes);
      
      const cls = classes.find((c) => c.batchId === selectedClass);
      console.log('✅ [AttendanceMarking] Found batch:', cls);
      
      if (cls) {
        setStudents(cls.students);
        const initialAttendance: Record<string, string> = {};
        cls.students.forEach((s) => {
          initialAttendance[s._id] = 'PRESENT';
        });
        setAttendance(initialAttendance);
        console.log('👥 [AttendanceMarking] Students loaded:', cls.students.length);
      }
    } else {
      setStudents([]);
      setAttendance({});
    }
  }, [selectedClass, classes]);

  const fetchClasses = async () => {
    try {
      console.log('📡 [AttendanceMarking] Fetching batches...');
      const response = await teacherApi.getAssignedStudents();
      console.log('✅ [AttendanceMarking] Raw API Response:', JSON.stringify(response.data, null, 2));
      
      // Log each item in the response
      response.data.forEach((item: unknown, index: number) => {
        console.log(`📦 [AttendanceMarking] Item ${index}:`, item);
      });
      
      const mapped: BatchData[] = response.data.map((c: {
        batchId: string;
        batchName: string;
        department: string;
        students: StudentData[];
        subjectsTaught?: string[];
      }) => {
        console.log('� [AttendanceMarking] Mapping:', {
          batchId: c.batchId,
          batchName: c.batchName,
          department: c.department,
          studentsCount: c.students?.length || 0,
        });
        return {
          batchId: c.batchId,
          batchName: c.batchName,
          department: c.department,
          students: c.students || [],
          subjectsTaught: c.subjectsTaught || [],
        };
      });
      
      console.log('📊 [AttendanceMarking] Final mapped batches:', mapped);
      console.log('📊 [AttendanceMarking] Batch options for dropdown:', mapped.map(b => ({ value: b.batchId, label: b.batchName })));
      setClasses(mapped);
    } catch (error) {
      console.error('❌ [AttendanceMarking] Failed to fetch classes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const records = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status,
    }));

    const cls = classes.find((c) => c.batchId === selectedClass);
    if (!cls || !cls.subjectsTaught || cls.subjectsTaught.length === 0) {
      alert('No subjects assigned to you for this batch');
      return;
    }

    console.log('📝 [AttendanceMarking] Submitting attendance:', {
      batchId: selectedClass,
      subject: cls.subjectsTaught[0],
      date,
      recordsCount: records.length,
    });

    try {
      await teacherApi.markStudentAttendance({
        batchId: selectedClass,
        subject: cls.subjectsTaught[0],
        date,
        records,
      });
      alert('Attendance marked successfully');
    } catch (error) {
      console.error('❌ [AttendanceMarking] Submit failed:', error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Failed to mark attendance';
      alert(errorMessage || 'Failed to mark attendance');
    }
  };

  const presentCount = Object.values(attendance).filter(s => s === 'PRESENT').length;
  const absentCount = Object.values(attendance).filter(s => s === 'ABSENT').length;

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-emerald-50 to-teal-50 min-h-screen">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Mark Attendance
        </h1>
        <p className="text-neutral-600">Record daily student attendance for your classes</p>
      </div>

      {/* Quick Stats */}
      {students.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Total Students</p>
                <p className="text-3xl font-bold text-blue-700">{students.length}</p>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-md">
                <Users size={32} className="text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Present</p>
                <p className="text-3xl font-bold text-emerald-700">{presentCount}</p>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-md">
                <CheckCircle size={32} className="text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Absent</p>
                <p className="text-3xl font-bold text-red-700">{absentCount}</p>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-md">
                <XCircle size={32} className="text-red-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Form */}
      <Card className="animate-slide-up shadow-lg border-2 border-white">
        {/* DEBUG INFO - Remove after fixing */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <h4 className="font-bold text-yellow-800 mb-2">🐛 Debug Info:</h4>
            <p className="text-sm text-yellow-700">Total batches loaded: {classes.length}</p>
            <div className="mt-2 max-h-40 overflow-auto">
              <pre className="text-xs text-yellow-800">
                {JSON.stringify(classes.map(c => ({ 
                  batchId: c.batchId, 
                  batchName: c.batchName,
                  studentsCount: c.students.length 
                })), null, 2)}
              </pre>
            </div>
          </div>
        )}
        
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-lg shadow-md">
              <UserCheck size={24} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-900">Attendance Recording</h3>
              <p className="text-sm text-emerald-700">Mark student presence for today's class</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
              <Users size={20} className="text-blue-600 mb-2" />
              <Select
                label="Select Batch"
                value={selectedClass}
                onChange={(e) => {
                  console.log('🎯 [AttendanceMarking] Batch selected:', e.target.value);
                  const selectedBatch = classes.find(c => c.batchId === e.target.value);
                  console.log('📦 [AttendanceMarking] Selected batch data:', selectedBatch);
                  setSelectedClass(e.target.value);
                }}
                options={[
                  { value: '', label: '-- Select a Batch --' },
                  ...classes.map((cls) => ({
                    value: cls.batchId,
                    label: cls.batchName || 'Unnamed Batch',
                  }))
                ]}
                required
              />
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
              <Calendar size={20} className="text-amber-600 mb-2" />
              <DatePicker
                label="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {students.length > 0 && (
            <>
              <div className="overflow-x-auto rounded-lg border-2 border-neutral-100">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">
                        Enrollment No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">
                        Attendance Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-100">
                    {students.map((student, idx) => (
                      <tr 
                        key={student._id} 
                        className="hover:bg-emerald-50 transition-colors duration-200 animate-slide-up"
                        style={{ animationDelay: `${300 + idx * 30}ms` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm text-neutral-700">{student.enrollmentNumber}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center text-emerald-600 font-bold shadow-sm">
                              {student.name.charAt(0)}
                            </div>
                            <span className="font-medium text-neutral-800">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-4">
                            <label className="flex items-center cursor-pointer group">
                              <input
                                type="radio"
                                name={`attendance-${student._id}`}
                                value="PRESENT"
                                checked={attendance[student._id] === 'PRESENT'}
                                onChange={() =>
                                  setAttendance({ ...attendance, [student._id]: 'PRESENT' })
                                }
                                className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              />
                              <span className="ml-2 font-medium text-emerald-700 group-hover:text-emerald-900 transition-colors">
                                Present
                              </span>
                            </label>
                            <label className="flex items-center cursor-pointer group">
                              <input
                                type="radio"
                                name={`attendance-${student._id}`}
                                value="ABSENT"
                                checked={attendance[student._id] === 'ABSENT'}
                                onChange={() =>
                                  setAttendance({ ...attendance, [student._id]: 'ABSENT' })
                                }
                                className="w-5 h-5 text-red-600 focus:ring-red-500 cursor-pointer"
                              />
                              <span className="ml-2 font-medium text-red-700 group-hover:text-red-900 transition-colors">
                                Absent
                              </span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <Button type="submit" className="w-full md:w-auto flex items-center justify-center gap-2 shadow-lg">
                  <CheckCircle size={20} />
                  Mark Attendance
                </Button>
              </div>
            </>
          )}
        </form>
      </Card>

      {/* Info Card */}
      <Card className="animate-slide-up bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl border-none">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Quick Reminder 📋</h3>
            <p className="text-emerald-100">Ensure all students are marked before submitting. You can update attendance later if needed.</p>
          </div>
          <div className="hidden md:block text-8xl opacity-20">✓</div>
        </div>
      </Card>
    </div>
  );
};