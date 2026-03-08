import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center py-16 space-y-4 animate-fade-in">
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-secondary-200 rounded-full"></div>
        {/* Spinning ring with gradient */}
        <div className="absolute inset-0 border-4 border-transparent border-t-primary-600 border-r-primary-500 rounded-full animate-spin"></div>
        {/* Inner pulse */}
        <div className="absolute inset-2 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full animate-pulse opacity-30"></div>
      </div>
      <p className="text-secondary-800 font-bold">Loading...</p>
    </div>
  );
};