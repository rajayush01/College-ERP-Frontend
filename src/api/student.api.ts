import axios from './axios';

// Auth
export const studentLogin = (studentId: string, password: string) =>
  axios.post('/student/auth/login', { studentId, password });

// Profile
export const getMyProfile = () =>
  axios.get('/student/profile/me');

// Timetable
export const getMyTimetable = () =>
  axios.get('/student/timetable/me');

export const getMyTimetableDocuments = () =>
  axios.get("/student/timetable/me/documents");

// Attendance
export const getMyAttendance = (params?: any) =>
  axios.get('/student/attendance/me', { params });

// Assignments
export const getMyAssignments = () =>
  axios.get("/student/assignments/my");


/**
 * Student: Submit Assignment (FormData)
 */
export const submitAssignment = async (
  assignmentId: string,
  files: File[]
) => {
  console.log('🚀 [Student API] Submitting assignment:', {
    assignmentId,
    filesCount: files.length,
    fileNames: files.map(f => f.name),
    fileSizes: files.map(f => f.size)
  });

  if (!assignmentId) {
    throw new Error("assignmentId is required");
  }

  if (!files || files.length === 0) {
    throw new Error("At least one file is required");
  }

  const formData = new FormData();
  formData.append('assignmentId', assignmentId);
  
  files.forEach((file, index) => {
    console.log(`📎 [Student API] Adding file ${index + 1}:`, {
      name: file.name,
      type: file.type,
      size: file.size
    });
    formData.append('files', file);
  });

  try {
    console.log('📤 [Student API] Sending request to /student/assignments/submit');
    const response = await axios.post("/student/assignments/submit", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ [Student API] Assignment submitted successfully:', response.data);
    return response;
  } catch (error: any) {
    console.error('❌ [Student API] Assignment submission failed:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};


// View my submission
export const getMySubmission = (assignmentId: string) =>
  axios.get(`/student/assignments/${assignmentId}/submission`);

// Results
export const getMyResults = () =>
  axios.get('/student/results/my');

export const getMyResultByExam = (examId: string) =>
  axios.get(`/student/results/${examId}`);

// Requests
export const raiseRequest = (data: any) =>
  axios.post('/student/requests', data);

export const getMyRequests = () =>
  axios.get('/student/requests/my');

// Notifications
export const pollMyNotifications = () =>
  axios.get('/student/notifications');

export const markNotificationAsRead = (statusId: string) =>
  axios.patch(`/student/notifications/${statusId}/read`);

export const getUnreadCount = () =>
  axios.get('/student/notifications/unread-count');

// Fees
export const getMyFeeDetails = (params?: any) =>
  axios.get('/student/fees/my-fees', { params });

export const submitPayment = (data: FormData) =>
  axios.post('/student/fees/submit-payment', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const getMyPaymentHistory = (params?: any) =>
  axios.get('/student/fees/payment-history', { params });