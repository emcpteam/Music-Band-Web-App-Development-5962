import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already authenticated from localStorage
    try {
      return localStorage.getItem('isAdminAuthenticated') === 'true';
    } catch (error) {
      return false;
    }
  });

  const [user, setUser] = useState(() => {
    // Load user data from localStorage if available
    try {
      const savedUser = localStorage.getItem('adminUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Save authentication state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('isAdminAuthenticated', isAuthenticated.toString());
      if (user) {
        localStorage.setItem('adminUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('adminUser');
      }
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  }, [isAuthenticated, user]);

  const login = (username, password) => {
    setLoading(true);
    
    // Simple credential check - hardcoded for demo
    const validCredentials = [
      { username: 'admin', password: 'admin123' },
      { username: 'admin', password: 'admin' },
      { username: 'stellarwaves', password: 'cosmic2024' },
      { username: 'demo', password: 'demo123' }
    ];

    const isValidCredential = validCredentials.some(
      cred => cred.username === username && cred.password === password
    );

    if (isValidCredential) {
      const userData = {
        username,
        email: `${username}@stellarwaves.com`,
        loginTime: new Date().toISOString()
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
      
      return { success: true, user: userData };
    } else {
      setLoading(false);
      return { success: false, error: 'Invalid username or password' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    try {
      localStorage.removeItem('isAdminAuthenticated');
      localStorage.removeItem('adminUser');
    } catch (error) {
      console.error('Error clearing auth state:', error);
    }
  };

  const completeOnboarding = () => {
    // Admin users don't need onboarding
    return true;
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    completeOnboarding
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}