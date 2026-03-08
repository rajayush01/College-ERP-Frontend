import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { DatePicker } from '../common/DatePicker';
import { Table } from '../common/Table';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as teacherApi from '@/api/teacher.api';
import { LEAVE_TYPES } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';

export const TeacherLeaves: React.FC = () => {
  const [formData, setFormData] = useState({
    leaveType: 'PAID',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [balance, setBalance] = useState<any>(null);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* ================= FETCH ALL DATA ================= */

  const fetchAll = async () => {
    try {
      const [balanceRes, leavesRes] = await Promise.all([
        teacherApi.getMyLeaveBalance(),
        teacherApi.getMyLeaves(),
      ]);
      setBalance(balanceRes.data);
      setLeaves(leavesRes.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load leave data');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End date cannot be before start date');
      return;
    }

    setSubmitting(true);
    try {
      await teacherApi.applyLeave(formData);
      setSuccess('Leave application submitted successfully');

      setFormData({
        leaveType: 'PAID',
        startDate: '',
        endDate: '',
        reason: '',
      });

      await fetchAll();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit leave');
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) return <LoadingSpinner />;

  /* ================= TABLE COLUMNS ================= */

  const columns = [
    { key: 'leaveType', header: 'Type' },
    {
      key: 'startDate',
      header: 'Start Date',
      render: (d: string) => formatDate(d, 'PP'),
    },
    {
      key: 'endDate',
      header: 'End Date',
      render: (d: string) => formatDate(d, 'PP'),
    },
    { key: 'reason', header: 'Reason' },
    {
      key: 'status',
      header: 'Status',
      render: (status: string) => <StatusBadge status={status} />,
    },
  ];

  return (
    <div className="space-y-10 p-6 bg-gradient-to-br from-neutral-50 via-indigo-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Leave Management
        </h1>
        <p className="text-neutral-600">
          Apply for leave, track balance & history
        </p>
      </div>

      {/* ================= BALANCE ================= */}
      {balance && (
        <Card>
          <h3 className="font-bold mb-4">
            Leave Balance ({balance.year})
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <BalanceCard
              title="Paid Leave"
              used={balance.used.paid}
              remaining={balance.remaining.paid}
              limit={balance.policy.paidLeaveLimit}
            />
            <BalanceCard
              title="Unpaid Leave"
              used={balance.used.unpaid}
              remaining={balance.remaining.unpaid}
              limit={balance.policy.unpaidLeaveLimit}
            />
          </div>
        </Card>
      )}

      {/* ================= APPLY FORM ================= */}
      <Card title="Apply for Leave">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-700 bg-green-50 p-3 rounded-lg text-sm">
              {success}
            </p>
          )}

          <Select
            label="Leave Type"
            value={formData.leaveType}
            onChange={(e) =>
              setFormData({ ...formData, leaveType: e.target.value })
            }
            options={LEAVE_TYPES}
            required
          />

          <div className="grid md:grid-cols-2 gap-6">
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              required
            />
            <DatePicker
              label="End Date"
              value={formData.endDate}
              min={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Reason
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-200"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              required
            />
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Leave'}
          </Button>
        </form>
      </Card>

      {/* ================= HISTORY ================= */}
      <Card title="Leave History">
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

/* ================= HELPERS ================= */

const BalanceCard = ({
  title,
  used,
  remaining,
  limit,
}: {
  title: string;
  used: number;
  remaining: number;
  limit: number;
}) => (
  <div className="p-4 rounded-lg border bg-neutral-50">
    <h4 className="font-semibold mb-2">{title}</h4>
    <p>Total: {limit}</p>
    <p>Used: {used}</p>
    <p className="font-bold">Remaining: {remaining}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    APPROVED: 'bg-emerald-100 text-emerald-800',
    REJECTED: 'bg-red-100 text-red-800',
    PENDING: 'bg-amber-100 text-amber-800',
  };

  return (
    <span
      className={`px-3 py-1 rounded-lg text-xs font-bold ${
        map[status] || 'bg-neutral-100'
      }`}
    >
      {status}
    </span>
  );
};
