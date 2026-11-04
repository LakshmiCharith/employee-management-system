import React, { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService';
import { mockUser } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ems_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return mockUser;
  });
  const [loading, setLoading] = useState(false);

  const login = async (usernameOrEmail, password, rememberMe = false) => {
    setLoading(true);
    try {
      const res = await authService.login(usernameOrEmail, password);
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('ems_user', JSON.stringify(res.data));
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid credentials';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ems_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
