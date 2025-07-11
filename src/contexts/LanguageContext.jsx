import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// ... rest of translations remain the same ...

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    try {
      // Changed default to 'it' (Italian)
      return localStorage.getItem('selectedLanguage') || 'it';
    } catch (error) {
      return 'it'; // Default to Italian
    }
  });

  // ... rest of the code remains the same ...

  const value = {
    currentLanguage,
    changeLanguage,
    t, // Frontend translations
    ta, // Admin translations
    availableLanguages: [
      // Changed order to show Italian first
      { code: 'it', name: 'Italiano', flag: '🇮🇹' },
      { code: 'en', name: 'English', flag: '🇺🇸' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};