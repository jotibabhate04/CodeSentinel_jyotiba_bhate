
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

const mockLogout = vi.fn();
const mockToggleTheme = vi.fn();
const mockOnFilterChange = vi.fn();
const mockOnClose = vi.fn();

let mockUser;
let mockIsDark;

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    logout: mockLogout,
  }),
}));

vi.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    isDark: mockIsDark,
    toggleTheme: mockToggleTheme,
  }),
}));

describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUser = {
      name: 'Test User',
      email: 'test@example.com',
    };

    mockIsDark = false;
  });

  it('renders CodeSentinel branding and navigation items', () => {
    render(
      <Sidebar
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        isOpen={false}
      />
    );

    expect(screen.getByText('Code')).toBeInTheDocument();
    expect(screen.getByText('Sentinel')).toBeInTheDocument();
    expect(screen.getByText('Enterprise TaskOps')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /All Tasks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pending Tasks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Completed/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /High Priority/i })).toBeInTheDocument();
  });

  it('marks the selected navigation item as current page', () => {
    render(
      <Sidebar
        currentFilter="pending"
        onFilterChange={mockOnFilterChange}
        isOpen={false}
      />
    );

    expect(
      screen.getByRole('button', { name: /Pending Tasks/i })
    ).toHaveAttribute('aria-current', 'page');

    expect(
      screen.getByRole('button', { name: /All Tasks/i })
    ).not.toHaveAttribute('aria-current', 'page');
  });

  it('calls onFilterChange when a navigation item is selected', () => {
    render(
      <Sidebar
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        isOpen={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Completed/i }));

    expect(mockOnFilterChange).toHaveBeenCalledWith('completed');
    expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
  });

  it('calls onClose after selecting a navigation item when provided', () => {
    render(
      <Sidebar
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /High Priority/i }));

    expect(mockOnFilterChange).toHaveBeenCalledWith('high-priority');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not fail when onClose is not provided', () => {
    render(
      <Sidebar
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        isOpen={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Pending Tasks/i }));

    expect(mockOnFilterChange).toHaveBeenCalledWith('pending');
  });

  it('renders mobile backdrop when sidebar is open', () => {
    render(
      <Sidebar
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close navigation menu' }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders close sidebar button when onClose is provided', () => {
    render(
      <Sidebar
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close sidebar' }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('displays user name, email and initial', () => {
    render(
      <Sidebar
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        isOpen={false}
      />
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('shows fallback user details when user is unavailable', () => {
    mockUser = null;

    render(
      <Sidebar
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        isOpen={false}
      />
    );

    expect(screen.getByText('Authorized User')).toBeInTheDocument();
    expect(screen.getByText('user@codesentinel.io')).toBeInTheDocument();
  });

  it('shows Light Theme and switches to dark theme', () => {
    render(
      <Sidebar
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        isOpen={false}
      />
    );

    expect(screen.getByText('Light Theme')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Switch to Dark Theme' })
    );

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('shows Dark Theme when dark mode is enabled', () => {
    mockIsDark = true;

    render(
      <Sidebar
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        isOpen={false}
      />
    );

    expect(screen.getByText('Dark Theme')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Switch to Light Theme' })
    );

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('calls logout when Sign Out is clicked', () => {
    render(
      <Sidebar
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        isOpen={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Sign Out/i }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

