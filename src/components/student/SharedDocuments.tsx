import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as commonApi from '@/api/common.api';
import { formatDate } from '@/utils/formatters';
import { FileText, Download } from 'lucide-react';

export const SharedDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await commonApi.getSharedDocuments();
      setDocuments(response.data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shared Documents</h1>

      {documents.length === 0 ? (
        <Card>
          <p className="text-gray-500">No documents available</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <Card key={doc._id}>
              <div className="flex items-start gap-4">
                <FileText className="text-blue-500" size={32} />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{doc.title}</h3>
                  {doc.description && (
                    <p className="text-gray-600 text-sm mt-1">{doc.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Uploaded: {formatDate(doc.createdAt, 'PP')}
                  </p>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-primary hover:underline"
                  >
                    <Download size={16} />
                    Download
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};