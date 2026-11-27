
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskFilters from './TaskFilters';

describe('TaskFilters Component', () => {
  const mockOnSearchChange = vi.fn();
  const mockOnStatusChange = vi.fn();
  const mockOnPriorityChange = vi.fn();
  const mockOnViewModeChange = vi.fn();
  const mockOnReset = vi.fn();

  const defaultProps = {
    searchQuery: '',
    onSearchChange: mockOnSearchChange,
    statusFilter: 'all',
    onStatusChange: mockOnStatusChange,
    priorityFilter: 'all',
    onPriorityChange: mockOnPriorityChange,
    viewMode: 'grid',
    onViewModeChange: mockOnViewModeChange,
    onReset: mockOnReset,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderFilters = (props = {}) =>
    render(<TaskFilters {...defaultProps} {...props} />);

  it('renders search input and priority options', () => {
    renderFilters();

    expect(
      screen.getByPlaceholderText('Search tasks by title or details...')
    ).toBeInTheDocument();

    expect(screen.getByText('All Priorities')).toBeInTheDocument();
    expect(screen.getByText('High Priority')).toBeInTheDocument();
    expect(screen.getByText('Medium Priority')).toBeInTheDocument();
    expect(screen.getByText('Low Priority')).toBeInTheDocument();
  });

  it('displays the current search query', () => {
    renderFilters({ searchQuery: 'Docker deployment' });

    expect(
      screen.getByPlaceholderText('Search tasks by title or details...')
    ).toHaveValue('Docker deployment');
  });

  it('calls onSearchChange when search input changes', () => {
    renderFilters();

    fireEvent.change(
      screen.getByPlaceholderText('Search tasks by title or details...'),
      { target: { value: 'AWS deployment' } }
    );

    expect(mockOnSearchChange).toHaveBeenCalledWith('AWS deployment');
    expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
  });

  it('displays the selected priority filter', () => {
    renderFilters({ priorityFilter: 'High' });

    expect(screen.getByRole('combobox')).toHaveValue('High');
  });

  it('calls onPriorityChange when priority is changed', () => {
    renderFilters();

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'High' },
    });

    expect(mockOnPriorityChange).toHaveBeenCalledWith('High');
  });

  it('calls onViewModeChange with grid when grid button is clicked', () => {
    renderFilters({ viewMode: 'table' });

    fireEvent.click(screen.getByTitle('Grid Cards View'));

    expect(mockOnViewModeChange).toHaveBeenCalledWith('grid');
  });

  it('calls onViewModeChange with table when table button is clicked', () => {
    renderFilters({ viewMode: 'grid' });

    fireEvent.click(screen.getByTitle('Table View'));

    expect(mockOnViewModeChange).toHaveBeenCalledWith('table');
  });

  it('does not display reset button when no filters are active', () => {
    renderFilters();

    expect(screen.queryByTitle('Reset Filters')).not.toBeInTheDocument();
  });

  it('displays reset button when search query is active', () => {
    renderFilters({ searchQuery: 'Docker' });

    expect(screen.getByTitle('Reset Filters')).toBeInTheDocument();
  });

  it('displays reset button when status filter is active', () => {
    renderFilters({ statusFilter: 'pending' });

    expect(screen.getByTitle('Reset Filters')).toBeInTheDocument();
  });

  it('displays reset button when priority filter is active', () => {
    renderFilters({ priorityFilter: 'High' });

    expect(screen.getByTitle('Reset Filters')).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked', () => {
    renderFilters({ searchQuery: 'Docker' });

    fireEvent.click(screen.getByTitle('Reset Filters'));

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('does not display reset button when filters are inactive', () => {
    renderFilters({
      searchQuery: '',
      statusFilter: 'all',
      priorityFilter: 'all',
    });

    expect(screen.queryByTitle('Reset Filters')).not.toBeInTheDocument();
  });
});

