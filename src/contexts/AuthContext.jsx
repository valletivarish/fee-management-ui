import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    return storedToken;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token]);

  const applySession = useCallback((accessToken, userInfo) => {
    setToken(accessToken);
    localStorage.setItem('token', accessToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    if (userInfo) {
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
    } else {
      setUser(null);
      localStorage.removeItem('user');
    }
  }, []);

  const extractUserInfo = (accessToken, fallbackRole, fallbackUsername) => {
    if (!accessToken) {
      return {
        role: fallbackRole || 'USER',
        username: fallbackUsername || '',
      };
    }

    try {
      const decoded = jwtDecode(accessToken) || {};
      const extractedRole =
        decoded.role ||
        decoded.roles ||
        decoded.authorities ||
        decoded.scope ||
        fallbackRole ||
        'USER';

      const normalizedRole = Array.isArray(extractedRole)
        ? extractedRole[0]
        : extractedRole;

      const username =
        decoded.sub ||
        decoded.username ||
        decoded.email ||
        fallbackUsername ||
        '';

      return {
        role: (normalizedRole || '').toString().toUpperCase(),
        username,
      };
    } catch (error) {
      console.warn('Unable to decode JWT for user info; using fallbacks.', error);
      return {
        role: fallbackRole || 'USER',
        username: fallbackUsername || '',
      };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      const { accessToken } = response.data;
      const normalizedRole = (credentials.role || '').toString().toUpperCase();
      const userInfo = extractUserInfo(accessToken, normalizedRole, credentials.usernameOrEmail);

      applySession(accessToken, userInfo);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
