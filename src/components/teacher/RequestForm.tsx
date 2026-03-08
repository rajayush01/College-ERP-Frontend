import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import * as teacherApi from '@/api/teacher.api';
import { Plus, Trash2 } from 'lucide-react';

export const TeacherRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'PROFILE_CHANGE',
    reason: '',
    changes: [{ field: '', newValue: '' }],
  });

  const handleAddChange = () => {
    setFormData({ ...formData, changes: [...formData.changes, { field: '', newValue: '' }] });
  };

  const handleRemoveChange = (index: number) => {
    const newChanges = formData.changes.filter((_, i) => i !== index);
    setFormData({ ...formData, changes: newChanges });
  };

  const handleChangeUpdate = (index: number, field: string, value: string) => {
    const newChanges = [...formData.changes];
    newChanges[index] = { ...newChanges[index], [field]: value };
    setFormData({ ...formData, changes: newChanges });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await teacherApi.raiseRequest(formData);
      alert('Request submitted successfully');
      navigate('/teacher/requests');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit request');
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-amber-50 to-orange-50 min-h-screen">
      <div className="animate-slide-up">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">Raise New Request</h1>
        <p className="text-neutral-600">Submit a profile change request for admin approval</p>
      </div>

      <Card className="animate-slide-up shadow-lg border-2 border-white" style={{ animationDelay: '100ms' }}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong className="font-bold">Note:</strong> Profile change requests require admin approval. 
              Your current information will remain unchanged until approved.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Reason for Request <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-50 transition-all duration-200"
              rows={4}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Explain why you need these changes..."
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-neutral-700">
                Changes Requested <span className="text-red-500">*</span>
              </label>
              <Button type="button" variant="secondary" onClick={handleAddChange} className="text-sm flex items-center gap-1">
                <Plus size={16} />
                Add Field
              </Button>
            </div>

            <div className="space-y-3">
              {formData.changes.map((change, index) => (
                <div key={index} className="p-4 bg-neutral-50 rounded-xl border-2 border-neutral-200 hover:border-amber-300 transition-colors">
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-5">
                      <Input placeholder="Field name (e.g., address)" value={change.field} onChange={(e) => handleChangeUpdate(index, 'field', e.target.value)} required />
                    </div>
                    <div className="col-span-6">
                      <Input placeholder="New value" value={change.newValue} onChange={(e) => handleChangeUpdate(index, 'newValue', e.target.value)} required />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      {formData.changes.length > 1 && (
                        <button type="button" onClick={() => handleRemoveChange(index)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-neutral-500 mt-3">
              Common fields: address, phoneNumbers, maritalStatus, husbandName
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <Button type="submit" className="shadow-lg">Submit Request</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/teacher/requests')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};