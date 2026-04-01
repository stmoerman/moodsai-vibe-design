// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthState {
  role: 'therapist' | 'client' | 'admin' | null;
  email: string | null;
  displayName: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string) => void;
  logout: () => void;
}

const ROLE_MAP: Record<string, { role: AuthState['role']; displayName: string }> = {
  'therapist-demo@moodsai.ai': { role: 'therapist', displayName: 'Demo Therapeut' },
  'client-demo@moodsai.ai': { role: 'client', displayName: 'Demo Cliënt' },
  'admin-demo@moodsai.ai': { role: 'admin', displayName: 'Demo Beheerder' },
};

const ROLE_ROUTES: Record<string, string> = {
  therapist: '/therapist',
  client: '/client',
  admin: '/admin',
};

const STORAGE_KEY = 'moods-demo-auth';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({ role: null, email: null, displayName: null });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setState(JSON.parse(saved));
    } catch {}
  }, []);

  const login = useCallback((email: string) => {
    const mapped = ROLE_MAP[email.toLowerCase()] ?? { role: 'client' as const, displayName: 'Demo Cliënt' };
    const newState: AuthState = { role: mapped.role, email, displayName: mapped.displayName };
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  const logout = useCallback(() => {
    setState({ role: null, email: null, displayName: null });
    localStorage.removeItem(STORAGE_KEY);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { ROLE_ROUTES };
