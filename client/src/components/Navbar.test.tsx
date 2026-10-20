import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/AuthProvider';
import api from '../api/axios';

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
    const { getByText, queryByText } = render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>,
    );
    expect(getByText(/sign in/i)).toBeDefined();
    expect(getByText(/create account/i)).toBeDefined();
    expect(queryByText(/sign out/i)).toBeNull();
  });

  it('renders user name and sign out when authenticated', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: { data: { user: { _id: '1', name: 'Alice', email: 'a@example.com', role: 'customer' } } } });
    const { getByText, findByText } = render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>,
    );
    await findByText(/alice/i);
    expect(getByText(/sign out/i)).toBeDefined();
  });
});
