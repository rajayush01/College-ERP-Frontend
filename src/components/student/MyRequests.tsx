import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Table } from '../common/Table';
import { Modal } from '../common/Modal';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as studentApi from '@/api/student.api';
import { formatDate } from '@/utils/formatters';
import { Eye, Plus } from 'lucide-react';

export const MyRequests: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await studentApi.getMyRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      PENDING: 'bg-accent-100 text-accent-800 border-accent-300',
      APPROVED: 'bg-success-100 text-success-800 border-success-300',
      REJECTED: 'bg-danger-100 text-danger-800 border-danger-300',
    };

    return (
      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status}
      </span>
    );
  };

  const columns = [
    { 
      key: 'targetModel', 
      header: 'Request Type',
      render: (targetModel: string) => (
        <span className="font-medium">{targetModel} Update</span>
      )
    },
    { 
      key: 'reason', 
      header: 'Reason',
      render: (reason: string) => (
        <span className="text-gray-600 max-w-xs truncate block">{reason}</span>
      )
    },
    {
      key: 'changes',
      header: 'Changes',
      render: (changes: any[]) => (
        <span className="text-sm text-gray-500">{changes?.length || 0} field(s)</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (status: string) => getStatusBadge(status),
    },
    {
      key: 'createdAt',
      header: 'Submitted',
      render: (date: string) => (
        <span className="text-sm text-gray-600">{formatDate(date, 'PP')}</span>
      )
    },
    {
      key: 'reviewedAt',
      header: 'Reviewed',
      render: (date: string, row: any) => (
        date ? (
          <span className="text-sm text-gray-600">{formatDate(date, 'PP')}</span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )
      )
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
          View Details
        </Button>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary-900">My Requests</h1>
        <Button 
          onClick={() => navigate('/student/requests/new')} 
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          New Request
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-accent-50 border-l-4 border-l-accent-600 shadow-xl">
          <div>
            <p className="text-sm font-semibold text-secondary-700">Pending</p>
            <p className="text-2xl font-bold text-accent-700">
              {requests.filter((r) => r.status === 'PENDING').length}
            </p>
          </div>
        </Card>
        <Card className="bg-success-50 border-l-4 border-l-success-600 shadow-xl">
          <div>
            <p className="text-sm font-semibold text-secondary-700">Approved</p>
            <p className="text-2xl font-bold text-success-700">
              {requests.filter((r) => r.status === 'APPROVED').length}
            </p>
          </div>
        </Card>
        <Card className="bg-danger-50 border-l-4 border-l-danger-600 shadow-xl">
          <div>
            <p className="text-sm font-semibold text-secondary-700">Rejected</p>
            <p className="text-2xl font-bold text-danger-700">
              {requests.filter((r) => r.status === 'REJECTED').length}
            </p>
          </div>
        </Card>
      </div>

      <Card className="shadow-xl border-2 border-secondary-300 border-l-4 border-l-primary-600">
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary-600 font-semibold mb-4">You haven't raised any requests yet</p>
            <Button onClick={() => navigate('/student/requests/new')}>
              Raise Your First Request
            </Button>
          </div>
        ) : (
          <Table columns={columns} data={requests} mobileCardView={true}/>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Request Details"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Status Header */}
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h3 className="font-semibold text-lg">{selectedRequest.targetModel} Update Request</h3>
                <p className="text-sm text-gray-500">
                  Submitted on {formatDate(selectedRequest.createdAt, 'PPp')}
                </p>
              </div>
              {getStatusBadge(selectedRequest.status)}
            </div>

            {/* Reason */}
            <div>
              <label className="font-semibold text-gray-700">Reason:</label>
              <p className="mt-1 text-gray-600 bg-gray-50 p-3 rounded">
                {selectedRequest.reason}
              </p>
            </div>

            {/* Changes */}
            <div>
              <label className="font-semibold text-gray-700 mb-2 block">
                Requested Changes:
              </label>
              {selectedRequest.changes && selectedRequest.changes.length > 0 ? (
                <div className="space-y-3">
                  {selectedRequest.changes.map((change: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded border border-gray-200">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Field</p>
                          <p className="font-medium">{change.field}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Old Value</p>
                          <p className="text-gray-600">
                            {change.oldValue ? String(change.oldValue) : <span className="text-gray-400">-</span>}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">New Value</p>
                          <p className="text-green-600 font-medium">
                            {String(change.newValue)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No changes specified</p>
              )}
            </div>

            {/* Review Information */}
            {selectedRequest.reviewedAt && (
              <div className="pt-4 border-t">
                <label className="font-semibold text-gray-700">Review Information:</label>
                <div className="mt-2 bg-blue-50 p-3 rounded">
                  <p className="text-sm">
                    <strong>Reviewed At:</strong> {formatDate(selectedRequest.reviewedAt, 'PPp')}
                  </p>
                  {selectedRequest.reviewedBy && (
                    <p className="text-sm mt-1">
                      <strong>Reviewed By:</strong> Admin
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};