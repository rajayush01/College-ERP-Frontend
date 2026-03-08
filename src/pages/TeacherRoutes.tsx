import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Sidebar } from '@/components/common/Sidebar';
import { TeacherDashboard } from '@/components/teacher/Dashboard';
import { TeacherProfile } from '@/components/teacher/Profile';
import { MyStudents } from '@/components/teacher/MyStudent';
import { AttendanceMarking } from '@/components/teacher/AttendanceMarking';
import { AssignmentCreate } from '@/components/teacher/AssignmentCreate';
import { MyAssignments } from '@/components/teacher/MyAssignments';
import { AssignmentGrading } from '@/components/teacher/AssignmentGrading';
import { MarksEntry } from '@/components/teacher/MarksEntry';
import { LeaveApplication } from '@/components/teacher/LeaveApplication';
import { LeaveHistory } from '@/components/teacher/LeaveHistory';
import { LeaveBalance } from '@/components/teacher/LeaveBalance';
import { TeacherNotifications } from '@/components/teacher/Notifications';
import { SendNotification } from '@/components/teacher/SendNotification';
import { TeacherLeaves } from '@/components/teacher/TeacherLeaves';
import { MyRequests } from '@/components/teacher/MyRequests';
import { Attendance } from '@/components/teacher/Attendance';
import { ExamList } from '@/components/teacher/ExamList';
import { SharedDocuments } from '@/components/teacher/SharedDocuments';
import { TeacherTimetable } from '@/components/teacher/TeacherTimetable';
import { TeacherMessage } from '@/components/teacher/TeacherMessage';

import { LayoutDashboard, User, Users, Calendar, BookOpen, ClipboardList, Briefcase, Bell, Send } from 'lucide-react';

export const TeacherRoutes: React.FC = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const menuItems = [
		{ path: '/teacher/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
		{ path: '/teacher/profile', label: 'Profile', icon: <User size={20} /> },
		{ path: '/teacher/students', label: 'My Students', icon: <Users size={20} /> },
		{ path: '/teacher/attendance', label: 'Mark Attendance', icon: <Calendar size={20} /> },
		{ path: '/teacher/assignments', label: 'Assignments', icon: <BookOpen size={20} /> },
		{ path: '/teacher/marks', label: 'Enter Marks', icon: <ClipboardList size={20} /> },
		{ path: '/teacher/leaves', label: 'My Leaves', icon: <Briefcase size={20} /> },
		{ path: '/teacher/notifications', label: 'Notifications', icon: <Bell size={20} /> },
		{ path: '/teacher/my-request', label: 'Send Request', icon: <Send size={20} /> },
		{ path: '/teacher/ExamList', label: 'Exam List', icon: <Send size={20} /> },
		{ path: '/teacher/shared-documents', label: 'Documents', icon: <Send size={20} /> },
		{ path: '/teacher/timetable', label: 'My Timetable', icon: <Send size={20} /> },
		{
			path: '/teacher/message-students',
			label: 'Message Students',
			icon: <Send size={20} />,
		},
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar onMenuClick={() => setSidebarOpen(true)} />

			<div className="flex">
				<Sidebar items={menuItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

				<main className="flex-1 p-6">
					<Routes>
						<Route path="/dashboard" element={<TeacherDashboard />} />
						<Route path="/profile" element={<TeacherProfile />} />
						<Route path="/students" element={<MyStudents />} />
						<Route path="/attendance" element={<Attendance />} />
						<Route path="/assignments" element={<MyAssignments />} />
						<Route path="/assignments/create" element={<AssignmentCreate />} />
						<Route path="/assignments/:assignmentId/submissions" element={<AssignmentGrading />} />
						<Route path="/marks" element={<MarksEntry />} />
						<Route path="/leaves" element={<TeacherLeaves />} />
						<Route path="/leaves/apply" element={<LeaveApplication />} />
						<Route path="/leaves/balance" element={<LeaveBalance />} />
						<Route path="/notifications" element={<TeacherNotifications />} />
						<Route path="/send-notification" element={<SendNotification />} />
						<Route path="/my-request" element={<MyRequests />} />
						<Route path="/ExamList" element={<ExamList />} />
						<Route path="/shared-documents" element={<SharedDocuments />} />
						<Route path="/timetable" element={<TeacherTimetable />} />
					    <Route path="/message-students" element={<TeacherMessage />} />
					</Routes>
				</main>
			</div>
		</div>
	);
};
