import React, { useEffect, useState } from "react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import * as adminApi from "../../api/admin.api";
import { DEPARTMENTS, PROGRAMS, SEMESTERS } from "@/utils/constants";

/* =========================
   TYPES
========================= */
type BatchType = {
  _id: string;
  batchName: string;
  department: string;
  program: string;
  semester: number;
  academicSession: string;
};

type FacultyType = {
  _id: string;
  name: string;
  teacherId: string;
};

type SubjectType = {
  _id: string;
  name: string;
  code: string;
};

export const BatchManagement: React.FC = () => {
  /* =========================
     STATE
  ========================= */
  const [batches, setBatches] = useState<BatchType[]>([]);
  const [faculty, setFaculty] = useState<FacultyType[]>([]);
  const [subjects, setSubjects] = useState<SubjectType[]>([]);

  const [batchData, setBatchData] = useState({
    batchName: "",
    department: "",
    program: "",
    semester: "",
    academicSession: ""
  });

  const [batchAdvisorData, setBatchAdvisorData] = useState({
    batchId: "",
    facultyId: ""
  });

  const [subjectFacultyData, setSubjectFacultyData] = useState({
    batchId: "",
    subject: "",
    facultyId: ""
  });

  /* =========================
     FETCH DROPDOWN DATA
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [batchRes, facultyRes, subjectRes] = await Promise.all([
          adminApi.getAllBatches(),
          adminApi.getTeachersForDropdown(),
          adminApi.getAllSubjects(),
        ]);

        setBatches(batchRes.data);
        setFaculty(facultyRes.data);
        setSubjects(subjectRes.data);
      } catch {
        alert("Failed to load batches or faculty");
      }
    };

    fetchData();
  }, []);

  /* =========================
     HANDLERS
  ========================= */
  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!batchData.batchName || !batchData.department || !batchData.program || !batchData.semester || !batchData.academicSession) {
      alert("All fields are required");
      console.log("Validation failed:", batchData);
      return;
    }
    
    console.log("Creating batch with data:", {
      batchName: batchData.batchName,
      department: batchData.department,
      program: batchData.program,
      semester: parseInt(batchData.semester),
      academicSession: batchData.academicSession
    });
    
    try {
      const response = await adminApi.createBatch({
        batchName: batchData.batchName,
        department: batchData.department,
        program: batchData.program,
        semester: parseInt(batchData.semester),
        academicSession: batchData.academicSession
      });
      
      console.log("Batch created successfully:", response.data);
      alert("Batch created successfully");
      
      setBatchData({ 
        batchName: "", 
        department: "", 
        program: "", 
        semester: "",
        academicSession: ""
      });

      const res = await adminApi.getAllBatches();
      setBatches(res.data);
    } catch (error: any) {
      console.error("Batch creation error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create batch");
    }
  };

  const handleAssignBatchAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.assignBatchAdvisor(
        batchAdvisorData.batchId,
        batchAdvisorData.facultyId
      );
      alert("Batch advisor assigned successfully");
      setBatchAdvisorData({ batchId: "", facultyId: "" });
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to assign batch advisor");
    }
  };

  const handleAssignSubjectFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.assignSubjectFaculty(
        subjectFacultyData.batchId,
        subjectFacultyData.subject,
        subjectFacultyData.facultyId
      );
      alert("Subject faculty assigned successfully");
      setSubjectFacultyData({ batchId: "", subject: "", facultyId: "" });
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to assign subject faculty");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Batch Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ================= CREATE BATCH ================= */}
        <Card title="Create Batch">
          <form onSubmit={handleCreateBatch} className="space-y-4">
            <Input
              label="Batch Name (e.g. CSE-2022-2026)"
              value={batchData.batchName}
              onChange={(e) =>
                setBatchData({ ...batchData, batchName: e.target.value })
              }
              required
            />
            <Select
              label="Department"
              value={batchData.department}
              onChange={(e) =>
                setBatchData({ ...batchData, department: e.target.value })
              }
              options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
              required
            />
            <Select
              label="Program"
              value={batchData.program}
              onChange={(e) =>
                setBatchData({ ...batchData, program: e.target.value })
              }
              options={PROGRAMS.map((p) => ({ value: p, label: p }))}
              required
            />
            <Select
              label="Semester"
              value={batchData.semester}
              onChange={(e) =>
                setBatchData({ ...batchData, semester: e.target.value })
              }
              options={SEMESTERS.map((s) => ({ value: s.toString(), label: `Semester ${s}` }))}
              required
            />
            <Input
              label="Academic Session (e.g. 2022-2026)"
              value={batchData.academicSession}
              onChange={(e) =>
                setBatchData({ ...batchData, academicSession: e.target.value })
              }
              required
            />
            <Button type="submit">Create Batch</Button>
          </form>
        </Card>

        {/* ================= ASSIGN BATCH ADVISOR ================= */}
        <Card title="Assign Batch Advisor">
          <form onSubmit={handleAssignBatchAdvisor} className="space-y-4">
            {/* Batch dropdown */}
            <select
              className="w-full border rounded px-3 py-2"
              value={batchAdvisorData.batchId}
              onChange={(e) =>
                setBatchAdvisorData({
                  ...batchAdvisorData,
                  batchId: e.target.value
                })
              }
              required
            >
              <option value="">Select Batch</option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.batchName}
                </option>
              ))}
            </select>

            {/* Faculty dropdown */}
            <select
              className="w-full border rounded px-3 py-2"
              value={batchAdvisorData.facultyId}
              onChange={(e) =>
                setBatchAdvisorData({
                  ...batchAdvisorData,
                  facultyId: e.target.value
                })
              }
              required
            >
              <option value="">Select Faculty</option>
              {faculty.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name} ({f.teacherId})
                </option>
              ))}
            </select>

            <Button type="submit">Assign Batch Advisor</Button>
          </form>
        </Card>

        {/* ================= ASSIGN SUBJECT FACULTY ================= */}
        <Card title="Assign Subject Faculty">
          <form onSubmit={handleAssignSubjectFaculty} className="space-y-4">
            {/* Batch dropdown */}
            <select
              className="w-full border rounded px-3 py-2"
              value={subjectFacultyData.batchId}
              onChange={(e) =>
                setSubjectFacultyData({
                  ...subjectFacultyData,
                  batchId: e.target.value
                })
              }
              required
            >
              <option value="">Select Batch</option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.batchName}
                </option>
              ))}
            </select>

            <Select
              label="Subject"
              value={subjectFacultyData.subject}
              onChange={(e) =>
                setSubjectFacultyData({
                  ...subjectFacultyData,
                  subject: e.target.value
                })
              }
              options={[
                { value: '', label: '-- Select Subject --' },
                ...subjects.map((s) => ({ value: s.name, label: `${s.name} (${s.code})` })),
              ]}
              required
            />

            {/* Faculty dropdown */}
            <select
              className="w-full border rounded px-3 py-2"
              value={subjectFacultyData.facultyId}
              onChange={(e) =>
                setSubjectFacultyData({
                  ...subjectFacultyData,
                  facultyId: e.target.value
                })
              }
              required
            >
              <option value="">Select Faculty</option>
              {faculty.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name} ({f.teacherId})
                </option>
              ))}
            </select>

            <Button type="submit">Assign Subject Faculty</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
