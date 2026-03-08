import { Assignment, AssignmentSubmission } from './teacher.types';

export interface AssignmentWithSubmission extends Assignment {
  submission: AssignmentSubmission | null;
}

export interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  attendancePercentage: number;
}

export interface AttendanceData {
  summary: AttendanceSummary;
  records: AttendanceRecord[];
}

export interface AttendanceRecord {
  _id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT';
}

export interface Result {
  examId: string;
  examName: string;
  examType: 'MAJOR' | 'MINOR';
  subjects: SubjectResult[];
  totalObtained: number;
  totalMax: number;
  percentage: string;
  publishedAt: string;
}

export interface SubjectResult {
  subject: string;
  marksObtained: number;
  maxMarks: number;
}