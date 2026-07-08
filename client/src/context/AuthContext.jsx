import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const response = await api.get('/users/me');
          if (response.data && response.data.success) {
            setUser(response.data.user);
            setToken(savedToken);
          } else {
            // Clear storage if response structure is invalid
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Persistent Auth Load Failure:', error.message);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } else {
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    loadCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.success) {
        const { token: receivedToken, user: receivedUser } = response.data;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        return { success: true };
      }
      return { success: false, errors: ['Failed to log in. Please try again.'] };
    } catch (error) {
      console.error('Login action error:', error);
      const errors = error.response?.data?.errors || [error.message || 'Login connection failed'];
      return { success: false, errors };
    }
  };

  const signup = async (email, password, confirmPassword) => {
    try {
      const response = await api.post('/auth/signup', { email, password, confirmPassword });
      if (response.data && response.data.success) {
        const { token: receivedToken, user: receivedUser } = response.data;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        return { success: true };
      }
      return { success: false, errors: ['Failed to sign up. Please try again.'] };
    } catch (error) {
      console.error('Signup action error:', error);
      const errors = error.response?.data?.errors || [error.message || 'Signup connection failed'];
      return { success: false, errors };
    }
  };

  const refreshUser = async () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const response = await api.get('/users/me');
        if (response.data && response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Refresh User Profile Failure:', error.message);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
export default AuthContext;
