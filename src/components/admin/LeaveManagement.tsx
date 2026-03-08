// import React, { useEffect, useState } from 'react';
// import { Card } from '../common/Card';
// import { Button } from '../common/Button';
// import { Table } from '../common/Table';
// import { Select } from '../common/Select';
// import * as adminApi from '@/api/admin.api';
// import { Check, X, Filter, Calendar, Clock } from 'lucide-react';
// import { formatDate } from '@/utils/formatters';

// export const LeaveManagement: React.FC = () => {
//   const [leaves, setLeaves] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [statusFilter, setStatusFilter] = useState('');

//   useEffect(() => {
//     fetchLeaves();
//   }, [statusFilter]);

//   const fetchLeaves = async () => {
//     setLoading(true);
//     try {
//       const response = await adminApi.getAllLeaves(statusFilter);
//       setLeaves(response.data);
//     } catch (error) {
//       console.error('Failed to fetch leaves:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateStatus = async (leaveId: string, status: string) => {
//     try {
//       await adminApi.updateLeaveStatus(leaveId, status);
//       fetchLeaves();
//       alert(`Leave ${status.toLowerCase()} successfully`);
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Failed to update leave status');
//     }
//   };

//   const columns = [
//     {
//       key: 'teacher',
//       header: 'Teacher',
//       render: (teacher: any) => (
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center text-amber-600 font-bold shadow-sm">
//             {teacher?.name?.charAt(0) || 'T'}
//           </div>
//           <span className="font-medium text-neutral-800">{teacher?.name || 'N/A'}</span>
//         </div>
//       ),
//     },
//     { 
//       key: 'leaveType', 
//       header: 'Type',
//       render: (type: string) => (
//         <span className="inline-flex px-3 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700 border-2 border-purple-200">
//           {type}
//         </span>
//       ),
//     },
//     {
//       key: 'startDate',
//       header: 'Start Date',
//       render: (date: string) => (
//         <div className="flex items-center gap-2 text-neutral-700">
//           <Calendar size={16} className="text-blue-600" />
//           {formatDate(date, 'PP')}
//         </div>
//       ),
//     },
//     {
//       key: 'endDate',
//       header: 'End Date',
//       render: (date: string) => (
//         <div className="flex items-center gap-2 text-neutral-700">
//           <Calendar size={16} className="text-blue-600" />
//           {formatDate(date, 'PP')}
//         </div>
//       ),
//     },
//     { 
//       key: 'reason', 
//       header: 'Reason',
//       render: (reason: string) => (
//         <span className="text-neutral-600 text-sm">{reason}</span>
//       ),
//     },
//     { 
//       key: 'status', 
//       header: 'Status',
//       render: (status: string) => (
//         <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${
//           status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
//           status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
//           'bg-amber-50 text-amber-700 border-amber-200'
//         }`}>
//           <Clock size={14} />
//           {status}
//         </span>
//       ),
//     },
//     {
//       key: 'actions',
//       header: 'Actions',
//       render: (_: any, row: any) => (
//         <div className="flex gap-2">
//           {row.status === 'PENDING' && (
//             <>
//               <Button
//                 variant="secondary"
//                 onClick={() => handleUpdateStatus(row._id, 'APPROVED')}
//                 className="flex items-center gap-1 text-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-2 border-emerald-200"
//               >
//                 <Check size={16} />
//                 Approve
//               </Button>
//               <Button
//                 variant="danger"
//                 onClick={() => handleUpdateStatus(row._id, 'REJECTED')}
//                 className="flex items-center gap-1 text-sm"
//               >
//                 <X size={16} />
//                 Reject
//               </Button>
//             </>
//           )}
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-amber-50 to-orange-50 min-h-screen">
//       {/* Header */}
//       <div className="animate-slide-up">
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
//           Leave Management
//         </h1>
//         <p className="text-neutral-600">Review and approve teacher leave requests</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Card className="animate-slide-up bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-white shadow-lg" style={{ animationDelay: '100ms' }}>
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-neutral-700">Pending Requests</p>
//               <p className="text-3xl font-bold text-amber-700">{leaves.filter(l => l.status === 'PENDING').length}</p>
//             </div>
//             <div className="p-4 bg-white rounded-2xl shadow-md">
//               <Clock size={32} className="text-amber-600" />
//             </div>
//           </div>
//         </Card>

//         <Card className="animate-slide-up bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-white shadow-lg" style={{ animationDelay: '150ms' }}>
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-neutral-700">Approved</p>
//               <p className="text-3xl font-bold text-emerald-700">{leaves.filter(l => l.status === 'APPROVED').length}</p>
//             </div>
//             <div className="p-4 bg-white rounded-2xl shadow-md">
//               <Check size={32} className="text-emerald-600" />
//             </div>
//           </div>
//         </Card>

