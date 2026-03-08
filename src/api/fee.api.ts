import axios from './axios';

// Fee API - Updated to use correct axios import
// Admin Fee Structure APIs
export const createFeeStructure = async (data: FormData | any) => {
  const config = data instanceof FormData ? {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  } : {};
  
  return axios.post('/admin/fee-structures', data, config);
};

export const getAllFeeStructures = async (params?: any) => {
  return axios.get('/admin/fee-structures', { params });
};

export const getFeeStructureById = async (id: string) => {
  return axios.get(`/admin/fee-structures/${id}`);
};

export const updateFeeStructure = async (id: string, data: FormData | any) => {
  const config = data instanceof FormData ? {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  } : {};
  
  return axios.put(`/admin/fee-structures/${id}`, data, config);
};

export const deleteFeeStructure = async (id: string) => {
  return axios.delete(`/admin/fee-structures/${id}`);
};

export const getClassesForFeeStructure = async () => {
  return axios.get('/admin/fee-structures/classes');
};

// Admin Fee Record APIs
export const getAllFeeRecords = async (params?: any) => {
  return axios.get('/admin/fee-records', { params });
};

export const getFeeRecordByStudent = async (studentId: string, params?: any) => {
  return axios.get(`/admin/fee-records/student/${studentId}`, { params });
};

export const recordPayment = async (studentId: string, data: FormData) => {
  return axios.post(`/admin/fee-records/student/${studentId}/payment`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updatePaymentStatus = async (recordId: string, paymentId: string, data: any) => {
  return axios.put(`/admin/fee-records/${recordId}/payment/${paymentId}/status`, data);
};

export const updateFeeAdjustments = async (recordId: string, data: any) => {
  return axios.put(`/admin/fee-records/${recordId}/adjustments`, data);
};

export const getFeeStatistics = async (params?: any) => {
  return axios.get('/admin/fee-records/statistics', { params });
};

// Student Fee APIs
export const getMyFeeDetails = async (params?: any) => {
  return axios.get('/student/fees/my-fees', { params });
};

export const submitPayment = async (data: FormData) => {
  return axios.post('/student/fees/submit-payment', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getMyPaymentHistory = async (params?: any) => {
  return axios.get('/student/fees/payment-history', { params });
};

// Update fee record status
export const updateFeeRecordStatus = async (recordId: string, data: any) => {
  return axios.put(`/admin/fee-records/${recordId}/status`, data);
};