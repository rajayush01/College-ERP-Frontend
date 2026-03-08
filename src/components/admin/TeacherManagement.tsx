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
import { BLOOD_GROUPS, MARITAL_STATUS, DEPARTMENTS } from '@/utils/constants';

/* =========================
   FORM TYPE
========================= */
type TeacherFormData = {
	name: string;
	fatherName: string;
	motherName: string;
	email: string;

	primaryPhone: string;
	secondaryPhone: string;

	street: string;
	city: string;
	state: string;
	pincode: string;

	dob: string;
	joinedDate: string;

	bloodGroup: string;
	maritalStatus: string;
	partnerName: string;

	department: string;
	designation: string;

	degree: string;
	institution: string;
	year: number;
};

const emptyForm: TeacherFormData = {
	name: '',
	fatherName: '',
	motherName: '',
	email: '',
	primaryPhone: '',
	secondaryPhone: '',
	street: '',
	city: '',
	state: '',
	pincode: '',
	dob: '',
	joinedDate: '',
	bloodGroup: '',
	maritalStatus: '',
	partnerName: '',
	department: '',
	designation: 'Assistant Professor',
	degree: '',
	institution: '',
	year: new Date().getFullYear(),
};

export const TeacherManagement: React.FC = () => {
	const [teachers, setTeachers] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	const [showFormModal, setShowFormModal] = useState(false);
	const [showViewModal, setShowViewModal] = useState(false);

	const [isEditMode, setIsEditMode] = useState(false);
	const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);

	const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
	const [formData, setFormData] = useState<TeacherFormData>(emptyForm);

  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);


	type UploadDoc = {
		file: File;
		title: string;
	};

	const [documents, setDocuments] = useState<UploadDoc[]>([]);
	const [uploadingDocs, setUploadingDocs] = useState(false);
	const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

	/* =========================
     INITIAL LOAD
  ========================= */
	useEffect(() => {
		fetchTeachers();
	}, []);

	const fetchTeachers = async () => {
		setLoading(true);
		try {
			const res = await adminApi.listTeachers();
			setTeachers(res.data.teachers || []);
		} finally {
			setLoading(false);
		}
	};

	const handleDocumentSelect = (files: FileList | null) => {
		if (!files) return;

		const newDocs: UploadDoc[] = Array.from(files).map((file) => ({
			file,
			title: '',
		}));

		setDocuments((prev) => [...prev, ...newDocs]);
	};

	const handleLabelChange = (index: number, value: string) => {
		const updated = [...documents];
		updated[index].title = value;
		setDocuments(updated);
	};

	const removeDocument = (index: number) => {
		setDocuments((docs) => docs.filter((_, i) => i !== index));
	};

	const uploadTeacherDocuments = async (teacherId: string) => {
    if (documents.length === 0) return;

    for (const doc of documents) {
      if (!doc.title) {
        alert("All documents must have a name");
        return;
      }

      try {
        setUploadingDocs(true);
        await adminApi.uploadTeacherDocuments(teacherId, doc.file, doc.title);
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to upload document");
        return;
      } finally {
        setUploadingDocs(false);
      }
    }

    alert("Documents uploaded successfully");
    setDocuments([]);
  };


	/* =========================
     CREATE / UPDATE
  ========================= */
