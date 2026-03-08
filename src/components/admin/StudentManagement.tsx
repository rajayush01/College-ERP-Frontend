import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Modal } from '../common/Modal';
import { Table } from '../common/Table';
import { DatePicker } from '../common/DatePicker';
import { DocumentUpload } from '../common/DocumentUpload';
import { PhotoUpload } from '../common/PhotoUpload';
import * as adminApi from '@/api/admin.api';
import { Plus, Eye, Pencil } from 'lucide-react';
import { BLOOD_GROUPS, DEPARTMENTS, PROGRAMS, SEMESTERS } from '@/utils/constants';

/* =========================
   UI FORM TYPE
========================= */
type StudentFormData = {
	name: string;
	enrollmentNumber: string;
	batchId: string;
	department: string;
	program: string;
	semester: string;

	fatherName: string;
	motherName: string;
	parentsEmail: string;
	studentEmail: string;

	address: string;
	phoneNumbers: string[];
	bloodGroup: string;
	caste: string;
	dob: string;
	joinedDate: string;
};

type UploadDoc = {
	file: File;
	title: string;
};

const emptyForm: StudentFormData = {
	name: '',
	enrollmentNumber: '',
	batchId: '',
	department: '',
	program: '',
	semester: '',
	fatherName: '',
	motherName: '',
	parentsEmail: '',
	studentEmail: '',
	address: '',
	phoneNumbers: [''],
	bloodGroup: '',
	caste: '',
	dob: '',
	joinedDate: '',
};

