import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, forgotPassword, resetPassword, logoutUser } from '../services/authApi';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      setUser({ id: 'dummy', name: 'Admin' });  // Placeholder; fetch real user if needed
    }
    setLoading(false);
  }, [accessToken]);

  const login = async (email, password) => {
    try {
      const { data } = await loginUser({ email, password });
      setAccessToken(data.accessToken);
      localStorage.setItem('accessToken', data.accessToken);
      setUser(data.user);
      navigate('/');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await registerUser({ name, email, password });
      setAccessToken(data.accessToken);
      localStorage.setItem('accessToken', data.accessToken);
      setUser(data.user);
      navigate('/login');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const forgot = async (email) => {
    try {
      await forgotPassword({ email });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to send OTP' };
    }
  };

  const reset = async (email, otp, newPassword) => {
    try {
      await resetPassword({ email, otp, newPassword });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Reset failed' };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      localStorage.removeItem('accessToken');
      setUser(null);
      navigate('/login');
    }
  };

  const value = { user, login, register, forgot, reset, logout, accessToken, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};