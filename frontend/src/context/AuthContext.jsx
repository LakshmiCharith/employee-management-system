import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { authService } from '../services/authService';
import { auth } from '../firebase/config';
import { seedInitialFirestoreData } from '../firebase/seed';
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

  // Initialize Firestore data on app launch
  useEffect(() => {
    seedInitialFirestoreData();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Auth user exists
        const saved = localStorage.getItem('ems_user');
        if (!saved) {
          const u = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            username: firebaseUser.email?.split('@')[0],
            fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            role: 'ROLE_EMPLOYEE',
          };
          setUser(u);
          localStorage.setItem('ems_user', JSON.stringify(u));
        }
      }
    });

    return () => unsubscribe();
  }, []);

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
      const msg = err.message || 'Invalid credentials';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
