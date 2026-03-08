import React, { useEffect, useState } from "react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { DatePicker } from "../common/DatePicker";
import { Select } from "../common/Select";
import * as adminApi from "@/api/admin.api";
import {
  Calendar,
  UserCheck,
  Plus,
  CheckCircle,
} from "lucide-react";

/* =========================
   TYPES
========================= */
type Teacher = {
  _id: string;
  teacherId: string;
  name: string;
};

type AttendanceRecord = {
  teacherId: string;
  status: string;
};

type AttendanceReportRow = {
  teacherId: string;
  name: string;
  status: "PRESENT" | "ABSENT" | "LEAVE";
};

/* =========================
   COMPONENT
========================= */
export const TeacherAttendance: React.FC = () => {
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [filterType, setFilterType] = useState<
    "day" | "week" | "month"
  >("day");

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([
    { teacherId: "", status: "PRESENT" },
  ]);

  const [report, setReport] = useState<AttendanceReportRow[]>([]);
  const [loadingReport, setLoadingReport] = useState(false);

  /* =========================
     FETCH TEACHERS (DROPDOWN)
  ========================= */
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await adminApi.getTeachersForDropdown();
      setTeachers(res.data ?? []);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    }
  };

  /* =========================
     FETCH ATTENDANCE REPORT
  ========================= */
  useEffect(() => {
    fetchAttendanceReport();
  }, [date, filterType]);

const fetchAttendanceReport = async () => {
  setLoadingReport(true);
  try {
    const res = await adminApi.getTeacherAttendanceReport({
      type: filterType,
      date,
    });

    console.log("📦 Attendance report API response:", res.data);

    setReport(res.data.report || []);
  } catch (err) {
    console.error("Failed to fetch attendance report:", err);
    setReport([]);
  } finally {
    setLoadingReport(false);
  }
};

  /* =========================
     RECORD HANDLERS
  ========================= */
  const handleAddRecord = () => {
    setRecords([...records, { teacherId: "", status: "PRESENT" }]);
  };

  const handleRecordChange = (
    index: number,
    field: keyof AttendanceRecord,
    value: string
  ) => {
    const updated = [...records];
    updated[index] = { ...updated[index], [field]: value };
    setRecords(updated);
  };

  /* =========================
     SUBMIT ATTENDANCE
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (records.some((r) => !r.teacherId)) {
      alert("Please select faculty for all records");
      return;
    }

    try {
      await adminApi.markTeacherAttendance({
        date,
        records,
      });

      alert("Faculty attendance marked successfully");
      setRecords([{ teacherId: "", status: "PRESENT" }]);

      // 🔁 Refresh report
      fetchAttendanceReport();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to mark attendance");
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-6 sm:space-y-8 p-3 sm:p-4 md:p-6 min-h-screen bg-neutral-50">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-green-700">
          Faculty Attendance
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 mt-1">
          Mark and review faculty attendance
        </p>
      </div>

      {/* MARK ATTENDANCE */}
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <UserCheck className="text-green-600" size={20} />
          <h2 className="text-base sm:text-lg font-semibold">
            Mark Attendance
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <DatePicker
            label="Attendance Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          {records.map((record, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Select
  value={record.teacherId}
  onChange={(e) =>
    handleRecordChange(index, "teacherId", e.target.value)
  }
  options={[
    { value: "", label: "Select Faculty" },
    ...teachers.map((t) => ({
      value: t.teacherId,
      label: `${t.name} (${t.teacherId})`,
    })),
  ]}
  searchable
  required
/>

              <Select
                value={record.status}
                onChange={(e) =>
                  handleRecordChange(
                    index,
                    "status",
                    e.target.value
                  )
                }
                options={[
                  { value: "PRESENT", label: "Present" },
                  { value: "ABSENT", label: "Absent" },
                  { value: "LEAVE", label: "Leave" },
                ]}
              />
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddRecord}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              <Plus size={16} /> Add Faculty
            </Button>

            <Button type="submit" className="w-full sm:w-auto text-sm sm:text-base">
              <CheckCircle size={16} /> Mark Attendance
            </Button>
          </div>
        </form>
      </Card>

      {/* ATTENDANCE REPORT */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Calendar size={20} /> Attendance Report
          </h2>

          <div className="w-full sm:w-auto sm:max-w-[200px]">
            <Select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as any)
              }
              options={[
                { value: "day", label: "Day" },
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
              ]}
            />
          </div>
        </div>

        {loadingReport ? (
          <p className="text-xs sm:text-sm text-neutral-500">
            Loading attendance...
          </p>
        ) : report.length === 0 ? (
          <p className="text-xs sm:text-sm text-neutral-500">
            No attendance data found
          </p>
        ) : (
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="min-w-[500px]">
              <table className="w-full border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Faculty</th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Faculty ID</th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.map((r) => (
                    <tr key={r.teacherId} className="border-t">
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">{r.name}</td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">{r.teacherId}</td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm font-semibold">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          r.status === 'PRESENT' 
                            ? 'bg-green-100 text-green-700' 
                            : r.status === 'ABSENT'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};