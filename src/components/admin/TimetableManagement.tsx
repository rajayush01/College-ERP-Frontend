// import React, { useEffect, useState } from "react";
// import { Button } from "../common/Button";
// import { Input } from "../common/Input";
// import { Select } from "../common/Select";
// import { Modal } from "../common/Modal";
// import { FileUpload } from "../common/FileUpload";
// import { Card } from "../common/Card";
// import * as adminApi from "@/api/admin.api";
// import {
//   Plus,
//   Trash2,
//   Calendar,
//   Upload,
//   Eye,
//   Download,
//   FileText,
// } from "lucide-react";
// import { DAYS } from "@/utils/constants";

// /* =========================
//    TYPES
// ========================= */
// type SubjectTeacher = {
//   subject: string;
//   teacher: string;
// };

// type ClassItem = {
//   _id: string;
//   name: string;
//   section: string;
//   subjectTeachers: SubjectTeacher[];
// };

// type Period = {
//   periodNumber: number;
//   subject: string;
//   teacher: string;
//   startTime: string;
//   endTime: string;
// };

// type TimetableDoc = {
//   _id: string;
//   title: string;
//   fileUrl: string;
//   class: {
//     name: string;
//     section: string;
//   };
//   createdAt: string;
// };

// /* =========================
//    COMPONENT
// ========================= */
// export const TimetableManagement: React.FC = () => {
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);

//   const [classes, setClasses] = useState<ClassItem[]>([]);
//   const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

//   const [mode, setMode] = useState<"MANUAL" | "PDF">("MANUAL");
//   const [pdfFile, setPdfFile] = useState<File | null>(null);

//   const [documents, setDocuments] = useState<TimetableDoc[]>([]);
//   const [previewDoc, setPreviewDoc] = useState<TimetableDoc | null>(null);

//   const [formData, setFormData] = useState<{
//     classId: string;
//     day: string;
//     periods: Period[];
//   }>({
//     classId: "",
//     day: "MON",
//     periods: [],
//   });

//   /* =========================
//      FETCH DATA
//   ========================= */
//   useEffect(() => {
//     fetchClasses();
//     fetchDocuments();
//   }, []);

//   const fetchClasses = async () => {
//     const res = await adminApi.getAllClasses();
//     setClasses(res.data || []);
//   };

//   const fetchDocuments = async () => {
//     const res = await adminApi.getAllTimetableDocuments();
//     setDocuments(res.data || []);
//   };

//   /* =========================
//      CLASS CHANGE
//   ========================= */
//   const handleClassChange = (classId: string) => {
//     const cls = classes.find(c => c._id === classId) || null;
//     setSelectedClass(cls);
//     setFormData({ classId, day: "MON", periods: [] });
//   };

//   /* =========================
//      MANUAL TIMETABLE
//   ========================= */
//   const handleAddPeriod = () => {
//     setFormData(prev => ({
//       ...prev,
//       periods: [
//         ...prev.periods,
//         {
//           periodNumber: prev.periods.length + 1,
//           subject: "",
//           teacher: "",
//           startTime: "09:00",
//           endTime: "09:45",
//         },
//       ],
//     }));
//   };

//   const handleSubjectChange = (index: number, subject: string) => {
//     if (!selectedClass) return;
//     const teacher =
//       selectedClass.subjectTeachers.find(st => st.subject === subject)
//         ?.teacher || "";

//     const updated = [...formData.periods];
//     updated[index] = { ...updated[index], subject, teacher };
//     setFormData({ ...formData, periods: updated });
//   };

//   const handleSaveManual = async () => {
//     await adminApi.upsertTimetable(formData);
//     alert("Timetable saved");
//     setShowCreateModal(false);
//   };

//   /* =========================
//      PDF UPLOAD
//   ========================= */
//   const handleUploadPDF = async () => {
//     if (!formData.classId || !pdfFile) return alert("Select class & PDF");

//     try {
//       await adminApi.uploadTimetableDocument(pdfFile, formData.classId);
//       alert("Timetable uploaded successfully");

//       setPdfFile(null);
//       setShowCreateModal(false);
//       fetchDocuments();
//     } catch (error: any) {
//       alert(error.response?.data?.message || "Failed to upload timetable");
//     }
//   };

