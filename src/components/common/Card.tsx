import React, { ReactNode } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  actions,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`bg-white w-[300px] md:w-full rounded-lg shadow-xl border-l-4 border-primary-600 p-3 sm:p-4 md:p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-in ${className}`}
    >
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b-2 border-secondary-200">
          {title && (
            <h3 className="text-base sm:text-lg font-bold text-secondary-900">
              {title}
            </h3>
          )}
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      )}

      <div className="text-secondary-700 text-sm sm:text-base">
        {children}
      </div>
    </div>
  );
};