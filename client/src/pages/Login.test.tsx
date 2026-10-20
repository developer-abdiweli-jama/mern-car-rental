import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthProvider } from '../context/AuthProvider';
import api from '../api/axios';

vi.mock('../api/axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls login with form values on submit', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: { data: { user: { _id: '1', name: 'Alice', email: 'a@example.com', role: 'customer' } } } });
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>,
    );
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret123' } });
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
    expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'alice@example.com', password: 'secret123' });
  });
});
