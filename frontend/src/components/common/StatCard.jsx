import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle, active, onClick }) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
      border: 'hover:border-blue-300 dark:hover:border-blue-700',
      activeRing: 'ring-2 ring-blue-500 border-blue-500',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
      border: 'hover:border-amber-300 dark:hover:border-amber-700',
      activeRing: 'ring-2 ring-amber-500 border-amber-500',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
      border: 'hover:border-emerald-300 dark:hover:border-emerald-700',
      activeRing: 'ring-2 ring-emerald-500 border-emerald-500',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
      border: 'hover:border-rose-300 dark:hover:border-rose-700',
      activeRing: 'ring-2 ring-rose-500 border-rose-500',
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-200 cursor-pointer ${
        scheme.border
      } ${active ? scheme.activeRing : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${scheme.bg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
