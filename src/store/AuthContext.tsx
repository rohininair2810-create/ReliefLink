import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { PortalRole, User, VictimProfile, VolunteerProfile, AuthorityProfile, DonorProfile } from '../types';

// Demo credentials
export const DEMO_USERS = {
  victim: { id: 'V001', email: 'priya.sharma@demo.com', password: 'demo123', name: 'Priya Sharma', role: 'victim' as PortalRole, phone: '+91-9876543210' },
  volunteer: { id: 'VOL001', email: 'arjun.kumar@demo.com', password: 'demo123', name: 'Arjun Kumar', role: 'volunteer' as PortalRole, phone: '+91-9876543211' },
  authority: { id: 'AUTH001', email: 'collector@district.gov.in', password: 'admin123', name: 'District Collector Raj Patel', role: 'authority' as PortalRole, phone: '+91-9876543212' },
  donor: { id: 'D001', email: 'helpinghand@example.com', password: 'demo123', name: 'Helping Hand Foundation', role: 'donor' as PortalRole, phone: '+91-9876543213' },
};

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string, role: PortalRole) => { success: boolean; error?: string };
  logout: () => void;
  register: (data: Partial<User> & { password: string }, role: PortalRole) => { success: boolean; error?: string };
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: PortalRole) => {
    const demo = DEMO_USERS[role];
    if (email === demo.email && password === demo.password) {
      setCurrentUser({ ...demo, createdAt: '2024-01-15' });
      return { success: true };
    }
    // Also allow any email/password for registration flow demo
    if (password.length >= 6) {
      setCurrentUser({ id: `${role.toUpperCase()}${Date.now()}`, name: email.split('@')[0], email, phone: '', role, createdAt: new Date().toISOString() });
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Use demo credentials or register.' };
  };

  const logout = () => setCurrentUser(null);

  const register = (data: Partial<User> & { password: string }, role: PortalRole) => {
    if (!data.email || !data.name || !data.password) {
      return { success: false, error: 'Please fill all required fields.' };
    }
    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    setCurrentUser({
      id: `${role.toUpperCase()}${Date.now()}`,
      name: data.name!,
      email: data.email!,
      phone: data.phone || '',
      role,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
