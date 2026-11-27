
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StatCard from './StatCard';

const MockIcon = (props) => (
  <svg data-testid="mock-icon" {...props} />
);

describe('StatCard Component', () => {
  it('renders title, value and subtitle', () => {
    render(
      <StatCard
        title="Total Tasks"
        value={25}
        subtitle="Tasks created"
        icon={MockIcon}
      />
    );

    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Tasks created')).toBeInTheDocument();
  });

  it('renders a div when onClick is not provided', () => {
    const { container } = render(
      <StatCard title="Completed" value={10} icon={MockIcon} />
    );

    expect(container.querySelector('button')).not.toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders a button when onClick is provided', () => {
    const handleClick = vi.fn();

    render(
      <StatCard
        title="Pending"
        value={5}
        icon={MockIcon}
        onClick={handleClick}
      />
    );

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('sets aria-pressed to true when active', () => {
    render(
      <StatCard
        title="Active Tasks"
        value={8}
        icon={MockIcon}
        active={true}
        onClick={() => {}}
      />
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('uses the blue color scheme when an invalid color is provided', () => {
    const { container } = render(
      <StatCard
        title="Total"
        value={20}
        icon={MockIcon}
        color="invalid"
      />
    );

    const iconContainer = container.querySelector('[data-testid="mock-icon"]').parentElement;
    expect(iconContainer.className).toContain('text-blue-600');
  });

  it('renders without subtitle when subtitle is not provided', () => {
    render(
      <StatCard title="Total Tasks" value={25} icon={MockIcon} />
    );

    expect(screen.queryByText('Tasks created')).not.toBeInTheDocument();
  });

  it('applies the amber color scheme', () => {
    const { container } = render(
      <StatCard title="Pending" value={5} icon={MockIcon} color="amber" />
    );

    const iconContainer = container.querySelector('[data-testid="mock-icon"]').parentElement;
    expect(iconContainer.className).toContain('text-amber-600');
  });

  it('applies the emerald color scheme', () => {
    const { container } = render(
      <StatCard title="Completed" value={10} icon={MockIcon} color="emerald" />
    );

    const iconContainer = container.querySelector('[data-testid="mock-icon"]').parentElement;
    expect(iconContainer.className).toContain('text-emerald-600');
  });

  it('applies the rose color scheme', () => {
    const { container } = render(
      <StatCard title="Overdue" value={2} icon={MockIcon} color="rose" />
    );

    const iconContainer = container.querySelector('[data-testid="mock-icon"]').parentElement;
    expect(iconContainer.className).toContain('text-rose-600');
  });
});

