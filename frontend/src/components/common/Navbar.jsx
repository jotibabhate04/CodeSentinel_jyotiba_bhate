import React from 'react';
import { Menu, Plus, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onOpenSidebar, onOpenCreateModal }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800">
            <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Session Secured
          </span>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Welcome back, <strong className="text-slate-800 dark:text-slate-100">{user?.name}</strong>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl transition-colors shadow-sm shadow-blue-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
