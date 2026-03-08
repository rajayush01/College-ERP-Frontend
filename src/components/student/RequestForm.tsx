import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import * as studentApi from '@/api/student.api';

export const StudentRequestForm: React.FC = () => {
  const [formData, setFormData] = useState({
    type: 'PROFILE_CHANGE',
    reason: '',
    changes: [{ field: '', newValue: '' }],
  });

  const handleAddChange = () => {
    setFormData({
      ...formData,
      changes: [...formData.changes, { field: '', newValue: '' }],
    });
  };

  const handleChangeUpdate = (index: number, field: string, value: string) => {
    const newChanges = [...formData.changes];
    newChanges[index] = { ...newChanges[index], [field]: value };
    setFormData({ ...formData, changes: newChanges });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await studentApi.raiseRequest(formData);
      alert('Request submitted successfully');
      setFormData({
        type: 'PROFILE_CHANGE',
        reason: '',
        changes: [{ field: '', newValue: '' }],
      });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit request');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Raise Request</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              className="input-field"
              rows={3}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Changes</label>
              <Button type="button" variant="secondary" onClick={handleAddChange} className="text-sm">
                Add Field
              </Button>
            </div>

            {formData.changes.map((change, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 mb-3">
                <Input
                  placeholder="Field name (e.g., address)"
                  value={change.field}
                  onChange={(e) => handleChangeUpdate(index, 'field', e.target.value)}
                  required
                />
                <Input
                  placeholder="New value"
                  value={change.newValue}
                  onChange={(e) => handleChangeUpdate(index, 'newValue', e.target.value)}
                  required
                />
              </div>
            ))}
          </div>

          <Button type="submit">Submit Request</Button>
        </form>
      </Card>
    </div>
  );
};