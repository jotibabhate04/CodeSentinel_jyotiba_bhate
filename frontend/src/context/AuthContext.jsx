import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('codesentinel_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('codesentinel_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate stored token on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const savedToken = localStorage.getItem('codesentinel_token');
      if (!savedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getProfile();
        if (response.success && response.user) {
          setUser(response.user);
          localStorage.setItem('codesentinel_user', JSON.stringify(response.user));
        } else {
          logout();
        }
      } catch (err) {
        // If token expired or server rejected, clear session
        console.warn('Session verification failed, logging out:', err.response?.data?.message || err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials);
    if (response.success && response.token) {
      localStorage.setItem('codesentinel_token', response.token);
      localStorage.setItem('codesentinel_user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || 'Login failed.');
  }, []);

  const register = useCallback(async (userData) => {
    const response = await authApi.register(userData);
    if (response.success && response.token) {
      localStorage.setItem('codesentinel_token', response.token);
      localStorage.setItem('codesentinel_user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || 'Registration failed.');
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('codesentinel_token');
    localStorage.removeItem('codesentinel_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
