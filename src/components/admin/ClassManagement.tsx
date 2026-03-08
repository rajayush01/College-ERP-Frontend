import React, { useEffect, useState } from "react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import * as adminApi from "../../api/admin.api";

/* =========================
   TYPES
========================= */
type ClassType = {
  _id: string;
  name: string;
  section: string;
};

type TeacherType = {
  _id: string;
  name: string;
  teacherId: string;
};

export const ClassManagement: React.FC = () => {
  /* =========================
     STATE
  ========================= */
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);

  const [classData, setClassData] = useState({
    name: "",
    section: ""
  });

  const [classTeacherData, setClassTeacherData] = useState({
    classId: "",
    teacherId: ""
  });

  const [subjectTeacherData, setSubjectTeacherData] = useState({
    classId: "",
    subject: "",
    teacherId: ""
  });

  /* =========================
     FETCH DROPDOWN DATA
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, teacherRes] = await Promise.all([
          adminApi.getAllClasses(),
          adminApi.getTeachersForDropdown()
        ]);

        setClasses(classRes.data);
        setTeachers(teacherRes.data);
      } catch {
        alert("Failed to load classes or teachers");
      }
    };

    fetchData();
  }, []);

  /* =========================
     HANDLERS
  ========================= */
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createClass(classData.name, classData.section);
      alert("Class created successfully");
      setClassData({ name: "", section: "" });

      const res = await adminApi.getAllClasses();
      setClasses(res.data);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create class");
    }
  };

  const handleAssignClassTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.assignClassTeacher(
        classTeacherData.classId,
        classTeacherData.teacherId
      );
      alert("Class teacher assigned successfully");
      setClassTeacherData({ classId: "", teacherId: "" });
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to assign class teacher");
    }
  };

  const handleAssignSubjectTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.assignSubjectTeacher(
        subjectTeacherData.classId,
        subjectTeacherData.subject,
        subjectTeacherData.teacherId
      );
      alert("Subject teacher assigned successfully");
      setSubjectTeacherData({ classId: "", subject: "", teacherId: "" });
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to assign subject teacher");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Class Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ================= CREATE CLASS ================= */}
        <Card title="Create Class">
          <form onSubmit={handleCreateClass} className="space-y-4">
            <Input
              label="Class Name (e.g. 8)"
              value={classData.name}
              onChange={(e) =>
                setClassData({ ...classData, name: e.target.value })
              }
              required
            />
            <Input
              label="Section (e.g. A)"
              value={classData.section}
              onChange={(e) =>
                setClassData({ ...classData, section: e.target.value })
              }
              required
            />
            <Button type="submit">Create Class</Button>
          </form>
        </Card>

        {/* ================= ASSIGN CLASS TEACHER ================= */}
        <Card title="Assign Class Teacher">
          <form onSubmit={handleAssignClassTeacher} className="space-y-4">
            {/* Class dropdown */}
            <select
              className="w-full border rounded px-3 py-2"
              value={classTeacherData.classId}
              onChange={(e) =>
                setClassTeacherData({
                  ...classTeacherData,
                  classId: e.target.value
                })
              }
              required
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} - {cls.section}
                </option>
              ))}
            </select>

            {/* Teacher dropdown */}
            <select
              className="w-full border rounded px-3 py-2"
              value={classTeacherData.teacherId}
              onChange={(e) =>
                setClassTeacherData({
                  ...classTeacherData,
                  teacherId: e.target.value
                })
              }
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.teacherId})
                </option>
              ))}
            </select>

            <Button type="submit">Assign Class Teacher</Button>
          </form>
        </Card>

        {/* ================= ASSIGN SUBJECT TEACHER ================= */}
        <Card title="Assign Subject Teacher">
          <form onSubmit={handleAssignSubjectTeacher} className="space-y-4">
            {/* Class dropdown */}
            <select
              className="w-full border rounded px-3 py-2"
              value={subjectTeacherData.classId}
              onChange={(e) =>
                setSubjectTeacherData({
                  ...subjectTeacherData,
                  classId: e.target.value
                })
              }
              required
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} - {cls.section}
                </option>
              ))}
            </select>

            <Input
              label="Subject"
              value={subjectTeacherData.subject}
              onChange={(e) =>
                setSubjectTeacherData({
                  ...subjectTeacherData,
                  subject: e.target.value
                })
              }
              required
            />

            {/* Teacher dropdown */}
            <select
              className="w-full border rounded px-3 py-2"
              value={subjectTeacherData.teacherId}
              onChange={(e) =>
                setSubjectTeacherData({
                  ...subjectTeacherData,
                  teacherId: e.target.value
                })
              }
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.teacherId})
                </option>
              ))}
            </select>

            <Button type="submit">Assign Subject Teacher</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
