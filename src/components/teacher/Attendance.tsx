import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { DatePicker } from '../common/DatePicker';
import { Select } from '../common/Select';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as teacherApi from '@/api/teacher.api';
import { Users, CheckCircle, XCircle, Search, UserCheck, Calendar } from 'lucide-react';

/* =============================== HELPERS =============================== */
const getWeekDates = (dateStr: string) => {
  const d = new Date(dateStr);
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));
  return Array.from({ length: 6 }).map((_, i) => {
    const dt = new Date(monday);
    dt.setDate(monday.getDate() + i);
    return dt.toISOString().split('T')[0];
  });
};

const getMonthDates = (dateStr: string) => {
  const base = new Date(dateStr);
  const year = base.getFullYear();
  const month = base.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }).map((_, i) =>
    new Date(year, month, i + 1).toISOString().split('T')[0]
  );
};
/* ====================================================================== */

type TabType = 'MARK' | 'HISTORY';
type RangeType = 'WEEK' | 'MONTH';

interface BatchData {
  batchId: string;
  batchName: string;
  department: string;
  subjectsTaught: string[];
  students: { _id: string; name: string; enrollmentNumber: string }[];
}

export const Attendance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('MARK');
  const [classes, setClasses] = useState<BatchData[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  /* ---------- MARK ---------- */
  const [markDate, setMarkDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<BatchData['students']>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [marking, setMarking] = useState(false);

  /* ---------- HISTORY ---------- */
  const [rangeType, setRangeType] = useState<RangeType>('WEEK');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [studentStats, setStudentStats] = useState<any[]>([]);
  const [dateHeaders, setDateHeaders] = useState<string[]>([]);

  /* ============================== INIT ============================== */
  useEffect(() => {
    teacherApi.getAssignedStudents().then((res) => {
      setClasses(res.data || []);
    }).catch(() => {});
  }, []);

  // When batch changes, load students and reset subject
  useEffect(() => {
    if (!selectedBatch) {
      setStudents([]);
      setAttendance({});
      setSelectedSubject('');
      return;
    }
    const cls = classes.find((c) => c.batchId === selectedBatch);
    if (!cls) return;

    setStudents(cls.students);
    const init: Record<string, string> = {};
    cls.students.forEach((s) => (init[s._id] = 'PRESENT'));
    setAttendance(init);

    // Auto-select first subject if available
    setSelectedSubject(cls.subjectsTaught?.[0] || '');
  }, [selectedBatch, classes]);

  /* ========================= MARK ATTENDANCE ========================= */
  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return alert('Please select a batch');
    if (!selectedSubject.trim()) return alert('Please select a subject');
    if (!markDate) return alert('Please select a date');
    if (students.length === 0) return alert('No students in this batch');

    setMarking(true);
    try {
      await teacherApi.markStudentAttendance({
        batchId: selectedBatch,
        subject: selectedSubject,
        date: markDate,
        records: Object.entries(attendance).map(([studentId, status]) => ({
          studentId,
          status,
        })),
      });
      alert('Attendance marked successfully');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setMarking(false);
    }
  };

  /* ============================== HISTORY ============================== */
  const loadHistory = async () => {
    if (!selectedBatch) return alert('Select a batch first');

    setHistoryLoading(true);
    try {
      const res = await teacherApi.getClassAttendance({ batchId: selectedBatch });

      const dates = rangeType === 'WEEK' ? getWeekDates(markDate) : getMonthDates(markDate);
      setDateHeaders(dates);

      const map: Record<string, any> = {};
      res.data.forEach((r: any) => {
        const sid = r.student._id;
        if (!map[sid]) {
          map[sid] = { student: r.student, attendance: {}, total: 0, present: 0 };
        }
        const d = r.date.split('T')[0];
        if (dates.includes(d)) {
          map[sid].attendance[d] = r.status;
        }
      });

      Object.values(map).forEach((s: any) => {
        dates.forEach((d) => {
          if (s.attendance[d]) {
            s.total++;
            if (s.attendance[d] === 'PRESENT') s.present++;
          }
        });
        s.percent = s.total ? Math.round((s.present / s.total) * 100) : 0;
      });

      setStudentStats(Object.values(map));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to load history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const presentCount = Object.values(attendance).filter((v) => v === 'PRESENT').length;
  const absentCount = Object.values(attendance).filter((v) => v === 'ABSENT').length;

  const currentBatch = classes.find((c) => c.batchId === selectedBatch);
  const subjectOptions = currentBatch?.subjectsTaught?.length
    ? currentBatch.subjectsTaught.map((s) => ({ value: s, label: s }))
    : [];

  return (
    <div className="space-y-6 p-4 sm:p-6 min-h-screen bg-gradient-to-br from-neutral-50 to-emerald-50">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
          Attendance
        </h1>
        <p className="text-neutral-600 text-sm">Mark, review & analyze student attendance</p>
      </div>

      {/* TABS */}
      <div className="flex gap-2">
        {(['MARK', 'HISTORY'] as TabType[]).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'primary' : 'secondary'}
            onClick={() => setActiveTab(tab)}
            size="sm"
          >
            {tab === 'MARK' ? 'Mark Attendance' : 'View History'}
          </Button>
        ))}
      </div>

      {/* BATCH + SUBJECT SELECTORS */}
      <Card>
        <div className="grid sm:grid-cols-2 gap-4">
          <Select
            label="Select Batch"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            options={[
              { value: '', label: '-- Select Batch --' },
              ...classes.map((c) => ({ value: c.batchId, label: c.batchName })),
            ]}
          />

          {selectedBatch && (
            subjectOptions.length > 0 ? (
              <Select
                label="Subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                options={[
                  { value: '', label: '-- Select Subject --' },
                  ...subjectOptions,
                ]}
              />
            ) : (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  placeholder="Enter subject name"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                />
              </div>
            )
          )}
        </div>
      </Card>

      {/* ========================== MARK ATTENDANCE ========================== */}
      {activeTab === 'MARK' && (
        <Card className="shadow-lg border-2 border-white">
          <DatePicker
            label="Attendance Date"
            value={markDate}
            onChange={(e) => setMarkDate(e.target.value)}
          />

          {students.length > 0 && (
            <div className="grid grid-cols-3 gap-4 my-6">
              <StatBox label="Total" value={students.length} icon={Users} color="blue" />
              <StatBox label="Present" value={presentCount} icon={CheckCircle} color="emerald" />
              <StatBox label="Absent" value={absentCount} icon={XCircle} color="red" />
            </div>
          )}

          <form onSubmit={handleMarkAttendance} className="space-y-2">
            {students.length === 0 && selectedBatch && (
              <p className="text-center text-neutral-500 py-8">No students found in this batch.</p>
            )}
            {students.length === 0 && !selectedBatch && (
              <p className="text-center text-neutral-500 py-8">Select a batch to load students.</p>
            )}

            {students.map((s, i) => (
              <div
                key={s._id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-xl hover:bg-emerald-50 transition-all gap-2"
                style={{ animationDelay: `${i * 20}ms` }}
              >
                <span className="font-medium text-neutral-800">
                  <span className="font-mono text-sm text-neutral-500 mr-2">{s.enrollmentNumber}</span>
                  {s.name}
                </span>
                <div className="flex gap-6">
                  {['PRESENT', 'ABSENT'].map((st) => (
                    <label key={st} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`att-${s._id}`}
                        checked={attendance[s._id] === st}
                        onChange={() => setAttendance({ ...attendance, [s._id]: st })}
                        className={`w-4 h-4 ${st === 'PRESENT' ? 'accent-emerald-600' : 'accent-red-600'}`}
                      />
                      <span className={`text-sm font-medium ${st === 'PRESENT' ? 'text-emerald-700' : 'text-red-700'}`}>
                        {st === 'PRESENT' ? 'Present' : 'Absent'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {students.length > 0 && (
              <div className="pt-4 border-t">
                <Button type="submit" disabled={marking} className="flex items-center gap-2">
                  <UserCheck size={18} />
                  {marking ? 'Submitting...' : 'Submit Attendance'}
                </Button>
              </div>
            )}
          </form>
        </Card>
      )}

      {/* ========================== HISTORY ========================== */}
      {activeTab === 'HISTORY' && (
        <>
          <Card>
            <div className="grid sm:grid-cols-3 gap-4 items-end">
              <Select
                label="View Range"
                value={rangeType}
                onChange={(e) => setRangeType(e.target.value as RangeType)}
                options={[
                  { value: 'WEEK', label: 'Week (Mon–Sat)' },
                  { value: 'MONTH', label: 'Full Month' },
                ]}
              />
              <DatePicker
                label="Reference Date"
                value={markDate}
                onChange={(e) => setMarkDate(e.target.value)}
              />
              <Button onClick={loadHistory} className="flex items-center gap-2">
                <Search size={16} /> Load History
              </Button>
            </div>
          </Card>

          {historyLoading ? (
            <LoadingSpinner />
          ) : studentStats.length > 0 ? (
            <Card className="overflow-x-auto shadow-xl">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-neutral-100 sticky top-0 z-10">
                  <tr>
                    <th className="sticky left-0 bg-neutral-100 px-4 py-3 text-left font-semibold">Student</th>
                    {dateHeaders.map((d) => (
                      <th key={d} className="px-2 py-3 text-xs text-center font-semibold">
                        {rangeType === 'WEEK'
                          ? new Date(d).toLocaleDateString('en-US', { weekday: 'short' })
                          : new Date(d).getDate()}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center font-semibold">%</th>
                  </tr>
                </thead>
                <tbody>
                  {studentStats.map((s: any) => (
                    <tr key={s.student._id} className="hover:bg-neutral-50 border-t">
                      <td className="sticky left-0 bg-white px-4 py-3 font-medium whitespace-nowrap">
                        {s.student.name}
                      </td>
                      {dateHeaders.map((d) => {
                        const st = s.attendance[d];
                        return (
                          <td key={d} className="text-center py-3">
                            {st === 'PRESENT' && <span className="text-emerald-600 font-bold">✓</span>}
                            {st === 'ABSENT' && <span className="text-red-600 font-bold">✕</span>}
                            {!st && <span className="text-neutral-300">—</span>}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center">
                        <AttendanceBadge percent={s.percent} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ) : (
            <Card>
              <p className="text-center text-neutral-500 py-8">
                {selectedBatch ? 'No attendance records found. Click "Load History" to fetch.' : 'Select a batch and click Load History.'}
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

/* ============================== UI HELPERS ============================== */
const StatBox = ({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) => {
  const colors: Record<string, string> = {
    blue: 'from-blue-50 to-blue-100 text-blue-700',
    emerald: 'from-emerald-50 to-emerald-100 text-emerald-700',
    red: 'from-red-50 to-red-100 text-red-700',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} p-4 rounded-xl flex items-center justify-between`}>
      <div>
        <p className="text-xs font-medium opacity-70">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <Icon size={24} className="opacity-60" />
    </div>
  );
};

const AttendanceBadge = ({ percent }: { percent: number }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-bold ${percent >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
    {percent}%
  </span>
);
