import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext(null);

// Initial state
const initialState = {
  band: {
    name: "Stellar Waves",
    tagline: "Cosmic electronic soundscapes",
    description: "An electronic music project exploring the intersection of ambient, downtempo, and cosmic soundscapes.",
    email: "contact@stellarwaves.com",
    socialLinks: {
      instagram: "https://instagram.com/stellarwaves",
      spotify: "https://open.spotify.com/artist/stellarwaves",
      youtube: "https://youtube.com/stellarwaves",
      bandcamp: "https://stellarwaves.bandcamp.com"
    },
    footer: {},
    sectionVisibility: {
      gallery: true,
      podcast: true,
      fanWall: true,
      merchandising: true
    }
  },
  adminCredentials: {
    username: "admin",
    email: "admin@stellarwaves.com"
  },
  theme: {
    primaryColor: "#8B5CF6",
    secondaryColor: "#EC4899",
    accentColor: "#06B6D4",
    fontFamily: "Poppins",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937"
  },
  albums: [],
  songs: [],
  podcasts: [],
  media: [],
  products: [],
  uploadedFiles: [],
  comments: []
};

export function AdminProvider({ children }) {
  const [data, setData] = useState(initialState);
  const [themeUpdateTrigger, setThemeUpdateTrigger] = useState(0);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('bandAdminData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setData(prevData => ({
          ...prevData,
          ...parsedData
        }));
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('bandAdminData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving admin data:', error);
    }
  }, [data]);

  const updateBandSettings = (settings) => {
    setData(prev => ({
      ...prev,
      band: {
        ...prev.band,
        ...settings
      }
    }));
  };

  const updateTheme = (newTheme) => {
    setData(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...newTheme
      }
    }));
    setThemeUpdateTrigger(prev => prev + 1);
  };

  const value = {
    data,
    themeUpdateTrigger,
    updateBandSettings,
    updateTheme
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}

export function useBandData() {
  const { data } = useAdmin();
  return data;
}