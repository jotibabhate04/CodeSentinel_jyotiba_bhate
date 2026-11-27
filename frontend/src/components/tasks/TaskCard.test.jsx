
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from './TaskCard';

describe('TaskCard Component', () => {
  const mockOnToggleStatus = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  const defaultTask = {
    id: 101,
    title: 'Deploy CodeSentinel on AWS',
    description: 'Configure EC2 and Docker deployment',
    priority: 'High',
    status: 'pending',
    due_date: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderCard = (task = defaultTask) => {
    return render(
      <TaskCard
        task={task}
        onToggleStatus={mockOnToggleStatus}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
  };

  it('renders task title and description', () => {
    renderCard();

    expect(screen.getByText('Deploy CodeSentinel on AWS')).toBeInTheDocument();
    expect(screen.getByText('Configure EC2 and Docker deployment')).toBeInTheDocument();
  });

  it('renders task ID', () => {
    renderCard();

    expect(screen.getByText('#101')).toBeInTheDocument();
  });

  it('renders priority and status badges', () => {
    renderCard();

    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('does not render description when it is empty', () => {
    renderCard({
      ...defaultTask,
      description: '',
    });

    expect(
      screen.queryByText('Configure EC2 and Docker deployment')
    ).not.toBeInTheDocument();
  });

  it('calls onEdit with task when edit button is clicked', () => {
    renderCard();

    fireEvent.click(screen.getByTitle('Edit task'));

    expect(mockOnEdit).toHaveBeenCalledWith(defaultTask);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete with task when delete button is clicked', () => {
    renderCard();

    fireEvent.click(screen.getByTitle('Delete task'));

    expect(mockOnDelete).toHaveBeenCalledWith(defaultTask);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleStatus when status button is clicked', () => {
    renderCard();

    fireEvent.click(screen.getByTitle('Mark as completed'));

    expect(mockOnToggleStatus).toHaveBeenCalledWith(defaultTask);
    expect(mockOnToggleStatus).toHaveBeenCalledTimes(1);
  });

  it('shows completed state and mark as pending action', () => {
    renderCard({
      ...defaultTask,
      status: 'completed',
    });

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByTitle('Mark as pending')).toBeInTheDocument();
  });

  it('does not display overdue label for completed tasks', () => {
    renderCard({
      ...defaultTask,
      status: 'completed',
      due_date: '2020-01-01',
    });

    expect(screen.queryByText(/Overdue:/)).not.toBeInTheDocument();
    expect(screen.getByText(/Jan 1, 2020/)).toBeInTheDocument();
  });

  it('displays no due date when due_date is missing', () => {
    renderCard({
      ...defaultTask,
      due_date: null,
    });

    expect(screen.getByText('No due date')).toBeInTheDocument();
  });

  it('formats a valid due date', () => {
    renderCard({
      ...defaultTask,
      due_date: '2026-12-15',
    });

    expect(screen.getByText(/Dec 15, 2026/)).toBeInTheDocument();
  });

  it('displays overdue label for an overdue pending task', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-26T12:00:00'));

    renderCard({
      ...defaultTask,
      status: 'pending',
      due_date: '2026-11-20',
    });

    expect(screen.getByText(/Overdue:/)).toBeInTheDocument();
  });

  it('displays Due label for a future task', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-26T12:00:00'));

    renderCard({
      ...defaultTask,
      due_date: '2026-12-20',
    });

    expect(screen.getByText(/Due:/)).toBeInTheDocument();
    expect(screen.queryByText(/Overdue:/)).not.toBeInTheDocument();
  });

  it('returns the original date string when date format is invalid', () => {
    renderCard({
      ...defaultTask,
      due_date: 'InvalidDate',
    });

    expect(screen.getByText(/InvalidDate/)).toBeInTheDocument();
  });
});

