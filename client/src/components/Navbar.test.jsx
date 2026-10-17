import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/AuthProvider';

vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(() => Promise.reject(new Error('no session'))),
    post: vi.fn(),
  },
}));

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login and sign up when not authenticated', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByText(/login/i)).toBeDefined();
    expect(screen.getByText(/sign up/i)).toBeDefined();
    expect(screen.queryByText(/logout/i)).toBeNull();
  });
});
