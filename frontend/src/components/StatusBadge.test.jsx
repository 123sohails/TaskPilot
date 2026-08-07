import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  it('renders correctly with "active" status', () => {
    render(<StatusBadge status="active" />);
    const badge = screen.getByText('active');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge-success');
  });

  it('renders correctly with "pending" status', () => {
    render(<StatusBadge status="pending" />);
    const badge = screen.getByText('pending');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge-warning');
  });

  it('renders correctly with "failed" status', () => {
    render(<StatusBadge status="failed" />);
    const badge = screen.getByText('failed');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge-error');
  });

  it('renders "Unknown" when no status is provided', () => {
    render(<StatusBadge />);
    const badge = screen.getByText('Unknown');
    expect(badge).toBeInTheDocument();
  });
});
