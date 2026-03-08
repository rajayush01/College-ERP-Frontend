import React, { useEffect, useState } from "react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Modal } from "../common/Modal";
import * as adminApi from "@/api/admin.api";
import { formatDate } from "@/utils/formatters";
import { Plus, BookOpen, Trash2, Eye, CheckCircle, Clock, Users, AlertTriangle } from "lucide-react";
import { EXAM_TYPES } from "@/utils/constants";

type SubjectRow = {
  subject: string;
  teachers: string[];
  maxMarks: number;
  selected: boolean;
};

export const ExamManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'exams' | 'results'>('exams');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    exam: any;
  }>({ isOpen: false, exam: null });

  const [classes, setClasses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);

  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingExams, setLoadingExams] = useState(false);

  const [subjects, setSubjects] = useState<SubjectRow[]>([]);

  const [formData, setFormData] = useState<{
    name: string;
    examType: "MINOR" | "MAJOR";
    classId?: string;
    className?: string;
  }>({
    name: "",
    examType: "MINOR",
  });

  /* =========================
     LOAD INITIAL DATA
  ========================= */
  useEffect(() => {
    fetchClasses();
    fetchExams();
  }, []);

  const fetchClasses = async () => {
    setLoadingClasses(true);
    try {
      const res = await adminApi.getAllBatches();
      setClasses(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchExams = async () => {
    setLoadingExams(true);
    try {
      const res = await adminApi.getAllExams();
      setExams(Array.isArray(res.data) ? res.data : res.data.exams || []);
    } finally {
      setLoadingExams(false);
    }
  };

  /* =========================
     CLASS SELECTION
  ========================= */
  const handleMinorClassSelect = (classId: string) => {
    const cls = classes.find((c) => c._id === classId);
    if (!cls) return;

    setFormData((p) => ({ ...p, classId, className: undefined }));

    // Use subjectFaculty from batch model
    const subjectFacultyList = cls.subjectFaculty || [];
    
    setSubjects(
      subjectFacultyList.map((sf: any) => ({
        subject: sf.subject,
        teachers: [sf.faculty?.name || "Unassigned"],
        maxMarks: 100,
        selected: true,
      }))
    );
  };

  const handleMajorClassSelect = (className: string) => {
    setFormData((p) => ({ ...p, className, classId: undefined }));

    // Filter batches by department
    const relevant = classes.filter((c) => c.department === className);
    const map = new Map<string, SubjectRow>();

    relevant.forEach((cls) => {
      const subjectFacultyList = cls.subjectFaculty || [];
      subjectFacultyList.forEach((sf: any) => {
        if (!map.has(sf.subject)) {
          map.set(sf.subject, {
            subject: sf.subject,
            teachers: [],
            maxMarks: 100,
            selected: true,
          });
        }
        map.get(sf.subject)!.teachers.push(sf.faculty?.name || "Unassigned");
      });
    });

    setSubjects(
      Array.from(map.values()).map((s) => ({
        ...s,
        teachers: Array.from(new Set(s.teachers)),
      }))
    );
  };

  /* =========================
     CREATE EXAM
  ========================= */
  const handleCreateExam = async () => {
    if (!formData.name.trim()) return alert("Exam name is required");

    if (formData.examType === "MINOR" && !formData.classId)
      return alert("Select batch");

    if (formData.examType === "MAJOR" && !formData.className)
      return alert("Select department");

    const selectedSubjects = subjects.filter(
      (s) => s.selected && s.maxMarks > 0
    );

    if (!selectedSubjects.length)
      return alert("Select at least one subject with marks");

    try {
      // Prepare batchIds array based on exam type
      let batchIds: string[] = [];
      
      if (formData.examType === "MINOR") {
        // For MINOR exams, use the single selected batch
        batchIds = [formData.classId!];
      } else {
        // For MAJOR exams, get all batches of the selected department
        const departmentBatches = classes.filter((c) => c.department === formData.className);
        batchIds = departmentBatches.map((c) => c._id);
      }

      await adminApi.createExam({
        name: formData.name,
        examType: formData.examType,
        batchIds: batchIds,
        subjects: selectedSubjects.map((s) => ({
          subject: s.subject,
          maxMarks: s.maxMarks,
        })),
      });

      await fetchExams();
      resetForm();
      setShowCreateModal(false);
      alert("Exam created successfully");
    } catch (err: any) {
      console.error("Exam creation error:", err);
      alert(err.response?.data?.message || "Failed to create exam");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", examType: "MINOR" });
    setSubjects([]);
  };

  /* =========================
     ACTIONS
  ========================= */
  const toggleExam = async (id: string) => {
    await adminApi.toggleExamStatus(id);
    fetchExams();
  };

  const deleteExam = async (id: string) => {
    if (!confirm("Delete this exam?")) return;
    await adminApi.deleteExam(id);
    fetchExams();
  };

  /* =========================
     RESULTS MANAGEMENT
  ========================= */
  const handlePublishResults = async (examId: string) => {
    if (!confirm('Are you sure you want to publish these results? This action cannot be undone.')) {
      return;
    }

    try {
      setPublishing(examId);
      await adminApi.publishResults(examId);
      
      await fetchExams();
      
      alert('Results published successfully! Students can now view their results.');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to publish results');
    } finally {
      setPublishing(null);
    }
  };

  const openPreview = (exam: any) => {
    setPreviewModal({ isOpen: true, exam });
  };

  const closePreview = () => {
    setPreviewModal({ isOpen: false, exam: null });
  };

  const evaluatedExams = exams.filter(exam => 
    exam.examType === 'MAJOR' && exam.status === 'EVALUATED'
  );
  const publishedExams = exams.filter(exam => 
    exam.examType === 'MAJOR' && exam.status === 'PUBLISHED'
  );

  const getStatusBadge = (exam: any) => {
    const statusConfig = {
      'CREATED': { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock },
      'EVALUATED': { bg: 'bg-amber-100', text: 'text-amber-700', icon: AlertTriangle },
      'PUBLISHED': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle }
    };

    const config = statusConfig[exam.status as keyof typeof statusConfig] || statusConfig.CREATED;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon size={12} />
        {exam.status}
      </span>
    );
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 bg-gradient-to-br from-neutral-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            Exam & Results Management
          </h1>
          <p className="text-sm sm:text-base text-neutral-600">
            Create exams, manage settings, and publish results
          </p>
        </div>

        <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm sm:text-base shrink-0">
          <Plus size={18} /> Create Exam
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border overflow-x-auto">
        <button
          onClick={() => setActiveTab('exams')}
          className={`flex-1 min-w-[140px] py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
            activeTab === 'exams'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-neutral-600 hover:text-neutral-800'
          }`}
        >
          <BookOpen size={14} className="inline mr-1 sm:mr-2" />
          Exam Management
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`flex-1 min-w-[140px] py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors relative ${
            activeTab === 'results'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-neutral-600 hover:text-neutral-800'
          }`}
        >
          <CheckCircle size={14} className="inline mr-1 sm:mr-2" />
          Results Management
          {evaluatedExams.length > 0 && (
            <span className="ml-1 sm:ml-2 bg-amber-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
              {evaluatedExams.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'exams' ? (
        /* ================= EXAM MANAGEMENT TAB ================= */
        <Card className="shadow-lg border-2 border-white">
          <div className="p-3 sm:p-4 md:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <BookOpen className="text-indigo-600" size={20} />
              Existing Exams
            </h3>

            {loadingExams ? (
              <p className="text-xs sm:text-sm text-neutral-500">Loading exams…</p>
            ) : exams.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <BookOpen className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-neutral-400 mb-3 sm:mb-4" />
                <p className="text-base sm:text-lg font-semibold text-neutral-800 mb-1">No Exams Found</p>
                <p className="text-sm sm:text-base text-neutral-600">Create your first exam to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {exams.map((exam) => (
                  <div
                    key={exam._id}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-2 border-neutral-100 rounded-lg p-3 sm:p-4 bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-semibold text-base sm:text-lg text-neutral-800 break-words">
                          {exam.name}
                        </h4>
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                          exam.examType === 'MAJOR' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                            : 'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                          {exam.examType}
                        </span>
                        {getStatusBadge(exam)}
                        <span className={`px-2 py-1 rounded text-xs font-medium shrink-0 ${
                          exam.isActive 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {exam.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span className="break-words">
                            Classes: {exam.classes?.map((c: any) => `${c.name}-${c.section}`).join(', ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen size={14} />
                          <span>Subjects: {exam.subjects?.length || 0}</span>
                        </div>
                      </div>

                      {exam.publishedAt && (
                        <p className="text-xs sm:text-sm text-emerald-600 mt-1 sm:mt-2">
                          Published on {formatDate(exam.publishedAt, 'PPp')}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openPreview(exam)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-xs sm:text-sm"
                      >
                        <Eye size={14} />
                        View
                      </Button>
                      
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleExam(exam._id)}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        {exam.isActive ? "Disable" : "Enable"}
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteExam(exam._id)}
                        className="w-full sm:w-auto flex items-center justify-center gap-1 text-xs sm:text-sm"
                      >
                        <Trash2 size={14} />
                        <span className="sm:hidden">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      ) : (
        /* ================= RESULTS MANAGEMENT TAB ================= */
        <div className="space-y-4 sm:space-y-6">
          {/* Pending Results */}
          <Card 
            className="shadow-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50"
          >
            <div className="p-3 sm:p-4 md:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
                <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                <span>Pending Results - Awaiting Publication</span>
                {evaluatedExams.length > 0 && (
                  <span className="bg-amber-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                    {evaluatedExams.length}
                  </span>
                )}
              </h3>

              {evaluatedExams.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <CheckCircle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-emerald-500 mb-3 sm:mb-4" />
                  <p className="text-base sm:text-lg font-semibold text-neutral-800 mb-1">All Caught Up!</p>
                  <p className="text-sm sm:text-base text-neutral-600">No results pending publication.</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {evaluatedExams.map((exam) => (
                    <div
                      key={exam._id}
                      className="flex flex-col gap-3 p-3 sm:p-4 bg-white rounded-lg border-2 border-amber-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <BookOpen className="text-amber-600 shrink-0" size={18} />
                          <h4 className="text-base sm:text-lg font-semibold text-neutral-800 break-words">
                            {exam.name}
                          </h4>
                          <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 shrink-0">
                            MAJOR EXAM
                          </span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-neutral-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span className="break-words">
                              Classes: {exam.classes?.map((c: any) => `${c.name}-${c.section}`).join(', ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen size={14} />
                            <span>Subjects: {exam.subjects?.length || 0}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="text-amber-500 shrink-0" size={14} />
                          <span className="text-xs sm:text-sm text-amber-700 font-medium">
                            Evaluated - Ready for Publication
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openPreview(exam)}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm"
                        >
                          <Eye size={14} />
                          Preview
                        </Button>
                        
                        <Button
                          onClick={() => handlePublishResults(exam._id)}
                          disabled={publishing === exam._id}
                          size="sm"
                          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-xs sm:text-sm"
                        >
                          <CheckCircle size={14} />
                          {publishing === exam._id ? 'Publishing...' : 'Publish Results'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Published Results */}
          <Card 
            className="shadow-lg border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50"
          >
            <div className="p-3 sm:p-4 md:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
                <CheckCircle className="text-emerald-600 shrink-0" size={20} />
                <span>Published Results</span>
                {publishedExams.length > 0 && (
                  <span className="bg-emerald-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                    {publishedExams.length}
                  </span>
                )}
              </h3>

              {publishedExams.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-sm sm:text-base text-neutral-600">No results have been published yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {publishedExams.map((exam) => (
                    <div
                      key={exam._id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-white rounded-lg border-2 border-emerald-200 shadow-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <CheckCircle className="text-emerald-600 shrink-0" size={18} />
                          <h4 className="text-base sm:text-lg font-semibold text-neutral-800 break-words">
                            {exam.name}
                          </h4>
                          <span className="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 shrink-0">
                            PUBLISHED
                          </span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-neutral-600">
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span className="break-words">
                              Classes: {exam.classes?.map((c: any) => `${c.name}-${c.section}`).join(', ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen size={14} />
                            <span>Subjects: {exam.subjects?.length || 0}</span>
                          </div>
                        </div>
                        
                        {exam.publishedAt && (
                          <p className="text-xs sm:text-sm text-emerald-700 mt-1 sm:mt-2">
                            Published on {formatDate(exam.publishedAt, 'PPp')}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openPreview(exam)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs sm:text-sm"
                        >
                          <Eye size={14} />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ================= CREATE EXAM MODAL ================= */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Exam"
        size="lg"
      >
        <div className="space-y-4 sm:space-y-5">
          <Input
            label="Exam Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((p) => ({ ...p, name: e.target.value }))
            }
          />

          <Select
            label="Exam Type"
            value={formData.examType}
            onChange={(e) => {
              setFormData({
                name: formData.name,
                examType: e.target.value as "MINOR" | "MAJOR",
              });
              setSubjects([]);
            }}
            options={EXAM_TYPES}
          />

          {formData.examType === "MINOR" && (
            <Select
              label="Batch"
              value={formData.classId || ""}
              onChange={(e) => handleMinorClassSelect(e.target.value)}
              options={classes.map((c) => ({
                value: c._id,
                label: c.batchName || `${c.name} - ${c.section}`,
              }))}
              loading={loadingClasses}
            />
          )}

          {formData.examType === "MAJOR" && (
            <Select
              label="Department"
              value={formData.className || ""}
              onChange={(e) => handleMajorClassSelect(e.target.value)}
              options={[...new Set(classes.map((c) => c.department || c.name))].map(
                (n) => ({ value: n, label: n })
              )}
              loading={loadingClasses}
            />
          )}

          {subjects.length > 0 && (
            <div className="space-y-2 max-h-[40vh] overflow-y-auto">
              {subjects.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:grid sm:grid-cols-12 gap-2 items-start sm:items-center border p-2 sm:p-3 rounded"
                >
                  <input
                    type="checkbox"
                    checked={s.selected}
                    onChange={() => {
                      const copy = [...subjects];
                      copy[i].selected = !copy[i].selected;
                      setSubjects(copy);
                    }}
                    className="sm:col-span-1 mt-1 sm:mt-0"
                  />
                  <div className="sm:col-span-3 font-medium text-sm break-words">{s.subject}</div>
                  <div className="sm:col-span-5 text-xs text-neutral-600 break-words">
                    {s.teachers.join(", ")}
                  </div>
                  <Input
                    className="sm:col-span-3 w-full"
                    value={s.maxMarks}
                    disabled={!s.selected}
                    onChange={(e) => {
                      const copy = [...subjects];
                      copy[i].maxMarks = Number(e.target.value) || 0;
                      setSubjects(copy);
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3 sm:pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="w-full sm:w-auto order-2 sm:order-1">
              Cancel
            </Button>
            <Button onClick={handleCreateExam} className="w-full sm:w-auto order-1 sm:order-2">Create</Button>
          </div>
        </div>
      </Modal>

      {/* ================= PREVIEW MODAL ================= */}
      <Modal
        isOpen={previewModal.isOpen}
        onClose={closePreview}
        title={`Exam Details: ${previewModal.exam?.name || ''}`}
        size="lg"
      >
        {previewModal.exam && (
          <div className="space-y-4 sm:space-y-6">
            {/* Exam Info */}
            <div className="bg-neutral-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Exam Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="break-words">
                  <span className="font-medium">Exam Type:</span>
                  <span className="ml-2">{previewModal.exam.examType}</span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className="ml-2">{getStatusBadge(previewModal.exam)}</span>
                </div>
                <div>
                  <span className="font-medium">Active:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    previewModal.exam.isActive 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {previewModal.exam.isActive ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <span className="ml-2">
                    {formatDate(previewModal.exam.createdAt, 'PP')}
                  </span>
                </div>
                <div className="col-span-1 sm:col-span-2 break-words">
                  <span className="font-medium">Classes:</span>
                  <span className="ml-2">
                    {previewModal.exam.classes?.map((c: any) => `${c.name}-${c.section}`).join(', ')}
                  </span>
                </div>
                {previewModal.exam.publishedAt && (
                  <div className="col-span-1 sm:col-span-2">
                    <span className="font-medium">Published:</span>
                    <span className="ml-2 text-emerald-600">
                      {formatDate(previewModal.exam.publishedAt, 'PPp')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Subjects */}
            <div>
              <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Subjects & Teachers</h3>
              <div className="space-y-2">
                {previewModal.exam.subjects?.map((subject: any, index: number) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-2 sm:p-3 bg-neutral-50 rounded">
                    <div className="break-words">
                      <span className="font-medium text-sm">{subject.subject}</span>
                      <span className="text-xs sm:text-sm text-neutral-600 ml-2">
                        (Max: {subject.maxMarks} marks)
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-neutral-600">
                      {subject.teachers?.length > 0 
                        ? `${subject.teachers.length} teacher(s) assigned`
                        : subject.teacher 
                          ? '1 teacher assigned'
                          : 'No teacher assigned'
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
              <Button variant="secondary" onClick={closePreview} className="w-full sm:w-auto order-2 sm:order-1">
                Close
              </Button>
              {previewModal.exam.status === 'EVALUATED' && (
                <Button
                  onClick={() => {
                    closePreview();
                    handlePublishResults(previewModal.exam._id);
                  }}
                  disabled={publishing === previewModal.exam._id}
                  className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Publish Results
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};