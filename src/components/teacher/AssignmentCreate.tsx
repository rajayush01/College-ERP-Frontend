import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { DatePicker } from '../common/DatePicker';
import { MultiFileUpload } from '../common/MultiFileUpload';
import * as teacherApi from '@/api/teacher.api';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

interface BatchData {
  batchId: string;
  batchName: string;
  department: string;
  subjectsTaught: string[];
}

interface FormData {
  title: string;
  description: string;
  subject: string;
  batchId: string;
  dueDate: string;
}

export const AssignmentCreate: React.FC = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<BatchData[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    subject: '',
    batchId: '',
    dueDate: '',
  });

  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      console.log('📡 [AssignmentCreate] Fetching batches...');
      const response = await teacherApi.getAssignedStudents();
      console.log('✅ [AssignmentCreate] Raw response:', response.data);
      
      const mapped: BatchData[] = response.data.map((c: {
        batchId: string;
        batchName: string;
        department: string;
        subjectsTaught?: string[];
      }) => {
        console.log('🔄 [AssignmentCreate] Mapping batch:', {
          batchId: c.batchId,
          batchName: c.batchName,
          department: c.department,
        });
        return {
          batchId: c.batchId,
          batchName: c.batchName,
          department: c.department,
          subjectsTaught: c.subjectsTaught || [],
        };
      });
      
      console.log('📊 [AssignmentCreate] Mapped batches:', mapped);
      setClasses(mapped);
    } catch (error) {
      console.error('❌ [AssignmentCreate] Failed to fetch batches:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 [AssignmentCreate] Submit clicked');
    console.log('📄 Form data:', formData);
    console.log(
      '📎 Attachments:',
      attachments.map((f) => ({
        name: f.name,
        type: f.type,
        sizeKB: Math.round(f.size / 1024),
      }))
    );

    if (!formData.batchId) {
      alert('Please select a batch');
      return;
    }

    if (!formData.subject.trim()) {
      alert('Please enter a subject name');
      return;
    }

    try {
      console.log('🚀 [AssignmentCreate] Sending request...');
      await teacherApi.createAssignment({
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        batchId: formData.batchId,
        dueDate: formData.dueDate,
        files: attachments,
      });

      console.log('✅ [AssignmentCreate] Assignment created successfully');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      alert('Assignment created successfully');
      navigate('/teacher/assignments');
    } catch (error) {
      console.error('🔥 [AssignmentCreate] Create failed:', error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Failed to create assignment';
      alert(errorMessage || 'Failed to create assignment');
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-blue-50 to-indigo-50 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-600">
        Create Assignment
      </h1>

      <Card className="shadow-lg border-2 border-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Assignment Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-lg border-2"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Select
              label="Batch"
              value={formData.batchId}
              onChange={(e) => {
                console.log('🎯 [AssignmentCreate] Batch selected:', e.target.value);
                const selectedBatch = classes.find(c => c.batchId === e.target.value);
                console.log('📦 [AssignmentCreate] Selected batch:', selectedBatch);
                setFormData({ 
                  ...formData, 
                  batchId: e.target.value,
                });
              }}
              options={classes.map((cls) => ({
                value: cls.batchId,
                label: cls.batchName,
              }))}
              required
            />

            <Input
              label="Subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subject: e.target.value,
                })
              }
              placeholder="Enter subject name"
              required
            />
          </div>

          <DatePicker
            label="Due Date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                dueDate: e.target.value,
              })
            }
            required
          />

          {/* PDF Attachments */}
          <MultiFileUpload
            label="Attach PDFs (Optional)"
            accept="application/pdf"
            multiple={true}
            maxFiles={5}
            files={attachments}
            onChange={setAttachments}
          />

          <div className="flex gap-3 pt-4 border-t">
            <Button type="submit">
              <FileText size={18} />
              Create Assignment
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() =>
                navigate('/teacher/assignments')
              }
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
