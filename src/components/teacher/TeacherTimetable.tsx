import React, { useEffect, useState } from "react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Select } from "../common/Select";
import { LoadingSpinner } from "../common/LoadingSpinner";
import * as teacherApi from "@/api/teacher.api";
import { Clock, FileText, Download, CalendarDays, Maximize2 } from "lucide-react";

interface BatchData { _id: string; batchName: string; department: string }
interface Period { periodNumber: number; subject: string; startTime: string; endTime: string }
interface DayTimetable { day: string; periods: Period[] }
interface TimetableDocument {
  _id: string; title: string; fileUrl: string; createdAt: string;
  batchId: { _id: string; batchName: string };
}

const DAY_LABEL: Record<string, string> = {
  MON: "Monday", TUE: "Tuesday", WED: "Wednesday",
  THU: "Thursday", FRI: "Friday", SAT: "Saturday",
};

export const TeacherTimetable: React.FC = () => {
  const [classes, setClasses] = useState<BatchData[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [manualTimetable, setManualTimetable] = useState<DayTimetable[]>([]);
  const [pdfDocs, setPdfDocs] = useState<TimetableDocument[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    teacherApi.getAssignedStudents().then((res) => {
      setClasses(res.data.map((c: any) => ({ _id: c.batchId, batchName: c.batchName, department: c.department })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);
    Promise.all([
      teacherApi.getMyBatchTimetable(selectedClass),
      teacherApi.getMyTimetableDocuments(),
    ]).then(([manualRes, docRes]) => {
      setManualTimetable(manualRes.data || []);
      setPdfDocs((docRes.data as TimetableDocument[]).filter((d) => d.batchId._id === selectedClass));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [selectedClass]);

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gradient-to-br from-neutral-50 to-indigo-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <CalendarDays size={28} className="text-indigo-600" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700">Batch Timetable</h1>
          <p className="text-neutral-500 text-sm">View timetables for your assigned batches</p>
        </div>
      </div>

      {/* BATCH SELECT */}
      <Card>
        <Select
          label="Select Batch"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          options={[
            { value: "", label: "-- Select a Batch --" },
            ...classes.map((c) => ({ value: c._id, label: c.batchName })),
          ]}
        />
      </Card>

      {loading && <LoadingSpinner />}

      {/* PDF TIMETABLE */}
      {!loading && pdfDocs.length > 0 && (
        <Card className="border-2 border-indigo-200">
          <h2 className="text-lg font-semibold text-indigo-600 mb-4 flex items-center gap-2">
            <FileText size={18} /> PDF Timetable
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pdfDocs.map((doc) => (
              <div key={doc._id} className="border rounded-xl p-4 bg-white shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-100 rounded-lg shrink-0">
                    <FileText className="text-indigo-600" size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{doc.title}</h3>
                    <p className="text-xs text-neutral-400">
                      Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="h-56 border rounded-lg overflow-hidden relative group">
                  <iframe src={doc.fileUrl} className="w-full h-full" title={doc.title} />
                  <button
                    onClick={() => window.open(doc.fileUrl, "_blank")}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-lg shadow text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Open fullscreen"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1 flex items-center justify-center gap-2 text-sm"
                    onClick={() => window.open(doc.fileUrl, "_blank")}>
                    <Maximize2 size={14} /> Open Fullscreen
                  </Button>
                  <Button variant="secondary" className="flex-1 flex items-center justify-center gap-2 text-sm"
                    onClick={() => window.open(doc.fileUrl, "_blank")}>
                    <Download size={14} /> Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* MANUAL TIMETABLE */}
      {!loading && pdfDocs.length === 0 && manualTimetable.length > 0 && (
        <Card className="border-2 border-emerald-200">
          <h2 className="text-lg font-semibold text-emerald-600 mb-4 flex items-center gap-2">
            <CalendarDays size={18} /> Manual Timetable
          </h2>
          <div className="space-y-5">
            {manualTimetable.map((day) => (
              <div key={day.day}>
                <h3 className="font-semibold text-base mb-2 text-neutral-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" />
                  {DAY_LABEL[day.day]}
                </h3>
                <div className="space-y-2">
                  {day.periods.map((p) => (
                    <div key={p.periodNumber}
                      className="flex justify-between items-center p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div>
                        <p className="font-semibold text-sm">Period {p.periodNumber} · {p.subject}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500 bg-neutral-50 px-3 py-1 rounded-lg">
                        <Clock size={13} />
                        {p.startTime} – {p.endTime}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* EMPTY STATE */}
      {!loading && selectedClass && pdfDocs.length === 0 && manualTimetable.length === 0 && (
        <Card className="text-center py-12 text-neutral-500">
          <CalendarDays className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
          <p>No timetable available for this batch yet.</p>
        </Card>
      )}

    </div>
  );
};
