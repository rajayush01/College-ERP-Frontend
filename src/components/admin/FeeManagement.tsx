// import React, { useState, useEffect } from 'react';
// import { Card } from '../common/Card';
// import { Button } from '../common/Button';
// import { Input } from '../common/Input';
// import { Select } from '../common/Select';
// import { Modal } from '../common/Modal';
// import { Table } from '../common/Table';
// import { DatePicker } from '../common/DatePicker';
// import { LoadingSpinner } from '../common/LoadingSpinner';
// import * as feeApi from '@/api/fee.api';
// import * as adminApi from '@/api/admin.api';
// import {
// 	Plus,
// 	Eye,
// 	Pencil,
// 	Trash2,
// 	DollarSign,
// 	Users,
// 	AlertCircle,
// 	CheckCircle,
// 	Receipt,
// 	TrendingUp,
// } from 'lucide-react';

// interface FeeBreakdown {
// 	tuitionFee: number;
// 	examFee: number;
// 	transportFee: number;
// 	libraryFee: number;
// 	labFee: number;
// 	sportsFee: number;
// 	developmentFee: number;
// 	miscellaneousFee: number;
// }

// interface FeeStructure {
// 	_id: string;
// 	class: {
// 		_id: string;
// 		name: string;
// 		section: string;
// 	};
// 	academicYear: string;
// 	feeBreakdown: FeeBreakdown;
// 	totalAmount: number;
// 	dueDate: string;
// 	installments: Array<{
// 		installmentNumber: number;
// 		amount: number;
// 		dueDate: string;
// 		description: string;
// 	}>;
// 	isActive: boolean;
// 	createdAt: string;
// }

// interface FeeRecord {
// 	_id: string;
// 	student: {
// 		_id: string;
// 		name: string;
// 		studentId: string;
// 		rollNumber: string;
// 	};
// 	totalFeeAmount: number;
// 	totalAmountPaid: number;
// 	remainingAmount: number;
// 	status: string;
// 	dueDate: string;
// 	payments: Array<{
// 		paymentId: string;
// 		amount: number;
// 		paymentMode: string;
// 		paymentDate: string;
// 		paymentStatus: string;
//         receiptUrl: string;
// 	}>;
// }

// const emptyFeeStructure = {
// 	class: '',
// 	academicYear: '',
// 	feeBreakdown: {
// 		tuitionFee: 0,
// 		examFee: 0,
// 		transportFee: 0,
// 		libraryFee: 0,
// 		labFee: 0,
// 		sportsFee: 0,
// 		developmentFee: 0,
// 		miscellaneousFee: 0,
// 	},
// 	dueDate: '',
// 	installments: [],
// };

// export const FeeManagement: React.FC = () => {
// 	const [activeTab, setActiveTab] = useState<'structures' | 'records' | 'statistics'>('structures');
// 	const [loading, setLoading] = useState(false);

// 	// Fee Structures
// 	const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
// 	const [classes, setClasses] = useState<any[]>([]);
// 	const [showStructureModal, setShowStructureModal] = useState(false);
// 	const [isEditMode, setIsEditMode] = useState(false);
// 	const [editingStructureId, setEditingStructureId] = useState<string | null>(null);
// 	const [structureFormData, setStructureFormData] = useState(emptyFeeStructure);

// 	// Fee Records
// 	const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
// 	const [showRecordModal, setShowRecordModal] = useState(false);
// 	const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);
// 	const [showPaymentModal, setShowPaymentModal] = useState(false);
// 	const [paymentData, setPaymentData] = useState({
// 		amount: '',
// 		paymentMode: 'CASH',
// 		transactionReference: '',
// 		remarks: '',
// 	});

//     const [showReceiptModal, setShowReceiptModal] = useState(false);
// const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);


// 	// Statistics
// 	const [statistics, setStatistics] = useState({
// 		totalCollected: 0,
// 		totalPending: 0,
// 		totalStudents: 0,
// 		defaulters: 0,
// 	});

// 	useEffect(() => {
// 		console.log('🚀 FeeManagement component mounted, activeTab:', activeTab);

// 		if (activeTab === 'structures') {
// 			console.log('📋 Loading fee structures and classes...');
// 			fetchFeeStructures();
// 			fetchClasses();
// 		} else if (activeTab === 'records') {
// 			console.log('📋 Loading fee records...');
// 			fetchFeeRecords();
// 		} else if (activeTab === 'statistics') {
// 			console.log('📋 Loading statistics...');
// 			fetchStatistics();
// 		}
// 	}, [activeTab]);

// 	const fetchClasses = async () => {
// 		try {
// 			console.log('🔍 Fetching classes for fee structure...');
// 			// Try the fee structure specific endpoint first, fallback to general classes
// 			try {
// 				const res = await feeApi.getClassesForFeeStructure();
// 				console.log('✅ Fee structure classes response:', res.data);
// 				setClasses(Array.isArray(res.data) ? res.data : []);
// 			} catch (feeError) {
// 				console.log('⚠️ Fee structure classes endpoint failed, trying general classes...');
// 				const res = await adminApi.getAllClasses();
// 				console.log('✅ General classes response:', res.data);
// 				setClasses(Array.isArray(res.data) ? res.data : []);
// 			}
// 		} catch (error) {
// 			console.error('❌ Failed to fetch classes:', error);
// 			console.error('Error details:', error.response?.data);
// 		}
// 	};

// 	const fetchFeeStructures = async () => {
// 		setLoading(true);
// 		try {
// 			console.log('🔍 Fetching fee structures...');
// 			const res = await feeApi.getAllFeeStructures();
// 			console.log('✅ Fee structures response:', res.data);

// 			// Handle different response structures
// 			const structures = res.data?.feeStructures || res.data || [];
// 			console.log('📊 Processed structures:', structures);
// 			setFeeStructures(structures);
// 		} catch (error) {
// 			console.error('❌ Failed to fetch fee structures:', error);
// 			console.error('Error details:', error.response?.data);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const fetchFeeRecords = async () => {
// 		setLoading(true);
// 		try {
// 			console.log('🔍 Fetching fee records...');
// 			const res = await feeApi.getAllFeeRecords();
// 			console.log('✅ Fee records response:', res.data);

// 			// Handle different response structures
// 			const records = res.data?.feeRecords || res.data || [];
// 			console.log('📊 Processed records:', records);
// 			setFeeRecords(records);
// 		} catch (error) {
// 			console.error('❌ Failed to fetch fee records:', error);
// 			console.error('Error details:', error.response?.data);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const fetchStatistics = async () => {
// 		setLoading(true);
// 		try {
// 			console.log('🔍 Fetching statistics...');
// 			const res = await feeApi.getFeeStatistics();
// 			console.log('✅ Statistics response:', res.data);

