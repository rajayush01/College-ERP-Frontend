import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { MultiFileUpload } from '../common/MultiFileUpload';
import * as studentApi from '@/api/student.api';
import { formatDate } from '@/utils/formatters';
import {
  Upload,
  FileText,
  Calendar,
  BookOpen,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export const AssignmentSubmission: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);


  useEffect(() => {
    if (!assignmentId) return;

    const loadData = async () => {
      try {
        const [assignmentsRes, submissionRes] = await Promise.allSettled([
          studentApi.getMyAssignments(),
          studentApi.getMySubmission(assignmentId),
        ]);

        if (assignmentsRes.status === 'fulfilled') {
          const found = assignmentsRes.value.data.find(
            (a: any) => a._id === assignmentId
          );
          setAssignment(found || null);
        }

        if (submissionRes.status === 'fulfilled') {
          setSubmission(submissionRes.value.data);
        } else {
          setSubmission(null); // No submission yet
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [assignmentId]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log('📝 [Assignment Submission] Starting submission:', {
    assignmentId,
    filesCount: selectedFiles.length,
    fileNames: selectedFiles.map(f => f.name)
  });

  if (selectedFiles.length === 0) {
    alert("Please select at least one PDF file");
    return;
  }

  // Validate all files are PDFs
  const invalidFiles = selectedFiles.filter(file => file.type !== "application/pdf");
  if (invalidFiles.length > 0) {
    console.error('❌ [Assignment Submission] Invalid file types:', invalidFiles.map(f => ({ name: f.name, type: f.type })));
    alert("Only PDF files are allowed");
    return;
  }

  try {
    setSubmitting(true);
    console.log('📤 [Assignment Submission] Calling API...');
    
    await studentApi.submitAssignment(assignmentId!, selectedFiles);
    
    console.log('✅ [Assignment Submission] API call successful, fetching updated submission...');
    const res = await studentApi.getMySubmission(assignmentId!);
    setSubmission(res.data);
    setSelectedFiles([]);
    
    console.log('🎉 [Assignment Submission] Submission completed successfully');
    alert("Assignment submitted successfully!");
  } catch (error: any) {
    console.error('❌ [Assignment Submission] Submission failed:', error);
    const errorMessage = error.response?.data?.message || error.message || "Failed to submit assignment";
    alert(errorMessage);
  } finally {
    setSubmitting(false);
  }
};


  if (loading) return <LoadingSpinner />;
  if (!assignment) return <div>Assignment not found</div>;

  const isOverdue = new Date(assignment.dueDate) < new Date();

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-blue-50 to-indigo-50 min-h-screen">
      <div>
        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          Submit Assignment
        </h1>
        <p className="text-neutral-600">
          Complete and submit your assignment
        </p>
      </div>

      <Card title="Assignment Details">
        <div className="space-y-4">
          <div>
            <BookOpen className="inline mr-2 text-blue-600" />
            <strong>{assignment.title}</strong>
          </div>
          <p>{assignment.description}</p>
          <p>
            <Calendar className="inline mr-2" />
            {formatDate(assignment.dueDate, 'PPp')}
            {isOverdue && ' (Overdue)'}
          </p>
        </div>
      </Card>

      {submission ? (
        <Card title="Your Submission">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle />
              Submitted on {formatDate(submission.submittedAt, 'PPp')}
            </div>

            {submission.files.map((file: any, i: number) => (
              <a
                key={i}
                href={file.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-blue-600"
              >
                <FileText size={16} />
                {file.fileName}
              </a>
            ))}
          </div>
        </Card>
      ) : (
        <Card title="Submit Your Work">
          {isOverdue ? (
            <div className="text-red-600 flex gap-2 items-center">
              <AlertCircle />
              Assignment overdue. Submission closed.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <MultiFileUpload
                label="Upload Assignment Files"
                accept="application/pdf"
                multiple={true}
                maxFiles={5}
                files={selectedFiles}
                onChange={setSelectedFiles}
              />

              <div className="flex gap-3">
                <Button type="submit" disabled={submitting || selectedFiles.length === 0}>
                  <Upload size={16} />
                  {submitting ? 'Submitting...' : 'Submit'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/student/assignments')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>
      )}
    </div>
  );
};
