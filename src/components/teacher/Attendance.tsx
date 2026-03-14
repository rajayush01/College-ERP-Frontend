// import React, { useEffect, useState } from 'react';
// import { Card } from '../common/Card';
// import { Button } from '../common/Button';
// import { DatePicker } from '../common/DatePicker';
// import { Select } from '../common/Select';
// import { LoadingSpinner } from '../common/LoadingSpinner';
// import * as teacherApi from '@/api/teacher.api';
// import {
//   Users,
//   CheckCircle,
//   XCircle,
//   Search,
//   CalendarDays,
// } from 'lucide-react';

// /* =============================== HELPERS =============================== */

// // Monday → Saturday
// const getWeekDates = (dateStr: string) => {
//   const d = new Date(dateStr);
//   const day = d.getDay();
//   const monday = new Date(d);
//   monday.setDate(d.getDate() - ((day + 6) % 7));

//   return Array.from({ length: 6 }).map((_, i) => {
//     const dt = new Date(monday);
//     dt.setDate(monday.getDate() + i);
//     return dt.toISOString().split('T')[0];
//   });
// };

// // Full month (FIXED)
// const getMonthDates = (dateStr: string) => {
//   const base = new Date(dateStr);
//   const year = base.getFullYear();
//   const month = base.getMonth();

//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   return Array.from({ length: daysInMonth }).map((_, i) =>
//     new Date(year, month, i + 1).toISOString().split('T')[0]
//   );
// };

// /* ====================================================================== */

// type TabType = 'MARK' | 'HISTORY';
// type RangeType = 'WEEK' | 'MONTH';

// export const Attendance: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<TabType>('MARK');

//   const [classes, setClasses] = useState<any[]>([]);
//   const [selectedClass, setSelectedClass] = useState('');

//   /* ---------- MARK ---------- */
//   const [markDate, setMarkDate] = useState(
//     new Date().toISOString().split('T')[0]
//   );
//   const [students, setStudents] = useState<any[]>([]);
//   const [attendance, setAttendance] = useState<Record<string, string>>({});
//   const [marking, setMarking] = useState(false);

//   /* ---------- HISTORY ---------- */
//   const [rangeType, setRangeType] = useState<RangeType>('WEEK');
//   const [historyLoading, setHistoryLoading] = useState(false);
//   const [studentStats, setStudentStats] = useState<any[]>([]);
//   const [dateHeaders, setDateHeaders] = useState<string[]>([]);

//   /* ============================== INIT ============================== */
//   useEffect(() => {
//     teacherApi.getAssignedStudents().then((res) => setClasses(res.data));
//   }, []);

//   useEffect(() => {
//     if (!selectedClass) return;
//     const cls = classes.find((c) => c.classId === selectedClass);
//     if (!cls) return;

//     setStudents(cls.students);
//     const init: Record<string, string> = {};
//     cls.students.forEach((s: any) => (init[s._id] = 'PRESENT'));
//     setAttendance(init);
//   }, [selectedClass, classes]);

//   /* ========================= MARK ATTENDANCE ========================= */
//   const handleMarkAttendance = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedClass || !markDate) return alert('Class & date required');

//     setMarking(true);
//     try {
//       await teacherApi.markStudentAttendance({
//         classId: selectedClass,
//         date: markDate,
//         records: Object.entries(attendance).map(([studentId, status]) => ({
//           studentId,
//           status,
//         })),
//       });
//       alert('Attendance marked successfully');
//     } finally {
//       setMarking(false);
//     }
//   };

//   /* ============================== HISTORY ============================== */
//   const loadHistory = async () => {
//     if (!selectedClass) return alert('Select class first');

//     setHistoryLoading(true);
//     try {
//       const res = await teacherApi.getClassAttendance({
//         classId: selectedClass,
//       });

//       const dates =
//         rangeType === 'WEEK'
//           ? getWeekDates(markDate)
//           : getMonthDates(markDate);

//       setDateHeaders(dates);

//       const map: any = {};

//       // Normalize backend data
//       res.data.forEach((r: any) => {
//         const sid = r.student._id;
//         if (!map[sid]) {
//           map[sid] = {
//             student: r.student,
//             attendance: {},
//             total: 0,
//             present: 0,
//           };
//         }
//         const d = r.date.split('T')[0];
//         if (dates.includes(d)) {
//           map[sid].attendance[d] = r.status;
//         }
//       });

//       // Compute totals
//       Object.values(map).forEach((s: any) => {
//         dates.forEach((d) => {
//           if (s.attendance[d]) {
//             s.total++;
//             if (s.attendance[d] === 'PRESENT') s.present++;
//           }
//         });
//         s.percent = s.total
//           ? Math.round((s.present / s.total) * 100)
//           : 0;
//       });