//   /* =========================
//      UI
//   ========================= */
//   return (
//     <div className="p-6 space-y-8 bg-neutral-50 min-h-screen">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-teal-700">
//           Timetable Management
//         </h1>
//         <Button onClick={() => setShowCreateModal(true)}>
//           <Plus size={18} /> Create Timetable
//         </Button>
//       </div>

//       {/* ================= TIMETABLE PDF LIST ================= */}
//       <Card title="Uploaded Timetables">
//         {documents.length === 0 ? (
//           <p className="text-sm text-neutral-500">No timetables uploaded</p>
//         ) : (
//           <div className="space-y-3">
//             {documents.map(doc => (
//               <div
//                 key={doc._id}
//                 className="flex justify-between items-center p-4 border rounded-lg bg-white"
//               >
//                 <div className="flex items-center gap-3">
//                   <FileText className="text-red-500" />
//                   <div>
//                     <p className="font-semibold">
//                       Class {doc.class.name} - {doc.class.section}
//                     </p>
//                     <p className="text-xs text-neutral-500">
//                       Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex gap-2">
//                   <Button
//                     size="sm"
//                     variant="secondary"
//                     onClick={() => {
//                       setPreviewDoc(doc);
//                       setShowPreviewModal(true);
//                     }}
//                   >
//                     <Eye size={16} /> Preview
//                   </Button>

//                   <a href={doc.fileUrl} download>
//                     <Button size="sm">
//                       <Download size={16} /> Download
//                     </Button>
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </Card>

//       {/* ================= CREATE / UPLOAD MODAL ================= */}
//       <Modal
//         isOpen={showCreateModal}
//         onClose={() => setShowCreateModal(false)}
//         title="Timetable"
//         size="xl"
//       >
//         <div className="space-y-6">
//           <Select
//             label="Timetable Type"
//             value={mode}
//             onChange={e => setMode(e.target.value as any)}
//             options={[
//               { value: "MANUAL", label: "Manual Timetable" },
//               { value: "PDF", label: "Upload PDF" },
//             ]}
//           />

//           <Select
//             label="Class"
//             value={formData.classId}
//             onChange={e => handleClassChange(e.target.value)}
//             options={classes.map(c => ({
//               value: c._id,
//               label: `${c.name} - ${c.section}`,
//             }))}
//           />

//           {mode === "MANUAL" && (
//             <>
//               <Select
//                 label="Day"
//                 value={formData.day}
//                 onChange={e =>
//                   setFormData(prev => ({ ...prev, day: e.target.value }))
//                 }
//                 options={DAYS.map(d => ({ value: d, label: d }))}
//               />

//               {formData.periods.map((p, i) => (
//                 <div key={i} className="grid grid-cols-12 gap-3">
//                   <Select
//                     className="col-span-5"
//                     label="Subject"
//                     value={p.subject}
//                     onChange={e =>
//                       handleSubjectChange(i, e.target.value)
//                     }
//                     options={
//                       selectedClass?.subjectTeachers.map(st => ({
//                         value: st.subject,
//                         label: st.subject,
//                       })) || []
//                     }
//                   />
//                   <Input
//                     className="col-span-3"
//                     label="Teacher"
//                     value={p.teacher}
//                     disabled
//                   />
//                   <Input className="col-span-2" type="time" value={p.startTime} />
//                   <Input className="col-span-2" type="time" value={p.endTime} />
//                 </div>
//               ))}

//               <div className="flex justify-between">
//                 <Button variant="secondary" onClick={handleAddPeriod}>
//                   <Plus size={16} /> Add Period
//                 </Button>
//                 <Button onClick={handleSaveManual}>
//                   <Calendar size={16} /> Save
//                 </Button>
//               </div>
//             </>
//           )}

//           {mode === "PDF" && (
//             <>
//               <FileUpload
//                 label="Upload Timetable PDF"
//                 accept=".pdf"
//                 onChange={file => setPdfFile(file)}
//               />

//               <div className="flex justify-end">
//                 <Button onClick={handleUploadPDF}>
//                   <Upload size={16} /> Upload PDF
//                 </Button>
//               </div>
//             </>
//           )}
//         </div>
//       </Modal>

