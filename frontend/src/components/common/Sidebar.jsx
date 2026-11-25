import React from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Clock, 
  CheckCircle2, 
  Flame, 
  LogOut, 
  User, 
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ currentFilter, onFilterChange, isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { id: 'all', label: 'All Tasks', icon: LayoutDashboard },
    { id: 'pending', label: 'Pending Tasks', icon: Clock },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'high-priority', label: 'High Priority', icon: Flame },
  ];

  const handleSelect = (id) => {
    onFilterChange(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">Code<span className="text-blue-600 dark:text-blue-400">Sentinel</span></span>
              <span className="block text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Enterprise TaskOps</span>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose} 
              className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Appearance & User Profile Section */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-3">
          {/* Theme Mode Toggle Row */}
          <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
              {isDark ? <Moon className="w-3.5 h-3.5 text-blue-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              {isDark ? 'Dark Theme' : 'Light Theme'}
            </span>
            <button
              onClick={toggleTheme}
              className="px-2.5 py-1 rounded-lg font-bold text-[11px] bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
            >
              Switch to {isDark ? 'Light' : 'Dark'}
            </button>
          </div>

          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name || 'Authorized User'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'user@codesentinel.io'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-white hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-transparent dark:hover:border-rose-900/50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
