// import React, { useState, useEffect } from 'react';
// import { Card } from '../common/Card';
// import { Button } from '../common/Button';
// import { Input } from '../common/Input';
// import { Select } from '../common/Select';
// import { Modal } from '../common/Modal';
// import { LoadingSpinner } from '../common/LoadingSpinner';
// import * as feeApi from '@/api/fee.api';
// import { 
//   DollarSign, 
//   Receipt, 
//   Calendar, 
//   AlertCircle, 
//   CheckCircle, 
//   Clock, 
//   CreditCard,
//   FileText,
//   Upload,
//   Eye,
//   Download
// } from 'lucide-react';

// interface FeeDetails {
//   _id: string;
//   feeStructure: {
//     _id: string;
//     class: {
//       name: string;
//       section: string;
//     };
//     academicYear: string;
//     feeBreakdown: {
//       tuitionFee: number;
//       examFee: number;
//       transportFee: number;
//       libraryFee: number;
//       labFee: number;
//       sportsFee: number;
//       developmentFee: number;
//       miscellaneousFee: number;
//     };
//     totalAmount: number;
//     dueDate: string;
//     installments: Array<{
//       installmentNumber: number;
//       amount: number;
//       dueDate: string;
//       description: string;
//     }>;
//   };
//   totalFeeAmount: number;
//   totalAmountPaid: number;
//   remainingAmount: number;
//   status: string;
//   dueDate: string;
//   payments: Array<{
//     paymentId: string;
//     amount: number;
//     paymentMode: string;
//     paymentDate: string;
//     transactionReference: string;
//     receiptUrl: string;
//     paymentStatus: string;
//     remarks: string;
//     createdAt: string;
//   }>;
//   lateFee: number;
//   discount: number;
//   discountReason: string;
// }

// interface PaymentHistory {
//   paymentId: string;
//   amount: number;
//   paymentMode: string;
//   paymentDate: string;
//   transactionReference: string;
//   receiptUrl: string;
//   paymentStatus: string;
//   remarks: string;
// }

// export const MyFees: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const [feeDetails, setFeeDetails] = useState<FeeDetails | null>(null);
//   const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showReceiptModal, setShowReceiptModal] = useState(false);
//   const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  
//   const [paymentData, setPaymentData] = useState({
//     amount: '',
//     paymentMode: 'UPI',
//     transactionReference: '',
//     remarks: '',
//     receipt: null as File | null,
//   });

//   useEffect(() => {
//     fetchFeeDetails();
//     fetchPaymentHistory();
//   }, []);

//   const fetchFeeDetails = async () => {
//     setLoading(true);
//     try {
//       const res = await feeApi.getMyFeeDetails();
//       setFeeDetails(res.data);
//     } catch (error) {
//       console.error('Failed to fetch fee details:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPaymentHistory = async () => {
//     try {
//       const res = await feeApi.getMyPaymentHistory();
//       setPaymentHistory(res.data || []);
//     } catch (error) {
//       console.error('Failed to fetch payment history:', error);
//     }
//   };

//   const handleSubmitPayment = async () => {
//     if (!paymentData.amount || !paymentData.transactionReference) {
//       alert('Amount and transaction reference are required');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('amount', paymentData.amount);
//       formData.append('paymentMode', paymentData.paymentMode);
//       formData.append('transactionReference', paymentData.transactionReference);
//       formData.append('remarks', paymentData.remarks);
      
//       if (paymentData.receipt) {
//         formData.append('receipt', paymentData.receipt);
//       }

//       await feeApi.submitPayment(formData);
      
//       alert('Payment submitted successfully! It will be reviewed by the admin.');
//       setShowPaymentModal(false);
//       setPaymentData({
//         amount: '',
//         paymentMode: 'UPI',
//         transactionReference: '',
//         remarks: '',
//         receipt: null,
//       });
      
//       fetchFeeDetails();
//       fetchPaymentHistory();
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Payment submission failed');
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'PAID': return 'text-green-600 bg-green-100';
//       case 'PARTIALLY_PAID': return 'text-yellow-600 bg-yellow-100';
//       case 'OVERDUE': return 'text-red-600 bg-red-100';
//       case 'DEFAULTER': return 'text-red-800 bg-red-200';
//       default: return 'text-gray-600 bg-gray-100';
//     }
//   };

