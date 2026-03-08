import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as studentApi from '@/api/student.api';
import {
  BookOpen,
  Calendar,
  FileText,
  Award,
  TrendingUp,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    assignments: 0,
    attendance: 0,
    results: 0,
    notifications: 0,
  });

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    console.log('🚀 [StudentDashboard] Component mounted');
    console.log('🔑 [StudentDashboard] Auth token:', localStorage.getItem('token') ? 'Present' : 'Missing');
    console.log('👤 [StudentDashboard] User data:', localStorage.getItem('user'));
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('📡 [StudentDashboard] Fetching dashboard data...');
      
      const [
        assignmentsRes,
        attendanceRes,
        resultsRes,
        notificationsRes,
        profileRes,
      ] = await Promise.all([
        studentApi.getMyAssignments().catch(err => {
          console.error('❌ [StudentDashboard] Assignments error:', err);
          return { data: [] };
        }),
        studentApi.getMyAttendance().catch(err => {
          console.error('❌ [StudentDashboard] Attendance error:', err);
          return { data: { summary: { attendancePercentage: 0 } } };
        }),
        studentApi.getMyResults().catch(err => {
          console.error('❌ [StudentDashboard] Results error:', err);
          return { data: [] };
        }),
        studentApi.getUnreadCount().catch(err => {
          console.error('❌ [StudentDashboard] Notifications error:', err);
          return { data: { unreadCount: 0 } };
        }),
        studentApi.getMyProfile().catch(err => {
          console.error('❌ [StudentDashboard] Profile error:', err);
          return { data: { student: null } };
        }),
      ]);

      console.log('✅ [StudentDashboard] Raw responses:', {
        assignments: assignmentsRes.data,
        attendance: attendanceRes.data,
        results: resultsRes.data,
        notifications: notificationsRes.data,
        profile: profileRes.data,
      });

      const assignmentsCount = Array.isArray(assignmentsRes.data) ? assignmentsRes.data.length : 0;
      const attendancePercent = attendanceRes.data?.summary?.attendancePercentage || 0;
      const resultsCount = Array.isArray(resultsRes.data) ? resultsRes.data.length : 0;
      const unreadCount = notificationsRes.data?.unreadCount || 0;

      console.log('📊 [StudentDashboard] Processed stats:', {
        assignments: assignmentsCount,
        attendance: attendancePercent,
        results: resultsCount,
        notifications: unreadCount,
        profileName: profileRes.data?.student?.name,
      });

      setStats({
        assignments: assignmentsCount,
        attendance: attendancePercent,
        results: resultsCount,
        notifications: unreadCount,
      });

      setProfile(profileRes.data?.student);

    } catch (error) {
      console.error('❌ [StudentDashboard] Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Debug panel data
  const debugInfo = {
    profileExists: !!profile,
    profileData: profile,
    stats,
    profileKeys: profile ? Object.keys(profile) : [],
  };

  const statCards = [
    {
      label: 'Assignments',
      value: stats.assignments,
      icon: BookOpen,
      bgGradient: 'from-primary-100 to-primary-200',
      iconColor: 'text-primary-700',
      subtext: 'Active tasks',
    },
    {
      label: 'Attendance',
      value: `${stats.attendance}%`,
      icon: Calendar,
      bgGradient: 'from-success-100 to-success-200',
      iconColor: 'text-success-700',
      subtext: 'Overall rate',
    },
    {
      label: 'Results',
      value: stats.results,
      icon: Award,
      bgGradient: 'from-accent-100 to-accent-200',
      iconColor: 'text-accent-700',
      subtext: 'Published',
    },
    {
      label: 'Notifications',
      value: stats.notifications,
      icon: FileText,
      bgGradient: 'from-secondary-200 to-secondary-300',
      iconColor: 'text-secondary-800',
      subtext: 'Unread',
    },
  ];

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-secondary-50 via-white to-secondary-100 min-h-screen">

      {/* DEBUG PANEL */}
      <Card className="bg-secondary-100 border-2 border-secondary-400 border-l-4 border-l-secondary-700">
        <h3 className="font-bold text-secondary-900 mb-2">🐛 Debug Info (Check Console for more details):</h3>
        <div className="text-xs space-y-2 text-secondary-800">
          <p><strong>Profile exists:</strong> {debugInfo.profileExists ? 'Yes' : 'No'}</p>
          <p><strong>Profile keys:</strong> {debugInfo.profileKeys.join(', ') || 'None'}</p>
          <details className="mt-2">
            <summary className="cursor-pointer font-semibold">View Full Profile Data</summary>
            <pre className="bg-white p-2 rounded overflow-auto max-h-60 mt-2 border border-secondary-300">
              {JSON.stringify(debugInfo.profileData, null, 2)}
            </pre>
          </details>
          <details className="mt-2">
            <summary className="cursor-pointer font-semibold">View Stats</summary>
            <pre className="bg-white p-2 rounded mt-2 border border-secondary-300">
              {JSON.stringify(debugInfo.stats, null, 2)}
            </pre>
          </details>
        </div>
      </Card>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">
          Student Dashboard
        </h1>
        <p className="text-secondary-700 font-semibold">
          Track your academic progress and stay on top of your goals! 🎯
        </p>
      </div>

      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: Student Profile */}
        <Card className="lg:col-span-1 shadow-xl border-2 border-white">
          <div className="flex flex-col items-center text-center p-6">

            <div className="w-28 h-28 rounded-full mb-4 overflow-hidden shadow-2xl border-4 border-primary-600">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt={`${profile.name}'s profile`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-full h-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white text-4xl font-bold ${profile?.image ? 'hidden' : 'flex'}`}
              >
                {profile?.name?.charAt(0) || 'S'}
              </div>
            </div>

            <h2 className="text-xl font-bold text-secondary-900">
              {profile?.name || 'Student'}
            </h2>

            <p className="text-sm text-secondary-600 mb-1 font-semibold">
              Student ID: {profile?.studentId || '—'}
            </p>

            <p className="text-sm text-secondary-600 mb-5 font-semibold">
              Enrollment No: {profile?.enrollmentNumber || '—'}
            </p>

            <div className="w-full space-y-3 text-sm">
              <div className="flex justify-between border-b border-secondary-200 pb-2">
                <span className="text-secondary-600 font-semibold">Department</span>
                <span className="font-bold text-secondary-900">
                  {profile?.department || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-secondary-200 pb-2">
                <span className="text-secondary-600 font-semibold">Semester</span>
                <span className="font-bold text-secondary-900">
                  {profile?.semester || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-secondary-200 pb-2">
                <span className="text-secondary-600 font-semibold">Program</span>
                <span className="font-bold text-secondary-900">
                  {profile?.program || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-secondary-200 pb-2">
                <span className="text-secondary-600 font-semibold">Email</span>
                <span className="font-bold text-secondary-900 truncate max-w-[160px]">
                  {profile?.studentEmail || profile?.parentsEmail || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-secondary-200 pb-2">
                <span className="text-secondary-600 font-semibold">Phone</span>
                <span className="font-bold text-secondary-900">
                  {profile?.phoneNumbers?.[0] || '—'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-secondary-600 font-semibold">Blood Group</span>
                <span className="font-bold text-secondary-900">
                  {profile?.bloodGroup || '—'}
                </span>
              </div>
            </div>
          </div>
        </Card>


        {/* RIGHT: Big Stats Box */}
        <Card className="lg:col-span-2 shadow-xl border-2 border-secondary-300 border-l-4 border-l-primary-600">
          <h3 className="text-lg font-bold mb-5 text-secondary-900">
            Academic Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`bg-gradient-to-br ${stat.bgGradient} rounded-lg p-5 relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-white`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-secondary-800">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-secondary-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-secondary-700 font-semibold">
                        {stat.subtext}
                      </p>
                    </div>

                    <div className={`p-3 bg-white rounded-lg shadow-xl border-2 border-secondary-300 ${stat.iconColor}`}>
                      <Icon size={26} />
                    </div>
                  </div>

                  {/* Attendance Progress */}
                  {stat.label === 'Attendance' && (
                    <div className="mt-4 h-3 bg-white rounded-full overflow-hidden border border-secondary-300">
                      <div
                        className="h-full bg-gradient-to-r from-success-600 to-success-500 rounded-full transition-all duration-700"
                        style={{ width: `${stats.attendance}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

      </div>

      {/* Motivation Card */}
      <Card className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white shadow-2xl border-2 border-primary-700">
        <TrendingUp size={44} className="mb-3 opacity-90" />
        <h3 className="text-2xl font-bold mb-2">
          Keep Going 🚀
        </h3>
        <p className="text-white/90 font-medium">
          Consistency today builds success tomorrow.
        </p>
      </Card>

    </div>
  );
};
