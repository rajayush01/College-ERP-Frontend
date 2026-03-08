import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClass = 'rounded-lg font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 shadow-lg hover:shadow-2xl inline-flex items-center justify-center gap-2 border-2';
  
  const sizes = {
    sm: 'px-4 py-2 text-xs sm:text-sm',
    md: 'px-6 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base',
    lg: 'px-7 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg',
  };
  
  const variants = {
    primary: 'bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white border-primary-700 hover:from-primary-500 hover:via-primary-600 hover:to-primary-800 focus:ring-4 focus:ring-primary-300 hover:-translate-y-0.5',
    secondary: 'bg-secondary-800 text-white border-secondary-700 hover:bg-secondary-700 hover:border-secondary-600 focus:ring-4 focus:ring-secondary-300 hover:-translate-y-0.5',
    danger: 'bg-gradient-to-br from-danger-500 via-danger-400 to-danger-600 text-white border-danger-600 hover:from-danger-400 hover:via-danger-500 hover:to-danger-700 focus:ring-4 focus:ring-danger-300 hover:-translate-y-0.5',
  };

  return (
    <button
      className={`${baseClass} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="hidden sm:inline">Loading...</span>
          <span className="sm:hidden">...</span>
        </>
      ) : children}
    </button>
  );
};