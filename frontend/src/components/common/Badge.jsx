import React from 'react';

export const PriorityBadge = ({ priority }) => {
  const config = {
    High: {
      bg: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200/80 dark:border-rose-900/60',
      dot: 'bg-rose-500',
    },
    Medium: {
      bg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200/80 dark:border-amber-900/60',
      dot: 'bg-amber-500',
    },
    Low: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-900/60',
      dot: 'bg-emerald-500',
    },
  };

  const style = config[priority] || config.Medium;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {priority}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const isCompleted = status === 'completed';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        isCompleted
          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200/80 dark:border-blue-900/60'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-400 dark:bg-slate-500'}`} />
      {isCompleted ? 'Completed' : 'Pending'}
    </span>
  );
};
