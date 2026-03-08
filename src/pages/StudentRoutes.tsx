import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Sidebar } from '@/components/common/Sidebar';
import { StudentDashboard } from '@/components/student/Dashboard';
import { StudentProfile } from '@/components/student/Profile';
import { MyTimetable } from '@/components/student/MyTimetable';
import { MyAttendance } from '@/components/student/MyAttendance';
import { MyAssignments } from '@/components/student/MyAssignments';
import { MyResults } from '@/components/student/MyResults';
import { ResultDetail } from '@/components/student/ResultDetail';
import { StudentRequestForm } from '@/components/student/RequestForm';
import { MyRequests } from '@/components/student/MyRequests';
import { StudentNotifications } from '@/components/student/Notifications';
import { SharedDocuments } from '@/components/student/SharedDocuments';
import { MyFees } from '@/components/student/MyFees';

import {
  LayoutDashboard,
  User,
  Calendar,
  UserCheck,
  BookOpen,
  Award,
  FileText,
  Bell,
  Folder,
  DollarSign,
} from 'lucide-react';

export const StudentRoutes: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/student/profile', label: 'Profile', icon: <User size={20} /> },
    { path: '/student/timetable', label: 'Timetable', icon: <Calendar size={20} /> },
    { path: '/student/attendance', label: 'Attendance', icon: <UserCheck size={20} /> },
    { path: '/student/assignments', label: 'Assignments', icon: <BookOpen size={20} /> },
    { path: '/student/results', label: 'Results', icon: <Award size={20} /> },
    { path: '/student/fees', label: 'My Fees', icon: <DollarSign size={20} /> },
    { path: '/student/requests', label: 'Requests', icon: <FileText size={20} /> },
    { path: '/student/notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { path: '/student/documents', label: 'Documents', icon: <Folder size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar items={menuItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/timetable" element={<MyTimetable />} />
            <Route path="/attendance" element={<MyAttendance />} />
            <Route path="/assignments" element={<MyAssignments />} />
            <Route path="/results" element={<MyResults />} />
            <Route path="/results/:examId" element={<ResultDetail />} />
            <Route path="/fees" element={<MyFees />} />
            <Route path="/requests" element={<MyRequests />} />
            <Route path="/requests/new" element={<StudentRequestForm />} />
            <Route path="/notifications" element={<StudentNotifications />} />
            <Route path="/documents" element={<SharedDocuments />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};