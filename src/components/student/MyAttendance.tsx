import React, { useEffect, useState } from "react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { DatePicker } from "../common/DatePicker";
import { LoadingSpinner } from "../common/LoadingSpinner";
import * as studentApi from "@/api/student.api";
import { formatDate, formatPercentage } from "@/utils/formatters";
import { Calendar, TrendingUp, User } from "lucide-react";

export const MyAttendance: React.FC = () => {
  const [attendance, setAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    from: "",
    to: "",
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await studentApi.getMyAttendance(filters);
      setAttendance(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setLoading(true);
    fetchAttendance();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-secondary-900">My Attendance</h1>

      {/* ================= SUMMARY ================= */}
      {attendance?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-primary-50 border-l-4 border-l-primary-600 shadow-xl">
            <p className="text-sm font-semibold text-secondary-700">Total Days</p>
            <p className="text-2xl font-bold text-secondary-900">
              {attendance.summary.totalDays}
            </p>
          </Card>

          <Card className="bg-success-50 border-l-4 border-l-success-600 shadow-xl">
            <p className="text-sm font-semibold text-secondary-700">Present</p>
            <p className="text-2xl font-bold text-success-700">
              {attendance.summary.presentDays}
            </p>
          </Card>

          <Card className="bg-danger-50 border-l-4 border-l-danger-600 shadow-xl">
            <p className="text-sm font-semibold text-secondary-700">Absent</p>
            <p className="text-2xl font-bold text-danger-700">
              {attendance.summary.absentDays}
            </p>
          </Card>

          <Card className="bg-accent-50 border-l-4 border-l-accent-600 shadow-xl">
            <p className="text-sm font-semibold text-secondary-700">Attendance %</p>
            <p className="text-2xl font-bold text-accent-700">
              {formatPercentage(
                attendance.summary.attendancePercentage
              )}
            </p>
          </Card>
        </div>
      )}

      {/* ================= FILTER ================= */}
      <Card title="Filter Attendance">
        <div className="grid grid-cols-3 gap-4">
          <DatePicker
            label="From Date"
            value={filters.from}
            onChange={(e) =>
              setFilters({ ...filters, from: e.target.value })
            }
          />
          <DatePicker
            label="To Date"
            value={filters.to}
            onChange={(e) =>
              setFilters({ ...filters, to: e.target.value })
            }
          />
          <div className="flex items-end">
            <Button onClick={handleFilter}>Apply Filter</Button>
          </div>
        </div>
      </Card>

      {/* ================= SUBJECT-WISE ATTENDANCE ================= */}
      {attendance?.subjects?.length === 0 ? (
        <Card className="shadow-xl border-2 border-secondary-300">
          <p className="text-secondary-600 text-center font-semibold">
            No attendance records found
          </p>
        </Card>
      ) : (
        attendance?.subjects?.map((sub: any) => (
          <Card key={sub.subject} className="space-y-4 shadow-xl border-2 border-secondary-300 border-l-4 border-l-primary-600">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-secondary-900">
                  {sub.subject}
                </h2>
                {sub.teacher && (
                  <p className="text-sm text-secondary-600 font-semibold flex items-center gap-1">
                    <User size={14} />
                    {sub.teacher.name}
                  </p>
                )}
              </div>

              <span className="text-sm font-bold text-primary-700 bg-primary-100 px-3 py-1 rounded-lg border border-primary-300">
                {formatPercentage(sub.stats.percentage)}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 text-sm font-semibold text-secondary-800">
              <div className="bg-success-50 px-3 py-2 rounded-lg border border-success-300">Present: {sub.stats.present}</div>
              <div className="bg-danger-50 px-3 py-2 rounded-lg border border-danger-300">Absent: {sub.stats.absent}</div>
              <div className="bg-primary-50 px-3 py-2 rounded-lg border border-primary-300">Total: {sub.stats.total}</div>
            </div>

            {/* Records */}
            <div className="overflow-x-auto rounded-lg border-2 border-secondary-300">
              <table className="min-w-full text-sm">
                <thead className="bg-gradient-to-r from-secondary-800 to-secondary-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-white font-bold">Date</th>
                    <th className="px-4 py-3 text-left text-white font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {sub.records.map((r: any, idx: number) => (
                    <tr key={idx} className="hover:bg-primary-50 border-l-4 border-transparent hover:border-primary-600 transition-all duration-200">
                      <td className="px-4 py-3 text-secondary-800 font-medium">
                        {formatDate(r.date, "PP")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                            r.status === "PRESENT"
                              ? "bg-success-100 text-success-800 border-success-300"
                              : "bg-danger-100 text-danger-800 border-danger-300"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};