//   const getPaymentStatusColor = (status: string) => {
//     switch (status) {
//       case 'APPROVED': return 'text-green-600 bg-green-100';
//       case 'REJECTED': return 'text-red-600 bg-red-100';
//       default: return 'text-yellow-600 bg-yellow-100';
//     }
//   };

//   const formatCurrency = (amount: number) => {
//     return `₹${amount.toLocaleString()}`;
//   };

//   if (loading) return <LoadingSpinner />;

//   if (!feeDetails) {
//     return (
//       <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
//         <h1 className="text-2xl sm:text-3xl font-bold">My Fees</h1>
//         <Card className="p-6 text-center">
//           <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No Fee Structure Assigned</h3>
//           <p className="text-gray-500">
//             No fee structure has been assigned to you yet. Please contact the administration.
//           </p>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//         <h1 className="text-2xl sm:text-3xl font-bold">My Fees</h1>
        
//         {feeDetails.remainingAmount > 0 && (
//           <Button
//             onClick={() => setShowPaymentModal(true)}
//             className="w-full sm:w-auto"
//           >
//             <CreditCard size={20} /> Make Payment
//           </Button>
//         )}
//       </div>

//       {/* Fee Overview */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//         <Card className="p-4 sm:p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Fee</p>
//               <p className="text-2xl font-bold text-blue-600">
//                 {formatCurrency(feeDetails.totalFeeAmount)}
//               </p>
//             </div>
//             <DollarSign className="h-8 w-8 text-blue-600" />
//           </div>
//         </Card>
        
//         <Card className="p-4 sm:p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Amount Paid</p>
//               <p className="text-2xl font-bold text-green-600">
//                 {formatCurrency(feeDetails.totalAmountPaid)}
//               </p>
//             </div>
//             <CheckCircle className="h-8 w-8 text-green-600" />
//           </div>
//         </Card>
        
//         <Card className="p-4 sm:p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Remaining</p>
//               <p className="text-2xl font-bold text-red-600">
//                 {formatCurrency(feeDetails.remainingAmount)}
//               </p>
//             </div>
//             <AlertCircle className="h-8 w-8 text-red-600" />
//           </div>
//         </Card>
        
//         <Card className="p-4 sm:p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Status</p>
//               <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feeDetails.status)}`}>
//                 {feeDetails.status.replace('_', ' ')}
//               </span>
//             </div>
//             <Clock className="h-8 w-8 text-gray-600" />
//           </div>
//         </Card>
//       </div>

//       {/* Fee Structure Details */}
//       <Card>
//         <div className="p-4 sm:p-6">
//           <h2 className="text-lg font-semibold mb-4 flex items-center">
//             <FileText className="mr-2" size={20} />
//             Fee Structure Details
//           </h2>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//             <div>
//               <p className="text-sm text-gray-600">Class</p>
//               <p className="font-medium">
//                 {feeDetails.feeStructure.class.name} - {feeDetails.feeStructure.class.section}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Academic Year</p>
//               <p className="font-medium">{feeDetails.feeStructure.academicYear}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Due Date</p>
//               <p className="font-medium flex items-center">
//                 <Calendar className="mr-1" size={16} />
//                 {new Date(feeDetails.dueDate).toLocaleDateString()}
//               </p>
//             </div>
//             {feeDetails.discount > 0 && (
//               <div>
//                 <p className="text-sm text-gray-600">Discount Applied</p>
//                 <p className="font-medium text-green-600">
//                   -{formatCurrency(feeDetails.discount)}
//                   {feeDetails.discountReason && (
//                     <span className="text-xs text-gray-500 block">
//                       ({feeDetails.discountReason})
//                     </span>
//                   )}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Fee Breakdown */}
//           <div className="border-t pt-4">
//             <h3 className="font-medium mb-3">Fee Breakdown</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
//               {Object.entries(feeDetails.feeStructure.feeBreakdown).map(([key, value]) => {
//                 if (value === 0) return null;
//                 return (
//                   <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
//                     <span className="capitalize">
//                       {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                     </span>
//                     <span className="font-medium">{formatCurrency(value)}</span>
//                   </div>
//                 );
//               })}
//               {feeDetails.lateFee > 0 && (
//                 <div className="flex justify-between p-2 bg-red-50 rounded">
//                   <span>Late Fee</span>
//                   <span className="font-medium text-red-600">
//                     +{formatCurrency(feeDetails.lateFee)}
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Installments */}
//           {feeDetails.feeStructure.installments.length > 0 && (
//             <div className="border-t pt-4 mt-4">
//               <h3 className="font-medium mb-3">Installment Plan</h3>
//               <div className="space-y-2">
//                 {feeDetails.feeStructure.installments.map((installment, index) => (
//                   <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 border rounded">
//                     <div>
//                       <span className="font-medium">
//                         Installment {installment.installmentNumber}
//                       </span>
//                       {installment.description && (
//                         <span className="text-sm text-gray-500 block sm:inline sm:ml-2">
//                           - {installment.description}
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                       <span className="font-medium">{formatCurrency(installment.amount)}</span>
//                       <span className="text-sm text-gray-500">
//                         Due: {new Date(installment.dueDate).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* Payment History */}
//       <Card>
//         <div className="p-4 sm:p-6">
//           <h2 className="text-lg font-semibold mb-4 flex items-center">
//             <Receipt className="mr-2" size={20} />
//             Payment History
//           </h2>
          
