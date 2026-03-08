import { Batch, Faculty, Student } from './common.types';

export interface CreateStudentData {
  name: string;
  enrollmentNumber: string;
  batchId: string;
  department: string;
  program: string;
  semester: number;
  fatherName?: string;
  motherName?: string;
  parentsEmail?: string;
  studentEmail?: string;
  address?: string;
  phoneNumbers?: string[]; 
  bloodGroup?: string;
  caste?: string;
  dob?: string;
  joinedDate?: string;
  image?: string;
}

export interface CreateTeacherData {
  name: string;
  email: string;
  designation?: string;
  department?: string;
  fatherName?: string;
  motherName?: string;

  phoneNumbers?: {
    label: 'primary' | 'secondary';
    number: string;
  }[];

  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  dob?: string;
  joinedDate?: string;
  bloodGroup?: string;
  maritalStatus?: string;
  partnerName?: string;

  qualifications?: {
    degree: string;
    institution: string;
    year: number;
  }[];

  image?: string;
}

export interface CreateBatchData {
  batchName: string;
  department: string;
  program: string;
  semester: number;
  academicSession?: string;
}

export interface Exam {
  _id: string;
  name: string;
  examType: 'MAJOR' | 'MINOR';
  batches: Batch[];
  subjects: ExamSubject[];
  status: 'CREATED' | 'EVALUATED' | 'PUBLISHED';
  publishedAt?: string;
  createdAt: string;
}

export interface ExamSubject {
  subject: string;
  maxMarks: number;
  teacher?: Faculty;
  teachers?: Faculty[];
}

export interface Leave {
  _id: string;
  teacher: Faculty;
  leaveType: 'PAID' | 'UNPAID';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: any;
  reviewedAt?: string;
  createdAt: string;
}

export interface LeavePolicy {
  _id: string;
  year: number;
  paidLeaveLimit: number;
  unpaidLeaveLimit: number;
}

export interface Request {
  _id: string;
  raisedBy: {
    role: string;
    userId: string;
  };
  targetModel: string;
  targetId: string;
  changes: ChangeItem[];
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: any;
  reviewedAt?: string;
  createdAt: string;
}

export interface ChangeItem {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface AttendanceRecord {
  _id: string;
  student: Student;
  batchId: Batch;
  subject: string;
  date: string;
  status: 'PRESENT' | 'ABSENT';
  markedBy: Faculty;
}

export interface DashboardSummary {
  studentAttendanceSummary: any[];
  lowAttendanceStudents: any[];
  facultyPresenceSummary: any[];
}