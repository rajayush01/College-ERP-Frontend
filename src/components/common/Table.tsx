import React, { ReactNode } from 'react';

interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  mobileCardView?: boolean; // Option to use card view on mobile instead of horizontal scroll
}

export const Table: React.FC<TableProps> = ({ 
  columns, 
  data, 
  loading,
  mobileCardView = false 
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-3 sm:space-y-4">
        <div className="relative w-12 h-12 sm:w-16 sm:h-16">
          <div className="absolute inset-0 border-4 border-secondary-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary-600 border-r-primary-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-secondary-800 font-bold text-sm sm:text-base">Loading data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-2 sm:space-y-3">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary-100 rounded-full flex items-center justify-center border-2 border-secondary-300">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-secondary-600 font-bold text-sm sm:text-base">No data available</p>
      </div>
    );
  }

  // Mobile card view (optional alternative to scrolling table)
  if (mobileCardView) {
    return (
      <>
        {/* Mobile Card View */}
        <div className="lg:hidden space-y-3">
          {data.map((row, idx) => (
            <div 
              key={idx}
              className="bg-white border-2 border-secondary-300 rounded-lg p-3 shadow-lg hover:shadow-2xl transition-all duration-300 animate-slide-up hover:scale-[1.02] border-l-4 border-l-primary-600"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              {columns.map((column) => (
                <div key={column.key} className="flex justify-between items-start py-2 border-b border-secondary-200 last:border-b-0">
                  <span className="text-xs font-bold text-secondary-700 uppercase mr-2">
                    {column.header}:
                  </span>
                  <span className="text-sm text-secondary-800 text-right flex-1 font-semibold">
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto rounded-lg border-2 border-secondary-300 shadow-xl">
          <table className="min-w-full divide-y-2 divide-secondary-300">
            <thead className="bg-gradient-to-r from-secondary-800 to-secondary-700">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {data.map((row, idx) => (
                <tr 
                  key={idx} 
                  className="hover:bg-primary-50 transition-all duration-300 animate-slide-up hover:scale-[1.01] border-l-4 border-transparent hover:border-primary-600"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-secondary-800 font-medium">
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  // Standard responsive table with horizontal scroll
  return (
    <div className="overflow-x-auto rounded-lg border-2 border-secondary-300 shadow-xl">
      <table className="min-w-full divide-y-2 divide-secondary-300">
        <thead className="bg-gradient-to-r from-secondary-800 to-secondary-700">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-secondary-200">
          {data.map((row, idx) => (
            <tr 
              key={idx} 
              className="hover:bg-primary-50 transition-all duration-300 animate-slide-up border-l-4 border-transparent hover:border-primary-600"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-secondary-800 font-medium">
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};