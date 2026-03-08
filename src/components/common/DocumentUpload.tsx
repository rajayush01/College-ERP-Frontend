import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { Button } from './Button';
import { Input } from './Input';
import { X, FileText } from 'lucide-react';

interface DocumentUploadProps {
  onUpload: (file: File, title: string) => Promise<void>;
  accept?: string;
  label?: string;
  titleLabel?: string;
  uploadButtonText?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUpload,
  accept = 'application/pdf',
  label = 'Upload Document',
  titleLabel = 'Document Title',
  uploadButtonText = 'Upload',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError('');
    
    // Auto-generate title from filename if empty
    if (!title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setTitle(nameWithoutExt);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      setError('Please select a file and enter a title');
      return;
    }

    try {
      setUploading(true);
      setError('');
      await onUpload(selectedFile, title.trim());
      
      // Reset form
      setSelectedFile(null);
      setTitle('');
    } catch (error: any) {
      setError(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setTitle('');
    setError('');
  };

  return (
    <div className="space-y-4 p-4 bg-neutral-50 rounded-lg border">
      <h3 className="font-medium text-neutral-800">{label}</h3>
      
      {!selectedFile ? (
        <FileUpload
          accept={accept}
          onChange={handleFileSelect}
          error={error}
        />
      ) : (
        <div className="space-y-4">
          {/* Selected File Display */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-neutral-500" />
              <span className="text-sm text-neutral-700">{selectedFile.name}</span>
              <span className="text-xs text-neutral-500">
                ({Math.round(selectedFile.size / 1024)} KB)
              </span>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Title Input */}
          <Input
            label={titleLabel}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title"
            required
          />

          {/* Upload Button */}
          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={uploading || !title.trim()}
            >
              {uploading ? 'Uploading...' : uploadButtonText}
            </Button>
            <Button
              variant="secondary"
              onClick={clearFile}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};