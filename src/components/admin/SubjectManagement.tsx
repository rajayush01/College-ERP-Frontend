import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import * as adminApi from '@/api/admin.api';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import { DEPARTMENTS, PROGRAMS, SEMESTERS } from '@/utils/constants';

type Subject = {
  _id: string;
  name: string;
  code: string;
  department?: string;
  program?: string;
  semester?: number;
};

const emptyForm = { name: '', code: '', department: '', program: '', semester: '' };

export const SubjectManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await adminApi.getAllSubjects();
      setSubjects(res.data);
    } catch {
      alert('Failed to load subjects');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      alert('Name and code are required');
      return;
    }
    setLoading(true);
    try {
      await adminApi.createSubject({
        name: formData.name.trim(),
        code: formData.code.trim(),
        department: formData.department || undefined,
        program: formData.program || undefined,
        semester: formData.semester ? parseInt(formData.semester) : undefined,
      });
      setFormData(emptyForm);
      await fetchSubjects();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create subject');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this subject?')) return;
    try {
      await adminApi.deleteSubject(id);
      await fetchSubjects();
    } catch {
      alert('Failed to delete subject');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gradient-to-br from-neutral-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="flex items-center gap-3">
        <BookOpen size={28} className="text-indigo-600" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Subject Management
          </h1>
          <p className="text-neutral-600 text-sm">Add and manage subjects available across the college</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== ADD SUBJECT FORM ===== */}
        <Card title="Add New Subject">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Subject Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Data Structures"
              required
            />
            <Input
              label="Subject Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. CS301"
              required
            />
            <Select
              label="Department (optional)"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              options={[{ value: '', label: '-- All Departments --' }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]}
            />
            <Select
              label="Program (optional)"
              value={formData.program}
              onChange={(e) => setFormData({ ...formData, program: e.target.value })}
              options={[{ value: '', label: '-- All Programs --' }, ...PROGRAMS.map((p) => ({ value: p, label: p }))]}
            />
            <Select
              label="Semester (optional)"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              options={[{ value: '', label: '-- All Semesters --' }, ...SEMESTERS.map((s) => ({ value: s.toString(), label: `Semester ${s}` }))]}
            />
            <Button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2">
              <Plus size={16} />
              {loading ? 'Adding...' : 'Add Subject'}
            </Button>
          </form>
        </Card>

        {/* ===== SUBJECT LIST ===== */}
        <div className="lg:col-span-2">
          <Card title={`All Subjects (${subjects.length})`}>
            {subjects.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                <p className="text-neutral-600">No subjects added yet. Add your first subject.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Code</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Dept</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Sem</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {subjects.map((s) => (
                      <tr key={s._id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-neutral-800">{s.name}</td>
                        <td className="px-4 py-3">
                          <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-mono font-semibold">
                            {s.code}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-neutral-600">{s.department || '—'}</td>
                        <td className="px-4 py-3 text-neutral-600">{s.semester || '—'}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete(s._id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
