import React, { useEffect, useState } from "react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Select } from "../common/Select";
import { LoadingSpinner } from "../common/LoadingSpinner";
import * as teacherApi from "@/api/teacher.api";
import {
  Clock,
  FileText,
  Download,
  CalendarDays,
} from "lucide-react";

/* ----------------------- INTERFACES ----------------------- */

interface BatchData {
  _id: string;
  batchName: string;
  department: string;
}

interface Period {
  periodNumber: number;
  subject: string;
  startTime: string;
  endTime: string;
  teacher?: {
    name: string;
  };
}

interface DayTimetable {
  day: string;
  periods: Period[];
}

interface TimetableDocument {
  _id: string;
  title: string;
  fileUrl: string;
  createdAt: string;
  batchId: {
    _id: string;
    batchName: string;
  };
}

/* ----------------------- CONSTANTS ----------------------- */

const DAY_LABEL: Record<string, string> = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
};

/* -------------------------------------------------------- */

export const TeacherTimetable: React.FC = () => {
  const [classes, setClasses] = useState<BatchData[]>([]);
  const [selectedClass, setSelectedClass] = useState("");

  const [manualTimetable, setManualTimetable] = useState<DayTimetable[]>([]);
  const [pdfDocs, setPdfDocs] = useState<TimetableDocument[]>([]);

  const [loading, setLoading] = useState(false);

  /* ------------------ LOAD ASSIGNED BATCHES ------------------ */
  useEffect(() => {
    console.log("📘 Fetching teacher batches via getAssignedStudents...");

    teacherApi
      .getAssignedStudents()
      .then((res) => {
        console.log("📘 Assigned batches response:", res.data);

        const mapped: BatchData[] = res.data.map((c: {
          batchId: string;
          batchName: string;
          department: string;
        }) => ({
          _id: c.batchId,
          batchName: c.batchName,
          department: c.department,
        }));

        setClasses(mapped);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch assigned batches", err);
      });
  }, []);

  /* ------------------ LOAD TIMETABLE ------------------ */
  useEffect(() => {
    if (!selectedClass) return;

    console.log("🗓️ Loading timetable for class:", selectedClass);
    setLoading(true);

    Promise.all([
      teacherApi.getMyBatchTimetable(selectedClass),
      teacherApi.getMyTimetableDocuments(),
    ])
      .then(([manualRes, docRes]) => {
        console.log("📘 Manual timetable:", manualRes.data);
        console.log("📄 Timetable documents:", docRes.data);

        setManualTimetable(manualRes.data || []);

        const filteredDocs = (docRes.data as TimetableDocument[]).filter(
          (d) => d.batchId._id === selectedClass
        );

        console.log("✅ Filtered PDFs:", filteredDocs);
        setPdfDocs(filteredDocs);
      })
      .catch((err) => {
        console.error("❌ Timetable load failed", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedClass]);

  /* -------------------------------------------------------- */

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 to-indigo-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <CalendarDays size={28} className="text-indigo-600" />
        <h1 className="text-3xl font-bold text-indigo-700">
          My Timetable
        </h1>
      </div>

      {/* CLASS SELECT */}
      <Card>
        <Select
          label="Select Batch"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          options={classes.map((c) => ({
            value: c._id,
            label: c.batchName,
          }))}
        />
      </Card>

      {/* LOADER */}
      {loading && <LoadingSpinner />}

      {/* ================= PDF TIMETABLE ================= */}
      {!loading && pdfDocs.length > 0 && (
        <Card className="border-2 border-indigo-200">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">
            📄 Timetable (PDF)
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {pdfDocs.map((doc) => (
              <div
                key={doc._id}
                className="border rounded-xl p-4 bg-white shadow-sm"
              >
                <div className="flex gap-3 items-start">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <FileText className="text-indigo-600" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold">{doc.title}</h3>
                    <p className="text-xs text-neutral-400">
                      Uploaded on{" "}
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* PDF PREVIEW */}
                <div className="mt-4 h-72 border rounded-lg overflow-hidden">
                  <iframe
                    src={doc.fileUrl}
                    className="w-full h-full"
                    title="Timetable PDF Preview"
                  />
                </div>

                <Button
                  variant="secondary"
                  className="w-full mt-4"
                  onClick={() =>
                    window.open(
                      doc.fileUrl,
                      "_blank"
                    )
                  }
                >
                  <Download size={16} />
                  Download PDF
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= MANUAL TIMETABLE ================= */}
      {!loading && pdfDocs.length === 0 && manualTimetable.length > 0 && (
        <Card className="border-2 border-emerald-200">
          <h2 className="text-xl font-semibold text-emerald-600 mb-4">
            🗓️ Manual Timetable
          </h2>

          <div className="space-y-6">
            {manualTimetable.map((day) => (
              <div key={day.day}>
                <h3 className="font-semibold text-lg mb-3 text-neutral-700">
                  {DAY_LABEL[day.day]}
                </h3>

                <div className="space-y-3">
                  {day.periods.map((p) => (
                    <div
                      key={p.periodNumber}
                      className="flex justify-between items-center p-3 bg-white border rounded-lg shadow-sm"
                    >
                      <div>
                        <p className="font-semibold">
                          Period {p.periodNumber} · {p.subject}
                        </p>
                        {p.teacher && (
                          <p className="text-sm text-neutral-500">
                            {p.teacher.name}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Clock size={14} />
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

      {/* ================= EMPTY STATE ================= */}
      {!loading &&
        selectedClass &&
        pdfDocs.length === 0 &&
        manualTimetable.length === 0 && (
          <Card className="text-center py-12 text-neutral-500">
            No timetable available for this class
          </Card>
        )}
    </div>
  );
};