//         <Card className="animate-slide-up bg-gradient-to-br from-red-50 to-red-100 border-2 border-white shadow-lg" style={{ animationDelay: '200ms' }}>
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-neutral-700">Rejected</p>
//               <p className="text-3xl font-bold text-red-700">{leaves.filter(l => l.status === 'REJECTED').length}</p>
//             </div>
//             <div className="p-4 bg-white rounded-2xl shadow-md">
//               <X size={32} className="text-red-600" />
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Leave Requests Table */}
//       <Card className="animate-slide-up shadow-lg border-2 border-white" style={{ animationDelay: '250ms' }}>
//         <div className="mb-6">
//           <div className="flex items-center gap-2 mb-4">
//             <Filter size={20} className="text-amber-600" />
//             <span className="font-medium text-neutral-700">Filter Requests</span>
//           </div>
//           <Select
//             label="Filter by Status"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             options={[
//               { value: '', label: 'All Requests' },
//               { value: 'PENDING', label: 'Pending' },
//               { value: 'APPROVED', label: 'Approved' },
//               { value: 'REJECTED', label: 'Rejected' },
//             ]}
//           />
//         </div>

//         <Table columns={columns} data={leaves} loading={loading} />
//       </Card>
//     </div>
//   );
// };

import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Table } from '../common/Table';
import { Select } from '../common/Select';
import * as adminApi from '@/api/admin.api';
import { Check, X, Filter, Calendar, Clock } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

export const LeaveManagement: React.FC = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAllLeaves(statusFilter);
      setLeaves(response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (leaveId: string, status: string) => {
    await adminApi.updateLeaveStatus(leaveId, status);
    fetchLeaves();
  };

  /* =========================
     DESKTOP TABLE COLUMNS
  ========================= */
  const columns = [
    {
      key: 'teacher',
      header: 'Teacher',
      render: (teacher: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold">
            {teacher?.name?.charAt(0) || 'T'}
          </div>
          <span className="font-medium">{teacher?.name}</span>
        </div>
      ),
    },
    { key: 'leaveType', header: 'Type' },
    {
      key: 'startDate',
      header: 'Start',
      render: (d: string) => formatDate(d, 'PP'),
    },
    {
      key: 'endDate',
      header: 'End',
      render: (d: string) => formatDate(d, 'PP'),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (r: string) => <span className="line-clamp-2">{r}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (s: string) => (
        <span
          className={`px-3 py-1 rounded text-xs font-bold ${
            s === 'APPROVED'
              ? 'bg-emerald-100 text-emerald-700'
              : s === 'REJECTED'
              ? 'bg-red-100 text-red-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {s}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: any) =>
        row.status === 'PENDING' && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleUpdateStatus(row._id, 'APPROVED')}>
              <Check size={14} />
            </Button>
            <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(row._id, 'REJECTED')}>
              <X size={14} />
            </Button>
          </div>
        ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 bg-neutral-50 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-amber-600">
          Leave Management
        </h1>
        <p className="text-neutral-600 text-sm md:text-base">
          Review and approve teacher leave requests
        </p>
      </div>

      {/* FILTER */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} />
          <span className="font-medium">Filter</span>
        </div>
        <Select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: '', label: 'All Requests' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'APPROVED', label: 'Approved' },
            { value: 'REJECTED', label: 'Rejected' },
          ]}
        />
      </Card>

      {/* =========================
          MOBILE VIEW (CARDS)
      ========================= */}
      <div className="space-y-4 md:hidden">
        {leaves.map((l) => (
          <Card key={l._id} className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{l.teacher?.name}</p>
                <p className="text-xs text-gray-500">{l.leaveType}</p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${
                  l.status === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-700'
                    : l.status === 'REJECTED'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {l.status}
              </span>
            </div>

            <div className="text-sm text-gray-600">
              <Calendar size={14} className="inline mr-1" />
              {formatDate(l.startDate, 'PP')} → {formatDate(l.endDate, 'PP')}
            </div>

            <p className="text-sm line-clamp-3">{l.reason}</p>

            {l.status === 'PENDING' && (
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1" onClick={() => handleUpdateStatus(l._id, 'APPROVED')}>
                  Approve
                </Button>
                <Button size="sm" variant="danger" className="flex-1" onClick={() => handleUpdateStatus(l._id, 'REJECTED')}>
                  Reject
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* =========================
          DESKTOP TABLE
      ========================= */}
      <div className="hidden md:block">
        <Card>
          <Table columns={columns} data={leaves} loading={loading} mobileCardView={true}/>
        </Card>
      </div>
    </div>
  );
};
