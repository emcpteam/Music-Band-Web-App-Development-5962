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
        setData(prevData => ({ ...prevData, ...parsedData }));
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
      band: { ...prev.band, ...settings }
    }));
  };

  const updateTheme = (newTheme) => {
    setData(prev => ({
      ...prev,
      theme: { ...prev.theme, ...newTheme }
    }));
    setThemeUpdateTrigger(prev => prev + 1);
  };
  
  // Album management
  const createAlbum = (albumData) => {
    const newAlbum = {
      ...albumData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    setData(prev => ({
      ...prev,
      albums: [...prev.albums, newAlbum]
    }));
    
    return newAlbum;
  };
  
  const updateAlbum = (id, albumData) => {
    setData(prev => ({
      ...prev,
      albums: prev.albums.map(album => 
        album.id === id ? { ...album, ...albumData } : album
      )
    }));
  };
  
  const deleteAlbum = (id) => {
    setData(prev => ({
      ...prev,
      albums: prev.albums.filter(album => album.id !== id),
      // Also delete related songs
      songs: prev.songs.filter(song => song.albumId !== id)
    }));
  };
  
  // Song management
  const createSong = (songData) => {
    const newSong = {
      ...songData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    setData(prev => ({
      ...prev,
      songs: [...prev.songs, newSong]
    }));
    
    return newSong;
  };
  
  const updateSong = (id, songData) => {
    setData(prev => ({
      ...prev,
      songs: prev.songs.map(song => 
        song.id === id ? { ...song, ...songData } : song
      )
    }));
  };
  
  const deleteSong = (id) => {
    setData(prev => ({
      ...prev,
      songs: prev.songs.filter(song => song.id !== id)
    }));
  };
  
  // Podcast management
  const createPodcast = (podcastData) => {
    const newPodcast = {
      ...podcastData,
      id: Date.now(),
      publishDate: new Date().toISOString()
    };
    
    setData(prev => ({
      ...prev,
      podcasts: [...prev.podcasts, newPodcast]
    }));
    
    return newPodcast;
  };
  
  const updatePodcast = (id, podcastData) => {
    setData(prev => ({
      ...prev,
      podcasts: prev.podcasts.map(podcast => 
        podcast.id === id ? { ...podcast, ...podcastData } : podcast
      )
    }));
  };
  
  const deletePodcast = (id) => {
    setData(prev => ({
      ...prev,
      podcasts: prev.podcasts.filter(podcast => podcast.id !== id)
    }));
  };
  
  // Media management
  const createMedia = (mediaData) => {
    const newMedia = {
      ...mediaData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    setData(prev => ({
      ...prev,
      media: [...prev.media, newMedia]
    }));
    
    return newMedia;
  };
  
  const updateMedia = (id, mediaData) => {
    setData(prev => ({
      ...prev,
      media: prev.media.map(media => 
        media.id === id ? { ...media, ...mediaData } : media
      )
    }));
  };
  
  const deleteMedia = (id) => {
    setData(prev => ({
      ...prev,
      media: prev.media.filter(media => media.id !== id)
    }));
  };
  
  // Product management
  const createProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    setData(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
    
    return newProduct;
  };
  
  const updateProduct = (id, productData) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(product => 
        product.id === id ? { ...product, ...productData } : product
      )
    }));
  };
  
  const deleteProduct = (id) => {
    setData(prev => ({
      ...prev,
      products: prev.products.filter(product => product.id !== id)
    }));
  };
  
  // File management
  const addUploadedFile = (fileData) => {
    setData(prev => {
      // Check if file already exists (for updates)
      const existingIndex = prev.uploadedFiles.findIndex(f => f.id === fileData.id);
      
      if (existingIndex >= 0) {
        // Update existing file
        const updatedFiles = [...prev.uploadedFiles];
        updatedFiles[existingIndex] = fileData;
        return {
          ...prev,
          uploadedFiles: updatedFiles
        };
      } else {
        // Add new file
        return {
          ...prev,
          uploadedFiles: [...prev.uploadedFiles, fileData]
        };
      }
    });
  };
  
  const removeUploadedFile = (fileId) => {
    setData(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter(file => file.id !== fileId)
    }));
  };
  
  // Comment management
  const approveComment = (commentId) => {
    setData(prev => ({
      ...prev,
      comments: prev.comments.map(comment => 
        comment.id === commentId ? { ...comment, status: 'approved' } : comment
      )
    }));
  };
  
  const rejectComment = (commentId) => {
    setData(prev => ({
      ...prev,
      comments: prev.comments.map(comment => 
        comment.id === commentId ? { ...comment, status: 'rejected' } : comment
      )
    }));
  };
  
  const deleteComment = (commentId) => {
    setData(prev => ({
      ...prev,
      comments: prev.comments.filter(comment => comment.id !== commentId)
    }));
  };
  
  // Account settings
  const updateAdminCredentials = (username, email) => {
    setData(prev => ({
      ...prev,
      adminCredentials: {
        ...prev.adminCredentials,
        username,
        email
      }
    }));
    
    return { success: true };
  };
  
  const changePassword = (currentPassword, newPassword) => {
    // This is a mock implementation since we don't store passwords
    // In a real app, this would verify the current password and update to the new one
    if (currentPassword === 'admin123' || currentPassword === 'admin') {
      return { success: true };
    } else {
      return { success: false, error: 'Current password is incorrect' };
    }
  };
  
  // Footer settings
  const updateFooterSettings = (footerData) => {
    setData(prev => ({
      ...prev,
      band: {
        ...prev.band,
        footer: footerData
      }
    }));
  };
  
  // SEO settings
  const updateSeoSettings = (seoData) => {
    setData(prev => ({
      ...prev,
      band: {
        ...prev.band,
        seo: seoData
      }
    }));
  };
  
  // System configuration
  const updateSystemConfiguration = (configData) => {
    setData(prev => ({
      ...prev,
      systemConfig: configData
    }));
  };
  
  // Translation management
  const updateTranslations = (translationsData) => {
    setData(prev => ({
      ...prev,
      translations: translationsData
    }));
  };

  const value = {
    data,
    themeUpdateTrigger,
    updateBandSettings,
    updateTheme,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    createSong,
    updateSong,
    deleteSong,
    createPodcast,
    updatePodcast,
    deletePodcast,
    createMedia,
    updateMedia,
    deleteMedia,
    createProduct,
    updateProduct,
    deleteProduct,
    addUploadedFile,
    removeUploadedFile,
    approveComment,
    rejectComment,
    deleteComment,
    updateAdminCredentials,
    changePassword,
    updateFooterSettings,
    updateSeoSettings,
    updateSystemConfiguration,
    updateTranslations
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