export const StudentManagement: React.FC = () => {
	const [students, setStudents] = useState<any[]>([]);
	const [batches, setBatches] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	const [showFormModal, setShowFormModal] = useState(false);
	const [showDetailModal, setShowDetailModal] = useState(false);

	const [isEditMode, setIsEditMode] = useState(false);
	const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

	const [selectedStudent, setSelectedStudent] = useState<any>(null);
	const [formData, setFormData] = useState<StudentFormData>(emptyForm);

	/* ===== DOCUMENT STATE ===== */
	const [documents, setDocuments] = useState<UploadDoc[]>([]);
	const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
	const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

	/* =========================
     INITIAL LOAD
  ========================= */
	useEffect(() => {
		fetchStudents();
		fetchBatches();
	}, []);

	const fetchStudents = async () => {
		setLoading(true);
		try {
			const res = await adminApi.listStudents();
			setStudents(res.data.students || []);
		} finally {
			setLoading(false);
		}
	};

	const fetchBatches = async () => {
		const res = await adminApi.getAllBatches();
		setBatches(Array.isArray(res.data) ? res.data : []);
	};

	/* =========================
     DOCUMENT HANDLERS
  ========================= */
	const handleDocumentSelect = (files: FileList | null) => {
		if (!files) return;

		const newDocs: UploadDoc[] = Array.from(files).map((file) => ({
			file,
			title: '',
		}));

		setDocuments((prev) => [...prev, ...newDocs]);
	};

	const handleDocTitleChange = (index: number, value: string) => {
		const updated = [...documents];
		updated[index].title = value;
		setDocuments(updated);
	};

	const removeDocument = (index: number) => {
		setDocuments((docs) => docs.filter((_, i) => i !== index));
	};

  const uploadStudentDocuments = async (studentId: string) => {
    if (documents.length === 0) return;

    for (const doc of documents) {
      if (!doc.title.trim()) {
        alert("All documents must have a title");
        return;
      }

      try {
        await adminApi.uploadStudentDocuments(studentId, doc.file, doc.title);
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to upload document");
        return;
      }
    }

    setDocuments([]);
  };


	/* =========================
     CREATE / UPDATE
  ========================= */
	const handleSubmitStudent = async () => {
		if (!formData.name || !formData.enrollmentNumber || !formData.batchId || !formData.dob) {
			alert('Name, Enrollment No, Batch and DOB are required');
			return;
		}

		// Validate documents have titles
		for (const doc of documents) {
			if (!doc.title.trim()) {
				alert("All documents must have a title");
				return;
			}
		}

		const payload = {
			...formData,
			phoneNumbers: formData.phoneNumbers.filter(Boolean),
			semester: parseInt(formData.semester) || 1,
		};

		try {
			let studentId: string;

			if (isEditMode && editingStudentId) {
				await adminApi.updateStudent(editingStudentId, payload, selectedPhoto || undefined);
				studentId = editingStudentId;
			} else {
				const res = await adminApi.createStudent(payload, selectedPhoto || undefined);
				studentId = res.data._id;
			}

			// Upload documents if any
			await uploadStudentDocuments(studentId);

			closeFormModal();
			fetchStudents();
		} catch (err: any) {
			alert(err.response?.data?.message || 'Operation failed');
		}
	};

	/* =========================
     EDIT
  ========================= */
	const handleEditStudent = async (id: string) => {
		const res = await adminApi.getStudentById(id);
		const student = res.data;

		setIsEditMode(true);
		setEditingStudentId(student._id);

		setFormData({
			name: student.name ?? '',
			enrollmentNumber: student.enrollmentNumber ?? '',
			batchId: student.batchId?._id ?? '',
			department: student.department ?? '',
			program: student.program ?? '',
			semester: student.semester ?? '',

			fatherName: student.fatherName ?? '',
			motherName: student.motherName ?? '',
			parentsEmail: student.parentsEmail ?? '',
			studentEmail: student.studentEmail ?? '',

			address: student.address ?? '',
			phoneNumbers: student.phoneNumbers?.length ? student.phoneNumbers : [''],

			bloodGroup: student.bloodGroup ?? '',
			caste: student.caste ?? '',

			dob: student.dob ? student.dob.split('T')[0] : '',
			joinedDate: student.joinedDate ? student.joinedDate.split('T')[0] : '',
		});

		// Clear documents for new uploads (existing documents are shown in view modal)
		setDocuments([]);
		setSelectedPhoto(null);
		setShowFormModal(true);
	};

	/* =========================
     VIEW
  ========================= */
	const handleViewDetails = async (id: string) => {
		const res = await adminApi.getStudentById(id);
		setSelectedStudent(res.data);
		setShowDetailModal(true);
	};

	const closeFormModal = () => {
		setShowFormModal(false);
		setIsEditMode(false);
		setEditingStudentId(null);
		setFormData(emptyForm);
		setDocuments([]);
		setSelectedPhoto(null);
	};

	/* =========================
     TABLE
  ========================= */
	const columns = [
		{ key: 'name', header: 'Name' },
		{ key: 'enrollmentNumber', header: 'Enrollment No' },
		{
			key: 'batchId',
			header: 'Batch',
			render: (_: any, row: any) => (row.batchId ? row.batchId.batchName : '—'),
		},
		{ key: 'department', header: 'Department' },
		{ key: 'semester', header: 'Semester' },
		{ key: 'fatherName', header: 'Father' },
		{
			key: 'actions',
			header: 'Actions',
			render: (_: any, row: any) => (
				<div className="flex gap-2">
					<Button variant="secondary" onClick={() => handleViewDetails(row._id)}>
						<Eye size={16} />
					</Button>
					<Button variant="secondary" onClick={() => handleEditStudent(row._id)}>
						<Pencil size={16} />
					</Button>
				</div>
			),
		},
	];

	/* =========================
     UI
  ========================= */
	return (
		<div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 ">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 ">
				<h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Student Management</h1>
				<Button
					onClick={() => {
						setIsEditMode(false);
						setEditingStudentId(null);
						setFormData(emptyForm);
						setDocuments([]);
						setShowFormModal(true);
					}}
					className="w-full sm:w-auto text-sm sm:text-base"
				>
					<Plus size={18} className="sm:mr-1" /> 
					<span className="hidden xs:inline">Add Student</span>
					<span className="xs:hidden">Add</span>
				</Button>
			</div>

			<Card>
				{/* Mobile-friendly table wrapper */}
				<div className="overflow-x-auto -mx-3 sm:mx-0">
					<div className="min-w-[600px]">
						<Table columns={columns} data={students} loading={loading} mobileCardView={true}/>
					</div>
				</div>
			</Card>

			{/* ================= CREATE / EDIT MODAL ================= */}
			<Modal
				isOpen={showFormModal}
				onClose={closeFormModal}
				title={isEditMode ? 'Edit Student' : 'Create Student'}
				size="lg"
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
					{/* Photo Upload */}
					<div className="col-span-1 sm:col-span-2 flex justify-center mb-2 sm:mb-4">
						<PhotoUpload
							currentPhoto={isEditMode ? selectedStudent?.image : undefined}
							onPhotoSelect={setSelectedPhoto}
							label="Student Photo"
							size="lg"
						/>
					</div>

					<Input
						label="Name"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					/>
					<Input
						label="Enrollment Number"
						value={formData.enrollmentNumber}
						onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
					/>

					<div className="col-span-1 sm:col-span-2">
						<Select
							label="Batch"
							value={formData.batchId}
							onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
							options={batches.map((b) => ({ value: b._id, label: b.batchName }))}
						/>
					</div>

					<Select
						label="Department"
						value={formData.department}
						onChange={(e) => setFormData({ ...formData, department: e.target.value })}
						options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
					/>
					<Select
						label="Program"
						value={formData.program}
						onChange={(e) => setFormData({ ...formData, program: e.target.value })}
						options={PROGRAMS.map((p) => ({ value: p, label: p }))}
					/>
					<Select
						label="Semester"
						value={formData.semester}
						onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
						options={SEMESTERS.map((s) => ({ value: s.toString(), label: `Semester ${s}` }))}
					/>

					<DatePicker
						label="DOB"
						value={formData.dob}
						onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
					/>
					<DatePicker
						label="Joined Date"
						value={formData.joinedDate}
						onChange={(e) => setFormData({ ...formData, joinedDate: e.target.value })}
					/>

					<Input
						label="Father Name"
						value={formData.fatherName}
						onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
					/>
					<Input
						label="Mother Name"
						value={formData.motherName}
						onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
					/>

					<Input
						label="Parent Email"
						value={formData.parentsEmail}
						onChange={(e) => setFormData({ ...formData, parentsEmail: e.target.value })}
					/>
					<Input
						label="Student Email"
						value={formData.studentEmail}
						onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
					/>

					<Select
						label="Blood Group"
						value={formData.bloodGroup}
						onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
						options={BLOOD_GROUPS}
					/>

					<Input
						label="Caste"
						value={formData.caste}
						onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
					/>
					
					<Input
						label="Phone"
						value={formData.phoneNumbers[0]}
						onChange={(e) => setFormData({ ...formData, phoneNumbers: [e.target.value] })}
					/>

					<div className="col-span-1 sm:col-span-2">
						<Input
							label="Address"
							value={formData.address}
							onChange={(e) => setFormData({ ...formData, address: e.target.value })}
						/>
					</div>

					{/* ================= DOCUMENT UPLOAD ================= */}
					<div className="col-span-1 sm:col-span-2 border-t pt-3 sm:pt-4">
						<h3 className="font-semibold mb-2 text-sm sm:text-base">
							{isEditMode ? 'Add New Documents' : 'Documents (PDF)'}
						</h3>
						{isEditMode && (
							<p className="text-xs sm:text-sm text-blue-600 mb-2 sm:mb-3">
								Existing documents can be viewed in the student details. Add new documents below.
							</p>
						)}
						<input
							type="file"
							accept="application/pdf"
							multiple
							onChange={(e) => handleDocumentSelect(e.target.files)}
							className="mb-2 sm:mb-3 w-full text-xs sm:text-sm"
						/>

						{documents.map((doc, i) => (
							<div key={i} className="flex flex-col gap-2 mt-2 p-2 sm:p-0">
								<Input
									placeholder="Document title (Aadhaar, TC, Birth Certificate)"
									value={doc.title}
									onChange={(e) => handleDocTitleChange(i, e.target.value)}
									className="w-full"
								/>
								<div className="flex items-center justify-between gap-2">
									<span className="text-xs text-gray-500 truncate flex-1">
										{doc.file.name}
									</span>
									<Button 
										variant="secondary" 
										size="sm"
										onClick={() => removeDocument(i)}
										className="shrink-0"
									>
										Remove
									</Button>
								</div>
							</div>
						))}

						{documents.length > 0 && (
							<p className="text-xs sm:text-sm text-blue-600 mt-2">
								{documents.length} document(s) selected for upload
							</p>
						)}
					</div>
				</div>

				<div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 sm:mt-6">
					<Button variant="secondary" onClick={closeFormModal} className="w-full sm:w-auto order-2 sm:order-1">
						Cancel
					</Button>
					<Button onClick={handleSubmitStudent} className="w-full sm:w-auto order-1 sm:order-2">
						{isEditMode ? 'Update Student' : 'Create Student'}
					</Button>
				</div>
			</Modal>

			{/* ================= VIEW MODAL ================= */}
			<Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Student Details" size="lg">
				{selectedStudent && (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 text-xs sm:text-sm">
							<div className="break-words">
								<b>ID:</b> {selectedStudent.studentId}
							</div>
							<div className="break-words">
								<b>Name:</b> {selectedStudent.name}
							</div>
							<div>
								<b>Enrollment No:</b> {selectedStudent.enrollmentNumber}
							</div>
							<div>
								<b>Batch:</b> {selectedStudent.batchId?.batchName}
							</div>
							<div>
								<b>Department:</b> {selectedStudent.department}
							</div>
							<div>
								<b>Program:</b> {selectedStudent.program}
							</div>
							<div>
								<b>Semester:</b> {selectedStudent.semester}
							</div>
							<div className="break-words">
								<b>Father:</b> {selectedStudent.fatherName}
							</div>
							<div className="break-words">
								<b>Mother:</b> {selectedStudent.motherName}
							</div>
							<div>
								<b>Blood Group:</b> {selectedStudent.bloodGroup}
							</div>
							<div>
								<b>Caste:</b> {selectedStudent.caste}
							</div>
							<div className="col-span-1 sm:col-span-2 break-words">
								<b>Address:</b> {selectedStudent.address}
							</div>
						</div>

						{/* DOCUMENT LIST */}
						{selectedStudent.documents?.length > 0 && (
							<>
								<h3 className="font-semibold mb-2 text-sm sm:text-base">Documents</h3>
								<div className="space-y-2">
									{selectedStudent.documents.map((doc: any, i: number) => (
										<div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-2 sm:p-3 border rounded">
											<span className="font-medium text-sm break-words">{doc.title}</span>
											<Button 
												variant="secondary" 
												size="sm"
												onClick={() => setPreviewDocUrl(doc.fileUrl)}
												className="w-full sm:w-auto shrink-0"
											>
												View
											</Button>
										</div>
									))}
								</div>
							</>
						)}

						{/* DOCUMENT UPLOAD */}
						<div className="mt-4 sm:mt-6 border-t pt-3 sm:pt-4">
							<DocumentUpload
								onUpload={async (file, title) => {
									await adminApi.uploadStudentDocuments(selectedStudent._id, file, title);
									// Refresh student data
									const updatedStudent = await adminApi.getStudentById(selectedStudent._id);
									setSelectedStudent(updatedStudent.data);
									fetchStudents(); // Refresh the main list
								}}
								label="Upload New Document"
								accept="application/pdf"
							/>
						</div>
					</>
				)}
			</Modal>

			{/* ================= PREVIEW MODAL ================= */}
			<Modal isOpen={!!previewDocUrl} onClose={() => setPreviewDocUrl(null)} title="Document Preview" size="xl">
				{previewDocUrl && (
					<div className="w-full h-[50vh] sm:h-[60vh] md:h-[80vh]">
						<iframe src={previewDocUrl} className="w-full h-full border" />
					</div>
				)}
			</Modal>
		</div>
	);
};