//       {/* ================= PREVIEW MODAL ================= */}
//       <Modal
//         isOpen={showPreviewModal}
//         onClose={() => setShowPreviewModal(false)}
//         title="Timetable Preview"
//         size="xl"
//       >
//         {previewDoc && (
//           <iframe
//   src={`${import.meta.env.VITE_API_BASE_URL}${previewDoc.fileUrl}`}
//   className="w-full h-[80vh] border rounded-lg"
//   title="Timetable Preview"
// />

         
//         )}
//       </Modal>
//     </div>
//   );
// };


import React, { useEffect, useState } from "react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Modal } from "../common/Modal";
import { FileUpload } from "../common/FileUpload";
import { Card } from "../common/Card";
import * as adminApi from "@/api/admin.api";
import {
  Plus,
  Trash2,
  Calendar,
  Upload,
  Eye,
  Download,
  FileText,
} from "lucide-react";
import { DAYS } from "@/utils/constants";

/* =========================
   TYPES
========================= */
type ClassItem = {
  _id: string;
  batchName: string;
  department: string;
  program: string;
  semester: number;
  subjectFaculty?: Array<{
    subject: string;
    faculty: {
      name: string;
    };
  }>;
};

type Period = {
  periodNumber: number;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
};

type TimetableDoc = {
  _id: string;
  title: string;
  fileUrl: string;
  batchId: {
    _id: string;
    batchName: string;
    department: string;
    program: string;
    semester: number;
  };
  createdAt: string;
};

type TimetableEntry = {
  _id: string;
  day: string;
  periods: Period[];
};

type PhoneNumber = {
  label: "primary" | "secondary";
  number: string;
};

