export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^\d{10}$/;
  return re.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined;
};

export const validateDateRange = (startDate: string, endDate: string): boolean => {
  return new Date(startDate) <= new Date(endDate);
};

export const validateMarks = (marks: number, maxMarks: number): boolean => {
  return marks >= 0 && marks <= maxMarks;
};