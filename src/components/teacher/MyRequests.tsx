// import React, { useEffect, useState } from 'react';
// import { Card } from '../common/Card';
// import { Button } from '../common/Button';
// import { Table } from '../common/Table';
// import { Modal } from '../common/Modal';
// import { LoadingSpinner } from '../common/LoadingSpinner';
// import * as teacherApi from '@/api/teacher.api';
// import { formatDate } from '@/utils/formatters';
// import { Eye, Plus } from 'lucide-react';

// export const MyRequests: React.FC = () => {
// 	const [requests, setRequests] = useState<any[]>([]);
// 	const [loading, setLoading] = useState(true);

// 	// View modal
// 	const [showDetailModal, setShowDetailModal] = useState(false);
// 	const [selectedRequest, setSelectedRequest] = useState<any>(null);

// 	// Create modal
// 	const [showCreateModal, setShowCreateModal] = useState(false);
// 	const [type, setType] = useState('PROFILE_CHANGE');
// 	const [reason, setReason] = useState('');
// 	const [submitting, setSubmitting] = useState(false);

// 	useEffect(() => {
// 		fetchRequests();
// 	}, []);

// 	const fetchRequests = async () => {
// 		setLoading(true);
// 		try {
// 			const res = await teacherApi.getMyRequests();
// 			setRequests(res.data);
// 		} catch (err) {
// 			console.error('Failed to fetch requests', err);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleCreateRequest = async () => {
// 		if (!reason.trim()) return;

// 		try {
// 			setSubmitting(true);
// 			await teacherApi.raiseRequest({
// 				type,
// 				reason,
// 				changes: [],
// 			});
// 			setShowCreateModal(false);
// 			setReason('');
// 			await fetchRequests();
// 		} catch (err) {
// 			console.error('Failed to create request', err);
// 		} finally {
// 			setSubmitting(false);
// 		}
// 	};

// 	const getStatusBadge = (status: string) => {
// 		const styles = {
// 			PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
// 			APPROVED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
// 			REJECTED: 'bg-red-100 text-red-800 border-red-200',
// 		};
// 		return (
// 			<span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${styles[status as keyof typeof styles]}`}>
// 				{status}
// 			</span>
// 		);
// 	};

// 	const renderValue = (value: any) => {
// 		if (value === null || value === undefined) return '-';
// 		if (typeof value === 'object') {
// 			return (
// 				<pre className="whitespace-pre-wrap text-xs bg-neutral-100 p-2 rounded">
// 					{JSON.stringify(value, null, 2)}
// 				</pre>
// 			);
// 		}
// 		return String(value);
// 	};

// 	const columns = [
// 		{
// 			key: 'targetModel',
// 			header: 'Type',
// 			render: (t: string) => <span className="font-medium">{t} Update</span>,
// 		},
// 		{
// 			key: 'reason',
// 			header: 'Reason',
// 			render: (r: string) => (
// 				<span className="text-neutral-600 truncate block max-w-xs">{r}</span>
// 			),
// 		},
// 		{
// 			key: 'changes',
// 			header: 'Changes',
// 			render: (c: any[]) => (
// 				<span className="text-sm text-neutral-500">{c?.length || 0} field(s)</span>
// 			),
// 		},
// 		{ key: 'status', header: 'Status', render: getStatusBadge },
// 		{
// 			key: 'createdAt',
// 			header: 'Submitted',
// 			render: (d: string) => <span className="text-sm">{formatDate(d, 'PP')}</span>,
// 		},
// 		{
// 			key: 'actions',
// 			header: 'Actions',
// 			render: (_: any, row: any) => (
// 				<Button
// 					variant="secondary"
// 					onClick={() => {
// 						setSelectedRequest(row);
// 						setShowDetailModal(true);
// 					}}
// 					className="flex items-center gap-2"
// 				>
// 					<Eye size={16} />
// 					View
// 				</Button>
// 			),
// 		},
// 	];

// 	if (loading) return <LoadingSpinner />;

// 	return (
// 		<div className="space-y-8 p-6 min-h-screen bg-neutral-50">
// 			<div className="flex justify-between items-center">
// 				<div>
// 					<h1 className="text-3xl font-bold mb-1">My Requests</h1>
// 					<p className="text-neutral-600">Track your profile change requests</p>
// 				</div>
// 				<Button onClick={() => setShowCreateModal(true)}>
// 					<Plus size={18} /> New Request
// 				</Button>
// 			</div>

