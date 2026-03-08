import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as teacherApi from '@/api/teacher.api';

export const LeaveBalance: React.FC = () => {
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await teacherApi.getMyLeaveBalance();
        setBalance(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch leave balance');
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  if (!balance) {
    return (
      <div className="p-6 text-neutral-500">
        No leave balance data available
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-green-50 to-emerald-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Leave Balance – {balance.year}
        </h1>
        <p className="text-neutral-600">
          Track your available leave days
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Paid Leave */}
        <Card
          title="Paid Leave"
          className="shadow-lg bg-gradient-to-br from-white to-green-50"
        >
          <StatRow label="Total Allocated" value={balance.policy?.paidLeaveLimit} />
          <StatRow
            label="Used"
            value={balance.used?.paid}
            tone="danger"
          />
          <StatRow
            label="Remaining"
            value={balance.remaining?.paid}
            tone="success"
            highlight
          />
        </Card>

        {/* Unpaid Leave */}
        <Card
          title="Unpaid Leave"
          className="shadow-lg bg-gradient-to-br from-white to-amber-50"
        >
          <StatRow label="Total Allocated" value={balance.policy?.unpaidLeaveLimit} />
          <StatRow
            label="Used"
            value={balance.used?.unpaid}
            tone="danger"
          />
          <StatRow
            label="Remaining"
            value={balance.remaining?.unpaid}
            tone="warning"
            highlight
          />
        </Card>
      </div>
    </div>
  );
};

/* ================= STAT ROW ================= */

const StatRow = ({
  label,
  value,
  tone = 'default',
  highlight = false,
}: {
  label: string;
  value: number;
  tone?: 'default' | 'danger' | 'success' | 'warning';
  highlight?: boolean;
}) => {
  const toneMap = {
    default: 'bg-neutral-50',
    danger: 'bg-red-50 border-red-100 text-red-700',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
  };

  return (
    <div
      className={`flex justify-between items-center p-3 rounded-lg border mb-3 ${toneMap[tone]}`}
    >
      <span className="text-neutral-600">{label}</span>
      <span
        className={`font-bold ${
          highlight ? 'text-xl' : 'text-base'
        }`}
      >
        {value ?? 0}
      </span>
    </div>
  );
};
