// import React, { useEffect, useState } from 'react';
// import { Card } from '../common/Card';
// import { LoadingSpinner } from '../common/LoadingSpinner';
// import * as adminApi from '@/api/admin.api';
// import { Users, UserCheck, UserX, GraduationCap, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
// import { formatPercentage } from '@/utils/formatters';

// export const AdminDashboard: React.FC = () => {
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState<any>({
//     stats: {
//       totalStudents: 0,
//       totalTeachers: 0,
//       totalClasses: 0,
//       totalAssignments: 0,
//       attendanceRate: 0
//     },
//     studentSummary: [],
//     lowAttendance: [],
//     teacherSummary: [],
//   });
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

// const fetchDashboardData = async () => {
//   try {
//     setError(null);
//     console.log('📊 [Admin Dashboard] Fetching dashboard data...');
    
//     const results = await Promise.allSettled([
//       adminApi.getDashboardStats(),
//       adminApi.getStudentAttendanceSummary(),
//       adminApi.getLowAttendanceStudents(),
//       adminApi.getTeacherPresenceSummary(),
//     ]);

//     console.log('📊 [Admin Dashboard] API results:', results.map(r => r.status));

//     const stats = results[0].status === "fulfilled" 
//       ? results[0].value.data 
//       : {
//           totalStudents: 0,
//           totalTeachers: 0,
//           totalClasses: 0,
//           totalAssignments: 0,
//           attendanceRate: 0
//         };

//     const studentSummary =
//       results[1].status === "fulfilled" && Array.isArray(results[1].value.data)
//         ? results[1].value.data
//         : [];

//     const lowAttendance =
//       results[2].status === "fulfilled" && Array.isArray(results[2].value.data)
//         ? results[2].value.data
//         : [];

//     const teacherSummary =
//       results[3].status === "fulfilled" && Array.isArray(results[3].value.data)
//         ? results[3].value.data
//         : [];

//     console.log('📊 [Admin Dashboard] Data loaded:', {
//       stats,
//       studentSummaryCount: studentSummary.length,
//       lowAttendanceCount: lowAttendance.length,
//       teacherSummaryCount: teacherSummary.length
//     });

//     setData({
//       stats,
//       studentSummary,
//       lowAttendance,
//       teacherSummary,
//     });
//   } catch (error: any) {
//     console.error("❌ [Admin Dashboard] Failed to fetch dashboard data:", error);
//     setError("Failed to load dashboard data. Please try again.");
//   } finally {
//     setLoading(false);
//   }
// };


//   if (loading) return <LoadingSpinner />;

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={fetchDashboardData}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const statCards = [
//     {
//       label: 'Total Students',
//       value: data.stats.totalStudents || data.studentSummary.length,
//       icon: Users,
//       bgGradient: 'from-blue-50 to-indigo-100',
//       iconColor: 'text-blue-600',
//       trend: 'Active',
//     },
//     {
//       label: 'Low Attendance',
//       value: data.lowAttendance.length,
//       icon: UserX,
//       bgGradient: 'from-red-50 to-rose-100',
//       iconColor: 'text-red-600',
//       trend: 'Requires attention',
//     },
//     {
//       label: 'Total Teachers',
//       value: data.stats.totalTeachers || data.teacherSummary.length,
//       icon: GraduationCap,
//       bgGradient: 'from-purple-50 to-violet-100',
//       iconColor: 'text-purple-600',
//       trend: 'Teaching staff',
//     },
//     {
//       label: 'Good Attendance',
//       value: (data.stats.totalStudents || data.studentSummary.length) - data.lowAttendance.length,
//       icon: UserCheck,
//       bgGradient: 'from-emerald-50 to-teal-100',
//       iconColor: 'text-emerald-600',
//       trend: '≥75%',
//     },
//   ];

//   return (
//     <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-indigo-50 to-purple-50 min-h-screen">
//       {/* Header */}
//       <div className="animate-slide-up">
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
//           Admin Dashboard
//         </h1>
//         <p className="text-neutral-600">Monitor and manage your institution's performance at a glance.</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statCards.map((stat, index) => {
//           const Icon = stat.icon;
//           return (
//             <div
//               key={stat.label}
//               className="animate-slide-up"
//               style={{ animationDelay: `${index * 100}ms` }}
//             >
//               <Card className={`bg-gradient-to-br ${stat.bgGradient} border-2 border-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group`}>
//                 {/* Animated shine effect */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                
//                 {/* Decorative elements */}
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-10 -translate-y-10"></div>
                
//                 <div className="relative">
//                   <div className="flex items-start justify-between mb-3">
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-neutral-700 mb-2">{stat.label}</p>
//                       <p className="text-4xl font-bold text-neutral-800 mb-2">{stat.value}</p>
//                       <div className="flex items-center gap-1 text-xs font-semibold text-neutral-600">
//                         <TrendingUp size={14} />
//                         <span>{stat.trend}</span>
//                       </div>
//                     </div>
//                     <div className={`p-4 rounded-2xl bg-white shadow-lg ${stat.iconColor} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
//                       <Icon size={28} strokeWidth={2.5} />
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             </div>
//           );
//         })}
//       </div>

//       {/* Low Attendance Students */}
//       <Card 
//         title="Students with Low Attendance (<75%)" 
//         className="animate-slide-up shadow-lg border-2 border-white"
//         style={{ animationDelay: '400ms' }}
//       >
//         {data.lowAttendance.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
//               <CheckCircle className="text-emerald-600" size={40} />
//             </div>
//             <p className="text-lg font-semibold text-neutral-800 mb-1">Excellent Attendance!</p>
//             <p className="text-neutral-600">All students are maintaining good attendance records.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto rounded-lg border-2 border-neutral-100">
//             <table className="min-w-full divide-y divide-neutral-200">
//               <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">
//                     Roll Number
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">
//                     Attendance %
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-neutral-100">
//                 {data.lowAttendance.map((student: any, idx: number) => (
//                   <tr 
//                     key={student._id} 
//                     className="hover:bg-red-50 transition-colors duration-200 animate-slide-up"
//                     style={{ animationDelay: `${500 + idx * 50}ms` }}
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center text-red-600 font-bold shadow-sm">
//                           {student.studentName.charAt(0)}
//                         </div>
//                         <span className="font-medium text-neutral-800">{student.studentName}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="text-neutral-700 font-mono text-sm">{student.rollNumber}</span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center gap-2">
//                         <span className="text-red-600 font-bold text-lg">
//                           {formatPercentage(student.attendancePercentage)}
//                         </span>
//                         <div className="flex-1 max-w-[100px]">
//                           <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
//                             <div 
//                               className="h-full bg-red-500 rounded-full transition-all duration-500"
//                               style={{ width: `${student.attendancePercentage}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
//                         <AlertCircle size={14} />
//                         Critical
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </Card>

//       {/* Teacher Presence Summary */}
//       <Card 
//         title="Teacher Presence Summary" 
//         className="animate-slide-up shadow-lg border-2 border-white"
//         style={{ animationDelay: '600ms' }}
//       >
//         {data.teacherSummary.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-100 rounded-full mb-4">
//               <GraduationCap className="text-neutral-400" size={40} />
//             </div>
//             <p className="text-lg font-semibold text-neutral-800 mb-1">No Data Available</p>
//             <p className="text-neutral-600">Teacher presence data will appear here.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto rounded-lg border-2 border-neutral-100">
//             <table className="min-w-full divide-y divide-neutral-200">
//               <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">
//                     Teacher ID
//                   </th>
//                   <th className="px-6 py-4 text-center text-xs font-bold text-neutral-700 uppercase tracking-wider">
//                     Present
//                   </th>
//                   <th className="px-6 py-4 text-center text-xs font-bold text-neutral-700 uppercase tracking-wider">
//                     Absent
//                   </th>
//                   <th className="px-6 py-4 text-center text-xs font-bold text-neutral-700 uppercase tracking-wider">
//                     Leave
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-neutral-100">
//                 {data.teacherSummary.map((teacher: any, idx: number) => (
//                   <tr 
//                     key={teacher._id} 
//                     className="hover:bg-purple-50 transition-colors duration-200 animate-slide-up"
//                     style={{ animationDelay: `${700 + idx * 50}ms` }}
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center text-purple-600 font-bold shadow-sm">
//                           {teacher.teacherName.charAt(0)}
//                         </div>
//                         <span className="font-medium text-neutral-800">{teacher.teacherName}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="text-neutral-700 font-mono text-sm">{teacher.teacherId}</span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                       <span className="inline-flex items-center justify-center min-w-[60px] px-3 py-1.5 rounded-lg text-sm font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
//                         {teacher.present}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                       <span className="inline-flex items-center justify-center min-w-[60px] px-3 py-1.5 rounded-lg text-sm font-bold bg-red-100 text-red-700 border border-red-200">
//                         {teacher.absent}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                       <span className="inline-flex items-center justify-center min-w-[60px] px-3 py-1.5 rounded-lg text-sm font-bold bg-amber-100 text-amber-700 border border-amber-200">
//                         {teacher.leave}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </Card>

//       {/* Quick Stats Summary */}
//       <div className="grid md:grid-cols-3 gap-6">
//         <Card 
//           className="animate-slide-up bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl border-none relative overflow-hidden"
//           style={{ animationDelay: '800ms' }}
//         >
//           <div className="absolute -top-8 -right-8 text-9xl opacity-10">📊</div>
//           <div className="relative">
//             <Users size={40} className="mb-3 opacity-90" />
//             <h3 className="text-2xl font-bold mb-1">{data.stats.totalStudents || data.studentSummary.length}</h3>
//             <p className="text-blue-100 text-sm">Total Students Enrolled</p>
//           </div>
//         </Card>

//         <Card 
//           className="animate-slide-up bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl border-none relative overflow-hidden"
//           style={{ animationDelay: '900ms' }}
//         >
//           <div className="absolute -top-8 -right-8 text-9xl opacity-10">👨‍🏫</div>
//           <div className="relative">
//             <GraduationCap size={40} className="mb-3 opacity-90" />
//             <h3 className="text-2xl font-bold mb-1">{data.stats.totalTeachers || data.teacherSummary.length}</h3>
//             <p className="text-purple-100 text-sm">Active Teachers</p>
//           </div>
//         </Card>

//         <Card 
//           className="animate-slide-up bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl border-none relative overflow-hidden"
//           style={{ animationDelay: '1000ms' }}
//         >
//           <div className="absolute -top-8 -right-8 text-9xl opacity-10">✅</div>
//           <div className="relative">
//             <CheckCircle size={40} className="mb-3 opacity-90" />
//             <h3 className="text-2xl font-bold mb-1">
//               {data.stats.attendanceRate 
//                 ? `${data.stats.attendanceRate}%`
//                 : (data.studentSummary.length === 0
//                     ? "0%"
//                     : (
//                         (1 - data.lowAttendance.length / data.studentSummary.length) *
//                         100
//                       ).toFixed(1) + "%")
//               }
//             </h3>
//             <p className="text-emerald-100 text-sm">Good Attendance Rate</p>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as adminApi from '@/api/admin.api';
import {
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';
import { formatPercentage } from '@/utils/formatters';

interface Student {
  _id: string;
  studentName: string;
  enrollmentNumber: string;
  attendancePercentage: number;
}

interface Teacher {
  _id: string;
  teacherName: string;
  teacherId: string;
  present: number;
  absent: number;
  leave: number;
}

interface DashboardData {
  stats: {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    totalAssignments: number;
    attendanceRate: number;
  };
  studentSummary: Student[];
  lowAttendance: Student[];
  teacherSummary: Teacher[];
}

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalStudents: 0,
      totalTeachers: 0,
      totalClasses: 0,
      totalAssignments: 0,
      attendanceRate: 0,
    },
    studentSummary: [],
    lowAttendance: [],
    teacherSummary: [],
  });
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = React.useCallback(async () => {
    try {
      setError(null);
      const results = await Promise.allSettled([
        adminApi.getDashboardStats(),
        adminApi.getStudentAttendanceSummary(),
        adminApi.getLowAttendanceStudents(),
        adminApi.getFacultyPresenceSummary(),
      ]);

      setData({
        stats:
          results[0].status === 'fulfilled'
            ? results[0].value.data
            : data.stats,
        studentSummary:
          results[1].status === 'fulfilled' ? results[1].value.data : [],
        lowAttendance:
          results[2].status === 'fulfilled' ? results[2].value.data : [],
        teacherSummary:
          results[3].status === 'fulfilled' ? results[3].value.data : [],
      });
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [data.stats]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AlertCircle className="text-red-500" size={32} />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Students',
      value: data.stats.totalStudents || data.studentSummary.length,
      icon: Users,
      bg: 'from-primary-100 to-primary-200',
      color: 'text-primary-700',
    },
    {
      label: 'Low Attendance',
      value: data.lowAttendance.length,
      icon: UserX,
      bg: 'from-danger-100 to-danger-200',
      color: 'text-danger-700',
    },
    {
      label: 'Total Faculty',
      value: data.stats.totalTeachers || data.teacherSummary.length,
      icon: GraduationCap,
      bg: 'from-accent-100 to-accent-200',
      color: 'text-accent-700',
    },
    {
      label: 'Good Attendance',
      value:
        (data.stats.totalStudents || data.studentSummary.length) -
        data.lowAttendance.length,
      icon: UserCheck,
      bg: 'from-success-100 to-success-200',
      color: 'text-success-700',
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-secondary-50 via-white to-secondary-100 min-h-screen overflow-x-hidden">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900">
          Admin Dashboard
        </h1>
        <p className="text-secondary-700 font-semibold text-sm md:text-base">
          Monitor and manage performance
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className={`bg-gradient-to-br ${s.bg} hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-white`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-secondary-800 font-bold">{s.label}</p>
                  <p className="text-3xl font-bold text-secondary-900">{s.value}</p>
                </div>
                <div className={`p-3 bg-white rounded-lg shadow-xl border-2 border-secondary-300 ${s.color}`}>
                  <Icon size={26} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* =========================
          MOBILE – LOW ATTENDANCE
      ========================= */}
      <div className="md:hidden space-y-4">
        <h2 className="font-bold text-lg text-secondary-900">Low Attendance Students</h2>
        {data.lowAttendance.map((s: Student) => (
          <Card key={s._id} className="space-y-2 border-l-4 border-l-danger-600">
            <p className="font-bold text-secondary-900">{s.studentName}</p>
            <p className="text-sm text-secondary-600 font-semibold">Enrollment: {s.enrollmentNumber}</p>
            <p className="text-danger-600 font-bold text-lg">
              {formatPercentage(s.attendancePercentage)}
            </p>
          </Card>
        ))}
      </div>

      {/* =========================
          DESKTOP – LOW ATTENDANCE
      ========================= */}
      <div className="hidden md:block">
        <Card title="Students with Low Attendance (<75%)" className="border-l-4 border-l-danger-600">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b-2 border-secondary-300">
                  <th className="p-3 text-left font-bold text-secondary-900">Name</th>
                  <th className="p-3 text-left font-bold text-secondary-900">Enrollment</th>
                  <th className="p-3 text-left font-bold text-secondary-900">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {data.lowAttendance.map((s: Student) => (
                  <tr key={s._id} className="border-b border-secondary-200 hover:bg-danger-50 transition-colors">
                    <td className="p-3 font-semibold text-secondary-800">{s.studentName}</td>
                    <td className="p-3 text-secondary-700 font-medium">{s.enrollmentNumber}</td>
                    <td className="p-3 text-danger-600 font-bold text-lg">
                      {formatPercentage(s.attendancePercentage)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* =========================
          MOBILE – FACULTY
      ========================= */}
      <div className="md:hidden space-y-4">
        <h2 className="font-bold text-lg text-secondary-900">Faculty Presence</h2>
        {data.teacherSummary.map((t: Teacher) => (
          <Card key={t._id} className="space-y-2 border-l-4 border-l-primary-600">
            <p className="font-bold text-secondary-900">{t.teacherName}</p>
            <div className="flex gap-4 text-sm">
              <span className="text-success-600 font-bold">P: {t.present}</span>
              <span className="text-danger-600 font-bold">A: {t.absent}</span>
              <span className="text-secondary-700 font-bold">L: {t.leave}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* =========================
          DESKTOP – FACULTY
      ========================= */}
      <div className="hidden md:block">
        <Card title="Faculty Presence Summary" className="border-l-4 border-l-primary-600">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b-2 border-secondary-300">
                  <th className="p-3 text-left font-bold text-secondary-900">Name</th>
                  <th className="p-3 text-center font-bold text-secondary-900">Present</th>
                  <th className="p-3 text-center font-bold text-secondary-900">Absent</th>
                  <th className="p-3 text-center font-bold text-secondary-900">Leave</th>
                </tr>
              </thead>
              <tbody>
                {data.teacherSummary.map((t: Teacher) => (
                  <tr key={t._id} className="border-b border-secondary-200 hover:bg-primary-50 transition-colors">
                    <td className="p-3 font-semibold text-secondary-800">{t.teacherName}</td>
                    <td className="p-3 text-center font-bold text-success-600">{t.present}</td>
                    <td className="p-3 text-center font-bold text-danger-600">{t.absent}</td>
                    <td className="p-3 text-center font-bold text-secondary-700">{t.leave}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