// 			<Card>
// 				{requests.length === 0 ? (
// 					<div className="text-center py-12">
// 						<p className="text-neutral-500 mb-4">No requests yet</p>
// 						<Button onClick={() => setShowCreateModal(true)}>
// 							Raise First Request
// 						</Button>
// 					</div>
// 				) : (
// 					<Table columns={columns} data={requests} />
// 				)}
// 			</Card>

// 			{/* VIEW REQUEST MODAL */}
// 			<Modal
// 				isOpen={showDetailModal}
// 				onClose={() => setShowDetailModal(false)}
// 				title="Request Details"
// 				size="lg"
// 			>
// 				{selectedRequest && (
// 					<div className="space-y-6">
// 						<div className="flex justify-between items-center border-b pb-3">
// 							<div>
// 								<h3 className="font-semibold text-lg">
// 									{selectedRequest.targetModel} Update
// 								</h3>
// 								<p className="text-sm text-neutral-500">
// 									{formatDate(selectedRequest.createdAt, 'PPp')}
// 								</p>
// 							</div>
// 							{getStatusBadge(selectedRequest.status)}
// 						</div>

// 						<div>
// 							<label className="font-semibold">Reason</label>
// 							<p className="mt-1 bg-neutral-50 p-3 rounded">
// 								{selectedRequest.reason}
// 							</p>
// 						</div>

// 						<div>
// 							<label className="font-semibold mb-2 block">Changes</label>
// 							{selectedRequest.changes?.map((c: any, i: number) => (
// 								<div key={i} className="border rounded p-4 mb-3 bg-neutral-50">
// 									<div className="grid grid-cols-3 gap-4">
// 										<div>
// 											<p className="text-xs text-neutral-500 uppercase">Field</p>
// 											<p className="font-medium">{c.field}</p>
// 										</div>
// 										<div>
// 											<p className="text-xs text-neutral-500 uppercase">Old</p>
// 											{renderValue(c.oldValue)}
// 										</div>
// 										<div>
// 											<p className="text-xs text-neutral-500 uppercase">New</p>
// 											<div className="text-emerald-700 font-medium">
// 												{renderValue(c.newValue)}
// 											</div>
// 										</div>
// 									</div>
// 								</div>
// 							))}
// 						</div>
// 					</div>
// 				)}
// 			</Modal>

// 			{/* CREATE REQUEST MODAL */}
// 			<Modal
// 				isOpen={showCreateModal}
// 				onClose={() => setShowCreateModal(false)}
// 				title="Raise New Request"
// 				size="md"
// 			>
// 				<div className="space-y-4">
// 					<div>
// 						<label className="block text-sm font-medium mb-1">Request Type</label>
// 						<select
// 							value={type}
// 							onChange={(e) => setType(e.target.value)}
// 							className="w-full border rounded px-3 py-2"
// 						>
// 							<option value="PROFILE_CHANGE">Profile Change</option>
// 							<option value="GENERAL">General</option>
// 						</select>
// 					</div>

// 					<div>
// 						<label className="block text-sm font-medium mb-1">Reason</label>
// 						<textarea
// 							value={reason}
// 							onChange={(e) => setReason(e.target.value)}
// 							className="w-full border rounded px-3 py-2"
// 							rows={4}
// 						/>
// 					</div>

// 					<div className="flex justify-end gap-3 pt-4">
// 						<Button variant="secondary" onClick={() => setShowCreateModal(false)}>
// 							Cancel
// 						</Button>
// 						<Button
// 							onClick={handleCreateRequest}
// 							disabled={submitting || !reason.trim()}
// 						>
// 							{submitting ? 'Submitting...' : 'Submit'}
// 						</Button>
// 					</div>
// 				</div>
// 			</Modal>
// 		</div>
// 	);
// };



import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Table } from '../common/Table';
import { Modal } from '../common/Modal';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as teacherApi from '@/api/teacher.api';
import { formatDate } from '@/utils/formatters';
import { Eye, Plus } from 'lucide-react';

