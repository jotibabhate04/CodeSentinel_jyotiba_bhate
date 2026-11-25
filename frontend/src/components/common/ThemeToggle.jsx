import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '', showLabel = true }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 shadow-sm ${
        isDark
          ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
          : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
      } ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 flex-shrink-0" />
          {showLabel && <span className="hidden sm:inline">Light Mode</span>}
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-slate-700 flex-shrink-0" />
          {showLabel && <span className="hidden sm:inline">Dark Mode</span>}
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
