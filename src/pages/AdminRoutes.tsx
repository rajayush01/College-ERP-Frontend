import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Sidebar } from '@/components/common/Sidebar';
import { AdminDashboard } from '@/components/admin/Dashboard';
import { StudentManagement } from '@/components/admin/StudentManagement';
import { TeacherManagement } from '@/components/admin/TeacherManagement';
import { BatchManagement } from '@/components/admin/BatchManagement';
import { TimetableManagement } from '@/components/admin/TimetableManagement';
import { ExamManagement } from '@/components/admin/ExamManagement';
import { FeeManagement } from '@/components/admin/FeeManagement';
import { LeaveManagement } from '@/components/admin/LeaveManagement';
import { LeavePolicyManagement } from '@/components/admin/LeavePolicyManagement';
import { RequestManagement } from '@/components/admin/RequestManagement';
import { DocumentManagement } from '@/components/admin/DocumentManagement';
import { NotificationSender } from '@/components/admin/NotificationSender';
import { TeacherAttendance } from '@/components/admin/TeacherAttendance';
import { SubjectManagement } from '@/components/admin/SubjectManagement';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardList,
  DollarSign,
  Briefcase,
  Settings,
  FileText,
  Bell,
  UserCheck,
} from 'lucide-react';

export const AdminRoutes: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/students', label: 'Students', icon: <Users size={20} /> },
    { path: '/admin/teachers', label: 'Faculty', icon: <GraduationCap size={20} /> },
    { path: '/admin/batches', label: 'Batches', icon: <BookOpen size={20} /> },
    { path: '/admin/timetable', label: 'Timetable', icon: <Calendar size={20} /> },
    { path: '/admin/exams', label: 'Exams', icon: <ClipboardList size={20} /> },
    { path: '/admin/fees', label: 'Fee Management', icon: <DollarSign size={20} /> },
    { path: '/admin/leaves', label: 'Leaves', icon: <Briefcase size={20} /> },
    { path: '/admin/leave-policy', label: 'Leave Policy', icon: <Settings size={20} /> },
    { path: '/admin/requests', label: 'Requests', icon: <FileText size={20} /> },
    { path: '/admin/documents', label: 'Documents', icon: <FileText size={20} /> },
    { path: '/admin/notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { path: '/admin/teacher-attendance', label: 'Faculty Attendance', icon: <UserCheck size={20} /> },
    { path: '/admin/subjects', label: 'Subjects', icon: <BookOpen size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar items={menuItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/students" element={<StudentManagement />} />
            <Route path="/teachers" element={<TeacherManagement />} />
            <Route path="/batches" element={<BatchManagement />} />
            <Route path="/timetable" element={<TimetableManagement />} />
            <Route path="/exams" element={<ExamManagement />} />
            <Route path="/fees" element={<FeeManagement />} />
            <Route path="/leaves" element={<LeaveManagement />} />
            <Route path="/leave-policy" element={<LeavePolicyManagement />} />
            <Route path="/requests" element={<RequestManagement />} />
            <Route path="/documents" element={<DocumentManagement />} />
            <Route path="/notifications" element={<NotificationSender />} />
            <Route path="/teacher-attendance" element={<TeacherAttendance />} />
            <Route path="/subjects" element={<SubjectManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};