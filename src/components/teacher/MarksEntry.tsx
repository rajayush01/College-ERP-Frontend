import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as teacherApi from '@/api/teacher.api';
import { ClipboardList } from 'lucide-react';

interface Student {
  _id: string;
  name: string;
  enrollmentNumber: string;
}

interface Exam {
  _id: string;
  name: string;
  batches: Array<{ _id: string; batchName: string }>;
  subjects: Array<{ subject: string }>;
}

export const MarksEntry: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const initialExamId = state?.examId;

  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState(initialExamId || '');
  const [students, setStudents] = useState<Student[]>([]);
  const [subject, setSubject] = useState('');
  const [records, setRecords] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch available exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        console.log('📡 [MarksEntry] Fetching exams...');
        const response = await teacherApi.getMyExams();
        console.log('✅ [MarksEntry] Exams:', response.data);
        setExams(response.data);
      } catch (error) {
        console.error('❌ [MarksEntry] Failed to fetch exams:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  // Load students when exam is selected
  useEffect(() => {
    if (!selectedExamId) {
      setStudents([]);
      setSubject('');
      setRecords({});
      return;
    }

    const loadStudents = async () => {
      try {
        console.log('📡 [MarksEntry] Loading students for exam:', selectedExamId);
        setLoading(true);

        const exam = exams.find((e) => e._id === selectedExamId);
        if (!exam || !exam.batches?.length) {
          console.warn('⚠️ [MarksEntry] No exam or batches found');
          setLoading(false);
          return;
        }

        const batchId = exam.batches[0]._id;
        console.log('📦 [MarksEntry] Loading batch:', batchId);

        const res = await teacherApi.getAssignedStudents();
        const batch = res.data.find((c: { batchId: string; students: Student[] }) => c.batchId === batchId);

        if (!batch) {
          console.warn('⚠️ [MarksEntry] Batch not found');
          setLoading(false);
          return;
        }

        console.log('👥 [MarksEntry] Students loaded:', batch.students.length);
        setStudents(batch.students);
        setSubject(exam.subjects?.[0]?.subject || '');

        // Initialize all students as 0 marks
        const initialRecords: Record<string, number> = {};
        batch.students.forEach((s: Student) => {
          initialRecords[s._id] = 0;
        });
        setRecords(initialRecords);
      } catch (error) {
        console.error('❌ [MarksEntry] Failed to load students:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [selectedExamId, exams]);

  const handleSubmit = async () => {
    if (!selectedExamId || !subject) {
      alert('Please select an exam');
      return;
    }

    if (students.length === 0) {
      alert('No students found for this exam');
      return;
    }

    try {
      setSubmitting(true);
      console.log('📝 [MarksEntry] Submitting marks:', {
        examId: selectedExamId,
        subject,
        recordsCount: Object.keys(records).length,
      });

      await teacherApi.submitMarks({
        examId: selectedExamId,
        subject,
        records: Object.entries(records).map(([studentId, marksObtained]) => ({
          studentId,
          marksObtained,
        })),
      });

      alert('Marks submitted successfully');
      navigate('/teacher/exams');
    } catch (error) {
      console.error('❌ [MarksEntry] Submit failed:', error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Failed to submit marks';
      alert(errorMessage || 'Failed to submit marks');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && exams.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-neutral-50 via-violet-50 to-purple-50 min-h-screen">
      <div className="flex items-center gap-3">
        <ClipboardList size={28} className="text-violet-600" />
        <div>
          <h1 className="text-3xl font-bold text-violet-700">Enter Marks</h1>
          <p className="text-neutral-600">Submit marks for your assigned exams</p>
        </div>
      </div>

      <Card>
        <div className="space-y-6">
          {/* Exam Selection */}
          <Select
            label="Select Exam"
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            options={exams.map((exam) => ({
              value: exam._id,
              label: exam.name,
            }))}
            required
          />

          {/* Show exam details if selected */}
          {selectedExamId && (
            <>
              {loading ? (
                <div className="text-center py-8">
                  <LoadingSpinner />
                  <p className="text-neutral-500 mt-2">Loading students...</p>
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  No students found for this exam
                </div>
              ) : (
                <>
                  <div className="p-4 bg-violet-50 rounded-lg border-2 border-violet-200">
                    <p className="text-sm text-violet-700">
                      <strong>Subject:</strong> {subject}
                    </p>
                    <p className="text-sm text-violet-700">
                      <strong>Total Students:</strong> {students.length}
                    </p>
                  </div>

                  {/* Marks Entry Table */}
                  <div className="overflow-x-auto rounded-lg border-2 border-neutral-100">
                    <table className="min-w-full divide-y divide-neutral-200">
                      <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase">
                            Enrollment No
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase">
                            Student Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase">
                            Marks Obtained
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-neutral-100">
                        {students.map((student) => (
                          <tr key={student._id} className="hover:bg-violet-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-mono text-sm text-neutral-700">
                                {student.enrollmentNumber}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-medium text-neutral-800">
                                {student.name}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="number"
                                min="0"
                                className="w-24 px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
                                value={records[student._id] || 0}
                                onChange={(e) =>
                                  setRecords({
                                    ...records,
                                    [student._id]: Number(e.target.value),
                                  })
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button 
                      onClick={handleSubmit} 
                      disabled={submitting}
                      className="flex items-center gap-2"
                    >
                      {submitting ? 'Submitting...' : 'Submit Marks'}
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => navigate('/teacher/exams')}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
