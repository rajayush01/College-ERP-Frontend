import { Class, Student, Teacher } from './common.types';

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: string;
  class: Class;
  section?: string;
  dueDate: string;
  attachments: AttachmentFile[];
  createdBy: Teacher;
  createdAt: string;
}

export interface AttachmentFile {
  fileName: string;
  fileUrl: string;
}

export interface AssignmentSubmission {
  _id: string;
  assignment: Assignment;
  student: Student;
  files: AttachmentFile[];
  submittedAt: string;
  marksObtained?: number;
  remarks?: string;
  gradedBy?: Teacher;
  gradedAt?: string;
}

export interface AssignmentAnalytics {
  totalStudents: number;
  submitted: number;
  pending: number;
  gradedCount: number;
  averageMarks: number;
}

export interface Mark {
  _id: string;
  exam: any;
  student: Student;
  subject: string;
  marksObtained: number;
  evaluatedBy: Teacher;
}

export interface TeacherExam {
  _id: string;
  name: string;
  class: Class;
  status: string;
  publishedAt?: string;
  subjects: {
    subject: string;
    maxMarks: number;
  }[];
}