import React from 'react';
import { Check, Edit2, Trash2, Calendar } from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../common/Badge';

const TaskTable = ({ tasks, onToggleStatus, onEdit, onDelete }) => {
  const formatDueDate = (dateStr) => {
    if (!dateStr) return '—';
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

  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <th className="py-3.5 px-4 w-12 text-center">Status</th>
            <th className="py-3.5 px-4">Task</th>
            <th className="py-3.5 px-4 w-28">Priority</th>
            <th className="py-3.5 px-4 w-32">Due Date</th>
            <th className="py-3.5 px-4 w-28 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          {tasks.map((task) => {
            const isCompleted = task.status === 'completed';
            return (
              <tr
                key={task.id}
                className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                  isCompleted ? 'bg-slate-50/30 dark:bg-slate-900/30' : ''
                }`}
              >
                {/* Status Toggle Checkbox */}
                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={() => onToggleStatus(task)}
                    className={`w-5 h-5 mx-auto rounded-lg border flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                </td>

                {/* Title & Description */}
                <td className="py-3.5 px-4 max-w-md">
                  <p
                    className={`font-semibold text-slate-900 dark:text-white leading-snug ${
                      isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p
                      className={`text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate ${
                        isCompleted ? 'text-slate-400 dark:text-slate-600' : ''
                      }`}
                    >
                      {task.description}
                    </p>
                  )}
                </td>

                {/* Priority */}
                <td className="py-3.5 px-4">
                  <PriorityBadge priority={task.priority} />
                </td>

                {/* Due Date */}
                <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {task.due_date ? (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      {formatDueDate(task.due_date)}
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
