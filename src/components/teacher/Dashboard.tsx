import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as teacherApi from '@/api/teacher.api';
import {
  Users,
  BookOpen,
  Calendar,
  Bell,
  TrendingUp,
  CheckCircle,
  Send,
  Mail,
  Phone,
  MapPin,
  IdCard,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    assignedStudents: 0,
    assignments: 0,
    exams: 0,
    notifications: 0,
  });

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [students, assignments, exams, profileRes] = await Promise.all([
        teacherApi.getAssignedStudents(),
        teacherApi.getMyAssignments(),
        teacherApi.getMyExams(),
        teacherApi.getMyProfile(),
      ]);

      setStats({
        assignedStudents: students.data.reduce(
          (acc: number, cls: any) => acc + cls.students.length,
          0
        ),
        assignments: assignments.data.length,
        exams: exams.data.length,
        notifications: 0,
      });

      setProfile(profileRes.data.teacher);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const statCards = [
    {
      label: 'Assigned Students',
      value: stats.assignedStudents,
      icon: Users,
      color: 'text-primary-700',
      bg: 'bg-primary-100',
    },
    {
      label: 'Assignments',
      value: stats.assignments,
      icon: BookOpen,
      color: 'text-success-700',
      bg: 'bg-success-100',
    },
    {
      label: 'Exams',
      value: stats.exams,
      icon: Calendar,
      color: 'text-accent-700',
      bg: 'bg-accent-100',
    },
    {
      label: 'Notifications',
      value: stats.notifications,
      icon: Bell,
      color: 'text-secondary-800',
      bg: 'bg-secondary-200',
    },
  ];

  const quickActions = [
    {
      path: '/teacher/attendance',
      icon: CheckCircle,
      label: 'Mark Attendance',
      color: 'text-primary-700',
      bgHover: 'hover:bg-primary-50',
      borderColor: 'border-primary-300',
    },
    {
      path: '/teacher/assignments/create',
      icon: BookOpen,
      label: 'Create Assignment',
      color: 'text-success-700',
      bgHover: 'hover:bg-success-50',
      borderColor: 'border-success-300',
    },
    {
      path: '/teacher/marks',
      icon: TrendingUp,
      label: 'Enter Marks',
      color: 'text-accent-700',
      bgHover: 'hover:bg-accent-50',
      borderColor: 'border-accent-300',
    },
    {
      path: '/teacher/my-request',
      icon: Send,
      label: 'Raise Request',
      color: 'text-danger-700',
      bgHover: 'hover:bg-danger-50',
      borderColor: 'border-danger-300',
    },
  ];

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-secondary-50 via-white to-secondary-100 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">
          Teacher Dashboard
        </h1>
        <p className="text-secondary-700 font-semibold">
          Welcome back! Here's your overview for today.
        </p>
      </div>

      {/* PROFILE + STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: PROFILE CARD */}
        <Card className="lg:col-span-1 shadow-xl border-2 border-white">
          <div className="flex flex-col items-center text-center">
            {/* Profile Image or Avatar */}
            <div className="w-32 h-32 rounded-full mb-4 overflow-hidden shadow-2xl border-4 border-primary-600">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt={`${profile.name}'s profile`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to gradient avatar if image fails to load
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
                {profile?.name?.charAt(0) || 'T'}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-secondary-900">
              {profile?.name}
            </h2>

            <p className="text-sm text-secondary-600 flex items-center gap-1 mt-1 font-semibold">
              <IdCard size={14} />
              {profile?.teacherId}
            </p>

            <div className="mt-4 space-y-2 text-sm text-secondary-700 w-full font-semibold">
              <p className="flex items-center gap-2 justify-center border-b border-secondary-200 pb-2">
                <Mail size={16} /> {profile?.email}
              </p>
              <p className="flex items-center gap-2 justify-center border-b border-secondary-200 pb-2">
                <Phone size={16} />
                {profile?.phoneNumbers?.[0]?.number}
              </p>
              <p className="flex items-center gap-2 justify-center text-center">
                <MapPin size={16} />
                {profile?.address?.city}, {profile?.address?.state}
              </p>
            </div>

            <div className="mt-4 text-xs text-secondary-600 font-semibold">
              Joined on{' '}
              {new Date(profile?.joinedDate).toLocaleDateString()}
            </div>
          </div>
        </Card>

        {/* RIGHT: BIG STATS CARD */}
        <Card className="lg:col-span-2 shadow-xl border-2 border-secondary-300 border-l-4 border-l-primary-600">
          <h3 className="text-lg font-bold text-secondary-900 mb-4">
            Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`p-4 rounded-lg ${stat.bg} flex items-center justify-between hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-white`}
                >
                  <div>
                    <p className="text-sm text-secondary-800 font-bold">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-secondary-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg bg-white shadow-xl border-2 border-secondary-300 ${stat.color}`}
                  >
                    <Icon size={24} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* QUICK ACTIONS */}
      <Card
        title="Quick Actions"
        className="shadow-xl border-2 border-secondary-300 border-l-4 border-l-primary-600"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className={`p-6 border-2 ${action.borderColor} rounded-lg ${action.bgHover} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 bg-white`}
              >
                <div
                  className={`inline-flex p-4 rounded-lg bg-white shadow-xl border-2 border-secondary-300 ${action.color} mb-3`}
                >
                  <Icon size={32} />
                </div>
                <p className="font-bold text-secondary-800">
                  {action.label}
                </p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* MOTIVATION */}
      <Card className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white shadow-2xl border-2 border-primary-700">
        <h3 className="text-2xl font-bold mb-2">
          Ready to inspire today? 🎓
        </h3>
        <p className="text-white/90 font-medium">
          Your dedication shapes the future. Keep up the great work!
        </p>
      </Card>
    </div>
  );
};