//       setStudentStats(Object.values(map));
//     } finally {
//       setHistoryLoading(false);
//     }
//   };

//   const presentCount = Object.values(attendance).filter(v => v === 'PRESENT').length;
//   const absentCount = Object.values(attendance).filter(v => v === 'ABSENT').length;

//   return (
//     <div className="space-y-8 p-6 min-h-screen bg-gradient-to-br from-neutral-50 to-emerald-50">

//       {/* ============================ HEADER ============================ */}
//       <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl animate-slide-up">
//         <h1 className="text-3xl font-bold">Attendance</h1>
//         <p className="text-emerald-100">
//           Mark, review & analyze attendance
//         </p>
//       </Card>

//       {/* ============================ TABS ============================ */}
//       <div className="flex gap-3">
//         {(['MARK', 'HISTORY'] as TabType[]).map(tab => (
//           <Button
//             key={tab}
//             variant={activeTab === tab ? 'primary' : 'secondary'}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </Button>
//         ))}
//       </div>

//       {/* ========================== CLASS SELECT ========================== */}
//       <Card className="animate-slide-up">
//         <Select
//           label="Select Batch"
//           value={selectedClass}
//           onChange={(e) => setSelectedClass(e.target.value)}
//           options={classes.map(c => ({
//             value: c.classId,
//             label: `Batch ${c.className}`,
//           }))}
//         />
//       </Card>

//       {/* ========================== MARK ATTENDANCE ========================== */}
//       {activeTab === 'MARK' && (
//         <Card className="animate-slide-up shadow-lg">
//           <DatePicker
//             label="Attendance Date"
//             value={markDate}
//             onChange={(e) => setMarkDate(e.target.value)}
//           />

//           <div className="grid md:grid-cols-3 gap-6 my-6">
//             <Stat label="Students" value={students.length} icon={Users} />
//             <Stat label="Present" value={presentCount} icon={CheckCircle} />
//             <Stat label="Absent" value={absentCount} icon={XCircle} />
//           </div>

//           <form onSubmit={handleMarkAttendance} className="space-y-2">
//             {students.map((s, i) => (
//               <div
//                 key={s._id}
//                 className="flex justify-between items-center p-3 rounded-xl hover:bg-emerald-50 transition-all animate-slide-up"
//                 style={{ animationDelay: `${i * 20}ms` }}
//               >
//                 <span className="font-medium">
//                   {s.enrollmentNumber} · {s.name}
//                 </span>
//                 <div className="flex gap-6">
//                   {['PRESENT', 'ABSENT'].map(st => (
//                     <label key={st} className="flex items-center gap-2">
//                       <input
//                         type="radio"
//                         checked={attendance[s._id] === st}
//                         onChange={() =>
//                           setAttendance({ ...attendance, [s._id]: st })
//                         }
//                       />
//                       {st}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             ))}
//             <Button type="submit" disabled={marking} className="mt-4">
//               Mark Attendance
//             </Button>
//           </form>
//         </Card>
//       )}

//       {/* ============================ HISTORY ============================ */}
//       {activeTab === 'HISTORY' && (
//         <>
//           <Card className="animate-slide-up">
//             <div className="grid md:grid-cols-3 gap-4">
//               <Select
//                 label="View"
//                 value={rangeType}
//                 onChange={(e) => setRangeType(e.target.value as RangeType)}
//                 options={[
//                   { value: 'WEEK', label: 'Week (Mon–Sat)' },
//                   { value: 'MONTH', label: 'Month' },
//                 ]}
//               />
//               <DatePicker
//                 label="Reference Date"
//                 value={markDate}
//                 onChange={(e) => setMarkDate(e.target.value)}
//               />
//               <Button onClick={loadHistory}>
//                 <Search size={18} /> Load
//               </Button>
//             </div>
//           </Card>

//           {historyLoading ? (
//             <LoadingSpinner />
//           ) : (
//             <Card className="overflow-x-auto shadow-xl animate-slide-up">
//               <table className="min-w-full border-collapse">
//                 <thead className="bg-neutral-100 sticky top-0 z-10">
//                   <tr>
//                     <th className="sticky left-0 bg-neutral-100 px-4 py-3">
//                       Student
//                     </th>
//                     {dateHeaders.map((d) => (
//                       <th key={d} className="px-2 text-xs text-center">
//                         {rangeType === 'WEEK'
//                           ? new Date(d).toLocaleDateString('en-US', { weekday: 'short' })
//                           : new Date(d).getDate()}
//                       </th>
//                     ))}
//                     <th className="px-4 py-3">%</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {studentStats.map((s: any) => (
//                     <tr key={s.student._id} className="hover:bg-neutral-50">
//                       <td className="sticky left-0 bg-white px-4 font-medium">
//                         {s.student.name}
//                       </td>
//                       {dateHeaders.map((d) => {
//                         const st = s.attendance[d];
//                         return (
//                           <td key={d} className="text-center">
//                             {st === 'PRESENT' && <span className="text-emerald-600 font-bold">✓</span>}
//                             {st === 'ABSENT' && <span className="text-red-600 font-bold">✕</span>}
//                             {!st && <span className="text-neutral-300">—</span>}
//                           </td>
//                         );
//                       })}
//                       <td className="px-4">
//                         <AttendanceBadge percent={s.percent} />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </Card>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// /* ============================== UI HELPERS ============================== */

