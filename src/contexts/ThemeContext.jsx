import React, { createContext, useContext, useEffect } from 'react';
import { useAdmin } from './AdminContext';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { data } = useAdmin();
  const theme = data?.theme;

  // Apply theme to CSS custom properties
  useEffect(() => {
    if (theme) {
      const root = document.documentElement;
      
      // Set CSS custom properties for the theme
      root.style.setProperty('--theme-primary', theme.primaryColor);
      root.style.setProperty('--theme-secondary', theme.secondaryColor);
      root.style.setProperty('--theme-accent', theme.accentColor);
      root.style.setProperty('--theme-background', theme.backgroundColor);
      root.style.setProperty('--theme-text', theme.textColor);
      root.style.setProperty('--theme-font-family', theme.fontFamily);

      // Apply font family to body
      document.body.style.fontFamily = theme.fontFamily;

      // Create dynamic gradient styles
      const primaryRgb = hexToRgb(theme.primaryColor);
      const secondaryRgb = hexToRgb(theme.secondaryColor);
      const accentRgb = hexToRgb(theme.accentColor);

      if (primaryRgb && secondaryRgb && accentRgb) {
        root.style.setProperty('--theme-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
        root.style.setProperty('--theme-secondary-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
        root.style.setProperty('--theme-accent-rgb', `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`);
      }
    }
  }, [theme]);

  // Helper function to convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const value = {
    theme,
    applyTheme: (newTheme) => {
      // This will be handled by the admin context
      // The useEffect above will automatically apply changes
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};