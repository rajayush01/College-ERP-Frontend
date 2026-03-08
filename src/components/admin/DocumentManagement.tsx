// import React, { useEffect, useState } from 'react';
// import { Card } from '../common/Card';
// import { Button } from '../common/Button';
// import { Input } from '../common/Input';
// import { Modal } from '../common/Modal';
// import { Table } from '../common/Table';
// import { FileUpload } from '../common/FileUpload';
// import * as adminApi from '@/api/admin.api';
// import { Plus, FileText, Download, Upload as UploadIcon } from 'lucide-react';
// import { formatDate } from '@/utils/formatters';

// /**
//  * Backend base URL for static files
//  * IMPORTANT: must match server config
//  */
// const FILE_BASE_URL = 'http://localhost:5000';

// export const DocumentManagement: React.FC = () => {
// 	const [documents, setDocuments] = useState<any[]>([]);
// 	const [loading, setLoading] = useState(false);
// 	const [uploading, setUploading] = useState(false);
// 	const [showUploadModal, setShowUploadModal] = useState(false);

// 	const [formData, setFormData] = useState<{
// 		title: string;
// 		description: string;
// 		file: File | null;
// 	}>({
// 		title: '',
// 		description: '',
// 		file: null,
// 	});

// 	/* =========================
//      LOAD DOCUMENTS
//   ========================= */
// 	useEffect(() => {
// 		fetchDocuments();
// 	}, []);

// 	const fetchDocuments = async () => {
// 		setLoading(true);
// 		try {
// 			const response = await adminApi.getAllDocuments();
// 			setDocuments(Array.isArray(response.data) ? response.data : []);
// 		} catch (error) {
// 			console.error('Failed to fetch documents:', error);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	/* =========================
//      UPLOAD DOCUMENT
//   ========================= */
//   const handleUpload = async () => {
//     if (!formData.title.trim()) {
//       alert('Title is required');
//       return;
//     }

//     if (!formData.file) {
//       alert('Please select a PDF file');
//       return;
//     }

//     if (formData.file.type !== 'application/pdf') {
//       alert('Only PDF files are allowed');
//       return;
//     }

//     try {
//       setUploading(true);
//       await adminApi.uploadDocument(formData.file, {
//         title: formData.title,
//         description: formData.description,
//         visibleTo: ['STUDENT', 'TEACHER'] // Default visibility
//       });
//       await fetchDocuments();
//       resetForm();
//       setShowUploadModal(false);
//       alert('Document uploaded successfully');
//     } catch (error: any) {
//       console.error('Upload error:', error);
//       alert(error.response?.data?.message || 'Failed to upload document');
//     } finally {
//       setUploading(false);
//     }
//   };



// 	const resetForm = () => {
// 		setFormData({
// 			title: '',
// 			description: '',
// 			file: null,
// 		});
// 	};

// 	/* =========================
//      TABLE CONFIG
//   ========================= */
// 	const columns = [
// 		{
// 			key: 'title',
// 			header: 'Title',
// 			render: (title: string) => (
// 				<div className="flex items-center gap-3">
// 					<div className="p-2 bg-blue-100 rounded-lg">
// 						<FileText size={20} className="text-blue-600" />
// 					</div>
// 					<span className="font-medium text-neutral-800">{title}</span>
// 				</div>
// 			),
// 		},
// 		{
// 			key: 'description',
// 			header: 'Description',
// 			render: (desc: string) => <span className="text-neutral-600">{desc?.trim() || 'No description'}</span>,
// 		},
// 		{
// 			key: 'createdAt',
// 			header: 'Uploaded',
// 			render: (date: string) => <span className="text-neutral-700 font-medium">{formatDate(date, 'PP')}</span>,
// 		},
// 		{
// 			key: 'fileUrl',
// 			header: 'Actions',
// 			render: (url: string) => (
// 	  <a
//   href={url}
//   target="_blank"
//   rel="noopener noreferrer"
//   className="inline-flex items-center gap-2"
// >
//   <Download size={16} />
//   Download
// </a>


// 			),
// 		},
// 	];

// 	/* =========================
//      UI
//   ========================= */
// 	return (
// 		<div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-cyan-50 to-blue-50 min-h-screen">
// 			{/* Header */}
// 			<div className="flex justify-between items-center">
// 				<div>
// 					<h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
// 						Document Management
// 					</h1>
// 					<p className="text-neutral-600">Upload and manage important documents</p>
// 				</div>

// 				<Button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 shadow-lg">
// 					<Plus size={20} />
// 					Upload Document
// 				</Button>
// 			</div>

