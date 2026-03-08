import React from 'react';

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4 animate-slide-up">
      {label && (
        <label className="block text-sm font-bold text-secondary-800 mb-2">
          {label}
        </label>
      )}
      <input
        type="date"
        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 bg-white ${
          error 
            ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-200' 
            : 'border-secondary-300 focus:border-primary-600 focus:ring-primary-200 hover:border-secondary-400'
        } ${className}`}
        {...props}
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