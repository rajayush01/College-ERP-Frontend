import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Table } from '../common/Table';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as teacherApi from '@/api/teacher.api';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

export const MyAssignments: React.FC = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        console.log('📡 [MyAssignments] Fetching assignments...');
        const response = await teacherApi.getMyAssignments();
        console.log('✅ [MyAssignments] Response:', response.data);
        setAssignments(response.data);
      } catch (error) {
        console.error('❌ [MyAssignments] Failed to fetch assignments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const columns = [
    { 
      key: 'title', 
      header: 'Title', 
      render: (title: string) => <span className="font-semibold text-neutral-800">{title}</span> 
    },
    { 
      key: 'subject', 
      header: 'Subject' 
    },
    { 
      key: 'batchId', 
      header: 'Batch', 
      render: (batch: any) => batch?.batchName || '—' 
    },
    { 
      key: 'dueDate', 
      header: 'Due Date', 
      render: (date: string) => formatDate(date, 'PP') 
    },
    { 
      key: 'actions', 
      header: 'Actions', 
      render: (_: any, row: any) => (
        <Button 
          variant="secondary" 
          onClick={() => navigate(`/teacher/assignments/${row._id}/submissions`)} 
          className="flex items-center gap-2"
        >
          <Eye size={16} />
          View Submissions
        </Button>
      ) 
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-indigo-50 to-blue-50 min-h-screen">
      <div className="flex justify-between items-center animate-slide-up">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">My Assignments</h1>
          <p className="text-neutral-600">Manage your created assignments</p>
        </div>
        <Button onClick={() => navigate('/teacher/assignments/create')} className="flex items-center gap-2 shadow-lg"><Plus size={20} />Create Assignment</Button>
      </div>
      <Card className="animate-slide-up shadow-lg border-2 border-white">
        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 mb-4">No assignments created yet</p>
            <Button onClick={() => navigate('/teacher/assignments/create')} className="flex items-center gap-2 mx-auto">
              <Plus size={20} />
              Create Your First Assignment
            </Button>
          </div>
        ) : (
          <Table columns={columns} data={assignments} mobileCardView={true}/>
        )}
      </Card>
    </div>
  );
};
