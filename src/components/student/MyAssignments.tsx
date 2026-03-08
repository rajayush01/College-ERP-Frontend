// import React, { useEffect, useState } from "react";
// import { Card } from "../common/Card";
// import { Button } from "../common/Button";
// import { LoadingSpinner } from "../common/LoadingSpinner";
// import * as assignmentApi from "@/api/student.api";
// import { Upload, X, FileText, Download } from "lucide-react";

// export const MyAssignments: React.FC = () => {
//   const [assignments, setAssignments] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Modal state
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeAssignment, setActiveAssignment] =
//     useState<any>(null);
//   const [selectedFiles, setSelectedFiles] =
//     useState<File[]>([]);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     assignmentApi
//       .getMyAssignments()
//       .then((res) => setAssignments(res.data || []))
//       .catch((err) =>
//         console.error("Failed to fetch assignments:", err)
//       )
//       .finally(() => setLoading(false));
//   }, []);

//   const openSubmitModal = (assignment: any) => {
//     setActiveAssignment(assignment);
//     setSelectedFiles([]);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setActiveAssignment(null);
//     setSelectedFiles([]);
//   };

//   const handleSubmit = async () => {
//     if (selectedFiles.length === 0) {
//       alert("Please select at least one PDF file");
//       return;
//     }

//     // Validate all files are PDFs
//     const invalidFiles = selectedFiles.filter(file => file.type !== "application/pdf");
//     if (invalidFiles.length > 0) {
//       alert("Only PDF files are allowed");
//       return;
//     }

//     console.log('📝 [MyAssignments] Starting submission:', {
//       assignmentId: activeAssignment._id,
//       filesCount: selectedFiles.length,
//       fileNames: selectedFiles.map(f => f.name)
//     });

//     try {
//       setSubmitting(true);

//       // Use the correct API function signature: submitAssignment(assignmentId, files[])
//       await assignmentApi.submitAssignment(activeAssignment._id, selectedFiles);

//       console.log('✅ [MyAssignments] Assignment submitted successfully');

//       // Refresh assignments list
//       const res = await assignmentApi.getMyAssignments();
//       setAssignments(res.data || []);

//       alert("Assignment submitted successfully!");
//       closeModal();
//     } catch (err: any) {
//       console.error('❌ [MyAssignments] Submission failed:', err);
//       alert(
//         err.response?.data?.message ||
//           "Failed to submit assignment"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div className="space-y-6 p-6">
//       <h1 className="text-3xl font-bold">My Assignments</h1>

//       {assignments.length === 0 ? (
//         <Card className="text-center text-gray-500 py-10">
//           No assignments available
//         </Card>
//       ) : (
//         assignments.map((a) => {
//           const isSubmitted = !!a.submission;
//           const isOverdue =
//             new Date(a.dueDate) < new Date() && !isSubmitted;

//           const statusStyle = isSubmitted
//             ? "bg-green-100 text-green-700"
//             : isOverdue
//             ? "bg-red-100 text-red-700"
//             : "bg-yellow-100 text-yellow-700";

//           return (
//             <Card
//               key={a._id}
//               className="space-y-4 p-5 hover:shadow-md transition-shadow"
//             >
//               {/* Header */}
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h2 className="text-lg font-semibold">
//                     {a.title}
//                   </h2>
//                   <p className="text-sm text-gray-500">
//                     {a.subject}
//                   </p>
//                 </div>

//                 <span
//                   className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyle}`}
//                 >
//                   {isSubmitted
//                     ? "Submitted"
//                     : isOverdue
//                     ? "Overdue"
//                     : "Pending"}
//                 </span>
//               </div>

//               {/* Description */}
//               {a.description && (
//                 <p className="text-sm text-gray-600">
//                   {a.description}
//                 </p>
//               )}

//               {/* Due date */}
//               <p className="text-xs text-gray-400">
//                 Due on{" "}
//                 {new Date(a.dueDate).toLocaleDateString()}
//               </p>

//               {/* 🔽 Teacher Attachments (PDF Download) */}
//               {a.attachments?.length > 0 && (
//                 <div className="space-y-2 pt-2">
//                   <p className="text-sm font-medium text-gray-700">
//                     Attached Files
//                   </p>

//                   {a.attachments.map(
//                     (file: any, idx: number) => (
//                       <a
//                         key={idx}
//                         href={file.fileUrl}
//                         download={file.fileName}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="flex items-center gap-2 text-blue-600 text-sm underline"
//                       >
//                         <Download size={14} />
//                         {file.fileName}
//                       </a>
//                     )
//                   )}
//                 </div>
//               )}

//               {/* Actions */}
//               <div className="flex justify-end gap-3 pt-3">
//                 {!isSubmitted && !isOverdue && (
//                   <Button
//                     onClick={() => openSubmitModal(a)}
//                   >
//                     Submit Assignment
//                   </Button>
//                 )}

//                 {isSubmitted && (
//                   <Button variant="secondary" disabled>
//                     Submitted
//                   </Button>
//                 )}
//               </div>
//             </Card>
//           );
//         })
//       )}

//       {/* ============ SUBMIT MODAL ============ */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4 relative">
//             <button
//               className="absolute top-4 right-4 text-gray-500"
//               onClick={closeModal}
//             >
//               <X />
//             </button>

//             <h2 className="text-xl font-semibold">
//               Submit Assignment
//             </h2>

//             <p className="text-sm text-gray-600">
//               {activeAssignment?.title}
//             </p>