//           {paymentHistory.length === 0 ? (
//             <div className="text-center py-8">
//               <Receipt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//               <p className="text-gray-500">No payments made yet</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {paymentHistory.map((payment, index) => (
//                 <div key={index} className="border rounded-lg p-4">
//                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
//                     <div className="flex-1">
//                       <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
//                         <span className="font-medium text-lg">
//                           {formatCurrency(payment.amount)}
//                         </span>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.paymentStatus)}`}>
//                           {payment.paymentStatus}
//                         </span>
//                       </div>
                      
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
//                         <div>
//                           <span className="font-medium">Payment ID:</span> {payment.paymentId}
//                         </div>
//                         <div>
//                           <span className="font-medium">Mode:</span> {payment.paymentMode}
//                         </div>
//                         <div>
//                           <span className="font-medium">Date:</span> {new Date(payment.paymentDate).toLocaleDateString()}
//                         </div>
//                         <div>
//                           <span className="font-medium">Reference:</span> {payment.transactionReference}
//                         </div>
//                       </div>
                      
//                       {payment.remarks && (
//                         <div className="mt-2 text-sm">
//                           <span className="font-medium text-gray-600">Remarks:</span> {payment.remarks}
//                         </div>
//                       )}
//                     </div>
                    
//                     {payment.receiptUrl && (
//                       <Button
//                         variant="secondary"
//                         size="sm"
//                         onClick={() => {
//                           setSelectedReceipt(payment.receiptUrl);
//                           setShowReceiptModal(true);
//                         }}
//                         className="w-full sm:w-auto"
//                       >
//                         <Eye size={16} /> View Receipt
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* Payment Submission Modal */}
//       <Modal
//         isOpen={showPaymentModal}
//         onClose={() => setShowPaymentModal(false)}
//         title="Submit Payment"
//         size="md"
//       >
//         <div className="space-y-4">
//           <div className="bg-blue-50 p-4 rounded-lg">
//             <p className="text-sm text-blue-800">
//               <strong>Remaining Amount:</strong> {formatCurrency(feeDetails.remainingAmount)}
//             </p>
//           </div>
          
//           <Input
//             label="Payment Amount"
//             type="number"
//             value={paymentData.amount}
//             onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
//             placeholder="Enter amount paid"
//             max={feeDetails.remainingAmount}
//           />
          
//           <Select
//             label="Payment Mode"
//             value={paymentData.paymentMode}
//             onChange={(e) => setPaymentData({ ...paymentData, paymentMode: e.target.value })}
//             options={[
//               { value: 'UPI', label: 'UPI' },
//               { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
//               { value: 'CHEQUE', label: 'Cheque' },
//               { value: 'CASH', label: 'Cash' },
//               { value: 'CARD', label: 'Card' },
//               { value: 'ONLINE', label: 'Online Payment' },
//             ]}
//           />
          
