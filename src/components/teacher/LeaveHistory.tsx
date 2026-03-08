import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Table } from '../common/Table';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as teacherApi from '@/api/teacher.api';
import { formatDate } from '@/utils/formatters';

export const LeaveHistory: React.FC = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await teacherApi.getMyLeaves();
        setLeaves(response.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch leave history');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Leave History
        </h1>
        <p className="text-neutral-600">
          View your past leave applications
        </p>
      </div>

      <Card className="shadow-lg">
        {leaves.length === 0 ? (
          <p className="text-neutral-500 text-center py-8">
            No leave applications found
          </p>
        ) : (
          <Table columns={columns} data={leaves} mobileCardView={true}/>
        )}
      </Card>
    </div>
  );
};

/* ================= TABLE COLUMNS ================= */

const columns = [
  {
    key: 'leaveType',
    header: 'Type',
    render: (type: string) => (
      <span className="font-semibold">{type}</span>
    ),
  },
  {
    key: 'startDate',
    header: 'Start Date',
    render: (date: string) => formatDate(date, 'PP'),
  },
  {
    key: 'endDate',
    header: 'End Date',
    render: (date: string) => formatDate(date, 'PP'),
  },
  {
    key: 'reason',
    header: 'Reason',
    render: (reason: string) => (
      <span className="truncate block max-w-xs">{reason}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (status: string) => <StatusBadge status={status} />,
  },
];

/* ================= STATUS BADGE ================= */

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, string> = {
    APPROVED: 'bg-emerald-100 text-emerald-800',
    REJECTED: 'bg-red-100 text-red-800',
    PENDING: 'bg-amber-100 text-amber-800',
  };

  return (
    <span
      className={`px-3 py-1 rounded-lg text-xs font-bold ${
        statusMap[status] || 'bg-neutral-100 text-neutral-700'
      }`}
    >
      {status}
    </span>
  );
};
