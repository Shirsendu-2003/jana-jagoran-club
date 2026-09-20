import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('scms_user');
    const token = localStorage.getItem('scms_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const data = res.data.data;
    localStorage.setItem('scms_token', data.token);
    localStorage.setItem('scms_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (payload) => {
    // New self-registrations are PENDING until an Admin approves them --
    // no token is issued here, so we don't touch local storage or `user` state.
    const res = await authApi.register(payload);
    return res.data.data;
  };

  const logout = () => {
    localStorage.removeItem('scms_token');
    localStorage.removeItem('scms_user');
    setUser(null);
  };

  /** Called after the user successfully sets a new password via the forced-change screen. */
  const clearMustChangePassword = () => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, mustChangePassword: false };
      localStorage.setItem('scms_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading, clearMustChangePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
