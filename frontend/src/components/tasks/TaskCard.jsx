import React from 'react';
import { Calendar, Check, Edit2, Trash2, Clock } from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../common/Badge';

const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = task.status === 'completed';

  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = Number.parseInt(parts[0], 10);
      const month = Number.parseInt(parts[1], 10) - 1;
      const day = Number.parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
  };

  const isOverdue = () => {
    if (!task.due_date || isCompleted) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.due_date);
    return dueDate < today;
  };

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-md ${
        isCompleted
          ? 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-900/40 opacity-80'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>

          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Edit task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task Title & Status Toggle */}
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleStatus(task)}
            className={`mt-1 w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors ${
              isCompleted
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-slate-800'
            }`}
            title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          >
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          <div className="flex-1 min-w-0">
            <h4
              className={`text-base font-semibold text-slate-900 dark:text-white leading-snug break-words ${
                isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {task.title}
            </h4>

            {task.description && (
              <p
                className={`text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-3 leading-relaxed ${
                  isCompleted ? 'text-slate-400 dark:text-slate-600' : ''
                }`}
              >
                {task.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Due Date & Timestamp Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-1.5">
          {task.due_date ? (
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                isOverdue() ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {isOverdue() ? 'Overdue: ' : 'Due: '}
              {formatDueDate(task.due_date)}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> No due date
            </span>
          )}
        </div>

        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          #{task.id}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
