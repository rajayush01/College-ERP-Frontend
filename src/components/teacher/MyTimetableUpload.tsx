import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import * as teacherApi from '@/api/teacher.api';
import { Plus, Trash2, Upload, CalendarDays, FileText, Maximize2, X } from 'lucide-react';
import { DAYS } from '@/utils/constants';

const DAY_LABEL: Record<string, string> = {
  MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday',
  THU: 'Thursday', FRI: 'Friday', SAT: 'Saturday',
};

type Period = { periodNumber: number; subject: string; startTime: string; endTime: string; room: string };
type DaySchedule = { day: string; periods: Period[] };
type PersonalTimetable = {
  _id: string; title: string; type: 'PDF' | 'MANUAL';
  fileUrl?: string; schedule?: DaySchedule[]; createdAt: string;
};

const emptyPeriod = (): Period => ({
  periodNumber: 1, subject: '', startTime: '09:00', endTime: '09:45', room: '',
});

export const MyTimetableUpload: React.FC = () => {
  const [mode, setMode] = useState<'PDF' | 'MANUAL'>('PDF');
  const [timetables, setTimetables] = useState<PersonalTimetable[]>([]);
  const [loading, setLoading] = useState(false);

  // PDF form
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfTitle, setPdfTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  // Manual form
  const [manualTitle, setManualTitle] = useState('');
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: 'MON', periods: [{ ...emptyPeriod() }] },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    setLoading(true);
    try {
      const res = await teacherApi.getMyPersonalTimetables();
      setTimetables(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  /* ===== PDF UPLOAD ===== */
  const handlePdfUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) return alert('Please select a PDF file');
    if (!pdfTitle.trim()) return alert('Please enter a title');
    setUploading(true);
    try {
      await teacherApi.uploadPersonalTimetablePDF(pdfFile, pdfTitle.trim());
      setPdfFile(null);
      setPdfTitle('');
      await fetchTimetables();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  /* ===== MANUAL SCHEDULE ===== */
  const addDay = () => {
    const usedDays = schedule.map((s) => s.day);
    const next = DAYS.find((d) => !usedDays.includes(d));
    if (!next) return alert('All days already added');
    setSchedule([...schedule, { day: next, periods: [{ ...emptyPeriod() }] }]);
  };

  const removeDay = (idx: number) =>
    setSchedule(schedule.filter((_, i) => i !== idx));

  const addPeriod = (dayIdx: number) => {
    const updated = [...schedule];
    const next = updated[dayIdx].periods.length + 1;
    updated[dayIdx].periods.push({ ...emptyPeriod(), periodNumber: next });
    setSchedule(updated);
  };

  const removePeriod = (dayIdx: number, pIdx: number) => {
    const updated = [...schedule];
    updated[dayIdx].periods = updated[dayIdx].periods.filter((_, i) => i !== pIdx);
    setSchedule(updated);
  };

  const updatePeriod = (dayIdx: number, pIdx: number, field: keyof Period, value: string) => {
    const updated = [...schedule];
    (updated[dayIdx].periods[pIdx] as any)[field] = value;
    setSchedule(updated);
  };

  const updateDay = (dayIdx: number, day: string) => {
    const updated = [...schedule];
    updated[dayIdx].day = day;
    setSchedule(updated);
  };

  const handleSaveManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return alert('Please enter a title');
    const hasEmpty = schedule.some((d) =>
      d.periods.some((p) => !p.subject.trim() || !p.startTime || !p.endTime)
    );
    if (hasEmpty) return alert('Please fill in all period details');
    setSaving(true);
    try {
      await teacherApi.savePersonalTimetableManual({ title: manualTitle.trim(), schedule });
      setManualTitle('');
      setSchedule([{ day: 'MON', periods: [{ ...emptyPeriod() }] }]);
      await fetchTimetables();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this timetable?')) return;
    try {
      await teacherApi.deletePersonalTimetable(id);
      await fetchTimetables();
    } catch {
      alert('Failed to delete');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gradient-to-br from-neutral-50 via-indigo-50 to-purple-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <CalendarDays size={28} className="text-indigo-600" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            My Timetable
          </h1>
          <p className="text-neutral-600 text-sm">Create or upload your personal teaching schedule</p>
        </div>
      </div>

      {/* MODE TOGGLE */}
      <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border w-fit">
        {(['PDF', 'MANUAL'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === m
                ? 'bg-indigo-600 text-white shadow'
                : 'text-neutral-600 hover:text-indigo-600'
            }`}
          >
            {m === 'PDF' ? '📄 Upload PDF' : '✏️ Create Manually'}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ===== LEFT: FORM ===== */}
        <div>
          {mode === 'PDF' ? (
            <Card title="Upload PDF Timetable">
              <form onSubmit={handlePdfUpload} className="space-y-4">
                <Input
                  label="Title"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  placeholder="e.g. Semester 5 Timetable"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    PDF File
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-300 rounded-xl cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-colors">
                    <Upload size={24} className="text-indigo-500 mb-2" />
                    <span className="text-sm text-indigo-600 font-medium">
                      {pdfFile ? pdfFile.name : 'Click to select PDF'}
                    </span>
                    <span className="text-xs text-neutral-400 mt-1">PDF only, max 10MB</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
                <Button type="submit" disabled={uploading} className="w-full flex items-center justify-center gap-2">
                  <Upload size={16} />
                  {uploading ? 'Uploading...' : 'Upload Timetable'}
                </Button>
              </form>
            </Card>
          ) : (
            <Card title="Create Manual Timetable">
              <form onSubmit={handleSaveManual} className="space-y-5">
                <Input
                  label="Title"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g. My Weekly Schedule"
                  required
                />

                {schedule.map((dayEntry, dayIdx) => (
                  <div key={dayIdx} className="border-2 border-indigo-100 rounded-xl p-4 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <Select
                        label="Day"
                        value={dayEntry.day}
                        onChange={(e) => updateDay(dayIdx, e.target.value)}
                        options={DAYS.map((d) => ({ value: d, label: DAY_LABEL[d] }))}
                      />
                      <button
                        type="button"
                        onClick={() => removeDay(dayIdx)}
                        className="ml-3 mt-5 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {dayEntry.periods.map((period, pIdx) => (
                      <div key={pIdx} className="bg-indigo-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-indigo-700">Period {pIdx + 1}</span>
                          {dayEntry.periods.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePeriod(dayIdx, pIdx)}
                              className="text-red-400 hover:text-red-600 p-1 rounded"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            label="Subject"
                            value={period.subject}
                            onChange={(e) => updatePeriod(dayIdx, pIdx, 'subject', e.target.value)}
                            placeholder="e.g. Data Structures"
                            required
                          />
                          <Input
                            label="Room (optional)"
                            value={period.room}
                            onChange={(e) => updatePeriod(dayIdx, pIdx, 'room', e.target.value)}
                            placeholder="e.g. Lab 3"
                          />
                          <Input
                            type="time"
                            label="Start Time"
                            value={period.startTime}
                            onChange={(e) => updatePeriod(dayIdx, pIdx, 'startTime', e.target.value)}
                            required
                          />
                          <Input
                            type="time"
                            label="End Time"
                            value={period.endTime}
                            onChange={(e) => updatePeriod(dayIdx, pIdx, 'endTime', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addPeriod(dayIdx)}
                      className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      <Plus size={14} /> Add Period
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addDay}
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium border-2 border-dashed border-indigo-300 rounded-xl px-4 py-3 w-full justify-center hover:bg-indigo-50 transition-colors"
                >
                  <Plus size={16} /> Add Another Day
                </button>

                <Button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2">
                  <CalendarDays size={16} />
                  {saving ? 'Saving...' : 'Save Timetable'}
                </Button>
              </form>
            </Card>
          )}
        </div>

        {/* ===== RIGHT: SAVED TIMETABLES ===== */}
        <div>
          <Card title={`Saved Timetables (${timetables.length})`}>
            {loading ? (
              <p className="text-neutral-500 text-sm text-center py-8">Loading...</p>
            ) : timetables.length === 0 ? (
              <div className="text-center py-12">
                <CalendarDays className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
                <p className="text-neutral-500 text-sm">No timetables yet. Create one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {timetables.map((tt) => (
                  <div key={tt._id} className="border-2 border-neutral-100 rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg shrink-0 ${tt.type === 'PDF' ? 'bg-red-100' : 'bg-indigo-100'}`}>
                          {tt.type === 'PDF'
                            ? <FileText size={18} className="text-red-600" />
                            : <CalendarDays size={18} className="text-indigo-600" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-800 truncate">{tt.title}</p>
                          <p className="text-xs text-neutral-400">
                            {tt.type} · {new Date(tt.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {tt.type === 'PDF' && tt.fileUrl && (
                          <button
                            onClick={() => window.open(tt.fileUrl, '_blank')}
                            className="p-2 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Open fullscreen"
                          >
                            <Maximize2 size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(tt._id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Manual preview inline */}
                    {tt.type === 'MANUAL' && tt.schedule && (
                      <div className="mt-3 space-y-2">
                        {tt.schedule.map((day) => (
                          <div key={day.day} className="text-xs">
                            <span className="font-semibold text-indigo-700">{DAY_LABEL[day.day]}: </span>
                            <span className="text-neutral-600">
                              {day.periods.map((p) => `${p.subject} (${p.startTime}–${p.endTime})`).join(' · ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* PDF thumbnail */}
                    {tt.type === 'PDF' && tt.fileUrl && (
                      <div className="mt-3 h-40 rounded-lg overflow-hidden border">
                        <iframe src={tt.fileUrl} className="w-full h-full" title={tt.title} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ===== FULLSCREEN VIEWER ===== */}
    </div>
  );
};

/* ===== FULLSCREEN VIEWER ===== */