// 			{/* Documents Table */}
// 			<Card className="shadow-lg border-2 border-white">
// 				<Table columns={columns} data={documents} loading={loading} />
// 			</Card>

// 			{/* Upload Modal */}
// 			<Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload Document" size="md">
// 				<div className="space-y-6">
// 					<Input
// 						label="Title"
// 						value={formData.title}
// 						onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
// 						required
// 					/>

// 					<Input
// 						label="Description"
// 						value={formData.description}
// 						onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
// 					/>

// 					<FileUpload
// 						label="Upload PDF"
// 						accept=".pdf"
// 						onChange={(file) => setFormData((p) => ({ ...p, file }))}
// 					/>

// 					{formData.file && (
// 						<div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
// 							<p className="text-sm text-emerald-700 flex items-center gap-2">
// 								<FileText size={16} />
// 								{formData.file.name}
// 							</p>
// 						</div>
// 					)}

// 					<div className="flex justify-end gap-3 pt-4 border-t">
// 						<Button variant="secondary" onClick={() => setShowUploadModal(false)} disabled={uploading}>
// 							Cancel
// 						</Button>
// 						<Button onClick={handleUpload} disabled={uploading} className="flex items-center gap-2">
// 							<UploadIcon size={18} />
// 							{uploading ? 'Uploading...' : 'Upload'}
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
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { Table } from '../common/Table';
import { FileUpload } from '../common/FileUpload';
import * as adminApi from '@/api/admin.api';
import { Plus, FileText, Download, Upload as UploadIcon } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

export const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null as File | null,
  });

  /* =========================
     LOAD DOCUMENTS
  ========================= */
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllDocuments();
      setDocuments(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UPLOAD DOCUMENT
  ========================= */
  const handleUpload = async () => {
    if (!formData.title.trim()) return alert('Title is required');
    if (!formData.file) return alert('Please select a PDF file');
    if (formData.file.type !== 'application/pdf') return alert('Only PDF files allowed');

    try {
      setUploading(true);
      await adminApi.uploadDocument(formData.file, {
        title: formData.title,
        description: formData.description,
        visibleTo: ['STUDENT', 'TEACHER'],
      });
      await fetchDocuments();
      resetForm();
      setShowUploadModal(false);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', file: null });
  };

  /* =========================
     DESKTOP TABLE
  ========================= */
  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (title: string) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText size={18} className="text-blue-600" />
          </div>
          <span className="font-medium">{title}</span>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (desc: string) => (
        <span className="text-neutral-600 line-clamp-2 max-w-md">
          {desc || 'No description'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Uploaded',
      render: (date: string) => formatDate(date, 'PP'),
    },
    {
      key: 'fileUrl',
      header: 'Actions',
      render: (url: string) => (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 font-medium"
        >
          <Download size={16} />
          Download
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-neutral-50 via-cyan-50 to-blue-50 min-h-screen overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Document Management
          </h1>
          <p className="text-neutral-600 text-sm">
            Upload and manage important documents
          </p>
        </div>

        <Button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus size={18} />
          Upload Document
        </Button>
      </div>

      {/* =========================
          MOBILE VIEW (NO TABLE)
      ========================= */}
      <div className="space-y-4 md:hidden">
        {documents.map((doc) => (
          <Card key={doc._id} className="space-y-3 max-w-full">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                <FileText size={18} className="text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold break-words">{doc.title}</p>
                <p className="text-xs text-gray-500">
                  Uploaded {formatDate(doc.createdAt, 'PP')}
                </p>
              </div>
            </div>

            <p className="text-sm text-neutral-600 break-words line-clamp-3">
              {doc.description || 'No description'}
            </p>

            <Button
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={() => window.open(doc.fileUrl, '_blank')}
            >
              <Download size={16} />
              Download
            </Button>
          </Card>
        ))}
      </div>

      {/* =========================
          DESKTOP TABLE
      ========================= */}
      <div className="hidden md:block">
        <Card className="shadow-lg border border-white">
          <Table columns={columns} data={documents} loading={loading} mobileCardView={true}/>
        </Card>
      </div>

      {/* =========================
          UPLOAD MODAL
      ========================= */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Document"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
            required
          />

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
          />

          <FileUpload
            label="Upload PDF"
            accept=".pdf"
            onChange={(file) => setFormData(p => ({ ...p, file }))}
          />

          {formData.file && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
              <p className="text-sm text-emerald-700 break-words">
                {formData.file.name}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={() => setShowUploadModal(false)}
              disabled={uploading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <UploadIcon size={16} />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