//             <label className="block">
//               <span className="text-sm font-medium text-gray-700">
//                 Upload PDF Files (Max 5)
//               </span>
//               <input
//                 type="file"
//                 accept="application/pdf"
//                 multiple
//                 onChange={(e) => {
//                   const files = Array.from(e.target.files || []);
//                   setSelectedFiles(files.slice(0, 5)); // Limit to 5 files
//                 }}
//                 className="mt-2 block w-full text-sm"
//               />
//             </label>

//             {selectedFiles.length > 0 && (
//               <div className="space-y-2">
//                 <p className="text-sm font-medium text-gray-700">
//                   Selected Files ({selectedFiles.length}/5):
//                 </p>
//                 {selectedFiles.map((file, index) => (
//                   <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                     <div className="flex items-center gap-2 text-sm text-blue-600">
//                       <FileText size={16} />
//                       <span>{file.name}</span>
//                       <span className="text-xs text-gray-500">
//                         ({Math.round(file.size / 1024)} KB)
//                       </span>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         const newFiles = selectedFiles.filter((_, i) => i !== index);
//                         setSelectedFiles(newFiles);
//                       }}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <div className="flex justify-end gap-3 pt-4">
//               <Button
//                 variant="secondary"
//                 onClick={closeModal}
//               >
//                 Cancel
//               </Button>

//               <Button
//                 onClick={handleSubmit}
//                 disabled={submitting || selectedFiles.length === 0}
//                 className="flex gap-2"
//               >
//                 <Upload size={16} />
//                 {submitting ? "Submitting..." : "Submit"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
import React, { useEffect, useState } from "react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { LoadingSpinner } from "../common/LoadingSpinner";
import * as assignmentApi from "@/api/student.api";
import { Upload, X, FileText, Download } from "lucide-react";

export const MyAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    assignmentApi
      .getMyAssignments()
      .then((res) => setAssignments(res.data || []))
      .catch((err) =>
        console.error("Failed to fetch assignments:", err)
      )
      .finally(() => setLoading(false));
  }, []);

  const openSubmitModal = (assignment: any) => {
    setActiveAssignment(assignment);
    setSelectedFiles([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveAssignment(null);
    setSelectedFiles([]);
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one PDF file");
      return;
    }

    const invalidFiles = selectedFiles.filter(
      (file) => file.type !== "application/pdf"
    );
    if (invalidFiles.length > 0) {
      alert("Only PDF files are allowed");
      return;
    }

    try {
      setSubmitting(true);

      await assignmentApi.submitAssignment(
        activeAssignment._id,
        selectedFiles
      );

      // Refresh assignments
      const res = await assignmentApi.getMyAssignments();
      setAssignments(res.data || []);

      alert("Assignment submitted successfully!");
      closeModal();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Failed to submit assignment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">My Assignments</h1>

      {assignments.length === 0 ? (
        <Card className="text-center text-gray-500 py-10">
          No assignments available
        </Card>
      ) : (
        assignments.map((a) => {
          const isSubmitted = !!a.submission;
          const isOverdue =
            new Date(a.dueDate) < new Date() && !isSubmitted;

          const statusStyle = isSubmitted
            ? "bg-green-100 text-green-700"
            : isOverdue
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700";

          return (
            <Card
              key={a._id}
              className="space-y-4 p-5 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">
                    {a.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {a.subject}
                  </p>
                </div>

                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyle}`}
                >
                  {isSubmitted
                    ? "Submitted"
                    : isOverdue
                    ? "Overdue"
                    : "Pending"}
                </span>
              </div>

              {/* Due date */}
              <p className="text-xs text-gray-400">
                Due on{" "}
                {new Date(a.dueDate).toLocaleDateString()}
              </p>

              {/* Teacher Attachments */}
              {a.attachments?.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-sm font-medium text-gray-700">
                    Attached Files
                  </p>

                  {a.attachments.map(
                    (file: any, idx: number) => (
                      <a
                        key={idx}
                        href={file.fileUrl}
                        download={file.fileName}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-blue-600 text-sm underline"
                      >
                        <Download size={14} />
                        {file.fileName}
                      </a>
                    )
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3">
                {!isSubmitted && !isOverdue && (
                  <Button
                    onClick={() => openSubmitModal(a)}
                  >
                    Submit Assignment
                  </Button>
                )}

                {isSubmitted && (
                  <Button variant="secondary" disabled>
                    Submitted
                  </Button>
                )}
              </div>
            </Card>
          );
        })
      )}

      {/* ============ SUBMIT MODAL ============ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4 relative">
            <button
              className="absolute top-4 right-4 text-gray-500"
              onClick={closeModal}
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold">
              Submit Assignment
            </h2>

            {/* Title */}
            <p className="text-sm font-medium text-gray-800">
              {activeAssignment?.title}
            </p>

            {/* ✅ Description moved here */}
            {activeAssignment?.description && (
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {activeAssignment.description}
              </p>
            )}

            {/* Upload */}
            <label className="block pt-2">
              <span className="text-sm font-medium text-gray-700">
                Upload PDF Files (Max 5)
              </span>
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setSelectedFiles(files.slice(0, 5));
                }}
                className="mt-2 block w-full text-sm"
              />
            </label>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Selected Files ({selectedFiles.length}/5)
                </p>

                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <FileText size={16} />
                      <span>{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({Math.round(file.size / 1024)} KB)
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setSelectedFiles(
                          selectedFiles.filter((_, i) => i !== index)
                        )
                      }
                      className="text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={submitting || selectedFiles.length === 0}
                className="flex gap-2"
              >
                <Upload size={16} />
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



