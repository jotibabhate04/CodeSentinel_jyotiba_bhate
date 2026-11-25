import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Flame, 
  Layers, 
  Plus, 
  Inbox, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { taskApi } from '../api/taskApi';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import StatCard from '../components/common/StatCard';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskCard from '../components/tasks/TaskCard';
import TaskTable from '../components/tasks/TaskTable';
import TaskModal from '../components/tasks/TaskModal';
import ConfirmModal from '../components/common/ConfirmModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const { success, error } = useToast();

  // Tasks & stats state
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, highPriority: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter & view states
  const [sidebarFilter, setSidebarFilter] = useState('all'); // 'all' | 'pending' | 'completed' | 'high-priority'
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch stats from backend
  const fetchStats = useCallback(async () => {
    try {
      const res = await taskApi.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  }, []);

  // Fetch tasks with query parameters
  const fetchTasks = useCallback(async () => {
    try {
      let statusParam = 'all';
      let priorityParam = priorityFilter;

      if (sidebarFilter === 'pending') statusParam = 'pending';
      if (sidebarFilter === 'completed') statusParam = 'completed';
      if (sidebarFilter === 'high-priority') priorityParam = 'High';

      const res = await taskApi.getTasks({
        search: searchQuery,
        status: statusParam,
        priority: priorityParam,
      });

      if (res.success && res.data) {
        setTasks(res.data);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to fetch tasks.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [sidebarFilter, priorityFilter, searchQuery, error]);

  // Initial load and filter change trigger
  useEffect(() => {
    setLoading(true);
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchTasks(), fetchStats()]);
  };

  // Status toggle handler (pending <-> completed)
  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
    );

    try {
      await taskApi.updateStatus(task.id, nextStatus);
      success(`Task marked as ${nextStatus}.`);
      fetchStats();
    } catch (err) {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t))
      );
      error(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  // Create / Update task submit handler
  const handleSaveTask = async (taskData) => {
    setIsSubmitting(true);
    try {
      if (selectedTask) {
        // Edit Mode
        const res = await taskApi.updateTask(selectedTask.id, taskData);
        success('Task updated successfully.');
        setTasks((prev) =>
          prev.map((t) => (t.id === selectedTask.id ? res.data : t))
        );
      } else {
        // Create Mode
        const res = await taskApi.createTask(taskData);
        success('Task created successfully.');
        setTasks((prev) => [res.data, ...prev]);
      }
      setIsTaskModalOpen(false);
      setSelectedTask(null);
      fetchStats();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete task submit handler
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      await taskApi.deleteTask(taskToDelete.id);
      success('Task deleted successfully.');
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      fetchStats();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete task.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenDelete = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setPriorityFilter('all');
    setSidebarFilter('all');
  };

  // Calculate completion percentage
  const completionPercentage =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        currentFilter={sidebarFilter}
        onFilterChange={setSidebarFilter}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenCreateModal={() => {
            setSelectedTask(null);
            setIsTaskModalOpen(true);
          }}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Top Overview Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Operations Dashboard
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Monitor and orchestrate your distributed project deliverables.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={() => {
                  setSelectedTask(null);
                  setIsTaskModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl transition-colors shadow-sm shadow-blue-500/20 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create Task</span>
              </button>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Tasks"
              value={stats.total}
              icon={Layers}
              color="blue"
              subtitle={`${completionPercentage}% completion rate`}
              active={sidebarFilter === 'all'}
              onClick={() => setSidebarFilter('all')}
            />
            <StatCard
              title="Pending"
              value={stats.pending}
              icon={Clock}
              color="amber"
              subtitle="Tasks in progress"
              active={sidebarFilter === 'pending'}
              onClick={() => setSidebarFilter('pending')}
            />
            <StatCard
              title="Completed"
              value={stats.completed}
              icon={CheckCircle2}
              color="emerald"
              subtitle="Done and verified"
              active={sidebarFilter === 'completed'}
              onClick={() => setSidebarFilter('completed')}
            />
            <StatCard
              title="High Priority"
              value={stats.highPriority}
              icon={Flame}
              color="rose"
              subtitle="Urgent attention required"
              active={sidebarFilter === 'high-priority'}
              onClick={() => setSidebarFilter('high-priority')}
            />
          </div>

          {/* Progress Bar Banner */}
          {stats.total > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Sprint Health & Completion</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {stats.completed} of {stats.total} tasks resolved across current workspace.
                  </p>
                </div>
              </div>

              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  <span>Progress</span>
                  <span>{completionPercentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <TaskFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={sidebarFilter}
            onStatusChange={setSidebarFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onReset={handleResetFilters}
          />

          {/* Task Collection Content */}
          {loading ? (
            <div className="py-24 flex items-center justify-center">
              <LoadingSpinner text="Synchronizing tasks with Sentinel DB..." size="lg" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-lg mx-auto my-12 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No tasks found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                {searchQuery || priorityFilter !== 'all' || sidebarFilter !== 'all'
                  ? 'No tasks match your active filter criteria. Try resetting filters.'
                  : 'Get started by creating your first task in CodeSentinel.'}
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                {searchQuery || priorityFilter !== 'all' || sidebarFilter !== 'all' ? (
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedTask(null);
                      setIsTaskModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Your First Task</span>
                  </button>
                )}
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>
          ) : (
            <TaskTable
              tasks={tasks}
              onToggleStatus={handleToggleStatus}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          )}
        </main>
      </div>

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleSaveTask}
        initialData={selectedTask}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to permanently delete "${taskToDelete?.title}"? This action cannot be reversed.`}
        confirmText="Confirm Delete"
        loading={isDeleting}
      />
    </div>
  );
};

export default DashboardPage;
