import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
  loading?: boolean;
  searchable?: boolean;
}


export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  loading,
  searchable,
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
      <select
        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 bg-white appearance-none cursor-pointer ${
          error 
            ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-200' 
            : 'border-secondary-300 focus:border-primary-600 focus:ring-primary-200 hover:border-secondary-400'
        } ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231E293B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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