//           <Input
//             label="Transaction Reference"
//             value={paymentData.transactionReference}
//             onChange={(e) => setPaymentData({ ...paymentData, transactionReference: e.target.value })}
//             placeholder="Transaction ID, UTR, or Cheque Number"
//           />
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Payment Receipt (Optional)
//             </label>
//             <input
//               type="file"
//               accept="image/*,application/pdf"
//               onChange={(e) => setPaymentData({ 
//                 ...paymentData, 
//                 receipt: e.target.files?.[0] || null 
//               })}
//               className="w-full text-sm border border-gray-300 rounded-md p-2"
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Upload screenshot or receipt (JPG, PNG, PDF)
//             </p>
//           </div>
          
//           <Input
//             label="Remarks (Optional)"
//             value={paymentData.remarks}
//             onChange={(e) => setPaymentData({ ...paymentData, remarks: e.target.value })}
//             placeholder="Additional notes"
//           />
          
//           <div className="bg-yellow-50 p-4 rounded-lg">
//             <p className="text-sm text-yellow-800">
//               <AlertCircle className="inline mr-1" size={16} />
//               Your payment will be reviewed by the admin before being approved.
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
//           <Button 
//             variant="secondary" 
//             onClick={() => setShowPaymentModal(false)}
//             className="w-full sm:w-auto"
//           >
//             Cancel
//           </Button>
//           <Button onClick={handleSubmitPayment} className="w-full sm:w-auto">
//             <Upload size={16} /> Submit Payment
//           </Button>
//         </div>
//       </Modal>

//       {/* Receipt Preview Modal */}
//       <Modal
//         isOpen={showReceiptModal}
//         onClose={() => setShowReceiptModal(false)}
//         title="Payment Receipt"
//         size="lg"
//       >
//         {selectedReceipt && (
//           <div className="space-y-4">
//             <div className="flex justify-end">
//               <Button
//                 variant="secondary"
//                 onClick={() => window.open(selectedReceipt, '_blank')}
//               >
//                 <Download size={16} /> Download
//               </Button>
//             </div>
//             <div className="w-full h-[60vh] sm:h-[70vh]">
//               {selectedReceipt.toLowerCase().includes('.pdf') ? (
//                 <iframe
//                   src={selectedReceipt}
//                   className="w-full h-full border rounded"
//                   title="Payment Receipt"
//                 />
//               ) : (
//                 <img
//                   src={selectedReceipt}
//                   alt="Payment Receipt"
//                   className="w-full h-full object-contain border rounded"
//                 />
//               )}
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };


import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Modal } from '../common/Modal';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as feeApi from '@/api/fee.api';
import {
  DollarSign,
  Receipt,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Upload,
  Eye,
  Download
} from 'lucide-react';

interface FeeDetails {
  _id: string;
  student: {
    name: string;
    studentId: string;
    enrollmentNumber: string;
    class?: {
      name: string;
      section: string;
    };
  };
  feeStructure: {
    academicYear: string;
    feeBreakdown: Record<string, number>;
    totalAmount: number;
    dueDate: string;
    installments: Array<{
      installmentNumber: number;
      amount: number;
      dueDate: string;
      description: string;
    }>;

    // ⭐ ADD THIS
    feeStructureDocument?: {
      fileUrl: string;
      originalName?: string;
      uploadedAt: string;
    };
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
    transactionReference: string;
    receiptUrl: string;
    paymentStatus: string;
    remarks: string;
    createdAt: string;
  }>;
  lateFee: number;
  discount: number;
  discountReason: string;
}

