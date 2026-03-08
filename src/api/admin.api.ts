import axios from './axios';
import { CreateStudentData, CreateTeacherData } from '@/types/admin.types';

// Auth
export const adminLogin = (email: string, password: string) =>
  axios.post('/admin/auth/login', { email, password });

// Students
export const createStudent = (data: CreateStudentData, photo?: File) => {
  const formData = new FormData();
  
  // Add all student data
  Object.keys(data).forEach(key => {
    const value = (data as any)[key];
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        // For objects, stringify them
        formData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  // Add photo if provided
  if (photo) {
    formData.append('photo', photo);
  }

  return axios.post('/admin/students', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const listStudents = (params?: any) =>
  axios.get('/admin/students', { params });

export const getStudentById = (id: string) =>
  axios.get(`/admin/students/${id}`);

export const listBatches = () =>
  axios.get("/admin/batches");

// Teachers
export const createTeacher = (data: CreateTeacherData, photo?: File) => {
  const formData = new FormData();
  
  // Add all teacher data
  Object.keys(data).forEach(key => {
    const value = (data as any)[key];
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        // For objects (like address), stringify them
        formData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  // Add photo if provided
  if (photo) {
    formData.append('photo', photo);
  }

  return axios.post('/admin/teachers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const listTeachers = (params?: any) =>
  axios.get('/admin/teachers', { params });

export const getTeacherById = (id: string) =>
  axios.get(`/admin/teachers/${id}`);

export const getTeachersForDropdown = () =>
  axios.get("/admin/teachers/dropdown");

export const updateTeacher = (id: string, data: any, photo?: File) => {
  const formData = new FormData();
  
  // Add all teacher data
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        // For objects (like address), stringify them
        formData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  // Add photo if provided
  if (photo) {
    formData.append('photo', photo);
  }

  return axios.patch(`/admin/teachers/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Batch Management
export const createBatch = (data: {
  batchName: string;
  department: string;
  program: string;
  semester: number;
  academicSession?: string;
}) =>
  axios.post("/admin/batches", data);

// Assign / update batch advisor
export const assignBatchAdvisor = (batchId: string, facultyId: string) =>
  axios.patch(`/admin/batches/${batchId}/batch-advisor`, { facultyId });

// Assign / update subject faculty
export const assignSubjectFaculty = (
  batchId: string,
  subject: string,
  facultyId: string
) =>
  axios.patch(`/admin/batches/${batchId}/subject-faculty`, {
    subject,
    facultyId
  });

export const getAllBatches = () =>
  axios.get("/admin/batches");

// Teacher Attendance Report (Day / Week / Month)
export const getTeacherAttendanceReport = (params?: {
  type?: 'day' | 'week' | 'month';
  date?: string;
}) =>
  axios.get('/admin/teacher-attendance', { params });

// Timetable
export const upsertTimetable = (data: any) =>
  axios.post('/admin/timetable', data);

export const getBatchTimetable = (batchId: string) =>
  axios.get(`/admin/timetable/${batchId}`);

// Exams
export const createExam = (data: any) =>
  axios.post('/admin/exam', data);

export const getAllExams = () =>
  axios.get('/admin/exam');

// Enable / Disable exam (toggle isActive)
export const toggleExamStatus = (examId: string) =>
  axios.patch(`/admin/exam/${examId}/toggle`);

// Delete exam (only if not published)
export const deleteExam = (examId: string) =>
  axios.delete(`/admin/exam/${examId}`);

export const publishResults = (examId: string) =>
  axios.post(`/admin/exam-publish/${examId}/publish`);

// Leaves
export const getAllLeaves = (status?: string) =>
  axios.get('/admin/leaves', { params: { status } });

export const updateLeaveStatus = (leaveId: string, status: string) =>
  axios.patch(`/admin/leaves/${leaveId}`, { status });

export const getLeaveSummary = () =>
  axios.get('/admin/leaves/summary');

export const getTeacherLeaveHistory = (teacherId: string) =>
  axios.get(`/admin/leaves/teacher/${teacherId}`);

export const getTeacherLeaveBalance = (teacherId: string, year: number) =>
  axios.get('/admin/leaves/balance', { params: { teacherId, year } });

export const updateStudent = (id: string, data: any, photo?: File) => {
  const formData = new FormData();
  
  // Add all student data
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        // For objects, stringify them
        formData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  // Add photo if provided
  if (photo) {
    formData.append('photo', photo);
  }

  return axios.patch(`/admin/students/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Leave Policy
export const setLeavePolicy = (data: any) =>
  axios.post('/admin/leave-policy', data);

// Requests
export const getAllRequests = () =>
  axios.get('/admin/requests');

export const approveRequest = (requestId: string) =>
  axios.post(`/admin/requests/${requestId}/approve`);

export const rejectRequest = (requestId: string) =>
  axios.post(`/admin/requests/${requestId}/reject`);

// Documents
export const uploadDocument = async (
  file: File,
  data: {
    title: string;
    description?: string;
    visibleTo?: string[];
  }
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.visibleTo) formData.append('visibleTo', JSON.stringify(data.visibleTo));

  console.log('Uploading document:', {
    fileName: file.name,
    fileSize: file.size,
    title: data.title,
    description: data.description,
    visibleTo: data.visibleTo
  });

  try {
    const response = await axios.post("/admin/documents/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Upload successful:', response.data);
    return response;
  } catch (error: any) {
    console.error('Upload failed:', error.response?.data || error.message);
    throw error;
  }
};

export const getAllDocuments = () =>
  axios.get('/admin/documents');

// Notifications
export const sendNotification = (data: any) =>
  axios.post('/admin/notification', data);

// Attendance
export const viewStudentAttendance = (params: any) =>
  axios.get('/admin/student-attendance', { params });

export const markTeacherAttendance = (data: any) =>
  axios.post('/admin/teacher-attendance/mark', data);

// Dashboard
export const getDashboardStats = () =>
  axios.get('/admin/dashboard/stats');

export const getStudentAttendanceSummary = () =>
  axios.get('/admin/dashboard/student-attendance-summary');

export const getLowAttendanceStudents = (batchId?: string) =>
  axios.get('/admin/dashboard/low-attendance-students', { params: { batchId } });

export const getFacultyPresenceSummary = () =>
  axios.get('/admin/dashboard/faculty-presence-summary');

// Teacher Documents
export const uploadTeacherDocuments = async (
  teacherId: string,
  file: File,
  title: string
) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('title', title);

  return axios.post(`/admin/teachers/${teacherId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Student Documents
export const uploadStudentDocuments = async (
  studentId: string,
  file: File,
  title: string
) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('title', title);

  return axios.post(`/admin/students/${studentId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadTimetableDocument = async (
  file: File,
  batchId: string,
  title?: string
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('batchId', batchId);
  if (title) formData.append('title', title);

  return axios.post("/admin/timetable/upload/document", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const toggleTimetableDocument = (docId: string) =>
  axios.patch(`/admin/timetable/document/${docId}/toggle`);

// Get all uploaded timetable PDFs
export const getAllTimetableDocuments = () =>
  axios.get("/admin/timetable/documents/all");




// Class Management APIs
export const getAllClasses = () =>
  axios.get('/admin/classes');

export const createClass = (name: string, section: string) =>
  axios.post('/admin/classes', { name, section });

export const assignClassTeacher = (classId: string, teacherId: string) =>
  axios.post('/admin/classes/assign-teacher', { classId, teacherId });

export const assignSubjectTeacher = (classId: string, subject: string, teacherId: string) =>
  axios.post('/admin/classes/assign-subject-teacher', { classId, subject, teacherId });
