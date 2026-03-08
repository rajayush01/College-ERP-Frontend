import React, { useRef, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';

interface MultiFileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  onChange: (files: File[]) => void;
  error?: string;
  files?: File[];
}

export const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  label,
  accept = '*',
  multiple = false,
  maxFiles = 5,
  onChange,
  error,
  files = [],
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (multiple) {
      const newFiles = [...files, ...selectedFiles].slice(0, maxFiles);
      onChange(newFiles);
    } else {
      onChange(selectedFiles.slice(0, 1));
    }
    
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (multiple) {
      const newFiles = [...files, ...droppedFiles].slice(0, maxFiles);
      onChange(newFiles);
    } else {
      onChange(droppedFiles.slice(0, 1));
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className="mb-4 animate-slide-up">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}
      
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-primary bg-primary-50 scale-105 shadow-lg'
            : error 
            ? 'border-danger-light hover:border-danger hover:bg-danger-50' 
            : 'border-neutral-300 hover:border-primary hover:bg-primary-50'
        }`}
      >
        <div className={`mx-auto h-16 w-16 mb-3 rounded-full flex items-center justify-center transition-all duration-300 ${
          isDragging 
            ? 'bg-primary text-white scale-110' 
            : 'bg-neutral-100 text-neutral-400 group-hover:bg-primary-100'
        }`}>
          <Upload className="h-8 w-8" />
        </div>
        <p className="text-base font-medium text-neutral-700 mb-1">
          Click to upload or drag and drop
        </p>
        <p className="text-sm text-neutral-500">
          {accept === '*' ? 'Any file type' : accept.split(',').join(', ')}
          {multiple && ` (Max ${maxFiles} files)`}
        </p>
      </div>
      
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      
      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-neutral-500" />
                <span className="text-sm text-neutral-700">{file.name}</span>
                <span className="text-xs text-neutral-500">
                  ({Math.round(file.size / 1024)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <p className="mt-1.5 text-sm text-danger flex items-center gap-1 animate-slide-up">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};