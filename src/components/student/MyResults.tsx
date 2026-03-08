import React, { useEffect, useState } from "react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { LoadingSpinner } from "../common/LoadingSpinner";
import * as studentApi from "@/api/student.api";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/formatters";
import { Eye } from "lucide-react";

export const MyResults: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      console.log("📘 Fetching published results…");
      const res = await studentApi.getMyResults();

      // Backend already filters by PUBLISHED,
      // this is just a defensive fallback
      const publishedOnly = (res.data || []).filter(
        (r: any) => r && r.examId
      );

      console.log(
        "✅ Published results received:",
        publishedOnly
      );

      setResults(publishedOnly);
    } catch (error) {
      console.error("❌ Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-secondary-900">My Results</h1>

      {results.length === 0 ? (
        <Card className="text-center shadow-xl border-2 border-secondary-300">
          <p className="text-secondary-600 font-semibold">
            No published results available
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((result) => {
            const percentage =
              result.percentage !== null
                ? `${result.percentage}%`
                : "—";

            return (
              <Card key={result.examId} className="space-y-4 shadow-xl border-2 border-secondary-300 border-l-4 border-l-primary-600 hover:shadow-2xl transition-all duration-300">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-secondary-900">
                      {result.examName}
                    </h3>
                    <span
                      className={`inline-block mt-1 text-xs px-3 py-1 rounded-lg font-bold border ${
                        result.examType === "MAJOR"
                          ? "bg-primary-100 text-primary-800 border-primary-300"
                          : "bg-success-100 text-success-800 border-success-300"
                      }`}
                    >
                      {result.examType}
                    </span>
                  </div>

                  <Button
                    variant="secondary"
                    onClick={() =>
                      navigate(
                        `/student/results/${result.examId}`
                      )
                    }
                    className="flex items-center gap-2"
                  >
                    <Eye size={16} />
                    View
                  </Button>
                </div>

                {/* Summary */}
                <div className="bg-secondary-50 p-4 rounded-lg border-2 border-secondary-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-secondary-700 font-semibold">
                      Total Marks
                    </span>
                    <span className="font-bold text-secondary-900">
                      {result.totalObtained} / {result.totalMax}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-secondary-700 font-semibold">
                      Percentage
                    </span>
                    <span className="font-bold text-success-700 text-lg">
                      {percentage}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                {result.publishedAt && (
                  <p className="text-xs text-secondary-600 font-medium">
                    Published on{" "}
                    {formatDate(result.publishedAt, "PPp")}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