export const MyFees: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [feeDetails, setFeeDetails] = useState<FeeDetails | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMode: 'UPI',
    transactionReference: '',
    remarks: '',
    receipt: null as File | null
  });

  useEffect(() => {
    fetchFeeDetails();
  }, []);

  const fetchFeeDetails = async () => {
    setLoading(true);
    try {
      const res = await feeApi.getMyFeeDetails();
      setFeeDetails(res.data);
    } catch (error) {
      console.error('Failed to fetch fee details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayment = async () => {
    if (!paymentData.amount || !paymentData.transactionReference) {
      alert('Amount and transaction reference are required');
      return;
    }

    if (!paymentData.receipt) {
      alert('Please upload a payment receipt');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('amount', paymentData.amount);
      formData.append('paymentMode', paymentData.paymentMode);
      formData.append('transactionReference', paymentData.transactionReference);
      formData.append('remarks', paymentData.remarks);
      formData.append('receipt', paymentData.receipt);

      await feeApi.submitPayment(formData);
      
      alert('Payment receipt submitted successfully! It will be reviewed by the admin.');
      setShowPaymentModal(false);
      setPaymentData({
        amount: '',
        paymentMode: 'UPI',
        transactionReference: '',
        remarks: '',
        receipt: null
      });
      
      fetchFeeDetails();
    } catch (error: any) {
      console.error('Payment submission failed:', error);
      alert(error.response?.data?.message || 'Payment submission failed');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount = 0) => `₹${amount.toLocaleString()}`;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'PAID': return 'text-green-600 bg-green-100';
      case 'PARTIALLY_PAID': return 'text-yellow-600 bg-yellow-100';
      case 'OVERDUE': return 'text-red-600 bg-red-100';
      case 'DEFAULTER': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-green-600 bg-green-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!feeDetails) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold">My Fees</h1>
        <Card className="p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Fee Structure Assigned</h3>
          <p className="text-gray-500">
            No fee structure has been assigned to you yet. Please contact the administration.
          </p>
        </Card>
      </div>
    );
  }

  const studentClass = feeDetails.student?.class;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">My Fees</h1>

        {feeDetails.remainingAmount > 0 && (
          <Button
            onClick={() => setShowPaymentModal(true)}
            className="w-full sm:w-auto"
          >
            <Upload size={20} /> Submit Receipt
          </Button>
        )}
      </div>

      {/* Fee Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Fee</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(feeDetails.totalFeeAmount)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Amount Paid</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(feeDetails.totalAmountPaid)}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(feeDetails.remainingAmount)}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feeDetails.status)}`}>
                {feeDetails.status.replace('_', ' ')}
              </span>
            </div>
            <Clock className="h-8 w-8 text-gray-600" />
          </div>
        </Card>
      </div>

      {/* Fee Structure Details */}
      <Card>
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="mr-2" size={20} />
            Fee Structure Details
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Class</p>
              <p className="font-medium">
                {studentClass
                  ? `${studentClass.name}-${studentClass.section}`
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Academic Year</p>
              <p className="font-medium">{feeDetails.feeStructure?.academicYear ?? 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Due Date</p>
              <p className="font-medium flex items-center">
                <Calendar className="mr-1" size={16} />
                {new Date(feeDetails.dueDate).toLocaleDateString()}
              </p>
            </div>
            {feeDetails.discount > 0 && (
              <div>
                <p className="text-sm text-gray-600">Discount Applied</p>
                <p className="font-medium text-green-600">
                  -{formatCurrency(feeDetails.discount)}
                  {feeDetails.discountReason && (
                    <span className="text-xs text-gray-500 block">
                      ({feeDetails.discountReason})
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Fee Structure Document */}
          {feeDetails.feeStructure?.feeStructureDocument?.fileUrl && (
            <div className="border-t pt-4 mb-6">
              <h3 className="font-medium mb-3 flex items-center">
                <FileText className="mr-2" size={16} />
                Fee Structure Document
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      {feeDetails.feeStructure.feeStructureDocument.originalName || 'Fee Structure Document'}
                    </p>
                    <p className="text-xs text-blue-600">
                      Uploaded: {new Date(feeDetails.feeStructure.feeStructureDocument.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
onClick={() => {
  const url = feeDetails.feeStructure?.feeStructureDocument?.fileUrl;
  if (url) window.open(url, '_blank');
}}                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Eye size={16} /> View Document
                  </Button>
                </div>
                
                {/* Embedded PDF Viewer */}
                <div className="w-full h-64 sm:h-80 border rounded-lg overflow-hidden bg-white">
                  <iframe
                    src={feeDetails.feeStructure.feeStructureDocument.fileUrl}
                    className="w-full h-full"
                    title="Fee Structure Document"
                    style={{ border: 'none' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Fee Breakdown */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Fee Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              {Object.entries(feeDetails.feeStructure?.feeBreakdown || {}).map(([key, value]) => {
                if (value === 0) return null;
                return (
                  <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                    <span className="font-medium">{formatCurrency(value)}</span>
                  </div>
                );
              })}
              {feeDetails.lateFee > 0 && (
                <div className="flex justify-between p-2 bg-red-50 rounded">
                  <span>Late Fee</span>
                  <span className="font-medium text-red-600">
                    +{formatCurrency(feeDetails.lateFee)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Payment History */}
      <Card>
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Receipt className="mr-2" size={20} />
            Payment History
          </h2>
          
          {!feeDetails.payments || feeDetails.payments.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No payments submitted yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {feeDetails.payments.map((payment, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <span className="font-medium text-lg">
                          {formatCurrency(payment.amount)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.paymentStatus)}`}>
                          {payment.paymentStatus}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Payment ID:</span> {payment.paymentId}
                        </div>
                        <div>
                          <span className="font-medium">Mode:</span> {payment.paymentMode}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {new Date(payment.paymentDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Reference:</span> {payment.transactionReference}
                        </div>
                      </div>
                      
                      {payment.remarks && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium text-gray-600">Remarks:</span> {payment.remarks}
                        </div>
                      )}
                    </div>
                    
                    {payment.receiptUrl && (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSelectedReceipt(payment.receiptUrl);
                          setShowReceiptModal(true);
                        }}
                        className="w-full sm:w-auto"
                      >
                        <Eye size={16} /> View Receipt
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Payment Submission Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Submit Payment Receipt"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Remaining Amount:</strong> {formatCurrency(feeDetails.remainingAmount)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Submit your payment receipt for admin verification
            </p>
          </div>
          
          <Input
            label="Payment Amount"
            type="number"
            value={paymentData.amount}
            onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
            placeholder="Enter amount paid"
            max={feeDetails.remainingAmount}
          />
          
          <Select
            label="Payment Mode"
            value={paymentData.paymentMode}
            onChange={(e) => setPaymentData({ ...paymentData, paymentMode: e.target.value })}
            options={[
              { value: 'UPI', label: 'UPI' },
              { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
              { value: 'CHEQUE', label: 'Cheque' },
              { value: 'CASH', label: 'Cash' },
              { value: 'CARD', label: 'Card' },
              { value: 'ONLINE', label: 'Online Payment' },
            ]}
          />
          
          <Input
            label="Transaction Reference"
            value={paymentData.transactionReference}
            onChange={(e) => setPaymentData({ ...paymentData, transactionReference: e.target.value })}
            placeholder="Transaction ID, UTR, or Cheque Number"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Receipt <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setPaymentData({ 
                ...paymentData, 
                receipt: e.target.files?.[0] || null 
              })}
              className="w-full text-sm border border-gray-300 rounded-md p-2"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload payment receipt (JPG, PNG, PDF) - Required
            </p>
          </div>
          
          <Input
            label="Remarks (Optional)"
            value={paymentData.remarks}
            onChange={(e) => setPaymentData({ ...paymentData, remarks: e.target.value })}
            placeholder="Additional notes"
          />
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <AlertCircle className="inline mr-1" size={16} />
              Your payment receipt will be reviewed by the admin before being approved.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <Button 
            variant="secondary" 
            onClick={() => setShowPaymentModal(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitPayment} 
            className="w-full sm:w-auto"
            disabled={loading}
          >
            <Upload size={16} /> {loading ? 'Submitting...' : 'Submit Receipt'}
          </Button>
        </div>
      </Modal>

      {/* Receipt Preview Modal */}
      <Modal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        title="Payment Receipt"
        size="lg"
      >
        {selectedReceipt && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => window.open(selectedReceipt, '_blank')}
              >
                <Download size={16} /> Download
              </Button>
            </div>
            <div className="w-full h-[60vh] sm:h-[70vh]">
              {selectedReceipt.toLowerCase().includes('.pdf') ? (
                <iframe
                  src={selectedReceipt}
                  className="w-full h-full border rounded"
                  title="Payment Receipt"
                />
              ) : (
                <img
                  src={selectedReceipt}
                  alt="Payment Receipt"
                  className="w-full h-full object-contain border rounded"
                />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