export const MyRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // View modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [type, setType] = useState('PROFILE_CHANGE');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await teacherApi.getMyRequests();
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!reason.trim()) return;

    try {
      setSubmitting(true);
      await teacherApi.raiseRequest({
        type,
        reason,
        changes: [],
      });
      setShowCreateModal(false);
      setReason('');
      await fetchRequests();
    } catch (err) {
      console.error('Failed to create request', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-accent-100 text-accent-800 border-accent-300',
      APPROVED: 'bg-success-100 text-success-800 border-success-300',
      REJECTED: 'bg-danger-100 text-danger-800 border-danger-300',
    };
    return (
      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  const renderValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') {
      return (
        <pre className="whitespace-pre-wrap text-xs bg-neutral-100 p-2 rounded">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    return String(value);
  };

  const columns = [
    {
      key: 'targetModel',
      header: 'Type',
      render: (t: string) => <span className="font-medium">{t} Update</span>,
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (r: string) => (
        <span className="text-neutral-600 truncate block max-w-xs">{r}</span>
      ),
    },
    {
      key: 'changes',
      header: 'Changes',
      render: (c: any[]) => (
        <span className="text-sm text-neutral-500">{c?.length || 0} field(s)</span>
      ),
    },
    { key: 'status', header: 'Status', render: getStatusBadge },
    {
      key: 'createdAt',
      header: 'Submitted',
      render: (d: string) => <span className="text-sm">{formatDate(d, 'PP')}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: any) => (
        <Button
          variant="secondary"
          onClick={() => {
            setSelectedRequest(row);
            setShowDetailModal(true);
          }}
          className="flex items-center gap-2"
        >
          <Eye size={16} />
          View
        </Button>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-4 md:p-6 min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-accent-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-secondary-900">My Requests</h1>
          <p className="text-secondary-700 font-semibold">Track your profile change requests</p>
        </div>

        <Button onClick={() => setShowCreateModal(true)} className="w-full md:w-auto">
          <Plus size={18} /> New Request
        </Button>
      </div>

      <Card className="shadow-xl border-2 border-secondary-300 border-l-4 border-l-primary-600">
        {requests.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-secondary-600 font-semibold mb-4">No requests yet</p>
            <Button onClick={() => setShowCreateModal(true)}>
              Raise First Request
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <Table columns={columns} data={requests} mobileCardView={true}/>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {requests.map((r) => (
                <Card key={r._id} className="p-4 space-y-3 shadow-lg border-2 border-secondary-300">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-secondary-900">{r.targetModel} Update</p>
                    {getStatusBadge(r.status)}
                  </div>

                  <p className="text-sm text-secondary-700 font-medium line-clamp-2">
                    {r.reason}
                  </p>

                  <div className="text-xs text-secondary-600 font-medium">
                    Submitted: {formatDate(r.createdAt, 'PP')}
                  </div>

                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      setSelectedRequest(r);
                      setShowDetailModal(true);
                    }}
                  >
                    <Eye size={16} /> View Details
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* VIEW REQUEST MODAL */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Request Details"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-semibold text-lg">
                  {selectedRequest.targetModel} Update
                </h3>
                <p className="text-sm text-neutral-500">
                  {formatDate(selectedRequest.createdAt, 'PPp')}
                </p>
              </div>
              {getStatusBadge(selectedRequest.status)}
            </div>

            <div>
              <label className="font-semibold">Reason</label>
              <p className="mt-1 bg-neutral-50 p-3 rounded">
                {selectedRequest.reason}
              </p>
            </div>

            <div>
              <label className="font-semibold block mb-2">Changes</label>
              {selectedRequest.changes?.map((c: any, i: number) => (
                <div key={i} className="border rounded p-3 mb-3 bg-neutral-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-neutral-500 uppercase">Field</p>
                      <p className="font-medium">{c.field}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase">Old</p>
                      {renderValue(c.oldValue)}
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase">New</p>
                      <div className="text-emerald-700 font-medium">
                        {renderValue(c.newValue)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* CREATE REQUEST MODAL */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Raise New Request"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Request Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="PROFILE_CHANGE">Profile Change</option>
              <option value="GENERAL">General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateRequest}
              disabled={submitting || !reason.trim()}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
