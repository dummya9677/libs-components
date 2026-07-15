import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loader } from '@/components/Loader';

describe('Loader', () => {
  it('renders status message', () => {
    render(<Loader message="Checking session…" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Checking session…')).toBeInTheDocument();
  });
});
