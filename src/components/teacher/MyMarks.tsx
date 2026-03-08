import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as teacherApi from '@/api/teacher.api';
import { ClipboardEdit, ArrowLeft } from 'lucide-react';

export const MarksEntry: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const examId = location.state?.examId;

  const [exam, setExam] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [subject, setSubject] = useState('');
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* -------------------- LOAD EXAM -------------------- */
  useEffect(() => {
    if (!examId) {
      navigate('/teacher/exams');
      return;
    }

    const loadExam = async () => {
      try {
        const res = await teacherApi.getMyExams();
        const found = res.data.find((e: any) => e._id === examId);
        if (!found) {
          alert('Exam not found');
          navigate('/teacher/exams');
          return;
        }
        setExam(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [examId]);

  /* -------------------- LOAD STUDENTS -------------------- */
  useEffect(() => {
    if (!exam?.classes?.length) return;

    // For now: load students from first class
    // (same logic you were already using)
    const loadStudents = async () => {
      try {
        const classId = exam.classes[0]._id;
        const res = await teacherApi.getAssignedStudents();
        const cls = res.data.find((c: any) => c.classId === classId);
        if (cls) {
          setStudents(cls.students);
          const initial: any = {};
          cls.students.forEach((s: any) => (initial[s._id] = 0));
          setMarks(initial);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadStudents();
  }, [exam]);

  /* -------------------- SUBJECT OPTIONS -------------------- */
  const subjectOptions = useMemo(() => {
    if (!exam) return [];
    return exam.subjects.map((s: any) => ({
      value: s.subject,
      label: s.subject,
    }));
  }, [exam]);

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async () => {
    if (!subject) return alert('Select subject');

    setSubmitting(true);
    try {
      await teacherApi.submitMarks({
        examId,
        subject,
        records: Object.entries(marks).map(([studentId, marksObtained]) => ({
          studentId,
          marksObtained,
        })),
      });

      alert('Marks submitted successfully');
      navigate('/teacher/exams');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit marks');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-indigo-50 to-purple-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Enter Marks
          </h1>
          <p className="text-neutral-600">{exam.name}</p>
        </div>
      </div>

      {/* META */}
      <Card className="shadow-lg border-2 border-white">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-neutral-500 mb-1">Batches</p>
            <p className="font-semibold">
              {exam.classes.map((c: any) => c.batchName || `${c.name}`).join(', ')}
            </p>
          </div>

          <Select
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            options={subjectOptions}
          />
        </div>
      </Card>

      {/* STUDENT TABLE */}
      <Card className="shadow-lg border-2 border-white">
        {students.length === 0 ? (
          <p className="text-neutral-500">No students found</p>
        ) : (
          <div className="space-y-3">
            {students.map((s) => (
              <div
                key={s._id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-indigo-50"
              >
                <span className="font-medium">
                  {s.enrollmentNumber} · {s.name}
                </span>
                <Input
                  type="number"
                  min={0}
                  value={marks[s._id] ?? 0}
                  onChange={(e) =>
                    setMarks({
                      ...marks,
                      [s._id]: Number(e.target.value),
                    })
                  }
                  className="w-24"
                />
              </div>
            ))}
          </div>
        )}

        <div className="pt-6">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2"
          >
            <ClipboardEdit size={18} />
            {submitting ? 'Submitting…' : 'Submit Marks'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
