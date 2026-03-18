import React, { useEffect, useState } from "react";
import { Card } from "../common/Card";
import { getMyFacultyAttendance } from "@/api/teacher.api";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

type AttendanceRecord = {
  _id: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LEAVE";
  markedAt: string | null;
};

const statusConfig = {
  PRESENT: { label: "Present", cls: "bg-green-100 text-green-700", icon: <CheckCircle size={14} /> },
  ABSENT: { label: "Absent", cls: "bg-red-100 text-red-700", icon: <XCircle size={14} /> },
  LEAVE: { label: "Leave", cls: "bg-yellow-100 text-yellow-700", icon: <Clock size={14} /> },
};

export const MyAttendance: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyFacultyAttendance()
      .then((res) => setRecords(res.data.records || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const present = records.filter((r) => r.status === "PRESENT").length;
  const absent = records.filter((r) => r.status === "ABSENT").length;
  const leave = records.filter((r) => r.status === "LEAVE").length;
  const total = records.length;
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 min-h-screen bg-neutral-50">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-green-700">My Attendance</h1>
        <p className="text-sm text-neutral-600 mt-1">Your attendance records marked by admin</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Days", value: total, cls: "text-neutral-700" },
          { label: "Present", value: present, cls: "text-green-700" },
          { label: "Absent", value: absent, cls: "text-red-700" },
          { label: "Leave", value: leave, cls: "text-yellow-700" },
        ].map((s) => (
          <Card key={s.label} className="text-center py-4">
            <p className={`text-2xl font-bold ${s.cls}`}>{s.value}</p>
            <p className="text-xs text-neutral-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Attendance % bar */}
      {total > 0 && (
        <Card>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Attendance Percentage</span>
            <span className={`font-bold ${pct >= 75 ? "text-green-700" : "text-red-600"}`}>{pct}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${pct >= 75 ? "bg-green-500" : "bg-red-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct < 75 && (
            <p className="text-xs text-red-600 mt-2">Attendance below 75% threshold</p>
          )}
        </Card>
      )}

      {/* Records table */}
      <Card>
        <h2 className="text-base font-semibold flex items-center gap-2 mb-4">
          <Calendar size={18} /> Attendance History
        </h2>

        {loading ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : records.length === 0 ? (
          <p className="text-sm text-neutral-500">No attendance records found</p>
        ) : (
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="min-w-[400px]">
              <table className="w-full border">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Date</th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Status</th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">Marked At</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => {
                    const cfg = statusConfig[r.status] ?? statusConfig.ABSENT;
                    return (
                      <tr key={r._id} className="border-t">
                        <td className="p-2 sm:p-3 text-xs sm:text-sm">
                          {new Date(r.date).toLocaleDateString(undefined, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${cfg.cls}`}>
                            {cfg.icon} {cfg.label}
                          </span>
                        </td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm text-neutral-500">
                          {r.markedAt
                            ? new Date(r.markedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
