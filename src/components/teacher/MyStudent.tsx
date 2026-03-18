import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as teacherApi from '@/api/teacher.api';
import { X } from 'lucide-react';

export const MyStudents: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await teacherApi.getAssignedStudents();
        setClasses(response.data);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-blue-50 to-cyan-50 min-h-screen">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          My Students
        </h1>
        <p className="text-neutral-600">
          View students assigned to your batches
        </p>
      </div>

      {classes.length === 0 ? (
        <Card>
          <p className="text-neutral-500">No students assigned</p>
        </Card>
      ) : (
        classes.map((cls, idx) => (
          <Card
            key={cls.batchId}
            title={cls.batchName}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full divide-y">
                <thead className="bg-neutral-100">
                  <tr>
                    {[
                      'Student ID',
                      'Name',
                      'Enrollment Number',
                      'Department',
                      'Semester',
                      'Parent Name',
                      'Contact',
                    ].map(h => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-bold uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y">
                  {cls.students.map((s: any) => (
                    <tr
                      key={s._id}
                      onClick={() => setSelectedStudent(s)}
                      className="cursor-pointer hover:bg-blue-50 transition"
                    >
                      <td className="px-6 py-4 font-mono text-sm">
                        {s.studentId}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {s.name}
                      </td>
                      <td className="px-6 py-4">
                        {s.enrollmentNumber}
                      </td>
                      <td className="px-6 py-4">
                        {s.department}
                      </td>
                      <td className="px-6 py-4">
                        {s.semester}
                      </td>
                      <td className="px-6 py-4">
                        {s.fatherName}
                      </td>
                      <td className="px-6 py-4">
                        {s.phoneNumbers?.[0] || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))
      )}

      {/* STUDENT MODAL */}
      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

/* ================= MODAL ================= */

const StudentModal = ({
  student,
  onClose,
}: {
  student: any;
  onClose: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[calc(100vh-3rem)] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — fixed */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <div>
            <h2 className="text-xl font-bold text-neutral-800">Student Details</h2>
            <p className="text-sm text-neutral-500">{student.name} · {student.studentId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <Info label="Student ID" value={student.studentId} />
            <Info label="Enrollment Number" value={student.enrollmentNumber} />
            <Info label="Name" value={student.name} />
            <Info label="Department" value={student.department} />
            <Info label="Program" value={student.program} />
            <Info label="Semester" value={student.semester} />
            <Info label="Father Name" value={student.fatherName || '—'} />
            <Info label="Mother Name" value={student.motherName || '—'} />
            <Info label="Parent Email" value={student.parentsEmail || '—'} />
            <Info label="Phone" value={student.phoneNumbers?.[0] || '—'} />
            <Info label="Blood Group" value={student.bloodGroup || '—'} />
            <Info label="Caste" value={student.caste || '—'} />
            <Info
              label="Date of Birth"
              value={student.dob ? new Date(student.dob).toLocaleDateString() : '—'}
            />
            <Info
              label="Joined Date"
              value={student.joinedDate ? new Date(student.joinedDate).toLocaleDateString() : '—'}
            />
            <div className="sm:col-span-2">
              <Info label="Address" value={student.address || '—'} />
            </div>
          </div>
        </div>

        {/* Footer — fixed */}
        <div className="px-6 py-4 border-t shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= INFO BLOCK ================= */

const Info = ({
  label,
  value,
}: {
  label: string;
  value: any;
}) => (
  <div className="p-3 rounded-lg border bg-neutral-50">
    <p className="text-xs text-neutral-500 mb-1">{label}</p>
    <p className="font-medium text-neutral-800">{value}</p>
  </div>
);
