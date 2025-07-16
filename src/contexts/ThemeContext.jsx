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
  const { data, themeUpdateTrigger } = useAdmin();
  const theme = data?.theme;

  // Apply theme to CSS custom properties whenever theme changes
  useEffect(() => {
    if (theme) {
      const root = document.documentElement;
      
      // Basic theme colors
      root.style.setProperty('--theme-primary', theme.primaryColor);
      root.style.setProperty('--theme-secondary', theme.secondaryColor);
      root.style.setProperty('--theme-accent', theme.accentColor);
      root.style.setProperty('--theme-background', theme.backgroundColor);
      root.style.setProperty('--theme-text', theme.textColor);
      root.style.setProperty('--theme-font-family', theme.fontFamily);
      
      // Apply section-specific colors if defined
      if (theme.sections) {
        // Header
        if (theme.sections.header) {
          root.style.setProperty('--theme-header-bg', theme.sections.header.backgroundColor || theme.backgroundColor);
          root.style.setProperty('--theme-header-text', theme.sections.header.textColor || theme.textColor);
          root.style.setProperty('--theme-header-gradient', theme.sections.header.gradient || 'none');
        }
        
        // Hero
        if (theme.sections.hero) {
          root.style.setProperty('--theme-hero-bg', theme.sections.hero.backgroundColor || theme.backgroundColor);
          root.style.setProperty('--theme-hero-text', theme.sections.hero.textColor || theme.textColor);
          root.style.setProperty('--theme-hero-gradient', theme.sections.hero.gradient || 'none');
        }
        
        // Music
        if (theme.sections.music) {
          root.style.setProperty('--theme-music-bg', theme.sections.music.backgroundColor || '#F9FAFB');
          root.style.setProperty('--theme-music-text', theme.sections.music.textColor || theme.textColor);
          root.style.setProperty('--theme-music-gradient', theme.sections.music.gradient || 'none');
        }
        
        // Gallery
        if (theme.sections.gallery) {
          root.style.setProperty('--theme-gallery-bg', theme.sections.gallery.backgroundColor || theme.backgroundColor);
          root.style.setProperty('--theme-gallery-text', theme.sections.gallery.textColor || theme.textColor);
          root.style.setProperty('--theme-gallery-gradient', theme.sections.gallery.gradient || 'none');
        }
        
        // Podcast
        if (theme.sections.podcast) {
          root.style.setProperty('--theme-podcast-bg', theme.sections.podcast.backgroundColor || '#F3F4F6');
          root.style.setProperty('--theme-podcast-text', theme.sections.podcast.textColor || theme.textColor);
          root.style.setProperty('--theme-podcast-gradient', theme.sections.podcast.gradient || 'none');
        }
        
        // Fan Wall
        if (theme.sections.fanwall) {
          root.style.setProperty('--theme-fanwall-bg', theme.sections.fanwall.backgroundColor || theme.backgroundColor);
          root.style.setProperty('--theme-fanwall-text', theme.sections.fanwall.textColor || theme.textColor);
          root.style.setProperty('--theme-fanwall-gradient', theme.sections.fanwall.gradient || 'none');
        }
        
        // Merch
        if (theme.sections.merch) {
          root.style.setProperty('--theme-merch-bg', theme.sections.merch.backgroundColor || '#F9FAFB');
          root.style.setProperty('--theme-merch-text', theme.sections.merch.textColor || theme.textColor);
          root.style.setProperty('--theme-merch-gradient', theme.sections.merch.gradient || 'none');
        }
        
        // Footer
        if (theme.sections.footer) {
          root.style.setProperty('--theme-footer-bg', theme.sections.footer.backgroundColor || '#1F2937');
          root.style.setProperty('--theme-footer-text', theme.sections.footer.textColor || '#FFFFFF');
          root.style.setProperty('--theme-footer-gradient', theme.sections.footer.gradient || 'none');
        }
      }

      // Create RGB values for transparency effects
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };
      
      const primaryRgb = hexToRgb(theme.primaryColor);
      const secondaryRgb = hexToRgb(theme.secondaryColor);
      const accentRgb = hexToRgb(theme.accentColor);
      
      if (primaryRgb && secondaryRgb && accentRgb) {
        root.style.setProperty('--theme-primary-rgb', `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`);
        root.style.setProperty('--theme-secondary-rgb', `${secondaryRgb.r},${secondaryRgb.g},${secondaryRgb.b}`);
        root.style.setProperty('--theme-accent-rgb', `${accentRgb.r},${accentRgb.g},${accentRgb.b}`);
      }
      
      // Apply gradient settings
      root.style.setProperty('--theme-gradient-direction', theme.gradientDirection || '45deg');
      root.style.setProperty('--theme-gradient-pattern', theme.gradientPattern || 'linear');
      
      // Apply font family to body
      document.body.style.fontFamily = theme.fontFamily;
      
      // Trigger a custom event to notify components of theme change
      window.dispatchEvent(new CustomEvent('themeUpdated', {
        detail: { theme, trigger: themeUpdateTrigger }
      }));
    }
  }, [theme, themeUpdateTrigger]);

  const value = {
    theme,
    themeUpdateTrigger
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};