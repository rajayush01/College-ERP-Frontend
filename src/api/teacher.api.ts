import axios from './axios';
// Auth
export const facultyLogin = (facultyId: string, password: string) =>
  axios.post('/teacher/auth/login', { teacherId: facultyId, password });

// Legacy alias
export const teacherLogin = facultyLogin;

// Profile
export const getMyProfile = () =>
  axios.get('/teacher/profile/me');

// Students
export const getAssignedStudents = () =>
  axios.get('/teacher/students/assigned');

// Attendance
export const markStudentAttendance = (data: any) =>
  axios.post('/teacher/attendance/mark', data);

export const getBatchAttendance = (params: any) =>
  axios.get('/teacher/attendance', { params });

// Legacy alias
export const getClassAttendance = getBatchAttendance;

// Assignments
export const createAssignment = async (data: {
  title: string;
  description: string;
  subject: string;
  batchId: string;
  dueDate: string;
  files?: File[];
}) => {
  const formData = new FormData();
  
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('subject', data.subject);
  formData.append('batchId', data.batchId);
  formData.append('dueDate', data.dueDate);

  if (data.files) {
    data.files.forEach(file => {
      formData.append('attachments', file);
    });
  }

  console.log('🚀 [Faculty API] Creating assignment:', {
    title: data.title,
    batchId: data.batchId,
    filesCount: data.files?.length || 0
  });

  try {
    const response = await axios.post("/teacher/assignments", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ [Faculty API] Assignment created successfully');
    return response;
  } catch (error: any) {
    console.error('❌ [Faculty API] Assignment creation failed:', error.response?.data || error.message);
    throw error;
  }
};



export const getMyAssignments = () =>
  axios.get('/teacher/assignments/my');

// Assignment Grading
export const getAssignmentSubmissions = (assignmentId: string) =>
  axios.get(`/teacher/assignment-grading/${assignmentId}/submissions`);

export const gradeSubmission = (submissionId: string, data: any) =>
  axios.patch(`/teacher/assignment-grading/submission/${submissionId}/grade`, data);

export const getAssignmentAnalytics = (assignmentId: string) =>
  axios.get(`/teacher/assignment-grading/${assignmentId}/analytics`);

// Marks
export const getMyExams = () =>
  axios.get('/teacher/marks/exams');

export const submitMarks = (data: any) =>
  axios.post('/teacher/marks/submit', data);

export const getMyMarks = (params?: any) =>
  axios.get('/teacher/marks', { params });

// Leaves
export const applyLeave = (data: any) =>
  axios.post('/teacher/leaves/apply', data);

export const getMyLeaves = () =>
  axios.get('/teacher/leaves/my');

export const getMyLeaveBalance = () =>
  axios.get('/teacher/leaves/balance');

// Requests
export const raiseRequest = (data: any) =>
  axios.post('/teacher/requests', data);

export const getMyRequests = () =>
  axios.get('/teacher/requests/my');

// Notifications
export const pollMyNotifications = () =>
  axios.get('/teacher/notifications');

export const sendNotificationToStudents = (data: any) =>
  axios.post('/teacher/notifications/send', data);

export const markNotificationAsRead = (statusId: string) =>
  axios.patch(`/teacher/notifications/${statusId}/read`);

export const getAttendanceSummary = (params: {
  fromDate: string;
  toDate: string;
}) =>
  axios.get('/teacher/attendance/summary', { params });


// Shared Documents
export const getSharedDocuments = () =>
  axios.get('/teacher/shared-documents');

export const getMyBatchTimetable = (batchId: string) =>
  axios.get(`/teacher/timetable/${batchId}`);

// Legacy alias
export const getMyClassTimetable = getMyBatchTimetable;

export const getMyTimetableDocuments = () =>
  axios.get(`/teacher/timetable/timetable-documents`);


