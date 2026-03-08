import React, { useState } from 'react';
import { Bell, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNotificationsPath = () => {
    if (!user?.role) return '/login';
    const role = user.role.toLowerCase();
    return `/${role}/notifications`;
  };

  const getProfilePath = () => {
    if (!user?.role) return '/login';
    const role = user.role.toLowerCase();
    return `/${role}/profile`;
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-primary-600 px-6 py-4 flex items-center justify-between sticky top-0 z-[60]">
      <div className="flex items-center gap-4">
        <button
  onClick={() => onMenuClick?.()}
          className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Menu size={24} className="text-secondary-700" />
        </button>
        <h1 className="text-xl font-bold text-secondary-900">
          College Management System
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            console.log('🔔 [Navbar] Notification clicked, user role:', user?.role);
            const path = getNotificationsPath();
            console.log('🔔 [Navbar] Navigating to:', path);
            navigate(path);
          }}
          className="relative p-2.5 hover:bg-primary-50 rounded-lg transition-all duration-300 group hover:scale-110 active:scale-95 border-2 border-transparent hover:border-primary-200"
        >
          <Bell size={20} className="text-secondary-700 group-hover:text-primary-600 transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-danger-500 to-danger-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce-subtle shadow-lg border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-secondary-100 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-transparent hover:border-secondary-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-white">
              {user?.name?.charAt(0) || <User size={16} />}
            </div>
            <span className="hidden md:block font-bold text-secondary-800">{user?.name}</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-secondary-200 overflow-hidden animate-scale-in">
              <button
                onClick={() => {
                  navigate(getProfilePath());
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-primary-50 flex items-center gap-3 transition-all duration-300 text-secondary-800 font-semibold border-b border-secondary-100"
              >
                <User size={18} className="text-primary-600" />
                <span>Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-danger-50 text-danger-600 flex items-center gap-3 transition-all duration-300 font-semibold"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};