// const Stat = ({ label, value, icon: Icon }: any) => (
//   <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center animate-slide-up">
//     <div>
//       <p className="text-sm text-neutral-600">{label}</p>
//       <p className="text-2xl font-bold">{value}</p>
//     </div>
//     {Icon && <Icon size={28} className="text-emerald-600" />}
//   </div>
// );

// const AttendanceBadge = ({ percent }: { percent: number }) => {
//   const cls =
//     percent >= 75
//       ? 'bg-emerald-100 text-emerald-700'
//       : 'bg-red-100 text-red-700';

//   return (
//     <span className={`px-3 py-1 rounded-full text-xs font-bold ${cls}`}>
//       {percent}%
//     </span>
//   );
// };

import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { DatePicker } from '../common/DatePicker';
import { Select } from '../common/Select';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as teacherApi from '@/api/teacher.api';
import {
  Users,
  CheckCircle,
  XCircle,
  Search,
  CalendarDays,
} from 'lucide-react';

/* =============================== HELPERS =============================== */

// Monday → Saturday
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

// Full month (FIXED)
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

export const Attendance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('MARK');

  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');

  /* ---------- MARK ---------- */
  const [markDate, setMarkDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [marking, setMarking] = useState(false);

  /* ---------- HISTORY ---------- */
  const [rangeType, setRangeType] = useState<RangeType>('WEEK');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [studentStats, setStudentStats] = useState<any[]>([]);
  const [dateHeaders, setDateHeaders] = useState<string[]>([]);

  /* ============================== INIT ============================== */
  useEffect(() => {
    teacherApi.getAssignedStudents().then((res) => setClasses(res.data));
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    const cls = classes.find((c) => c.batchId === selectedClass);
    if (!cls) return;

    setStudents(cls.students);
    const init: Record<string, string> = {};
    cls.students.forEach((s: any) => (init[s._id] = 'PRESENT'));
    setAttendance(init);
  }, [selectedClass, classes]);

  /* ========================= MARK ATTENDANCE ========================= */
  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !markDate) return alert('Class & date required');

    setMarking(true);
    try {
      await teacherApi.markStudentAttendance({
        batchId: selectedClass,
        date: markDate,
        records: Object.entries(attendance).map(([studentId, status]) => ({
          studentId,
          status,
        })),
      });
      alert('Attendance marked successfully');
    } finally {
      setMarking(false);
    }
  };

  /* ============================== HISTORY ============================== */
  const loadHistory = async () => {
    if (!selectedClass) return alert('Select class first');

    setHistoryLoading(true);
    try {
      const res = await teacherApi.getClassAttendance({
        batchId: selectedClass,
      });

      const dates =
        rangeType === 'WEEK'
          ? getWeekDates(markDate)
          : getMonthDates(markDate);

      setDateHeaders(dates);

      const map: any = {};

      // Normalize backend data
      res.data.forEach((r: any) => {
        const sid = r.student._id;
        if (!map[sid]) {
          map[sid] = {
            student: r.student,
            attendance: {},
            total: 0,
            present: 0,
          };
        }
        const d = r.date.split('T')[0];
        if (dates.includes(d)) {
          map[sid].attendance[d] = r.status;
        }
      });

      // Compute totals
      Object.values(map).forEach((s: any) => {
        dates.forEach((d) => {
          if (s.attendance[d]) {
            s.total++;
            if (s.attendance[d] === 'PRESENT') s.present++;
          }
        });
        s.percent = s.total
          ? Math.round((s.present / s.total) * 100)
          : 0;
      });

      setStudentStats(Object.values(map));
    } finally {
      setHistoryLoading(false);
    }
  };

  const presentCount = Object.values(attendance).filter(v => v === 'PRESENT').length;
  const absentCount = Object.values(attendance).filter(v => v === 'ABSENT').length;

  return (
    <div className="space-y-8 p-6 min-h-screen bg-gradient-to-br from-neutral-50 to-emerald-50">

      {/* ============================ HEADER ============================ */}
      <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl animate-slide-up">
        <h1 className="text-3xl font-bold">Attendance</h1>
        <p className="text-emerald-100">
          Mark, review & analyze attendance
        </p>
      </Card>

      {/* ============================ TABS ============================ */}
      <div className="flex gap-3">
        {(['MARK', 'HISTORY'] as TabType[]).map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'primary' : 'secondary'}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* ========================== CLASS SELECT ========================== */}
      <Card className="animate-slide-up">
        <Select
          label="Select Batch"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        options={classes.map(c => ({
            value: c.batchId,
            label: c.batchName || 'Unnamed Batch',
          }))}
        />
      </Card>

      {/* ========================== MARK ATTENDANCE ========================== */}
      {activeTab === 'MARK' && (
        <Card className="animate-slide-up shadow-lg">
          <DatePicker
            label="Attendance Date"
            value={markDate}
            onChange={(e) => setMarkDate(e.target.value)}
          />

          <div className="grid md:grid-cols-3 gap-6 my-6">
            <Stat label="Students" value={students.length} icon={Users} />
            <Stat label="Present" value={presentCount} icon={CheckCircle} />
            <Stat label="Absent" value={absentCount} icon={XCircle} />
          </div>

          <form onSubmit={handleMarkAttendance} className="space-y-2">
            {students.map((s, i) => (
              <div
                key={s._id}
                className="flex justify-between items-center p-3 rounded-xl hover:bg-emerald-50 transition-all animate-slide-up"
                style={{ animationDelay: `${i * 20}ms` }}
              >
                <span className="font-medium">
                  {s.enrollmentNumber} · {s.name}
                </span>
                <div className="flex gap-6">
                  {['PRESENT', 'ABSENT'].map(st => (
                    <label key={st} className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={attendance[s._id] === st}
                        onChange={() =>
                          setAttendance({ ...attendance, [s._id]: st })
                        }
                      />
                      {st}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <Button type="submit" disabled={marking} className="mt-4">
              Mark Attendance
            </Button>
          </form>
        </Card>
      )}

      {/* ============================ HISTORY ============================ */}
      {activeTab === 'HISTORY' && (
        <>
          <Card className="animate-slide-up">
            <div className="grid md:grid-cols-3 gap-4">
              <Select
                label="View"
                value={rangeType}
                onChange={(e) => setRangeType(e.target.value as RangeType)}
                options={[
                  { value: 'WEEK', label: 'Week (Mon–Sat)' },
                  { value: 'MONTH', label: 'Month' },
                ]}
              />
              <DatePicker
                label="Reference Date"
                value={markDate}
                onChange={(e) => setMarkDate(e.target.value)}
              />
              <Button onClick={loadHistory}>
                <Search size={18} /> Load
              </Button>
            </div>
          </Card>

          {historyLoading ? (
            <LoadingSpinner />
          ) : (
            <Card className="overflow-x-auto shadow-xl animate-slide-up">
              <table className="min-w-full border-collapse">
                <thead className="bg-neutral-100 sticky top-0 z-10">
                  <tr>
                    <th className="sticky left-0 bg-neutral-100 px-4 py-3">
                      Student
                    </th>
                    {dateHeaders.map((d) => (
                      <th key={d} className="px-2 text-xs text-center">
                        {rangeType === 'WEEK'
                          ? new Date(d).toLocaleDateString('en-US', { weekday: 'short' })
                          : new Date(d).getDate()}
                      </th>
                    ))}
                    <th className="px-4 py-3">%</th>
                  </tr>
                </thead>
                <tbody>
                  {studentStats.map((s: any) => (
                    <tr key={s.student._id} className="hover:bg-neutral-50">
                      <td className="sticky left-0 bg-white px-4 font-medium">
                        {s.student.name}
                      </td>
                      {dateHeaders.map((d) => {
                        const st = s.attendance[d];
                        return (
                          <td key={d} className="text-center">
                            {st === 'PRESENT' && <span className="text-emerald-600 font-bold">✓</span>}
                            {st === 'ABSENT' && <span className="text-red-600 font-bold">✕</span>}
                            {!st && <span className="text-neutral-300">—</span>}
                          </td>
                        );
                      })}
                      <td className="px-4">
                        <AttendanceBadge percent={s.percent} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

/* ============================== UI HELPERS ============================== */

const Stat = ({ label, value, icon: Icon }: any) => (
  <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center animate-slide-up">
    <div>
      <p className="text-sm text-neutral-600">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    {Icon && <Icon size={28} className="text-emerald-600" />}
  </div>
);

const AttendanceBadge = ({ percent }: { percent: number }) => {
  const cls =
    percent >= 75
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-red-100 text-red-700';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${cls}`}>
      {percent}%
    </span>
  );
};
