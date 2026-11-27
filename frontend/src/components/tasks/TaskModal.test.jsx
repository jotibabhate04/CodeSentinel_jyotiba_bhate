
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskModal from './TaskModal';

describe('TaskModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderModal = (props = {}) => {
    return render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        {...props}
      />
    );
  };

  it('does not render when modal is closed', () => {
    renderModal({ isOpen: false });

    expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
  });

  it('renders create task form with default values', () => {
    renderModal();

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/Task Title/i)).toHaveValue('');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('');
    expect(screen.getByLabelText(/Priority/i)).toHaveValue('Medium');
    expect(screen.getByLabelText(/Status/i)).toHaveValue('pending');
    expect(screen.getByLabelText(/Due Date/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Create Task' })).toBeInTheDocument();
  });

  it('shows validation error when title is empty', () => {
    renderModal();

    fireEvent.click(screen.getByRole('button', { name: 'Create Task' }));

    expect(screen.getByText('Task title is required.')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error when title contains only spaces', () => {
    renderModal();

    fireEvent.change(screen.getByLabelText(/Task Title/i), {
      target: { value: '   ' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create Task' }));

    expect(screen.getByText('Task title is required.')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error when title exceeds 255 characters', () => {
    renderModal();

    fireEvent.change(screen.getByLabelText(/Task Title/i), {
      target: { value: 'A'.repeat(256) },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create Task' }));

    expect(
      screen.getByText('Title cannot exceed 255 characters.')
    ).toBeInTheDocument();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits a valid new task with trimmed values', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.type(screen.getByLabelText(/Task Title/i), '  Deploy AWS App  ');
    await user.type(screen.getByLabelText(/Description/i), '  Deployment task  ');

    await user.selectOptions(screen.getByLabelText(/Priority/i), 'High');
    await user.selectOptions(screen.getByLabelText(/Status/i), 'completed');

    await user.type(screen.getByLabelText(/Due Date/i), '2026-12-15');

    await user.click(screen.getByRole('button', { name: 'Create Task' }));

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Deploy AWS App',
      description: 'Deployment task',
      priority: 'High',
      status: 'completed',
      dueDate: '2026-12-15',
    });
  });

  it('submits null for empty description and due date', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.type(screen.getByLabelText(/Task Title/i), 'Create Pipeline');
    await user.click(screen.getByRole('button', { name: 'Create Task' }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Create Pipeline',
      description: null,
      priority: 'Medium',
      status: 'pending',
      dueDate: null,
    });
  });

  it('renders edit form with existing task data', () => {
    const initialData = {
      title: 'Existing Task',
      description: 'Existing description',
      priority: 'High',
      status: 'completed',
      due_date: '2026-12-20T00:00:00.000Z',
    };

    renderModal({ initialData });

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/Task Title/i)).toHaveValue('Existing Task');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('Existing description');
    expect(screen.getByLabelText(/Priority/i)).toHaveValue('High');
    expect(screen.getByLabelText(/Status/i)).toHaveValue('completed');
    expect(screen.getByLabelText(/Due Date/i)).toHaveValue('2026-12-20');
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
  });

  it('uses default values when optional initial task fields are missing', () => {
    renderModal({
      initialData: {
        title: 'Basic Task',
      },
    });

    expect(screen.getByLabelText(/Description/i)).toHaveValue('');
    expect(screen.getByLabelText(/Priority/i)).toHaveValue('Medium');
    expect(screen.getByLabelText(/Status/i)).toHaveValue('pending');
    expect(screen.getByLabelText(/Due Date/i)).toHaveValue('');
  });

  it('calls onClose when close button is clicked', () => {
    renderModal();

    fireEvent.click(screen.getByRole('button', { name: 'Close task modal' }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked', () => {
    renderModal();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('disables buttons and shows loading indicator while submitting', () => {
    renderModal({ isSubmitting: true });

    expect(screen.getByRole('button', { name: 'Close task modal' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Create Task' })).toBeDisabled();

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('disables save button while editing and submitting', () => {
    renderModal({
      initialData: { title: 'Existing Task' },
      isSubmitting: true,
    });

    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeDisabled();
  });

  it('clears validation errors when modal is reopened', () => {
    const { rerender } = renderModal();

    fireEvent.click(screen.getByRole('button', { name: 'Create Task' }));

    expect(screen.getByText('Task title is required.')).toBeInTheDocument();

    rerender(
      <TaskModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    rerender(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(
      screen.queryByText('Task title is required.')
    ).not.toBeInTheDocument();
  });

  it('resets the form when initialData changes to null', () => {
    const { rerender } = render(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={{ title: 'Old Task', priority: 'High' }}
      />
    );

    expect(screen.getByLabelText(/Task Title/i)).toHaveValue('Old Task');

    rerender(
      <TaskModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={null}
      />
    );

    expect(screen.getByLabelText(/Task Title/i)).toHaveValue('');
    expect(screen.getByLabelText(/Priority/i)).toHaveValue('Medium');
  });
});

