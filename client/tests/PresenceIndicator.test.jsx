/**
 * PresenceIndicator Component Tests
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PresenceIndicator from '../src/components/PresenceIndicator.jsx';

describe('PresenceIndicator Component', () => {
  it('renders user count', () => {
    render(<PresenceIndicator userCount={5} activeCount={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows active status when all users are active', () => {
    const { container } = render(<PresenceIndicator userCount={3} activeCount={3} />);
    const status = container.querySelector('.presence-indicator__status--all-active');
    expect(status).toBeInTheDocument();
  });

  it('shows inactive status when some users are inactive', () => {
    const { container } = render(<PresenceIndicator userCount={3} activeCount={2} />);
    const status = container.querySelector('.presence-indicator__status--some-inactive');
    expect(status).toBeInTheDocument();
  });

  it('handles zero users', () => {
    render(<PresenceIndicator userCount={0} activeCount={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('shows correct title tooltip', () => {
    const { container } = render(<PresenceIndicator userCount={10} activeCount={5} />);
    const indicator = container.querySelector('.presence-indicator');
    expect(indicator).toHaveAttribute('title', '5 of 10 users active');
  });
});