const handleSubmitTeacher = async () => {
  if (!formData.name || !formData.email || !formData.primaryPhone || !formData.dob || !formData.department || !formData.fatherName || !formData.motherName) {
    alert("Name, Father's Name, Mother's Name, Email, Primary Phone, Department and DOB are required");
    return;
  }

  // Validate documents have titles
  for (const doc of documents) {
    if (!doc.title.trim()) {
      alert("All documents must have a title");
      return;
    }
  }

  // Build phoneNumbers array in the correct format
  const phoneNumbers: { label: 'primary' | 'secondary'; number: string }[] = [
    { label: "primary" as const, number: formData.primaryPhone }
  ];
  
  if (formData.secondaryPhone) {
    phoneNumbers.push({ label: "secondary" as const, number: formData.secondaryPhone });
  }

  const payload = {
    name: formData.name,
    fatherName: formData.fatherName,
    motherName: formData.motherName,
    email: formData.email,
    phoneNumbers: phoneNumbers,
    address: {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    },
    dob: formData.dob,
    joinedDate: formData.joinedDate || undefined,
    bloodGroup: formData.bloodGroup || undefined,
    maritalStatus: formData.maritalStatus || undefined,
    partnerName:
      formData.maritalStatus === "Married"
        ? formData.partnerName
        : undefined,
    department: formData.department,
    designation: formData.designation || 'Assistant Professor',
    qualifications:
      formData.degree && formData.institution
        ? [
            {
              degree: formData.degree,
              institution: formData.institution,
              year: formData.year,
            },
          ]
        : [],
  };

  console.log("Submitting teacher data:", payload);

  try {
    let teacherId: string;

    if (isEditMode && editingTeacherId) {
      await adminApi.updateTeacher(editingTeacherId, payload, selectedPhoto || undefined);
      teacherId = editingTeacherId;
    } else {
      const res = await adminApi.createTeacher(payload, selectedPhoto || undefined);
      teacherId = res.data._id || res.data.teacherId;
    }

    // Upload documents if any
    await uploadTeacherDocuments(teacherId);

    alert(isEditMode ? "Faculty updated successfully" : "Faculty created successfully");

    closeFormModal();
    fetchTeachers();
  } catch (err: any) {
    console.error("Teacher submission error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Operation failed");
  }
};


	/* =========================
     VIEW
  ========================= */
	const handleViewTeacher = async (id: string) => {
		const res = await adminApi.getTeacherById(id);
		setSelectedTeacher(res.data);
		setShowViewModal(true);
	};

	/* =========================
     EDIT
  ========================= */
	const handleEditTeacher = async (row: any) => {
		const res = await adminApi.getTeacherById(row._id);
		const teacher = res.data;

		const primaryPhone = teacher.phoneNumbers?.find((p: any) => p.label === 'primary')?.number || '';

		const secondaryPhone = teacher.phoneNumbers?.find((p: any) => p.label === 'secondary')?.number || '';

		const qualification = teacher.qualifications?.[0];

		setFormData({
			name: teacher.name ?? '',
			fatherName: teacher.fatherName ?? '',
			motherName: teacher.motherName ?? '',
			email: teacher.email ?? '',

			primaryPhone,
			secondaryPhone,

			street: teacher.address?.street ?? '',
			city: teacher.address?.city ?? '',
			state: teacher.address?.state ?? '',
			pincode: teacher.address?.pincode ?? '',

			dob: teacher.dob ? new Date(teacher.dob).toISOString().split('T')[0] : '',

			joinedDate: teacher.joinedDate ? new Date(teacher.joinedDate).toISOString().split('T')[0] : '',

			bloodGroup: teacher.bloodGroup ?? '',
			maritalStatus: teacher.maritalStatus ?? '',
			partnerName: teacher.partnerName ?? '',

			department: teacher.department ?? '',
			designation: teacher.designation ?? 'Assistant Professor',

			degree: qualification?.degree ?? '',
			institution: qualification?.institution ?? '',
			year: qualification?.year ?? new Date().getFullYear(),
		});

		// Clear documents for new uploads (existing documents are shown in view modal)
		setDocuments([]);
		setSelectedPhoto(null);
		setIsEditMode(true);
		setEditingTeacherId(teacher._id);
		setShowFormModal(true);
	};

	const closeFormModal = () => {
		setShowFormModal(false);
		setIsEditMode(false);
		setEditingTeacherId(null);
		setFormData(emptyForm);
		setDocuments([]);
		setSelectedPhoto(null);
	};

	/* =========================
     TABLE
  ========================= */
	const columns = [
		{ key: 'name', header: 'Name' },
		{ key: 'teacherId', header: 'Faculty ID' },
		{ key: 'email', header: 'Email' },
		{ key: 'maritalStatus', header: 'Marital Status' },
		{
			key: 'actions',
			header: 'Actions',
			render: (_: any, row: any) => (
				<div className="flex gap-2">
					<Button variant="secondary" onClick={() => handleViewTeacher(row._id)}>
						<Eye size={16} />
					</Button>
					<Button variant="secondary" onClick={() => handleEditTeacher(row)}>
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
		<div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
				<h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Faculty Management</h1>
				<Button
					onClick={() => {
						setIsEditMode(false);
						setEditingTeacherId(null);
						setFormData(emptyForm);
						setDocuments([]);
						setSelectedPhoto(null);
						setShowFormModal(true);
					}}
					className="w-full sm:w-auto text-sm sm:text-base"
				>
					<Plus size={18} className="sm:mr-1" /> 
					<span className="hidden xs:inline">Add Faculty</span>
					<span className="xs:hidden">Add</span>
				</Button>
			</div>

			<Card>
				{/* Mobile-friendly table wrapper */}
				<div className="overflow-x-auto -mx-3 sm:mx-0">
					<div className="min-w-[700px]">
						<Table columns={columns} data={teachers} loading={loading} mobileCardView={true}/>
					</div>
				</div>
			</Card>

			{/* ================= CREATE / EDIT MODAL ================= */}
			<Modal
				isOpen={showFormModal}
				onClose={closeFormModal}
				title={isEditMode ? 'Edit Faculty' : 'Create Faculty'}
				size="lg"
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
					{/* Photo Upload */}
					<div className="col-span-1 sm:col-span-2 flex justify-center mb-2 sm:mb-4">
						<PhotoUpload
							currentPhoto={isEditMode ? selectedTeacher?.image : undefined}
							onPhotoSelect={setSelectedPhoto}
							label="Faculty Photo"
							size="lg"
						/>
					</div>

					<Input
						label="Name"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						required
					/>
				    <Input
						label="Father's Name"
						value={formData.fatherName}
						onChange={(e) =>
							setFormData({ ...formData, fatherName: e.target.value })
						}
						required
					/>

					<Input
						label="Mother's Name"
						value={formData.motherName}
						onChange={(e) =>
							setFormData({ ...formData, motherName: e.target.value })
						}
						required
					/>

					<div className="col-span-1 sm:col-span-2">
						<Input label="Email" value={formData.email} disabled={isEditMode} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
					</div>

					<Select
						label="Department"
						value={formData.department}
						onChange={(e) => setFormData({ ...formData, department: e.target.value })}
						options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
						required
					/>
					<Input
						label="Designation"
						value={formData.designation}
						onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
						placeholder="Assistant Professor"
					/>

					<Input
						label="Primary Phone"
						value={formData.primaryPhone}
						onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
						required
					/>
					<Input
						label="Secondary Phone"
						value={formData.secondaryPhone}
						onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
					/>

					<DatePicker
						label="DOB"
						value={formData.dob}
						onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
						required
					/>
					<DatePicker
						label="Joined Date"
						value={formData.joinedDate}
						onChange={(e) => setFormData({ ...formData, joinedDate: e.target.value })}
					/>

					<Select
						label="Blood Group"
						value={formData.bloodGroup}
						onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
						options={BLOOD_GROUPS}
					/>
					<Select
						label="Marital Status"
						value={formData.maritalStatus}
						onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
						options={MARITAL_STATUS}
					/>

					{formData.maritalStatus === 'Married' && (
						<div className="col-span-1 sm:col-span-2">
							<Input
								label="Partner Name"
								value={formData.partnerName}
								onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
							/>
						</div>
					)}

					<Input
						label="Street"
						value={formData.street}
						onChange={(e) => setFormData({ ...formData, street: e.target.value })}
					/>
					<Input
						label="City"
						value={formData.city}
						onChange={(e) => setFormData({ ...formData, city: e.target.value })}
					/>
					<Input
						label="State"
						value={formData.state}
						onChange={(e) => setFormData({ ...formData, state: e.target.value })}
					/>
					<Input
						label="Pincode"
						value={formData.pincode}
						onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
					/>

					<Input
						label="Degree"
						value={formData.degree}
						onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
					/>
					<Input
						label="Institution"
						value={formData.institution}
						onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
					/>

					{/* ================= DOCUMENT UPLOAD ================= */}
					<div className="col-span-1 sm:col-span-2 border-t pt-3 sm:pt-4">
						<h3 className="font-semibold mb-2 text-sm sm:text-base">
							{isEditMode ? 'Add New Documents' : 'Documents (PDF)'}
						</h3>
						{isEditMode && (
							<p className="text-xs sm:text-sm text-blue-600 mb-2 sm:mb-3">
								Existing documents can be viewed in the faculty details. Add new documents below.
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
									placeholder="Document title (Aadhaar, Degree, Experience Certificate)"
									value={doc.title}
									onChange={(e) => handleLabelChange(i, e.target.value)}
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
					<Button onClick={handleSubmitTeacher} className="w-full sm:w-auto order-1 sm:order-2">
						{isEditMode ? 'Update Faculty' : 'Create Faculty'}
					</Button>
				</div>
			</Modal>

			{/* ================= VIEW MODAL ================= */}
			<Modal
				isOpen={showViewModal}
				onClose={() => setShowViewModal(false)}
				title="Faculty Details"
				size="lg"
			>
				{selectedTeacher && (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
						<div className="break-words"><b>ID:</b> {selectedTeacher.teacherId}</div>
						<div className="break-words"><b>Name:</b> {selectedTeacher.name}</div>
						<div className="break-words"><b>Email:</b> {selectedTeacher.email}</div>
						<div className="break-words"><b>Parent:</b> {selectedTeacher.parentsName}</div>
						<div><b>DOB:</b> {selectedTeacher.dob?.split("T")[0]}</div>
						<div><b>Joined:</b> {selectedTeacher.joinedDate?.split("T")[0] || "—"}</div>
						<div><b>Blood Group:</b> {selectedTeacher.bloodGroup || "—"}</div>
						<div><b>Marital:</b> {selectedTeacher.maritalStatus || "—"}</div>

						{/* Phones */}
						<div className="col-span-1 sm:col-span-2">
							<b>Phones:</b>
							<ul className="list-disc ml-5 mt-1">
								{selectedTeacher.phoneNumbers?.map((p: any, i: number) => (
									<li key={i} className="break-all">
										{p.label}: {p.number}
									</li>
								))}
							</ul>
						</div>

						{/* ================= DOCUMENTS ================= */}
						<div className="col-span-1 sm:col-span-2 mt-2 sm:mt-4">
							<b>Documents:</b>

							{selectedTeacher.documents?.length > 0 ? (
								<div className="mt-2 space-y-2">
									{selectedTeacher.documents.map((doc: any, index: number) => (
										<div
											key={index}
											className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border rounded p-2 sm:p-3"
										>
											<div className="flex-1 min-w-0">
												<div className="font-medium text-sm break-words">{doc.title}</div>
												<div className="text-xs text-gray-500 break-all">
													{doc.originalName}
												</div>
											</div>

											<Button
												type="button"
												variant="secondary"
												size="sm"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();

													console.log( `${import.meta.env.VITE_API_BASE_URL}${doc.fileUrl}`)

													setPreviewDocUrl(
														doc.fileUrl
													);
												}}
												className="w-full sm:w-auto shrink-0"
											>
												View
											</Button>
										</div>
									))}
								</div>
							) : (
								<div className="text-gray-500 mt-1 text-xs sm:text-sm">No documents uploaded</div>
							)}

							{/* DOCUMENT UPLOAD */}
							<div className="mt-4 sm:mt-6 border-t pt-3 sm:pt-4">
								<DocumentUpload
									onUpload={async (file, title) => {
										await adminApi.uploadTeacherDocuments(selectedTeacher._id, file, title);
										// Refresh teacher data
										const updatedTeacher = await adminApi.getTeacherById(selectedTeacher._id);
										setSelectedTeacher(updatedTeacher.data);
										fetchTeachers(); // Refresh the main list
									}}
									label="Upload New Document"
									accept="application/pdf"
								/>
							</div>
						</div>
					</div>
				)}
			</Modal>

			<Modal
				isOpen={!!previewDocUrl}
				onClose={() => setPreviewDocUrl(null)}
				title="Document Preview"
				size="xl"
			>
				{previewDocUrl && (
					<div className="w-full h-[50vh] sm:h-[60vh] md:h-[80vh]">
						<iframe
							src={previewDocUrl}
							className="w-full h-full border"
						/>
					</div>
				)}
			</Modal>
		</div>
	);
};