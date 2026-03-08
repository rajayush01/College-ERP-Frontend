import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto animate-fade-in">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-secondary-900/60 backdrop-blur-md transition-opacity" 
          onClick={onClose} 
        />
        
        <div className={`relative bg-white rounded-xl shadow-2xl ${sizes[size]} w-full animate-scale-in border-2 border-secondary-300`}>
          <div className="flex items-center justify-between p-6 border-b-2 border-secondary-200 bg-secondary-50">
            <h3 className="text-xl font-bold text-secondary-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-secondary-500 hover:text-secondary-700 transition-all duration-300 hover:bg-secondary-200 p-2 rounded-lg hover:scale-110 active:scale-95"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 text-secondary-800">{children}</div>
        </div>
      </div>
    </div>
  );
};