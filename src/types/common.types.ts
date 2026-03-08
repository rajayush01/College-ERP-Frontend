export interface User {
  id: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  name: string;
  email?: string;
  studentId?: string;
  teacherId?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  admin?: any;
  teacher?: any;
  student?: any;
}

export interface ApiError {
  message: string;
  errors?: any;
}

export interface Batch {
  _id: string;
  batchName: string;
  department: string;
  program: string;
  semester: number;
  academicSession?: string;
  batchAdvisor?: Faculty;
  subjectFaculty: SubjectFaculty[];
}

export interface SubjectFaculty {
  subject: string;
  faculty: Faculty;
}

export interface Faculty {
  _id: string;
  teacherId: string;
  name: string;
  email: string;
  designation?: string;
  department?: string;
  phoneNumbers?: Array<{
    label: 'primary' | 'secondary';
    number: string;
  }>;
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
  image?: string;
  qualifications?: Qualification[];
}

export interface Qualification {
  degree: string;
  institution: string;
  year: number;
}

export interface Student {
  _id: string;
  studentId: string;
  name: string;
  enrollmentNumber: string;
  batchId: Batch | string;
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

export interface Notification {
  _id: string;
  notification: {
    _id: string;
    title: string;
    message: string;
    createdAt: string;
    createdBy: string;
  };
  isRead: boolean;
  createdAt: string;
}

export interface SharedDocument {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  uploadedBy: any;
  visibleTo: string[];
  createdAt: string;
}

export interface Timetable {
  _id: string;
  batchId: string;
  day: string;
  periods: Period[];
}

export interface Period {
  periodNumber: number;
  subject: string;
  faculty: Faculty;
  startTime: string;
  endTime: string;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  pages: number;
  data: T[];
}

// Legacy type aliases for backward compatibility during migration
export type Class = Batch;
export type Teacher = Faculty;