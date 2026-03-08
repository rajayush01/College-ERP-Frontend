// import React, { useEffect, useState } from 'react';
// import { Card } from '../common/Card';
// import { Button } from '../common/Button';
// import { Table } from '../common/Table';
// import { Modal } from '../common/Modal';
// import * as adminApi from '@/api/admin.api';
// import { Check, X, Eye, AlertCircle } from 'lucide-react';
// import { formatDate } from '@/utils/formatters';

// export const RequestManagement: React.FC = () => {
//   const [requests, setRequests] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState<any>(null);

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     setLoading(true);
//     try {
//       const response = await adminApi.getAllRequests();
//       setRequests(response.data);
//     } catch (error) {
//       console.error('Failed to fetch requests:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprove = async (requestId: string) => {
//     try {
//       await adminApi.approveRequest(requestId);
//       fetchRequests();
//       alert('Request approved successfully');
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Failed to approve request');
//     }
//   };

//   const handleReject = async (requestId: string) => {
//     try {
//       await adminApi.rejectRequest(requestId);
//       fetchRequests();
//       alert('Request rejected successfully');
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Failed to reject request');
//     }
//   };

//   const columns = [
//     {
//       key: 'raisedBy',
//       header: 'Raised By',
//       render: (raisedBy: any) => (
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center text-indigo-600 font-bold shadow-sm">
//             {raisedBy.role?.charAt(0)}
//           </div>
//           <div>
//             <p className="font-medium text-neutral-800">{raisedBy.role}</p>
//             <p className="text-xs text-neutral-500">{raisedBy.userId}</p>
//           </div>
//         </div>
//       ),
//     },
//     { 
//       key: 'targetModel', 
//       header: 'Target',
//       render: (target: string) => (
//         <span className="inline-flex px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 border-2 border-blue-200">
//           {target}
//         </span>
//       ),
//     },
//     { 
//       key: 'reason', 
//       header: 'Reason',
//       render: (reason: string) => (
//         <span className="text-neutral-600 text-sm line-clamp-2">{reason}</span>
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
//           <AlertCircle size={14} />
//           {status}
//         </span>
//       ),
//     },
//     {
//       key: 'createdAt',
//       header: 'Created',
//       render: (date: string) => formatDate(date, 'PP'),
//     },
//     {
//       key: 'actions',
//       header: 'Actions',
//       render: (_: any, row: any) => (
//         <div className="flex gap-2">
//           <Button
//             variant="secondary"
//             onClick={() => {
//               setSelectedRequest(row);
//               setShowDetailModal(true);
//             }}
//             className="flex items-center gap-1 text-sm"
//           >
//             <Eye size={16} />
//             View
//           </Button>
//           {row.status === 'PENDING' && (
//             <>
//               <Button
//                 variant="secondary"
//                 onClick={() => handleApprove(row._id)}
//                 className="flex items-center gap-1 text-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-2 border-emerald-200"
//               >
//                 <Check size={16} />
//                 Approve
//               </Button>
//               <Button
//                 variant="danger"
//                 onClick={() => handleReject(row._id)}
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
//     <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-indigo-50 to-blue-50 min-h-screen">
//       <div className="animate-slide-up">
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
//           Request Management
//         </h1>
//         <p className="text-neutral-600">Review and process modification requests</p>
//       </div>

//       <Card className="animate-slide-up shadow-lg border-2 border-white" style={{ animationDelay: '100ms' }}>
//         <Table columns={columns} data={requests} loading={loading} />
//       </Card>

//       <Modal
//         isOpen={showDetailModal}
//         onClose={() => setShowDetailModal(false)}
//         title="Request Details"
//         size="lg"
//       >
//         {selectedRequest && (
//           <div className="space-y-6">
//             <div className="p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200">
//               <label className="font-semibold text-indigo-900 mb-2 block">Reason for Request:</label>
//               <p className="text-indigo-700">{selectedRequest.reason}</p>
//             </div>

//             <div>
//               <label className="font-semibold text-neutral-800 mb-3 block flex items-center gap-2">
//                 <AlertCircle size={20} className="text-amber-600" />
//                 Proposed Changes:
//               </label>
//               <div className="space-y-3">
//                 {selectedRequest.changes.map((change: any, index: number) => (
//                   <div key={index} className="p-4 bg-neutral-50 rounded-xl border-2 border-neutral-200">
//                     <p className="font-semibold text-neutral-700 mb-2">Field: {change.field}</p>
//                     <div className="grid md:grid-cols-2 gap-4">
//                       <div className="p-3 bg-red-50 rounded-lg border-2 border-red-200">
//                         <p className="text-xs font-semibold text-red-600 mb-1">Old Value:</p>
//                         <p className="text-sm text-red-800">{JSON.stringify(change.oldValue)}</p>
//                       </div>
//                       <div className="p-3 bg-emerald-50 rounded-lg border-2 border-emerald-200">
//                         <p className="text-xs font-semibold text-emerald-600 mb-1">New Value:</p>
//                         <p className="text-sm text-emerald-800">{JSON.stringify(change.newValue)}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };


import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Table } from '../common/Table';
import { Modal } from '../common/Modal';
import * as adminApi from '@/api/admin.api';
import { Check, X, Eye } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

export const RequestManagement: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllRequests();
      setRequests(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    await adminApi.approveRequest(id);
    fetchRequests();
  };

  const handleReject = async (id: string) => {
    await adminApi.rejectRequest(id);
    fetchRequests();
  };

  /* =========================
     DESKTOP TABLE COLUMNS
  ========================= */
  const columns = [
    {
      key: 'raisedBy',
      header: 'Raised By',
      render: (r: any) => (
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            {r.role?.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{r.role}</p>
            <p className="text-xs text-gray-500">{r.userId}</p>
          </div>
        </div>
      ),
    },
    { key: 'targetModel', header: 'Target' },
    {
      key: 'reason',
      header: 'Reason',
      render: (r: string) => (
        <span className="line-clamp-2 max-w-xs">{r}</span>
      ),
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
      key: 'createdAt',
      header: 'Created',
      render: (d: string) => formatDate(d, 'PP'),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setSelectedRequest(row);
              setShowDetailModal(true);
            }}
          >
            <Eye size={14} />
          </Button>

          {row.status === 'PENDING' && (
            <>
              <Button size="sm" onClick={() => handleApprove(row._id)}>
                <Check size={14} />
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleReject(row._id)}>
                <X size={14} />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 bg-neutral-50 min-h-screen overflow-x-hidden">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-600">
          Request Management
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Review and process modification requests
        </p>
      </div>

      {/* =========================
          MOBILE VIEW
      ========================= */}
      <div className="space-y-4 md:hidden max-w-full">
        {requests.map((r) => (
          <Card key={r._id} className="space-y-3 max-w-full">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <p className="font-semibold truncate">{r.raisedBy.role}</p>
                <p className="text-xs text-gray-500 truncate">{r.raisedBy.userId}</p>
              </div>

              <span
                className={`px-2 py-1 rounded text-xs font-bold shrink-0 ${
                  r.status === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-700'
                    : r.status === 'REJECTED'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {r.status}
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-500">Target</p>
              <p className="font-medium break-words">{r.targetModel}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Reason</p>
              <p className="text-sm break-words line-clamp-3">{r.reason}</p>
            </div>

            <div className="text-xs text-gray-400">
              Submitted on {formatDate(r.createdAt, 'PP')}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setSelectedRequest(r);
                  setShowDetailModal(true);
                }}
              >
                View
              </Button>

              {r.status === 'PENDING' && (
                <>
                  <Button size="sm" className="flex-1" onClick={() => handleApprove(r._id)}>
                    Approve
                  </Button>
                  <Button size="sm" variant="danger" className="flex-1" onClick={() => handleReject(r._id)}>
                    Reject
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* =========================
          DESKTOP TABLE
      ========================= */}
      <div className="hidden md:block">
        <Card>
          <Table columns={columns} data={requests} loading={loading} mobileCardView={true}/>
        </Card>
      </div>

      {/* =========================
          DETAILS MODAL
      ========================= */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Request Details"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-4 max-w-full overflow-x-hidden">
            <div className="p-3 bg-indigo-50 rounded">
              <p className="font-semibold mb-1">Reason</p>
              <p className="text-sm break-words">{selectedRequest.reason}</p>
            </div>

            {selectedRequest.changes.map((c: any, i: number) => (
              <div key={i} className="p-3 border rounded max-w-full">
                <p className="font-semibold mb-2 break-words">{c.field}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <pre className="bg-red-50 p-2 rounded text-xs max-w-full whitespace-pre-wrap break-all overflow-x-hidden">
                    {JSON.stringify(c.oldValue, null, 2)}
                  </pre>

                  <pre className="bg-emerald-50 p-2 rounded text-xs max-w-full whitespace-pre-wrap break-all overflow-x-hidden">
                    {JSON.stringify(c.newValue, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};