/* =========================
   COMPONENT
========================= */
export const TimetableManagement: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  const [mode, setMode] = useState<"MANUAL" | "PDF">("MANUAL");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [documents, setDocuments] = useState<TimetableDoc[]>([]);
  const [previewDoc, setPreviewDoc] = useState<TimetableDoc | null>(null);
  
  const [selectedBatchForView, setSelectedBatchForView] = useState("");
  const [viewingTimetable, setViewingTimetable] = useState<TimetableEntry[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([
  { label: "primary", number: "" }
]);

  const [formData, setFormData] = useState<{
    classId: string;
    day: string;
    periods: Period[];
  }>({
    classId: "",
    day: "MON",
    periods: [],
  });

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    console.log('🚀 [Timetable] Component mounted, fetching data...');
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([fetchClasses(), fetchDocuments()]);
      } catch (err) {
        console.error('❌ [Timetable] Failed to fetch initial data:', err);
        setError('Failed to load timetable data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchClasses = async () => {
    try {
      console.log('📡 [Timetable] Fetching batches...');
      const res = await adminApi.getAllBatches();
      console.log('✅ [Timetable] Batches:', res.data);
      setClasses(res.data || []);
    } catch (error) {
      console.error('❌ [Timetable] Failed to fetch batches:', error);
      setClasses([]);
      throw error;
    }
  };

  const fetchDocuments = async () => {
    try {
      console.log('📡 [Timetable] Fetching documents...');
      const res = await adminApi.getAllTimetableDocuments();
      console.log('✅ [Timetable] Documents:', res.data);
      setDocuments(res.data || []);
    } catch (error) {
      console.error('❌ [Timetable] Failed to fetch documents:', error);
      setDocuments([]);
      throw error;
    }
  };

  /* =========================
     CLASS CHANGE
  ========================= */
  const handleClassChange = (classId: string) => {
    const cls = classes.find(c => c._id === classId) || null;
    setSelectedClass(cls);
    setFormData({ classId, day: "MON", periods: [] });
  };

  /* =========================
     MANUAL TIMETABLE
  ========================= */
  const handleAddPeriod = () => {
    setFormData(prev => ({
      ...prev,
      periods: [
        ...prev.periods,
        {
          periodNumber: prev.periods.length + 1,
          subject: "",
          teacher: "",
          startTime: "09:00",
          endTime: "09:45",
        },
      ],
    }));
  };

  const handleSubjectChange = (index: number, subject: string) => {
    if (!selectedClass) return;
    const teacherData =
      selectedClass.subjectFaculty?.find(sf => sf.subject === subject)
        ?.faculty || null;
    
    const teacher = teacherData?.name || "";

    const updated = [...formData.periods];
    updated[index] = { ...updated[index], subject, teacher };
    setFormData({ ...formData, periods: updated });
  };

  const handleSaveManual = async () => {
    try {
      console.log('💾 [Timetable] Saving manual timetable:', formData);
      
      if (!formData.classId) {
        alert('Please select a batch');
        return;
      }
      
      if (formData.periods.length === 0) {
        alert('Please add at least one period');
        return;
      }

      // Validate all periods have required fields
      const invalidPeriods = formData.periods.filter(
        p => !p.subject || !p.startTime || !p.endTime
      );
      
      if (invalidPeriods.length > 0) {
        alert('Please fill in all period details (subject, start time, end time)');
        return;
      }

      await adminApi.upsertTimetable({
        batchId: formData.classId,
        day: formData.day,
        periods: formData.periods,
      });
      
      console.log('✅ [Timetable] Saved successfully');
      alert('Timetable saved successfully');
      setShowCreateModal(false);
      setFormData({ classId: "", day: "MON", periods: [] });
      
      // Refresh the view if we're viewing this batch
      if (selectedBatchForView === formData.classId) {
        handleViewTimetable(formData.classId);
      }
    } catch (error: unknown) {
      console.error('❌ [Timetable] Save failed:', error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Failed to save timetable';
      alert(errorMessage || 'Failed to save timetable');
    }
  };

  const handleViewTimetable = async (batchId: string) => {
    try {
      console.log('👀 [Timetable] Viewing timetable for batch:', batchId);
      const res = await adminApi.getBatchTimetable(batchId);
      console.log('✅ [Timetable] Timetable data:', res.data);
      setViewingTimetable(res.data || []);
      setSelectedBatchForView(batchId);
    } catch (error) {
      console.error('❌ [Timetable] Failed to fetch timetable:', error);
      setViewingTimetable([]);
    }
  };

  /* =========================
     PDF UPLOAD
  ========================= */
  const handleUploadPDF = async () => {
    if (!formData.classId || !pdfFile) return alert("Select batch & PDF");

    try {
      await adminApi.uploadTimetableDocument(pdfFile, formData.classId);
      alert("Timetable uploaded successfully");
      setPdfFile(null);
      setShowCreateModal(false);
      fetchDocuments();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Failed to upload timetable';
      alert(errorMessage || "Failed to upload timetable");
    }
  };

  /* =========================
     UI
  ========================= */
  console.log('🎨 [Timetable] Rendering component...', {
    classesCount: classes.length,
    documentsCount: documents.length,
    viewingTimetableCount: viewingTimetable.length,
    loading,
    error,
  });

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading timetable data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 bg-neutral-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-teal-700">
          Timetable Management
        </h1>
        <Button
          onClick={() => {
            console.log('➕ [Timetable] Create button clicked');
            setShowCreateModal(true);
          }}
          className="w-full sm:w-auto"
        >
          <Plus size={18} /> Create Timetable
        </Button>
      </div>

      {/* ================= VIEW MANUAL TIMETABLE ================= */}
      <Card title="View Manual Timetable">
        <div className="space-y-4">
          <Select
            label="Select Batch"
            value={selectedBatchForView}
            onChange={e => handleViewTimetable(e.target.value)}
            options={[
              { value: "", label: "-- Select Batch --" },
              ...classes.map(c => ({
                value: c._id,
                label: c.batchName,
              })),
            ]}
          />

          {selectedBatchForView && viewingTimetable.length === 0 && (
            <p className="text-sm text-neutral-500 text-center py-4">
              No timetable found for this batch
            </p>
          )}

          {viewingTimetable.length > 0 && (
            <div className="space-y-6">
              {viewingTimetable.map(entry => (
                <div key={entry._id} className="border rounded-lg p-4 bg-white">
                  <h3 className="text-lg font-semibold text-teal-700 mb-3">
                    {entry.day}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-neutral-100">
                        <tr>
                          <th className="px-4 py-2 text-left">Period</th>
                          <th className="px-4 py-2 text-left">Subject</th>
                          <th className="px-4 py-2 text-left">Teacher</th>
                          <th className="px-4 py-2 text-left">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entry.periods.map((period, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="px-4 py-2">{period.periodNumber}</td>
                            <td className="px-4 py-2">{period.subject}</td>
                            <td className="px-4 py-2">{period.teacher}</td>
                            <td className="px-4 py-2">
                              {period.startTime} - {period.endTime}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* ================= TIMETABLE PDF LIST ================= */}
      <Card title="Uploaded Timetables">
        {documents.length === 0 ? (
          <p className="text-sm text-neutral-500">No timetables uploaded</p>
        ) : (
          <div className="space-y-3">
            {documents.map(doc => (
              <div
                key={doc._id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 border rounded-lg bg-white"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-red-500" />
                  <div>
                    <p className="font-semibold">
                      {doc.batchId?.batchName || 'Unknown Batch'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {doc.batchId?.department && doc.batchId?.program 
                        ? `${doc.batchId.department} - ${doc.batchId.program} (Sem ${doc.batchId.semester})`
                        : 'No batch info'
                      }
                    </p>
                    <p className="text-xs text-neutral-500">
                      Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setPreviewDoc(doc);
                      setShowPreviewModal(true);
                    }}
                    className="w-full sm:w-auto"
                  >
                    <Eye size={16} /> Preview
                  </Button>

                  <a href={doc.fileUrl} download className="w-full sm:w-auto">
                    <Button size="sm" className="w-full">
                      <Download size={16} /> Download
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ================= CREATE / UPLOAD MODAL ================= */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Timetable"
        size="xl"
      >
        <div className="space-y-6">
          <Select
            label="Timetable Type"
            value={mode}
            onChange={e => setMode(e.target.value as "MANUAL" | "PDF")}
            options={[
              { value: "MANUAL", label: "Manual Timetable" },
              { value: "PDF", label: "Upload PDF" },
            ]}
          />

          <Select
            label="Batch"
            value={formData.classId}
            onChange={e => handleClassChange(e.target.value)}
            options={classes.map(c => ({
              value: c._id,
              label: c.batchName,
            }))}
          />

          {mode === "MANUAL" && (
            <>
              <Select
                label="Day"
                value={formData.day}
                onChange={e =>
                  setFormData(prev => ({ ...prev, day: e.target.value }))
                }
                options={DAYS.map(d => ({ value: d, label: d }))}
              />

              {formData.periods.map((p, i) => (
                <Card key={i} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-blue-900">Period {p.periodNumber}</h4>
                    <button
                      onClick={() => {
                        const updated = formData.periods.filter((_, idx) => idx !== i);
                        setFormData({ ...formData, periods: updated });
                      }}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-100 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Subject"
                      value={p.subject}
                      onChange={e => handleSubjectChange(i, e.target.value)}
                      options={
                        selectedClass?.subjectFaculty?.map(sf => ({
                          value: sf.subject,
                          label: sf.subject,
                        })) || []
                      }
                      required
                    />
                    <Input
                      label="Teacher"
                      value={p.teacher}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Input
                      type="time"
                      label="Start Time"
                      value={p.startTime}
                      onChange={e => {
                        const updated = [...formData.periods];
                        updated[i] = { ...updated[i], startTime: e.target.value };
                        setFormData({ ...formData, periods: updated });
                      }}
                      required
                    />
                    <Input
                      type="time"
                      label="End Time"
                      value={p.endTime}
                      onChange={e => {
                        const updated = [...formData.periods];
                        updated[i] = { ...updated[i], endTime: e.target.value };
                        setFormData({ ...formData, periods: updated });
                      }}
                      required
                    />
                  </div>
                </Card>
              ))}

              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t">
                <Button 
                  variant="secondary" 
                  onClick={handleAddPeriod}
                  className="w-full sm:w-auto"
                >
                  <Plus size={16} /> Add Period
                </Button>
                <Button 
                  onClick={handleSaveManual}
                  className="w-full sm:w-auto"
                  disabled={formData.periods.length === 0}
                >
                  <Calendar size={16} /> Save Timetable
                </Button>
              </div>
            </>
          )}

          {mode === "PDF" && (
            <>
              <FileUpload
                label="Upload Timetable PDF"
                accept=".pdf"
                onChange={file => setPdfFile(file)}
              />

              <div className="flex justify-end">
                <Button onClick={handleUploadPDF}>
                  <Upload size={16} /> Upload PDF
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* ================= PREVIEW MODAL ================= */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Timetable Preview"
        size="xl"
      >
        {previewDoc && (
          <iframe
            src={`${import.meta.env.VITE_API_URL}${previewDoc.fileUrl}`}
            className="w-full h-[70vh] sm:h-[85vh] border rounded-lg"
            title="Timetable Preview"
          />
        )}
      </Modal>
    </div>
  );
};
