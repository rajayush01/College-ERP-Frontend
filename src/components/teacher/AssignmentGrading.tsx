import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Modal } from "../common/Modal";
import { LoadingSpinner } from "../common/LoadingSpinner";
import * as teacherApi from "@/api/teacher.api";
import { formatDate } from "@/utils/formatters";
import {
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  FileText,
} from "lucide-react";

const colorMap: Record<string, string> = {
  blue: "from-blue-50 to-blue-100 text-blue-700",
  emerald: "from-emerald-50 to-emerald-100 text-emerald-700",
  amber: "from-amber-50 to-amber-100 text-amber-700",
  purple: "from-purple-50 to-purple-100 text-purple-700",
};

export const AssignmentGrading: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<any>(null);
  const [gradeData, setGradeData] = useState({
    marksObtained: 0,
    remarks: "",
  });

  useEffect(() => {
    if (!assignmentId) return;

    Promise.all([
      teacherApi.getAssignmentSubmissions(assignmentId),
      teacherApi.getAssignmentAnalytics(assignmentId),
    ])
      .then(([subs, stats]) => {
        setSubmissions(subs.data);
        setAnalytics(stats.data);
      })
      .catch((err) =>
        console.error("Failed to load grading data:", err)
      )
      .finally(() => setLoading(false));
  }, [assignmentId]);

  const handleGrade = async () => {
    try {
      await teacherApi.gradeSubmission(
        selectedSubmission._id,
        gradeData
      );
      setShowGradeModal(false);

      const res = await teacherApi.getAssignmentSubmissions(
        assignmentId!
      );
      setSubmissions(res.data);

      alert("Submission graded successfully");
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Failed to grade submission"
      );
    }
  };

  if (loading) return <LoadingSpinner />;

  const statCards = [
    {
      label: "Total Students",
      value: analytics?.totalStudents || 0,
      icon: Users,
      color: "blue",
    },
    {
      label: "Submitted",
      value: analytics?.submitted || 0,
      icon: CheckCircle,
      color: "emerald",
    },
    {
      label: "Pending",
      value: analytics?.pending || 0,
      icon: Clock,
      color: "amber",
    },
    {
      label: "Average Marks",
      value: analytics?.averageMarks || 0,
      icon: TrendingUp,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-purple-50 to-indigo-50 min-h-screen">
      <h1 className="text-4xl font-bold text-purple-700">
        Assignment Submissions
      </h1>

      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className={`bg-gradient-to-br ${
                  colorMap[stat.color]
                } border-2 border-white shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold">
                      {stat.value}
                    </p>
                  </div>
                  <Icon size={32} />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        {submissions.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            No submissions yet
          </div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Student</th>
                <th className="p-3">Submitted</th>
                <th className="p-3">Marks</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s._id} className="border-b">
                  <td className="p-3">
                    {s.student.name}
                  </td>
                  <td className="p-3">
                    {formatDate(s.submittedAt, "PPp")}
                  </td>
                  <td className="p-3">
                    {s.marksObtained ?? "—"}
                  </td>
                  <td className="p-3">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelectedSubmission(s);
                        setGradeData({
                          marksObtained:
                            s.marksObtained || 0,
                          remarks: s.remarks || "",
                        });
                        setShowGradeModal(true);
                      }}
                    >
                      Grade
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal
        isOpen={showGradeModal}
        onClose={() => setShowGradeModal(false)}
        title="Grade Submission"
      >
        {selectedSubmission && (
          <div className="space-y-4">
            <p className="font-semibold">
              {selectedSubmission.student.name}
            </p>

          {selectedSubmission.files?.map((file: any, i: number) => (
  <div
    key={i}
    className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
  >
    <div className="flex items-center gap-2 text-blue-600">
      <FileText size={16} />
      <span className="font-medium">
        {file.fileName}
      </span>
    </div>

    <div className="flex gap-3">
      {/* View PDF */}
      <a
        href={file.fileUrl}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-blue-600 underline"
      >
        View
      </a>

      {/* Download PDF */}
      <a
        href={file.fileUrl}
        download={file.fileName}
        className="text-sm text-emerald-600 underline"
      >
        Download
      </a>
    </div>
  </div>
))}


            <Input
              label="Marks"
              type="number"
              value={gradeData.marksObtained}
              onChange={(e) =>
                setGradeData({
                  ...gradeData,
                  marksObtained: Number(e.target.value),
                })
              }
            />

            <textarea
              className="w-full border rounded p-2"
              rows={3}
              placeholder="Remarks"
              value={gradeData.remarks}
              onChange={(e) =>
                setGradeData({
                  ...gradeData,
                  remarks: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowGradeModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleGrade}>
                Submit Grade
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
