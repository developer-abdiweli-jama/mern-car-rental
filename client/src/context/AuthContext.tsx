import { createContext } from 'react';
import type { User } from '../types';

export const AuthContext = createContext<{ user: User | null; loading: boolean; register: (values: Record<string, unknown>) => Promise<unknown>; login: (values: Record<string, unknown>) => Promise<unknown>; logout: () => Promise<void> } | null>(null);
