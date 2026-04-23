import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On app load, check if a user is already logged in (from LocalStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem('tradehub_user');
    const token = localStorage.getItem('tradehub_token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function to be called from Login.jsx
  const login = (userData, token) => {
    localStorage.setItem('tradehub_token', token);
    localStorage.setItem('tradehub_user', JSON.stringify(userData));
    setUser(userData);
    navigate('/');
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('tradehub_token');
    localStorage.removeItem('tradehub_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);