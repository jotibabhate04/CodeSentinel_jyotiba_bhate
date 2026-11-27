
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskTable from './TaskTable';

const mockTasks = [
  {
    id: 1,
    title: 'Configure AWS EC2',
    description: 'Deploy application on EC2 instance',
    priority: 'High',
    status: 'pending',
    due_date: '2026-12-15'
  },
  {
    id: 2,
    title: 'Complete Docker Setup',
    description: '',
    priority: 'Medium',
    status: 'completed',
    due_date: '2026-11-20'
  },
  {
    id: 3,
    title: 'Learn Jenkins',
    description: 'Configure CI/CD pipeline',
    priority: 'Low',
    status: 'pending',
    due_date: null
  }
];

const renderTable = (tasks = mockTasks) => {
  const onToggleStatus = vi.fn();
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  render(
    <TaskTable
      tasks={tasks}
      onToggleStatus={onToggleStatus}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );

  return { onToggleStatus, onEdit, onDelete };
};

describe('TaskTable', () => {
  it('renders all table headers', () => {
    renderTable();

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Task')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Due Date')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders all task titles', () => {
    renderTable();

    expect(screen.getByText('Configure AWS EC2')).toBeInTheDocument();
    expect(screen.getByText('Complete Docker Setup')).toBeInTheDocument();
    expect(screen.getByText('Learn Jenkins')).toBeInTheDocument();
  });

  it('renders task descriptions when available', () => {
    renderTable();

    expect(
      screen.getByText('Deploy application on EC2 instance')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Configure CI/CD pipeline')
    ).toBeInTheDocument();
  });

  it('does not render an empty description', () => {
    renderTable();

    expect(
      screen.queryByText('Deploy application on EC2 instance')
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Configure CI/CD pipeline')
    ).toBeInTheDocument();
  });

  it('renders priority badges', () => {
    renderTable();

    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  it('formats due dates', () => {
    renderTable();

    expect(screen.getByText('Dec 15, 2026')).toBeInTheDocument();
    expect(screen.getByText('Nov 20, 2026')).toBeInTheDocument();
  });

  it('renders dash when due date is missing', () => {
    renderTable();

    const rows = screen.getAllByRole('row');
    const taskRow = rows.find((row) =>
      within(row).queryByText('Learn Jenkins')
    );

    expect(taskRow).toBeInTheDocument();
    expect(within(taskRow).getAllByText('—').length).toBeGreaterThan(0);
  });

  it('renders pending and completed tasks', () => {
    renderTable();

    const rows = screen.getAllByRole('row');

    expect(rows).toHaveLength(4);
    expect(rows[1]).not.toHaveClass('bg-slate-50/30');
    expect(rows[2]).toHaveClass('bg-slate-50/30');
  });

  it('calls onToggleStatus with the selected task', async () => {
    const user = userEvent.setup();
    const { onToggleStatus } = renderTable();

    const rows = screen.getAllByRole('row');
    const taskRow = rows.find((row) =>
      within(row).queryByText('Configure AWS EC2')
    );

    await user.click(within(taskRow).getAllByRole('button')[0]);

    expect(onToggleStatus).toHaveBeenCalledWith(mockTasks[0]);
  });

  it('calls onEdit with the selected task', async () => {
    const user = userEvent.setup();
    const { onEdit } = renderTable();

    await user.click(screen.getAllByTitle('Edit task')[0]);

    expect(onEdit).toHaveBeenCalledWith(mockTasks[0]);
  });

  it('calls onDelete with the selected task', async () => {
    const user = userEvent.setup();
    const { onDelete } = renderTable();

    await user.click(screen.getAllByTitle('Delete task')[0]);

    expect(onDelete).toHaveBeenCalledWith(mockTasks[0]);
  });

  it('renders an empty table when no tasks are provided', () => {
    renderTable([]);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(1);
  });

  it('displays Invalid Date for an invalid date value', () => {
    const tasks = [
      {
        id: 4,
        title: 'Invalid date task',
        description: '',
        priority: 'Low',
        status: 'pending',
        due_date: 'not-a-date'
      }
    ];

    renderTable(tasks);

    expect(screen.getByText('Invalid Date')).toBeInTheDocument();
  });
});

