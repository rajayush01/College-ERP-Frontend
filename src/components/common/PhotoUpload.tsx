import React, { useState, useRef } from 'react';
import { Camera, X, User } from 'lucide-react';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoSelect: (file: File | null) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  currentPhoto,
  onPhotoSelect,
  label = 'Profile Photo',
  size = 'md'
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when currentPhoto changes
  React.useEffect(() => {
    setPreview(currentPhoto || null);
  }, [currentPhoto]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setSelectedFile(file);
      onPhotoSelect(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    setSelectedFile(null);
    onPhotoSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <label className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center cursor-pointer hover:border-indigo-400 transition-colors overflow-hidden bg-neutral-50`}
          onClick={handleClick}
        >
          {preview ? (
            <img
              src={preview}
              alt="Profile preview"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-400">
              <User size={size === 'sm' ? 16 : size === 'md' ? 24 : 32} />
              <span className="text-xs mt-1">Photo</span>
            </div>
          )}
        </div>

        {/* Camera overlay */}
        <div
          className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-1.5 cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg"
          onClick={handleClick}
        >
          <Camera size={12} className="text-white" />
        </div>

        {/* Remove button */}
        {preview && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
          >
            <X size={12} className="text-white" />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="text-center">
        <p className="text-xs text-neutral-500">
          Click to upload photo
        </p>
        <p className="text-xs text-neutral-400">
          JPEG, PNG, GIF up to 5MB
        </p>
      </div>

      {selectedFile && (
        <div className="text-center">
          <p className="text-xs text-green-600">
            ✓ {selectedFile.name} selected
          </p>
          <p className="text-xs text-neutral-500">
            ({Math.round(selectedFile.size / 1024)} KB)
          </p>
        </div>
      )}
    </div>
  );
};