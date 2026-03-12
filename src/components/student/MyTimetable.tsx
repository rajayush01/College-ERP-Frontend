import React, { useCallback, useEffect, useState } from "react";
import { Card } from "../common/Card";
import { LoadingSpinner } from "../common/LoadingSpinner";
import * as studentApi from "@/api/student.api";
import { DAYS } from "@/utils/constants";

type TimetableDoc = {
  _id: string;
  title: string;
  fileUrl: string;
  createdAt: string;
};

export const MyTimetable: React.FC = () => {
  const [timetable, setTimetable] = useState<any[]>([]);
  const [documents, setDocuments] = useState<TimetableDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"timetable" | "documents">(
    "timetable"
  );
  const [previewDoc, setPreviewDoc] = useState<TimetableDoc | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

const getPreviewUrl = (fileUrl: string) => {
  const fullUrl = `${API_BASE_URL}${fileUrl}`;
  const isPdf = fileUrl.toLowerCase().endsWith(".pdf");

  // If running locally, Google Viewer WILL NOT work
  const isLocalhost =
    API_BASE_URL.includes("localhost") ||
    API_BASE_URL.includes("127.0.0.1");

  if (!isPdf) return fullUrl;

  return isLocalhost
    ? `${fullUrl}#toolbar=0`
    : `https://docs.google.com/gview?url=${encodeURIComponent(
        fullUrl
      )}&embedded=true`;
};


  const fetchData = useCallback(async () => {
    try {
      const [timetableRes, documentsRes] = await Promise.all([
        studentApi.getMyTimetable(),
        studentApi.getMyTimetableDocuments(),
      ]);

      setTimetable(timetableRes.data?.timetable || []);
      setDocuments(documentsRes.data || []);
    } catch (error) {
      console.error("Failed to fetch timetable data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-secondary-900">My Timetable</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b-2 border-secondary-300">
        <button
          onClick={() => setActiveTab("timetable")}
          className={`pb-2 font-bold border-b-4 transition-all duration-200 ${
            activeTab === "timetable"
              ? "border-primary-600 text-primary-700"
              : "border-transparent text-secondary-600 hover:text-secondary-900"
          }`}
        >
          Timetable
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`pb-2 font-bold border-b-4 transition-all duration-200 ${
            activeTab === "documents"
              ? "border-primary-600 text-primary-700"
              : "border-transparent text-secondary-600 hover:text-secondary-900"
          }`}
        >
          Documents
        </button>
      </div>

      {/* 🗓 Timetable Tab */}
      {activeTab === "timetable" && (
        <>
          {timetable.length === 0 ? (
            <Card className="shadow-xl border-2 border-secondary-300">
              <p className="text-secondary-600 text-center font-semibold">
                No timetable available
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {DAYS.map((day) => {
                const daySchedule = timetable.find((t) => t.day === day);
                if (!daySchedule?.periods?.length) return null;

                return (
                  <Card key={day} title={day} className="shadow-xl border-2 border-secondary-300 border-l-4 border-l-primary-600">
                    <div className="overflow-x-auto rounded-lg border-2 border-secondary-300">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gradient-to-r from-secondary-800 to-secondary-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-white font-bold">Period</th>
                            <th className="px-4 py-3 text-left text-white font-bold">Subject</th>
                            <th className="px-4 py-3 text-left text-white font-bold">Teacher</th>
                            <th className="px-4 py-3 text-left text-white font-bold">Time</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-secondary-200">
                          {[...daySchedule.periods]
                            .sort(
                              (a, b) =>
                                a.periodNumber - b.periodNumber
                            )
                            .map((period: any) => (
                              <tr
                                key={`${day}-${period.periodNumber}`}
                                className="hover:bg-primary-50 border-l-4 border-transparent hover:border-primary-600 transition-all duration-200"
                              >
                                <td className="px-4 py-3 text-secondary-900 font-bold">
                                  {period.periodNumber}
                                </td>
                                <td className="px-4 py-3 text-secondary-800 font-semibold">
                                  {period.subject}
                                </td>
                                <td className="px-4 py-3 text-secondary-700 font-medium">
                                  {period.teacher?.name || "—"}
                                </td>
                                <td className="px-4 py-3 text-secondary-700 font-medium">
                                  {period.startTime} –{" "}
                                  {period.endTime}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* 📄 Documents Tab */}
      {activeTab === "documents" && (
        <>
          {documents.length === 0 ? (
            <Card className="shadow-xl border-2 border-secondary-300">
              <p className="text-secondary-600 text-center font-semibold">
                No timetable documents uploaded
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <Card key={doc._id} className="shadow-xl border-2 border-secondary-300 border-l-4 border-l-primary-600 hover:shadow-2xl transition-all duration-300">
                  <div className="space-y-3">
                    <h3 className="font-bold text-secondary-900">
                      {doc.title || "Timetable Document"}
                    </h3>

                    <p className="text-xs text-secondary-600 font-medium">
                      Uploaded on{" "}
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="text-primary-700 text-sm font-bold hover:text-primary-800 transition-colors"
                      >
                        Preview
                      </button>

                      <a
                        href={`${API_BASE_URL}${doc.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary-700 text-sm font-semibold hover:text-secondary-900 transition-colors"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* 🔍 Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white w-full max-w-6xl h-[85vh] rounded-lg shadow-lg relative">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>
           <iframe
  src={getPreviewUrl(previewDoc.fileUrl)}
  className="w-full h-full"
  title="Timetable PDF Preview"
  frameBorder="0"
/>

          </div>
        </div>
      )}
    </div>
  );
};
