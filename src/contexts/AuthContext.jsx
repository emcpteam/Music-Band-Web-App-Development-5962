import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem('quest_token');
    const userId = localStorage.getItem('quest_userId');
    
    if (token && userId) {
      setUser({ userId, token });
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  const login = ({ userId, token, newUser }) => {
    localStorage.setItem('quest_token', token);
    localStorage.setItem('quest_userId', userId);
    localStorage.setItem('quest_isNewUser', newUser.toString());
    
    setUser({ userId, token, newUser });
    setIsAuthenticated(true);
    
    return { newUser };
  };

  const logout = () => {
    localStorage.removeItem('quest_token');
    localStorage.removeItem('quest_userId');
    localStorage.removeItem('quest_isNewUser');
    localStorage.removeItem('quest_onboardingComplete');
    
    setUser(null);
    setIsAuthenticated(false);
  };

  const completeOnboarding = () => {
    localStorage.setItem('quest_onboardingComplete', 'true');
  };

  const isOnboardingComplete = () => {
    return localStorage.getItem('quest_onboardingComplete') === 'true';
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    completeOnboarding,
    isOnboardingComplete
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};