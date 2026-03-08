import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';

interface SidebarItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl border-r-4 border-primary-600 transform transition-all duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b-2 border-secondary-200 lg:hidden flex-shrink-0">
          <h2 className="text-lg font-bold text-secondary-900">Menu</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <X size={24} className="text-secondary-700" />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto flex-1">
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li 
                key={item.path}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <NavLink to={item.path} onClick={onClose}>
  {({ isActive }) => (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-300 group border-2 ${
        isActive
          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-xl scale-105 font-bold border-primary-700'
          : 'text-secondary-700 hover:bg-secondary-100 hover:scale-105 hover:shadow-md active:scale-95 font-semibold border-transparent hover:border-secondary-200'
      }`}
    >
      <span
        className={
          isActive
            ? ''
            : 'group-hover:text-primary-600 transition-colors duration-300'
        }
      >
        {item.icon}
      </span>

      <span>{item.label}</span>
    </div>
  )}
</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};