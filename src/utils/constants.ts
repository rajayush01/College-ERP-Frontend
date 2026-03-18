export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const EXAM_TYPES = [
  { value: 'MAJOR', label: 'Major Exam' },
  { value: 'MINOR', label: 'Minor Exam' },
];

export const EXAM_STATUS = {
  CREATED: 'Created',
  EVALUATED: 'Evaluated',
  PUBLISHED: 'Published',
};

export const LEAVE_TYPES = [
  { value: 'PAID', label: 'Paid Leave' },
  { value: 'UNPAID', label: 'Unpaid Leave' },
];

export const LEAVE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  LEAVE: 'Leave',
};

export const NOTIFICATION_TARGETS = [
  { value: 'ALL_STUDENTS', label: 'All Students' },
  { value: 'ALL_TEACHERS', label: 'All Teachers' },
  { value: 'BATCH', label: 'Specific Batch' },
  { value: 'DEPARTMENT', label: 'Department' },
];

export const BLOOD_GROUPS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

export const MARITAL_STATUS = [
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' },
];

export const PROGRAMS = [
  'B.Tech',
  'M.Tech',
  'MBA',
  'MCA',
  'BCA',
];

export const DEPARTMENTS = [
  'CSE',
  'ECE',
  'EEE',
  'MECH',
  'CIVIL',
  'IT',
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const CASTES = [
  { value: 'General', label: 'General' },
  { value: 'OBC', label: 'OBC (Other Backward Class)' },
  { value: 'SC', label: 'SC (Scheduled Caste)' },
  { value: 'ST', label: 'ST (Scheduled Tribe)' },
  { value: 'EWS', label: 'EWS (Economically Weaker Section)' },
  { value: 'NT', label: 'NT (Nomadic Tribe)' },
  { value: 'SBC', label: 'SBC (Special Backward Class)' },
  { value: 'VJ', label: 'VJ (Vimukta Jati)' },
];

export const DESIGNATIONS = [
  { value: 'Professor', label: 'Professor' },
  { value: 'Associate Professor', label: 'Associate Professor' },
  { value: 'Assistant Professor', label: 'Assistant Professor' },
  { value: 'Lecturer', label: 'Lecturer' },
];