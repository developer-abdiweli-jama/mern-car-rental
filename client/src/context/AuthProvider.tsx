import { useEffect, useState } from 'react';
import type { User } from '../types';
import { AuthContext } from './AuthContext';
import api from '../api/axios';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    const onExpired = () => {
      setUser(null);
    };
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  const register = async (values: Record<string, unknown>) => {
    const res = await api.post('/auth/register', values);
    setUser(res.data.data.user);
    return res.data;
  };

  const login = async (values: Record<string, unknown>) => {
    const res = await api.post('/auth/login', values);
    setUser(res.data.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore logout errors; still clear local state
    }
    setUser(null);
  };

  const value = { user, loading, register, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
