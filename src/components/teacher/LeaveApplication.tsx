import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { DatePicker } from '../common/DatePicker';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as teacherApi from '@/api/teacher.api';
import { LEAVE_TYPES } from '@/utils/constants';

export const LeaveApplication: React.FC = () => {
  const [formData, setFormData] = useState({
    leaveType: 'PAID',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* Fetch leave balance */
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await teacherApi.getMyLeaveBalance();
        setBalance(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchBalance();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End date cannot be before start date');
      return;
    }

    setLoading(true);
    try {
      await teacherApi.applyLeave(formData);
      setSuccess('Leave application submitted successfully');

      setFormData({
        leaveType: 'PAID',
        startDate: '',
        endDate: '',
        reason: '',
      });

      // refresh balance after submit
      const res = await teacherApi.getMyLeaveBalance();
      setBalance(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit leave');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-amber-50 to-orange-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
          Apply for Leave
        </h1>
        <p className="text-neutral-600">
          Submit your leave application for approval
        </p>
      </div>

      {/* Leave Balance */}
      {balance && (
        <Card>
          <h3 className="font-bold mb-3">Leave Balance ({balance.year})</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
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

      {/* Form */}
      <Card>
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
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <DatePicker
              label="End Date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              min={formData.startDate}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Reason
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-200"
              rows={4}
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              required
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

/* ================= BALANCE CARD ================= */

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
