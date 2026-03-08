import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  label?: string;
  accept?: string;
  onChange: (file: File) => void;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = '*',
  onChange,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className="mb-4 animate-slide-up">
      {label && (
        <label className="block text-sm font-bold text-secondary-800 mb-2">
          {label}
        </label>
      )}
      
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-primary-600 bg-primary-50 scale-105 shadow-2xl'
            : error 
            ? 'border-danger-400 hover:border-danger-500 hover:bg-danger-50' 
            : 'border-secondary-400 hover:border-primary-600 hover:bg-primary-50'
        }`}
      >
        <div className={`mx-auto h-16 w-16 mb-3 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
          isDragging 
            ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white scale-110 border-primary-700' 
            : 'bg-secondary-100 text-secondary-600 group-hover:bg-primary-200 border-secondary-300'
        }`}>
          <Upload className="h-8 w-8" />
        </div>
        <p className="text-base font-bold text-secondary-800 mb-1">
          Click to upload or drag and drop
        </p>
        <p className="text-sm text-secondary-600 font-medium">
          {accept === '*' ? 'Any file type' : accept.split(',').join(', ')}
        </p>
      </div>
      
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      
      {error && (
        <p className="mt-1.5 text-sm text-danger-600 font-semibold flex items-center gap-1 animate-slide-up">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};