// 			// Map backend response to frontend structure
// 			const stats = {
// 				totalCollected: res.data?.totalAmountPaid || 0,
// 				totalPending: res.data?.totalRemaining || 0,
// 				totalStudents: res.data?.totalStudents || 0,
// 				defaulters: (res.data?.defaulterCount || 0) + (res.data?.overdueCount || 0),
// 			};
// 			console.log('📊 Processed statistics:', stats);
// 			setStatistics(stats);
// 		} catch (error) {
// 			console.error('❌ Failed to fetch statistics:', error);
// 			console.error('Error details:', error.response?.data);
// 			setStatistics({
// 				totalCollected: 0,
// 				totalPending: 0,
// 				totalStudents: 0,
// 				defaulters: 0,
// 			});
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	useEffect(() => {
// 		console.log('🚀 FeeManagement component mounted, activeTab:', activeTab);

// 		if (activeTab === 'structures') {
// 			console.log('📋 Loading fee structures and classes...');
// 			fetchFeeStructures();
// 			fetchClasses();
// 		} else if (activeTab === 'records') {
// 			console.log('📋 Loading fee records...');
// 			fetchFeeRecords();
// 		} else if (activeTab === 'statistics') {
// 			console.log('📋 Loading statistics...');
// 			fetchStatistics();
// 		}
// 	}, [activeTab]);

// 	const handleCreateStructure = async () => {
// 		if (!structureFormData.class || !structureFormData.dueDate) {
// 			alert('Class and due date are required');
// 			return;
// 		}

// 		try {
// 			if (isEditMode && editingStructureId) {
// 				await feeApi.updateFeeStructure(editingStructureId, structureFormData);
// 			} else {
// 				await feeApi.createFeeStructure(structureFormData);
// 			}

// 			closeStructureModal();
// 			fetchFeeStructures();
// 		} catch (error: any) {
// 			alert(error.response?.data?.message || 'Operation failed');
// 		}
// 	};

// 	const handleEditStructure = (structure: FeeStructure) => {
// 		setIsEditMode(true);
// 		setEditingStructureId(structure._id);
// 		setStructureFormData({
// 			class: structure.class._id,
// 			academicYear: structure.academicYear,
// 			feeBreakdown: structure.feeBreakdown,
// 			dueDate: structure.dueDate.split('T')[0],
// 			installments: structure.installments,
// 		});
// 		setShowStructureModal(true);
// 	};

// 	const handleDeleteStructure = async (id: string) => {
// 		if (confirm('Are you sure you want to delete this fee structure?')) {
// 			try {
// 				await feeApi.deleteFeeStructure(id);
// 				fetchFeeStructures();
// 			} catch (error: any) {
// 				alert(error.response?.data?.message || 'Failed to delete');
// 			}
// 		}
// 	};

// 	const closeStructureModal = () => {
// 		setShowStructureModal(false);
// 		setIsEditMode(false);
// 		setEditingStructureId(null);
// 		setStructureFormData(emptyFeeStructure);
// 	};

// 	const handleRecordPayment = async () => {
// 		if (!selectedRecord || !paymentData.amount) {
// 			alert('Amount is required');
// 			return;
// 		}

// 		try {
// 			const formData = new FormData();
// 			formData.append('amount', paymentData.amount);
// 			formData.append('paymentMode', paymentData.paymentMode);
// 			formData.append('transactionReference', paymentData.transactionReference);
// 			formData.append('remarks', paymentData.remarks);

// 			await feeApi.recordPayment(selectedRecord.student._id, formData);

// 			setShowPaymentModal(false);
// 			setPaymentData({
// 				amount: '',
// 				paymentMode: 'CASH',
// 				transactionReference: '',
// 				remarks: '',
// 			});
// 			fetchFeeRecords();
// 		} catch (error: any) {
// 			alert(error.response?.data?.message || 'Payment recording failed');
// 		}
// 	};

// 	const getStatusColor = (status: string) => {
// 		switch (status) {
// 			case 'PAID':
// 				return 'text-green-600 bg-green-100';
// 			case 'PARTIALLY_PAID':
// 				return 'text-yellow-600 bg-yellow-100';
// 			case 'OVERDUE':
// 				return 'text-red-600 bg-red-100';
// 			case 'DEFAULTER':
// 				return 'text-red-800 bg-red-200';
// 			default:
// 				return 'text-gray-600 bg-gray-100';
// 		}
// 	};

// 	const structureColumns = [
// 		{
// 			key: 'class',
// 			header: 'Class',
// 			render: (_: any, row: FeeStructure) => `${row.class.name} - ${row.class.section}`,
// 		},
// 		{ key: 'academicYear', header: 'Academic Year' },
// 		{
// 			key: 'totalAmount',
// 			header: 'Total Amount',
// 			render: (_: any, row: FeeStructure) => `₹${row.totalAmount.toLocaleString()}`,
// 		},
// 		{
// 			key: 'dueDate',
// 			header: 'Due Date',
// 			render: (_: any, row: FeeStructure) => new Date(row.dueDate).toLocaleDateString(),
// 		},
// 		{
// 			key: 'actions',
// 			header: 'Actions',
// 			render: (_: any, row: FeeStructure) => (
// 				<div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
// 					<Button variant="secondary" size="sm" onClick={() => handleEditStructure(row)}>
// 						<Pencil size={14} />
// 					</Button>
// 					<Button variant="secondary" size="sm" onClick={() => handleDeleteStructure(row._id)}>
// 						<Trash2 size={14} />
// 					</Button>
// 				</div>
// 			),
// 		},
// 	];

// 	const recordColumns = [
// 		{
// 			key: 'student',
// 			header: 'Student',
// 			render: (_: any, row: FeeRecord) => (
// 				<div className="text-sm">
// 					<div className="font-medium">{row.student.name}</div>
// 					<div className="text-gray-500">{row.student.studentId}</div>
// 				</div>
// 			),
// 		},
// 		{
// 			key: 'totalAmount',
// 			header: 'Total Fee',
// 			render: (_: any, row: FeeRecord) => `₹${row.totalFeeAmount.toLocaleString()}`,
// 		},
// 		{
// 			key: 'paid',
// 			header: 'Paid',
// 			render: (_: any, row: FeeRecord) => `₹${row.totalAmountPaid.toLocaleString()}`,
// 		},
// 		{
// 			key: 'remaining',
// 			header: 'Remaining',
// 			render: (_: any, row: FeeRecord) => `₹${row.remainingAmount.toLocaleString()}`,
// 		},
// 		{
// 			key: 'status',
// 			header: 'Status',
// 			render: (_: any, row: FeeRecord) => (
// 				<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
// 					{row.status.replace('_', ' ')}
// 				</span>
// 			),
// 		},
// 		{
// 			key: 'actions',
// 			header: 'Actions',
// 			render: (_: any, row: FeeRecord) => (
// 				<div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
// 					<Button
// 						variant="secondary"
// 						size="sm"
// 						onClick={() => {
// 							setSelectedRecord(row);
// 							setShowRecordModal(true);
// 						}}
// 					>
// 						<Eye size={14} />
// 					</Button>
// 					<Button
// 						variant="secondary"
// 						size="sm"
// 						onClick={() => {
// 							setSelectedRecord(row);
// 							setShowPaymentModal(true);
// 						}}
// 					>
// 						<Receipt size={14} />
// 					</Button>
// 				</div>
// 			),
// 		},
// 	];

// 	return (
// 		<div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
// 			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
// 				<h1 className="text-2xl sm:text-3xl font-bold">Fee Management</h1>

// 				{activeTab === 'structures' && (
// 					<Button
// 						onClick={() => {
// 							setIsEditMode(false);
// 							setStructureFormData(emptyFeeStructure);
// 							setShowStructureModal(true);
// 						}}
// 						className="w-full sm:w-auto"
// 					>
// 						<Plus size={20} /> Create Fee Structure
// 					</Button>
// 				)}
// 			</div>

// 			{/* Tabs */}
// 			<div className="flex flex-col sm:flex-row gap-2 sm:gap-4 border-b">
// 				<button
// 					onClick={() => setActiveTab('structures')}
// 					className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
// 						activeTab === 'structures' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-blue-500'
// 					}`}
// 				>
// 					<DollarSign size={16} className="inline mr-2" />
// 					Fee Structures
// 				</button>
// 				<button
// 					onClick={() => setActiveTab('records')}
// 					className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
// 						activeTab === 'records' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-blue-500'
// 					}`}
// 				>
// 					<Users size={16} className="inline mr-2" />
// 					Fee Records
// 				</button>
// 				<button
// 					onClick={() => setActiveTab('statistics')}
// 					className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
// 						activeTab === 'statistics' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-blue-500'
// 					}`}
// 				>
// 					<TrendingUp size={16} className="inline mr-2" />
// 					Statistics
// 				</button>
// 			</div>

// 			{/* Tab Content */}
// 			{activeTab === 'structures' && (
// 				<Card>
// 					<div className="overflow-x-auto">
// 						<Table columns={structureColumns} data={feeStructures} loading={loading} />
// 					</div>
// 				</Card>
// 			)}

// 			{activeTab === 'records' && (
// 				<Card>
// 					<div className="overflow-x-auto">
// 						<Table columns={recordColumns} data={feeRecords} loading={loading} />
// 					</div>
// 				</Card>
// 			)}

// 			{activeTab === 'statistics' && (
// 				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
// 					<Card className="p-4 sm:p-6">
// 						<div className="flex items-center justify-between">
// 							<div>
// 								<p className="text-sm font-medium text-gray-600">Total Collected</p>
// 								<p className="text-2xl font-bold text-green-600">
// 									₹{statistics.totalCollected.toLocaleString()}
// 								</p>
// 							</div>
// 							<CheckCircle className="h-8 w-8 text-green-600" />
// 						</div>
// 					</Card>

// 					<Card className="p-4 sm:p-6">
// 						<div className="flex items-center justify-between">
// 							<div>
// 								<p className="text-sm font-medium text-gray-600">Total Pending</p>
// 								<p className="text-2xl font-bold text-yellow-600">
// 									₹{statistics.totalPending.toLocaleString()}
// 								</p>
// 							</div>
// 							<AlertCircle className="h-8 w-8 text-yellow-600" />
// 						</div>
// 					</Card>

// 					<Card className="p-4 sm:p-6">
// 						<div className="flex items-center justify-between">
// 							<div>
// 								<p className="text-sm font-medium text-gray-600">Total Students</p>
// 								<p className="text-2xl font-bold text-blue-600">{statistics.totalStudents}</p>
// 							</div>
// 							<Users className="h-8 w-8 text-blue-600" />
// 						</div>
// 					</Card>

// 					<Card className="p-4 sm:p-6">
// 						<div className="flex items-center justify-between">
// 							<div>
// 								<p className="text-sm font-medium text-gray-600">Defaulters</p>
// 								<p className="text-2xl font-bold text-red-600">{statistics.defaulters}</p>
// 							</div>
// 							<AlertCircle className="h-8 w-8 text-red-600" />
// 						</div>
// 					</Card>
// 				</div>
// 			)}

// 			{/* Fee Structure Modal */}
// 			<Modal
// 				isOpen={showStructureModal}
// 				onClose={closeStructureModal}
// 				title={isEditMode ? 'Edit Fee Structure' : 'Create Fee Structure'}
// 				size="lg"
// 			>
// 				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// 					<Select
// 						label="Class"
// 						value={structureFormData.class}
// 						onChange={(e) => setStructureFormData({ ...structureFormData, class: e.target.value })}
// 						options={classes.map((c) => ({ value: c._id, label: `${c.name} - ${c.section}` }))}
// 					/>

// 					<Input
// 						label="Academic Year"
// 						value={structureFormData.academicYear}
// 						onChange={(e) => setStructureFormData({ ...structureFormData, academicYear: e.target.value })}
// 						placeholder="2024-2025"
// 					/>

// 					<DatePicker
// 						label="Due Date"
// 						value={structureFormData.dueDate}
// 						onChange={(e) => setStructureFormData({ ...structureFormData, dueDate: e.target.value })}
// 					/>

// 					<div className="col-span-1 sm:col-span-2">
// 						<h3 className="font-semibold mb-4">Fee Breakdown</h3>
// 						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// 							<Input
// 								label="Tuition Fee"
// 								type="number"
// 								value={structureFormData.feeBreakdown.tuitionFee}
// 								onChange={(e) =>
// 									setStructureFormData({
// 										...structureFormData,
// 										feeBreakdown: {
// 											...structureFormData.feeBreakdown,
// 											tuitionFee: Number(e.target.value),
// 										},
// 									})
// 								}
// 							/>
// 							<Input
// 								label="Exam Fee"
// 								type="number"
// 								value={structureFormData.feeBreakdown.examFee}
// 								onChange={(e) =>
// 									setStructureFormData({
// 										...structureFormData,
// 										feeBreakdown: {
// 											...structureFormData.feeBreakdown,
// 											examFee: Number(e.target.value),
// 										},
// 									})
// 								}
// 							/>
// 							<Input
// 								label="Transport Fee"
// 								type="number"
// 								value={structureFormData.feeBreakdown.transportFee}
// 								onChange={(e) =>
// 									setStructureFormData({
// 										...structureFormData,
// 										feeBreakdown: {
// 											...structureFormData.feeBreakdown,
// 											transportFee: Number(e.target.value),
// 										},
// 									})
// 								}
// 							/>
// 							<Input
// 								label="Library Fee"
// 								type="number"
// 								value={structureFormData.feeBreakdown.libraryFee}
// 								onChange={(e) =>
// 									setStructureFormData({
// 										...structureFormData,
// 										feeBreakdown: {
// 											...structureFormData.feeBreakdown,
// 											libraryFee: Number(e.target.value),
// 										},
// 									})
// 								}
// 							/>
// 							<Input
// 								label="Lab Fee"
// 								type="number"
// 								value={structureFormData.feeBreakdown.labFee}
// 								onChange={(e) =>
// 									setStructureFormData({
// 										...structureFormData,
// 										feeBreakdown: {
// 											...structureFormData.feeBreakdown,
// 											labFee: Number(e.target.value),
// 										},
// 									})
// 								}
// 							/>
// 							<Input
// 								label="Sports Fee"
// 								type="number"
// 								value={structureFormData.feeBreakdown.sportsFee}
// 								onChange={(e) =>
// 									setStructureFormData({
// 										...structureFormData,
// 										feeBreakdown: {
// 											...structureFormData.feeBreakdown,
// 											sportsFee: Number(e.target.value),
// 										},
// 									})
// 								}
// 							/>
// 						</div>
// 					</div>
// 				</div>

// 				<div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
// 					<Button variant="secondary" onClick={closeStructureModal} className="w-full sm:w-auto">
// 						Cancel
// 					</Button>
// 					<Button onClick={handleCreateStructure} className="w-full sm:w-auto">
// 						{isEditMode ? 'Update Structure' : 'Create Structure'}
// 					</Button>
// 				</div>
// 			</Modal>

// 			{/* Fee Record Details Modal */}
// 			<Modal
// 				isOpen={showRecordModal}
// 				onClose={() => setShowRecordModal(false)}
// 				title="Fee Record Details"
// 				size="lg"
// 			>
// 				{selectedRecord && (
// 					<div className="space-y-4">
// 						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
// 							<div>
// 								<b>Student:</b> {selectedRecord.student.name}
// 							</div>
// 							<div>
// 								<b>Student ID:</b> {selectedRecord.student.studentId}
// 							</div>
// 							<div>
// 								<b>Total Fee:</b> ₹{selectedRecord.totalFeeAmount.toLocaleString()}
// 							</div>
// 							<div>
// 								<b>Amount Paid:</b> ₹{selectedRecord.totalAmountPaid.toLocaleString()}
// 							</div>
// 							<div>
// 								<b>Remaining:</b> ₹{selectedRecord.remainingAmount.toLocaleString()}
// 							</div>
// 							<div>
// 								<b>Status:</b>
// 								<span
// 									className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRecord.status)}`}
// 								>
// 									{selectedRecord.status.replace('_', ' ')}
// 								</span>
// 							</div>
// 						</div>

// 						{selectedRecord.payments.length > 0 && (
// 							<div>
// 								<h3 className="font-semibold mb-2">Payment History</h3>
// 								<div className="space-y-2 max-h-60 overflow-y-auto">
// 						         {selectedRecord.payments.map((payment, index) => (
//   <div key={index} className="border rounded p-3 text-sm">
//     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
//       <div>
//         <div><b>Amount:</b> ₹{payment.amount.toLocaleString()}</div>
//         <div><b>Mode:</b> {payment.paymentMode}</div>
//         <div>
//           <b>Date:</b> {new Date(payment.paymentDate).toLocaleDateString()}
//         </div>
//       </div>

//       <div className="flex items-center gap-2">
//         <span
//           className={`px-2 py-1 rounded-full text-xs font-medium ${
//             payment.paymentStatus === 'APPROVED'
//               ? 'text-green-600 bg-green-100'
//               : payment.paymentStatus === 'REJECTED'
//               ? 'text-red-600 bg-red-100'
//               : 'text-yellow-600 bg-yellow-100'
//           }`}
//         >
//           {payment.paymentStatus}
//         </span>

//         {payment.receiptUrl && (
//           <Button
//             size="sm"
//             variant="secondary"
//             onClick={() => {
//               setSelectedReceiptUrl(payment.receiptUrl);
//               setShowReceiptModal(true);
//             }}
//           >
//             <Eye size={14} /> Receipt
//           </Button>
//         )}
//       </div>
//     </div>
//   </div>
// ))}

// 								</div>
// 							</div>
// 						)}
// 					</div>
// 				)}
// 			</Modal>

//             <Modal
//   isOpen={showReceiptModal}
//   onClose={() => setShowReceiptModal(false)}
//   title="Payment Receipt"
//   size="lg"
// >
//   {selectedReceiptUrl && (
//     <div className="w-full h-[70vh]">
//       {selectedReceiptUrl.toLowerCase().endsWith('.pdf') ? (
//         <iframe
//           src={selectedReceiptUrl}
//           className="w-full h-full border rounded"
//           title="Receipt PDF"
//         />
//       ) : (
//         <img
//           src={selectedReceiptUrl}
//           alt="Receipt"
//           className="w-full h-full object-contain border rounded"
//         />
//       )}
//     </div>
//   )}
// </Modal>


// 			{/* Payment Recording Modal */}
// 			<Modal
// 				isOpen={showPaymentModal}
// 				onClose={() => setShowPaymentModal(false)}
// 				title="Record Payment"
// 				size="md"
// 			>
// 				<div className="space-y-4">
// 					<Input
// 						label="Amount"
// 						type="number"
// 						value={paymentData.amount}
// 						onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
// 						placeholder="Enter payment amount"
// 					/>

// 					<Select
// 						label="Payment Mode"
// 						value={paymentData.paymentMode}
// 						onChange={(e) => setPaymentData({ ...paymentData, paymentMode: e.target.value })}
// 						options={[
// 							{ value: 'CASH', label: 'Cash' },
// 							{ value: 'UPI', label: 'UPI' },
// 							{ value: 'CHEQUE', label: 'Cheque' },
// 							{ value: 'BANK_TRANSFER', label: 'Bank Transfer' },
// 							{ value: 'CARD', label: 'Card' },
// 							{ value: 'ONLINE', label: 'Online' },
// 						]}
// 					/>

// 					<Input
// 						label="Transaction Reference"
// 						value={paymentData.transactionReference}
// 						onChange={(e) => setPaymentData({ ...paymentData, transactionReference: e.target.value })}
// 						placeholder="Transaction ID or reference"
// 					/>

// 					<Input
// 						label="Remarks"
// 						value={paymentData.remarks}
// 						onChange={(e) => setPaymentData({ ...paymentData, remarks: e.target.value })}
// 						placeholder="Additional notes"
// 					/>
// 				</div>

// 				<div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
// 					<Button variant="secondary" onClick={() => setShowPaymentModal(false)} className="w-full sm:w-auto">
// 						Cancel
// 					</Button>
// 					<Button onClick={handleRecordPayment} className="w-full sm:w-auto">
// 						Record Payment
// 					</Button>
// 				</div>
// 			</Modal>

// 			{loading && <LoadingSpinner />}
// 		</div>
// 	);
// };
import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Modal } from '../common/Modal';
import { Table } from '../common/Table';
import { DatePicker } from '../common/DatePicker';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as feeApi from '@/api/fee.api';
import * as adminApi from '@/api/admin.api';
import { Plus, Eye, Pencil, Trash2, DollarSign, Users, AlertCircle, CheckCircle, Receipt, TrendingUp, FileText } from 'lucide-react';

interface FeeBreakdown {
  tuitionFee: number;
  examFee: number;
  transportFee: number;
  libraryFee: number;
  labFee: number;
  sportsFee: number;
  developmentFee: number;
  miscellaneousFee: number;
}

interface FeeStructure {
  _id: string;
  className?: string; // Add className for new format
  class: {
    _id: string;
    name: string;
    section: string;
  };
  academicYear: string;
  feeBreakdown: FeeBreakdown;
  totalAmount: number;
  dueDate: string;
  installments: Array<{
    installmentNumber: number;
    amount: number;
    dueDate: string;
    description: string;
  }>;
  isActive: boolean;
  createdAt: string;
  feeStructureDocument?: {
    fileUrl: string;
    fileName?: string;
  };
}

interface FeeRecord {
  _id: string;
  student: {
    _id: string;
    name: string;
    studentId: string;
    enrollmentNumber: string;
  };
  totalFeeAmount: number;
  totalAmountPaid: number;
  remainingAmount: number;
  status: string;
  dueDate: string;
  payments: Array<{
    paymentId: string;
    amount: number;
    paymentMode: string;
    paymentDate: string;
    paymentStatus: string;
  }>;
}

const emptyFeeStructure = {
  class: '',
  academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  feeBreakdown: {
    tuitionFee: 0,
    examFee: 0,
    transportFee: 0,
    libraryFee: 0,
    labFee: 0,
    sportsFee: 0,
    developmentFee: 0,
    miscellaneousFee: 0,
  },
  dueDate: '',
  installments: [] as Array<{
    installmentNumber: number;
    amount: number;
    dueDate: string;
    description: string;
  }>,
};

export const FeeManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'structures' | 'records' | 'statistics'>('structures');
  const [loading, setLoading] = useState(false);

  // Fee Structures
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [showStructureModal, setShowStructureModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingStructureId, setEditingStructureId] = useState<string | null>(null);
  const [structureFormData, setStructureFormData] = useState(emptyFeeStructure);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);

  // Fee Records
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMode: 'CASH',
    transactionReference: '',
    remarks: '',
  });

  // Statistics
  const [statistics, setStatistics] = useState({
    totalCollected: 0,
    totalPending: 0,
    totalStudents: 0,
    defaulters: 0,
  });

  useEffect(() => {
    console.log('🚀 FeeManagement component mounted, activeTab:', activeTab);
    
    if (activeTab === 'structures') {
      console.log('📋 Loading fee structures and classes...');
      fetchFeeStructures();
      fetchClasses();
    } else if (activeTab === 'records') {
      console.log('📋 Loading fee records...');
      fetchFeeRecords();
    } else if (activeTab === 'statistics') {
      console.log('📋 Loading statistics...');
      fetchStatistics();
    }
  }, [activeTab]);

  const fetchClasses = async () => {
    try {
      console.log('🔍 Fetching batches for fee structure...');
      const res = await adminApi.getAllBatches();
      console.log('✅ Batches response:', res.data);
      const batchesData = Array.isArray(res.data) ? res.data : [];
      console.log('📊 Processed batches:', batchesData);
      setClasses(batchesData);
    } catch (error: unknown) {
      console.error('❌ Failed to fetch batches:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error details:', (error as any)?.response?.data || errorMessage);
      setClasses([]);
    }
  };

  const fetchFeeStructures = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching fee structures...');
      const res = await feeApi.getAllFeeStructures();
      console.log('✅ Fee structures response:', res.data);
      
      // Handle different response structures
      const structures = res.data?.feeStructures || res.data || [];
      console.log('📊 Processed structures:', structures);
      setFeeStructures(structures);
    } catch (error: unknown) {
      console.error('❌ Failed to fetch fee structures:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error details:', (error as any)?.response?.data || errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeeRecords = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching fee records...');
      const res = await feeApi.getAllFeeRecords();
      console.log('✅ Fee records response:', res.data);
      
      // Handle different response structures
      const records = res.data?.feeRecords || res.data || [];
      console.log('📊 Processed records:', records);
      setFeeRecords(records);
    } catch (error: unknown) {
      console.error('❌ Failed to fetch fee records:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error details:', (error as any)?.response?.data || errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching statistics...');
      const res = await feeApi.getFeeStatistics();
      console.log('✅ Statistics response:', res.data);
      
      // Map backend response to frontend structure
      const stats = {
        totalCollected: res.data?.totalAmountPaid || 0,
        totalPending: res.data?.totalRemaining || 0,
        totalStudents: res.data?.totalStudents || 0,
        defaulters: (res.data?.defaulterCount || 0) + (res.data?.overdueCount || 0),
      };
      console.log('📊 Processed statistics:', stats);
      setStatistics(stats);
    } catch (error: unknown) {
      console.error('❌ Failed to fetch statistics:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error details:', (error as any)?.response?.data || errorMessage);
      setStatistics({
        totalCollected: 0,
        totalPending: 0,
        totalStudents: 0,
        defaulters: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 FeeManagement component mounted, activeTab:', activeTab);
    
    if (activeTab === 'structures') {
      console.log('📋 Loading fee structures and classes...');
      fetchFeeStructures();
      fetchClasses();
    } else if (activeTab === 'records') {
      console.log('📋 Loading fee records...');
      fetchFeeRecords();
    } else if (activeTab === 'statistics') {
      console.log('📋 Loading statistics...');
      fetchStatistics();
    }
  }, [activeTab]);

  const handleCreateStructure = async () => {
    if (!structureFormData.class || !structureFormData.dueDate) {
      alert('Class and due date are required');
      return;
    }

    try {
      // Ensure academic year is set
      const dataToSend = {
        ...structureFormData,
        academicYear: structureFormData.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
      };

      console.log('📤 Sending fee structure data:', dataToSend);

      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all form fields
      formData.append('class', dataToSend.class);
      formData.append('academicYear', dataToSend.academicYear);
      formData.append('feeBreakdown', JSON.stringify(dataToSend.feeBreakdown));
      formData.append('dueDate', dataToSend.dueDate);
      formData.append('installments', JSON.stringify(dataToSend.installments));
      
      // Add document if selected
      if (selectedDocument) {
        formData.append('feeStructureDocument', selectedDocument);
        console.log('📎 Adding fee structure document:', selectedDocument.name);
      }

      if (isEditMode && editingStructureId) {
        await feeApi.updateFeeStructure(editingStructureId, formData);
      } else {
        await feeApi.createFeeStructure(formData);
      }
      
      closeStructureModal();
      fetchFeeStructures();
    } catch (error: any) {
      console.error('Fee structure operation failed:', error);
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEditStructure = (structure: FeeStructure) => {
    setIsEditMode(true);
    setEditingStructureId(structure._id);
    
    // Handle both old format (class._id) and new format (className)
    const classValue = structure.class?._id || structure.className || structure.class?.name || '';
    
    setStructureFormData({
      class: classValue,
      academicYear: structure.academicYear,
      feeBreakdown: structure.feeBreakdown,
      dueDate: structure.dueDate.split('T')[0],
      installments: structure.installments,
    });
    setShowStructureModal(true);
  };

  const handleDeleteStructure = async (id: string) => {
    if (confirm('Are you sure you want to delete this fee structure?')) {
      try {
        await feeApi.deleteFeeStructure(id);
        fetchFeeStructures();
      } catch (error: any) {
        console.error('Delete fee structure failed:', error);
        alert(error.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const closeStructureModal = () => {
    setShowStructureModal(false);
    setIsEditMode(false);
    setEditingStructureId(null);
    setStructureFormData(emptyFeeStructure);
    setSelectedDocument(null);
  };

  const handleRecordPayment = async () => {
    if (!selectedRecord || !paymentData.amount) {
      alert('Amount is required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('amount', paymentData.amount);
      formData.append('paymentMode', paymentData.paymentMode);
      formData.append('transactionReference', paymentData.transactionReference);
      formData.append('remarks', paymentData.remarks);

      await feeApi.recordPayment(selectedRecord.student._id, formData);
      
      setShowPaymentModal(false);
      setPaymentData({
        amount: '',
        paymentMode: 'CASH',
        transactionReference: '',
        remarks: '',
      });
      fetchFeeRecords();
    } catch (error: any) {
      console.error('Payment recording failed:', error);
      alert(error.response?.data?.message || 'Payment recording failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'text-green-600 bg-green-100';
      case 'PARTIALLY_PAID': return 'text-yellow-600 bg-yellow-100';
      case 'OVERDUE': return 'text-red-600 bg-red-100';
      case 'DEFAULTER': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const structureColumns = [
    {
      key: 'class',
      header: 'Class',
      render: (_: any, row: FeeStructure) => {
        // Handle both old format (class.name) and new format (className)
        if (row.class && typeof row.class === 'object' && row.class.name) {
          return `Class ${row.class.name}`;
        }
        // Find the batch name from classes array
        const batch = classes.find(c => c._id === row.className || c._id === row.class);
        return batch ? batch.batchName : row.className || 'Unknown';
      },
    },
    { key: 'academicYear', header: 'Academic Year' },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      render: (_: any, row: FeeStructure) => `₹${row.totalAmount.toLocaleString()}`,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (_: any, row: FeeStructure) => new Date(row.dueDate).toLocaleDateString(),
    },
    {
      key: 'document',
      header: 'Document',
      render: (_: any, row: FeeStructure) => (
        <div className="flex items-center gap-2">
          {row.feeStructureDocument?.fileUrl ? (
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                📄 PDF
              </span>
              <Button
  variant="secondary"
  onClick={() => row.feeStructureDocument?.fileUrl && window.open(row.feeStructureDocument.fileUrl, '_blank')}
  className="text-xs px-2 py-1"
>
  <Eye size={12} /> View
</Button>
            </div>
          ) : (
            <span className="text-xs text-gray-500">No document</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: FeeStructure) => (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
          <Button variant="secondary" onClick={() => handleEditStructure(row)}>
            <Pencil size={14} />
          </Button>
          <Button variant="secondary" onClick={() => handleDeleteStructure(row._id)}>
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  const recordColumns = [
    {
      key: 'student',
      header: 'Student',
      render: (_: any, row: FeeRecord) => {
        const pendingPayments = row.payments?.filter((p: any) => p.paymentStatus === 'PENDING') || [];
        const hasReceipts = pendingPayments.some((p: any) => p.receiptUrl);
        
        return (
          <div className="text-sm">
            <div className="font-medium flex items-center gap-2">
              {row.student.name}
              {pendingPayments.length > 0 && (
                <div className="flex gap-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    🔔 {pendingPayments.length} Pending
                  </span>
                  {hasReceipts && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      📄 Receipt
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="text-gray-500">{row.student.studentId}</div>
          </div>
        );
      },
    },
    {
      key: 'totalAmount',
      header: 'Total Fee',
      render: (_: any, row: FeeRecord) => `₹${row.totalFeeAmount.toLocaleString()}`,
    },
    {
      key: 'paid',
      header: 'Paid',
      render: (_: any, row: FeeRecord) => `₹${row.totalAmountPaid.toLocaleString()}`,
    },
    {
      key: 'remaining',
      header: 'Remaining',
      render: (_: any, row: FeeRecord) => `₹${row.remainingAmount.toLocaleString()}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (_: any, row: FeeRecord) => {
        const pendingPayments = row.payments?.filter((p: any) => p.paymentStatus === 'PENDING') || [];
        const pendingAmount = pendingPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
        
        return (
          <div className="flex flex-col gap-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
              {row.status.replace('_', ' ')}
            </span>
            {pendingPayments.length > 0 && (
              <div className="text-xs">
                <span className="text-orange-600 font-medium">
                  ₹{pendingAmount.toLocaleString()} Pending Review
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: FeeRecord) => {
        const pendingPayments = row.payments?.filter((p: any) => p.paymentStatus === 'PENDING') || [];
        const hasReceipts = pendingPayments.some((p: any) => p.receiptUrl);
        
        return (
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedRecord(row);
                setShowRecordModal(true);
              }}
              className={hasReceipts ? 'bg-orange-500 hover:bg-orange-600 text-white font-medium' : ''}
            >
              <Eye size={14} />
              {hasReceipts ? ' 📄 Review Receipts' : ' View Details'}
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedRecord(row);
                setShowPaymentModal(true);
              }}
            >
              <Receipt size={14} />
            </Button>
            
            {pendingPayments.length > 0 && (
              <div className="flex gap-1">
                <Button
                  variant="secondary"
                  onClick={async () => {
                    if (confirm(`Approve all ${pendingPayments.length} pending payments for ${row.student.name}?`)) {
                      try {
                        for (const payment of pendingPayments) {
                          await feeApi.updatePaymentStatus(row._id, payment.paymentId, { 
                            status: 'APPROVED' 
                          });
                        }
                        alert('All payments approved successfully!');
                        fetchFeeRecords();
                      } catch (error: any) {
                        alert(error.response?.data?.message || 'Failed to approve payments');
                      }
                    }
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1"
                >
                  ✓ Approve All
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={async () => {
                    const reason = prompt('Enter rejection reason for all pending payments:');
                    if (reason) {
                      try {
                        for (const payment of pendingPayments) {
                          await feeApi.updatePaymentStatus(row._id, payment.paymentId, { 
                            status: 'REJECTED',
                            rejectionReason: reason
                          });
                        }
                        alert('All payments rejected successfully!');
                        fetchFeeRecords();
                      } catch (error: any) {
                        alert(error.response?.data?.message || 'Failed to reject payments');
                      }
                    }
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1"
                >
                  ✗ Reject All
                </Button>
              </div>
            )}
            
            <Button
              variant="secondary"
              onClick={async () => {
                const newStatus = prompt(
                  `Current status: ${row.status}\nEnter new status (UNPAID, PARTIALLY_PAID, PAID, DEFAULTER, OVERDUE):`,
                  row.status
                );
                
                if (newStatus && ['UNPAID', 'PARTIALLY_PAID', 'PAID', 'DEFAULTER', 'OVERDUE'].includes(newStatus)) {
                  const remarks = prompt('Enter remarks (optional):') || '';
                  
                  try {
                    await feeApi.updateFeeRecordStatus(row._id, { status: newStatus, remarks });
                    alert(`Status updated to ${newStatus}`);
                    fetchFeeRecords();
                  } catch (error: any) {
                    console.error('Failed to update status:', error);
                    alert(error.response?.data?.message || 'Failed to update status');
                  }
                }
              }}
              className="text-xs px-2 py-1"
            >
              Update Status
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Fee Management</h1>
        
        {activeTab === 'structures' && (
          <Button
            onClick={() => {
              setIsEditMode(false);
              setStructureFormData(emptyFeeStructure);
              setShowStructureModal(true);
            }}
            className="w-full sm:w-auto"
          >
            <Plus size={20} /> Create Fee Structure
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 border-b">
        <button
          onClick={() => setActiveTab('structures')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
            activeTab === 'structures'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          <DollarSign size={16} className="inline mr-2" />
          Fee Structures
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
            activeTab === 'records'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          <Users size={16} className="inline mr-2" />
          Fee Records
        </button>
        <button
          onClick={() => setActiveTab('statistics')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
            activeTab === 'statistics'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          <TrendingUp size={16} className="inline mr-2" />
          Statistics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'structures' && (
        <Card>
          <div className="overflow-x-auto">
            <Table columns={structureColumns} data={feeStructures} loading={loading} mobileCardView={true}/>
          </div>
        </Card>
      )}

      {activeTab === 'records' && (
        <Card>
          <div className="overflow-x-auto">
            <Table columns={recordColumns} data={feeRecords} loading={loading} mobileCardView={true}/>
          </div>
        </Card>
      )}

      {activeTab === 'statistics' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Collected</p>
                <p className="text-2xl font-bold text-green-600">₹{statistics.totalCollected.toLocaleString()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </Card>
          
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pending</p>
                <p className="text-2xl font-bold text-yellow-600">₹{statistics.totalPending.toLocaleString()}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </Card>
          
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-blue-600">{statistics.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
          
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Defaulters</p>
                <p className="text-2xl font-bold text-red-600">{statistics.defaulters}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </Card>
        </div>
      )}

      {/* Fee Structure Modal */}
      <Modal
        isOpen={showStructureModal}
        onClose={closeStructureModal}
        title={isEditMode ? 'Edit Fee Structure' : 'Create Fee Structure'}
        size="lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Debug info */}
          {classes.length === 0 && (
            <div className="col-span-2 bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
              <p className="text-yellow-800">⚠️ No batches available. Please create batches first.</p>
            </div>
          )}
          
          <Select
            label="Batch"
            value={structureFormData.class}
            onChange={(e) => {
              console.log('Batch selected:', e.target.value);
              setStructureFormData({ ...structureFormData, class: e.target.value });
            }}
            options={classes.map((c) => {
              console.log('Mapping batch:', c);
              return { value: c._id, label: c.batchName || 'Unnamed Batch' };
            })}
          />
          
          <Input
            label="Academic Year"
            value={structureFormData.academicYear}
            onChange={(e) => setStructureFormData({ ...structureFormData, academicYear: e.target.value })}
            placeholder="2024-2025"
          />

          <DatePicker
            label="Due Date"
            value={structureFormData.dueDate}
            onChange={(e) => setStructureFormData({ ...structureFormData, dueDate: e.target.value })}
          />

          <div className="col-span-1 sm:col-span-2">
            <h3 className="font-semibold mb-4">Fee Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Tuition Fee"
                type="number"
                value={structureFormData.feeBreakdown.tuitionFee}
                onChange={(e) => setStructureFormData({
                  ...structureFormData,
                  feeBreakdown: { ...structureFormData.feeBreakdown, tuitionFee: Number(e.target.value) }
                })}
              />
              <Input
                label="Exam Fee"
                type="number"
                value={structureFormData.feeBreakdown.examFee}
                onChange={(e) => setStructureFormData({
                  ...structureFormData,
                  feeBreakdown: { ...structureFormData.feeBreakdown, examFee: Number(e.target.value) }
                })}
              />
              <Input
                label="Transport Fee"
                type="number"
                value={structureFormData.feeBreakdown.transportFee}
                onChange={(e) => setStructureFormData({
                  ...structureFormData,
                  feeBreakdown: { ...structureFormData.feeBreakdown, transportFee: Number(e.target.value) }
                })}
              />
              <Input
                label="Library Fee"
                type="number"
                value={structureFormData.feeBreakdown.libraryFee}
                onChange={(e) => setStructureFormData({
                  ...structureFormData,
                  feeBreakdown: { ...structureFormData.feeBreakdown, libraryFee: Number(e.target.value) }
                })}
              />
              <Input
                label="Lab Fee"
                type="number"
                value={structureFormData.feeBreakdown.labFee}
                onChange={(e) => setStructureFormData({
                  ...structureFormData,
                  feeBreakdown: { ...structureFormData.feeBreakdown, labFee: Number(e.target.value) }
                })}
              />
              <Input
                label="Sports Fee"
                type="number"
                value={structureFormData.feeBreakdown.sportsFee}
                onChange={(e) => setStructureFormData({
                  ...structureFormData,
                  feeBreakdown: { ...structureFormData.feeBreakdown, sportsFee: Number(e.target.value) }
                })}
              />
            </div>
          </div>

          {/* Fee Structure Document Upload */}
          <div className="col-span-1 sm:col-span-2">
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <FileText className="mr-2" size={20} />
                Fee Structure Document (Optional)
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    📄 Upload Fee Structure PDF
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setSelectedDocument(e.target.files?.[0] || null)}
                    className="w-full text-sm border border-blue-300 rounded-md p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-blue-600 mt-2">
                    📋 Upload a PDF document that will be visible to all students in this class. 
                    This allows you to share detailed fee structure information, payment instructions, or official documents.
                  </p>
                </div>
                {selectedDocument && (
                  <div className="bg-green-100 p-3 rounded-md">
                    <div className="flex items-center text-sm text-green-800">
                      <CheckCircle className="mr-2" size={16} />
                      <span className="font-medium">Selected: {selectedDocument.name}</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      File size: {(selectedDocument.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
                <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                  <strong>💡 Tip:</strong> You can create fee structures with manual entry (above) and optionally attach a PDF document. 
                  Students will see both the breakdown and the document in their fee details.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={closeStructureModal} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleCreateStructure} className="w-full sm:w-auto">
            {isEditMode ? 'Update Structure' : 'Create Structure'}
          </Button>
        </div>
      </Modal>

      {/* Fee Record Details Modal */}
      <Modal
        isOpen={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        title={`Fee Record Details - ${selectedRecord?.student.name}`}
        size="xl"
      >
        {selectedRecord && (
          <div className="space-y-6">
            {/* Student Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
              <div><b>Student:</b> {selectedRecord.student.name}</div>
              <div><b>Student ID:</b> {selectedRecord.student.studentId}</div>
              <div><b>Total Fee:</b> ₹{selectedRecord.totalFeeAmount.toLocaleString()}</div>
              <div><b>Amount Paid:</b> ₹{selectedRecord.totalAmountPaid.toLocaleString()}</div>
              <div><b>Remaining:</b> ₹{selectedRecord.remainingAmount.toLocaleString()}</div>
              <div>
                <b>Status:</b> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRecord.status)}`}>
                  {selectedRecord.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {selectedRecord.payments.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                  Payment History & Receipts
                  {selectedRecord.payments.some((p: any) => p.paymentStatus === 'PENDING') && (
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedRecord.payments.filter((p: any) => p.paymentStatus === 'PENDING').length} Pending Review
                    </span>
                  )}
                </h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedRecord.payments
                    .sort((a: any, b: any) => {
                      // Sort pending payments first
                      if (a.paymentStatus === 'PENDING' && b.paymentStatus !== 'PENDING') return -1;
                      if (b.paymentStatus === 'PENDING' && a.paymentStatus !== 'PENDING') return 1;
                      return new Date(b.createdAt || b.paymentDate).getTime() - new Date(a.createdAt || a.paymentDate).getTime();
                    })
                    .map((payment: any, index: number) => (
                    <div key={index} className={`border-2 rounded-lg p-4 ${
                      payment.paymentStatus === 'PENDING' ? 'border-orange-300 bg-orange-50' : 
                      payment.paymentStatus === 'APPROVED' ? 'border-green-300 bg-green-50' :
                      'border-red-300 bg-red-50'
                    }`}>
                      
                      {/* Payment Header */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-lg font-bold">₹{payment.amount.toLocaleString()}</div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              payment.paymentStatus === 'APPROVED' ? 'text-green-700 bg-green-200' :
                              payment.paymentStatus === 'REJECTED' ? 'text-red-700 bg-red-200' :
                              'text-orange-700 bg-orange-200'
                            }`}>
                              {payment.paymentStatus}
                              {payment.paymentStatus === 'PENDING' && ' - NEEDS REVIEW'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div><b>Mode:</b> {payment.paymentMode}</div>
                            <div><b>Date:</b> {new Date(payment.paymentDate).toLocaleDateString()}</div>
                            <div><b>Reference:</b> {payment.transactionReference}</div>
                            <div><b>Payment ID:</b> {payment.paymentId}</div>
                          </div>
                          
                          {payment.remarks && (
                            <div className="mt-2 text-sm"><b>Remarks:</b> {payment.remarks}</div>
                          )}
                          {payment.rejectionReason && (
                            <div className="mt-2 text-sm text-red-600"><b>Rejection Reason:</b> {payment.rejectionReason}</div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        {payment.paymentStatus === 'PENDING' && (
                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              onClick={async () => {
                                if (confirm(`Approve payment of ₹${payment.amount.toLocaleString()} from ${selectedRecord.student.name}?`)) {
                                  try {
                                    await feeApi.updatePaymentStatus(selectedRecord._id, payment.paymentId, { 
                                      status: 'APPROVED' 
                                    });
                                    alert('Payment approved successfully! Status will be updated.');
                                    fetchFeeRecords();
                                    setShowRecordModal(false);
                                  } catch (error: any) {
                                    alert(error.response?.data?.message || 'Failed to approve payment');
                                  }
                                }
                              }}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2"
                            >
                              ✓ Approve Payment
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={async () => {
                                const reason = prompt('Enter rejection reason:');
                                if (reason) {
                                  try {
                                    await feeApi.updatePaymentStatus(selectedRecord._id, payment.paymentId, { 
                                      status: 'REJECTED',
                                      rejectionReason: reason
                                    });
                                    alert('Payment rejected successfully!');
                                    fetchFeeRecords();
                                    setShowRecordModal(false);
                                  } catch (error: any) {
                                    alert(error.response?.data?.message || 'Failed to reject payment');
                                  }
                                }
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2"
                            >
                              ✗ Reject Payment
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Receipt Display */}
                      {payment.receiptUrl && (
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium text-sm">Payment Receipt:</h4>
                            <Button
                              variant="secondary"
                              onClick={() => window.open(payment.receiptUrl, '_blank')}
                              className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              <Eye size={12} /> Open in New Tab
                            </Button>
                          </div>
                          
                          <div className="w-full h-64 sm:h-80 border rounded-lg overflow-hidden bg-gray-100">
                            {payment.receiptUrl.toLowerCase().includes('.pdf') ? (
                              <iframe
                                src={payment.receiptUrl}
                                className="w-full h-full"
                                title={`Payment Receipt - ${payment.paymentId}`}
                                style={{ border: 'none' }}
                              />
                            ) : (
                              <img
                                src={payment.receiptUrl}
                                alt={`Payment Receipt - ${payment.paymentId}`}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  console.error('Failed to load receipt image:', payment.receiptUrl);
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  const parent = (e.target as HTMLImageElement).parentElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="flex items-center justify-center h-full text-gray-500">
                                        <div class="text-center">
                                          <p>Failed to load receipt</p>
                                          <button onclick="window.open('${payment.receiptUrl}', '_blank')" 
                                                  class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm">
                                            Open Direct Link
                                          </button>
                                        </div>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                            )}
                          </div>
                        </div>
                      )}
                      
                      {!payment.receiptUrl && payment.paymentStatus === 'PENDING' && (
                        <div className="border-t pt-4">
                          <div className="text-center text-gray-500 py-4">
                            <p>No receipt uploaded for this payment</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedRecord.payments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No payments submitted yet</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Payment Recording Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Record Payment"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Amount"
            type="number"
            value={paymentData.amount}
            onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
            placeholder="Enter payment amount"
          />
          
          <Select
            label="Payment Mode"
            value={paymentData.paymentMode}
            onChange={(e) => setPaymentData({ ...paymentData, paymentMode: e.target.value })}
            options={[
              { value: 'CASH', label: 'Cash' },
              { value: 'UPI', label: 'UPI' },
              { value: 'CHEQUE', label: 'Cheque' },
              { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
              { value: 'CARD', label: 'Card' },
              { value: 'ONLINE', label: 'Online' },
            ]}
          />
          
          <Input
            label="Transaction Reference"
            value={paymentData.transactionReference}
            onChange={(e) => setPaymentData({ ...paymentData, transactionReference: e.target.value })}
            placeholder="Transaction ID or reference"
          />
          
          <Input
            label="Remarks"
            value={paymentData.remarks}
            onChange={(e) => setPaymentData({ ...paymentData, remarks: e.target.value })}
            placeholder="Additional notes"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <Button 
            variant="secondary" 
            onClick={() => setShowPaymentModal(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button onClick={handleRecordPayment} className="w-full sm:w-auto">
            Record Payment
          </Button>
        </div>
      </Modal>

      {loading && <LoadingSpinner />}
    </div>
  );
};