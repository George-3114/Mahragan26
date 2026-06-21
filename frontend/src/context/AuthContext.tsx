import { useCallback, useEffect, ReactNode } from 'react';
import { create } from 'zustand';
import { User, UserRole } from '../types';
import { getToken, setToken, removeToken, getStoredUser, setStoredUser, removeStoredUser } from '../utils/storage';
import { getServices } from '../application';

const childUser: User = {
  id: 'u6',
  name: 'Friend',
  email: 'child@festival.com',
  role: 'child',
  grade: 'Grade 5',
  teamId: '1',
  totalPoints: 245,
  achievements: [],
  createdAt: new Date().toISOString(),
};

const adminUser: User = {
  id: 'admin1',
  name: 'Admin',
  email: 'admin@festival.com',
  role: 'admin',
  totalPoints: 0,
  achievements: [],
  createdAt: new Date().toISOString(),
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    removeToken();
    removeStoredUser();
    set({ user: null, isAuthenticated: false });
  },
}));

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  isAdmin: boolean;
  isChild: boolean;
}

async function resolveUserFromEmail(email: string): Promise<User> {
  if (email.toLowerCase().includes('admin')) {
    return adminUser;
  }

  const services = getServices();
  const member = await services.context.repositories.teamMembers.findByUserId('u6');
  if (member) {
    return {
      ...childUser,
      name: member.displayName,
      totalPoints: member.totalPoints,
      teamId: member.teamId,
      grade: member.grade,
    };
  }

  return childUser;
}

export function useAuth(): AuthContextType {
  const state = useAuthStore();

  const login = useCallback(async (email: string, _password: string) => {
    state.setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = await resolveUserFromEmail(email);
    setToken('mock-jwt-token');
    setStoredUser(JSON.stringify(user));
    state.setUser(user);
    state.setLoading(false);
  }, [state]);

  const hasRole = useCallback(
    (role: UserRole) => state.user?.role === role,
    [state.user?.role],
  );

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    logout: state.logout,
    hasRole,
    isAdmin: state.user?.role === 'admin',
    isChild: state.user?.role === 'child',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const storedUser = getStoredUser();

      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setUser(user);
        } catch {
          setUser(null);
        }
      } else {
        setToken('demo-token');
        const user = await resolveUserFromEmail('child@festival.com');
        setUser(user);
      }
      setLoading(false);
    };

    initAuth();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
