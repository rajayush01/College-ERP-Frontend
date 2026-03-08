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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-800"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Student Details
        </h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <Info label="Student ID" value={student.studentId} />
          <Info label="Name" value={student.name} />
          <Info label="Enrollment Number" value={student.enrollmentNumber} />
          <Info label="Department" value={student.department} />
          <Info label="Program" value={student.program} />
          <Info label="Semester" value={student.semester} />

          <Info label="Father Name" value={student.fatherName} />
          <Info label="Mother Name" value={student.motherName} />

          <Info
            label="Parent Email"
            value={student.parentsEmail || '—'}
          />
          <Info
            label="Phone"
            value={student.phoneNumbers?.[0] || '—'}
          />

          <Info label="Blood Group" value={student.bloodGroup} />
          <Info label="Caste" value={student.caste} />

          <Info
            label="DOB"
            value={new Date(student.dob).toLocaleDateString()}
          />
          <Info
            label="Joined Date"
            value={new Date(student.joinedDate).toLocaleDateString()}
          />

          <div className="md:col-span-2">
            <Info label="Address" value={student.address} />
          </div>
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
