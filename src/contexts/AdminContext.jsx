import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

const initialData = {
  band: {
    name: "Stellar Waves",
    tagline: "Cosmic Dreams - Digital Booklet Experience",
    logo: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center",
    description: "Creating cosmic soundscapes that transport you to another dimension.",
    email: "hello@stellarwaves.com",
    socialLinks: {
      instagram: "https://instagram.com/stellarwaves",
      spotify: "https://spotify.com/artist/stellarwaves",
      youtube: "https://youtube.com/stellarwaves",
      bandcamp: "https://stellarwaves.bandcamp.com"
    },
    tracking: {
      metaPixelCode: "",
      googleTagManagerCode: ""
    }
  },
  adminCredentials: {
    username: "admin",
    password: "admin123",
    email: "admin@stellarwaves.com"
  },
  theme: {
    primaryColor: "#8B5CF6",
    secondaryColor: "#EC4899",
    accentColor: "#06B6D4",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
    fontFamily: "Poppins"
  },
  translations: {
    en: {
      home: 'Home',
      music: 'Music',
      gallery: 'Gallery',
      podcast: 'Podcast',
      fanWall: 'Fan Wall',
      merch: 'Merch',
      admin: 'Admin',
      listenNow: 'Listen Now',
      musicPlayer: 'Music Player',
      immersiveExperience: 'Immerse yourself in our cosmic soundscape',
      lyricsNotes: 'Lyrics & Notes',
      trackList: 'Track List',
      like: 'Like',
      share: 'Share',
      noSongsYet: 'No songs available yet',
      songsWillAppear: 'Songs will appear here once they are added by the band.',
      noLyricsAvailable: 'No lyrics available for this track.',
      artistNotes: 'Artist Notes:',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      create: 'Create',
      update: 'Update',
      close: 'Close'
    },
    it: {
      home: 'Home',
      music: 'Musica',
      gallery: 'Galleria',
      podcast: 'Podcast',
      fanWall: 'Muro dei Fan',
      merch: 'Merchandising',
      admin: 'Admin',
      listenNow: 'Ascolta Ora',
      musicPlayer: 'Lettore Musicale',
      immersiveExperience: 'Immergiti nel nostro paesaggio sonoro cosmico',
      lyricsNotes: 'Testi e Note',
      trackList: 'Lista Tracce',
      like: 'Mi Piace',
      share: 'Condividi',
      noSongsYet: 'Nessuna canzone ancora disponibile',
      songsWillAppear: 'Le canzoni appariranno qui una volta aggiunte dalla band.',
      noLyricsAvailable: 'Nessun testo disponibile per questa traccia.',
      artistNotes: 'Note dell\'Artista:',
      loading: 'Caricamento...',
      save: 'Salva',
      cancel: 'Annulla',
      delete: 'Elimina',
      edit: 'Modifica',
      add: 'Aggiungi',
      create: 'Crea',
      update: 'Aggiorna',
      close: 'Chiudi'
    }
  },
  albums: [
    {
      id: 1,
      title: "Cosmic Dreams",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center",
      releaseDate: "2024-01-15",
      description: "Our latest journey through cosmic soundscapes",
      genre: "Electronic/Ambient",
      duration: "45:30",
      trackCount: 12,
      recordLabel: "Stellar Records",
      producer: "Alex Cosmos",
      engineer: "Sarah Starlight",
      studio: "Cosmic Studios, Los Angeles",
      credits: {
        vocals: "Luna Stellar - Lead vocals, backing vocals",
        guitar: "Orion Wave - Electric guitar, acoustic guitar",
        bass: "Nova Sound - Bass guitar, synth bass",
        drums: "Cosmic Beat - Drums, electronic percussion",
        keyboards: "Stellar Key - Synthesizers, piano, organs",
        other: "Galaxy String Quartet - Strings on tracks 3, 7, 11"
      },
      liner_notes: "Cosmic Dreams represents our journey through the vastness of space and time.",
      special_thanks: "Special thanks to our fans who supported us through this cosmic journey.",
      isActive: true
    }
  ],
  songs: [
    {
      id: 1,
      title: "Cosmic Dreams",
      albumId: 1,
      duration: "3:45",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      lyrics: "Floating through the cosmic void\nStars are dancing in my mind\nGravity cannot destroy\nThe dreams that I hope to find",
      notes: "This track was inspired by a late-night stargazing session in the desert.",
      isActive: true,
      order: 1
    },
    {
      id: 2,
      title: "Neon Nights",
      albumId: 1,
      duration: "4:12",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      lyrics: "City lights are calling out\nNeon signs light up the street",
      notes: "Recorded during our tour through Tokyo.",
      isActive: true,
      order: 2
    }
  ],
  podcasts: [
    {
      id: 1,
      title: "The Making of Cosmic Dreams",
      description: "Join us as we dive deep into the creative process behind our latest album.",
      duration: "45:30",
      publishDate: "2024-01-15",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      isNew: true,
      isActive: true
    }
  ],
  media: [
    {
      id: 1,
      type: 'image',
      title: 'Studio Sessions',
      url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      description: 'Behind the scenes during the recording of Cosmic Dreams.',
      category: 'studio',
      isActive: true
    }
  ],
  products: [
    {
      id: 1,
      name: "Cosmic Dreams Vinyl",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
      description: "Limited edition vinyl pressing of our latest album.",
      category: "music",
      stock: 23,
      isLimited: true,
      isActive: true
    }
  ],
  comments: [
    {
      id: 1,
      username: "CosmicFan92",
      email: "fan@example.com",
      message: "Amazing new album! The production quality is incredible.",
      timestamp: "2024-01-20T10:30:00Z",
      likes: 15,
      status: "pending",
      flags: []
    }
  ],
  uploadedFiles: []
};

// Safe localStorage operations
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage.getItem failed:', error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('localStorage.setItem failed:', error);
      return false;
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('localStorage.removeItem failed:', error);
      return false;
    }
  }
};

export const AdminProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = safeLocalStorage.getItem('bandAdminData');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        return { ...initialData, ...parsedData };
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
    return initialData;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return safeLocalStorage.getItem('adminAuth') === 'true';
  });

  // Force theme updates to propagate globally
  const [themeUpdateTrigger, setThemeUpdateTrigger] = useState(0);

  useEffect(() => {
    safeLocalStorage.setItem('bandAdminData', JSON.stringify(data));
  }, [data]);

  // Apply theme changes immediately to CSS variables
  useEffect(() => {
    if (data.theme) {
      const root = document.documentElement;
      
      // Set CSS custom properties
      root.style.setProperty('--theme-primary', data.theme.primaryColor);
      root.style.setProperty('--theme-secondary', data.theme.secondaryColor);
      root.style.setProperty('--theme-accent', data.theme.accentColor);
      root.style.setProperty('--theme-background', data.theme.backgroundColor);
      root.style.setProperty('--theme-text', data.theme.textColor);
      root.style.setProperty('--theme-font-family', data.theme.fontFamily);

      // Apply font family to body
      document.body.style.fontFamily = data.theme.fontFamily;

      // Create RGB values for transparency effects
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };

      const primaryRgb = hexToRgb(data.theme.primaryColor);
      const secondaryRgb = hexToRgb(data.theme.secondaryColor);
      const accentRgb = hexToRgb(data.theme.accentColor);

      if (primaryRgb && secondaryRgb && accentRgb) {
        root.style.setProperty('--theme-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
        root.style.setProperty('--theme-secondary-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
        root.style.setProperty('--theme-accent-rgb', `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`);
      }

      // Trigger a custom event to notify components of theme change
      window.dispatchEvent(new CustomEvent('themeUpdated', { 
        detail: { theme: data.theme, trigger: themeUpdateTrigger } 
      }));
    }
  }, [data.theme, themeUpdateTrigger]);

  const login = (username, password) => {
    const credentials = data.adminCredentials;
    if (username === credentials.username && password === credentials.password) {
      setIsAuthenticated(true);
      safeLocalStorage.setItem('adminAuth', 'true');
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    safeLocalStorage.removeItem('adminAuth');
  };

  const updateBandInfo = (updates) => {
    setData(prev => ({
      ...prev,
      band: { ...prev.band, ...updates }
    }));
  };

  const updateTheme = (themeUpdates) => {
    setData(prev => ({
      ...prev,
      theme: { ...prev.theme, ...themeUpdates }
    }));
    // Force theme update trigger
    setThemeUpdateTrigger(prev => prev + 1);
  };

  const updateTranslations = (newTranslations) => {
    setData(prev => ({
      ...prev,
      translations: { ...prev.translations, ...newTranslations }
    }));
  };

  // CRUD operations with error handling
  const createAlbum = (album) => {
    try {
      const newAlbum = { ...album, id: Date.now(), isActive: true };
      setData(prev => ({
        ...prev,
        albums: [...prev.albums, newAlbum]
      }));
      return newAlbum;
    } catch (error) {
      console.error('Error creating album:', error);
      return null;
    }
  };

  const updateAlbum = (id, updates) => {
    try {
      setData(prev => ({
        ...prev,
        albums: prev.albums.map(album => 
          album.id === id ? { ...album, ...updates } : album
        )
      }));
    } catch (error) {
      console.error('Error updating album:', error);
    }
  };

  const deleteAlbum = (id) => {
    try {
      setData(prev => ({
        ...prev,
        albums: prev.albums.filter(album => album.id !== id),
        songs: prev.songs.filter(song => song.albumId !== id)
      }));
    } catch (error) {
      console.error('Error deleting album:', error);
    }
  };

  const createSong = (song) => {
    try {
      const newSong = { ...song, id: Date.now(), isActive: true };
      setData(prev => ({
        ...prev,
        songs: [...prev.songs, newSong]
      }));
      return newSong;
    } catch (error) {
      console.error('Error creating song:', error);
      return null;
    }
  };

  const updateSong = (id, updates) => {
    try {
      setData(prev => ({
        ...prev,
        songs: prev.songs.map(song => 
          song.id === id ? { ...song, ...updates } : song
        )
      }));
    } catch (error) {
      console.error('Error updating song:', error);
    }
  };

  const deleteSong = (id) => {
    try {
      setData(prev => ({
        ...prev,
        songs: prev.songs.filter(song => song.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  const createPodcast = (podcast) => {
    try {
      const newPodcast = { 
        ...podcast, 
        id: Date.now(), 
        isActive: true, 
        publishDate: new Date().toISOString().split('T')[0] 
      };
      setData(prev => ({
        ...prev,
        podcasts: [...prev.podcasts, newPodcast]
      }));
      return newPodcast;
    } catch (error) {
      console.error('Error creating podcast:', error);
      return null;
    }
  };

  const updatePodcast = (id, updates) => {
    try {
      setData(prev => ({
        ...prev,
        podcasts: prev.podcasts.map(podcast => 
          podcast.id === id ? { ...podcast, ...updates } : podcast
        )
      }));
    } catch (error) {
      console.error('Error updating podcast:', error);
    }
  };

  const deletePodcast = (id) => {
    try {
      setData(prev => ({
        ...prev,
        podcasts: prev.podcasts.filter(podcast => podcast.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting podcast:', error);
    }
  };

  const createMedia = (media) => {
    try {
      const newMedia = { ...media, id: Date.now(), isActive: true };
      setData(prev => ({
        ...prev,
        media: [...prev.media, newMedia]
      }));
      return newMedia;
    } catch (error) {
      console.error('Error creating media:', error);
      return null;
    }
  };

  const updateMedia = (id, updates) => {
    try {
      setData(prev => ({
        ...prev,
        media: prev.media.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      }));
    } catch (error) {
      console.error('Error updating media:', error);
    }
  };

  const deleteMedia = (id) => {
    try {
      setData(prev => ({
        ...prev,
        media: prev.media.filter(item => item.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  const createProduct = (product) => {
    try {
      const newProduct = { ...product, id: Date.now(), isActive: true };
      setData(prev => ({
        ...prev,
        products: [...prev.products, newProduct]
      }));
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  };

  const updateProduct = (id, updates) => {
    try {
      setData(prev => ({
        ...prev,
        products: prev.products.map(product => 
          product.id === id ? { ...product, ...updates } : product
        )
      }));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = (id) => {
    try {
      setData(prev => ({
        ...prev,
        products: prev.products.filter(product => product.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const addUploadedFile = (file) => {
    try {
      setData(prev => {
        const existingFiles = Array.isArray(prev.uploadedFiles) ? prev.uploadedFiles : [];
        const existingIndex = existingFiles.findIndex(f => f.id === file.id);
        
        if (existingIndex !== -1) {
          const updatedFiles = [...existingFiles];
          updatedFiles[existingIndex] = { ...existingFiles[existingIndex], ...file };
          return { ...prev, uploadedFiles: updatedFiles };
        } else {
          return { ...prev, uploadedFiles: [...existingFiles, file] };
        }
      });
    } catch (error) {
      console.error('Error adding uploaded file:', error);
    }
  };

  const removeUploadedFile = (fileId) => {
    try {
      setData(prev => ({
        ...prev,
        uploadedFiles: (prev.uploadedFiles || []).filter(file => file.id !== fileId)
      }));
    } catch (error) {
      console.error('Error removing uploaded file:', error);
    }
  };

  const approveComment = (commentId) => {
    try {
      setData(prev => ({
        ...prev,
        comments: prev.comments.map(comment => 
          comment.id === commentId ? { ...comment, status: 'approved' } : comment
        )
      }));
    } catch (error) {
      console.error('Error approving comment:', error);
    }
  };

  const rejectComment = (commentId) => {
    try {
      setData(prev => ({
        ...prev,
        comments: prev.comments.map(comment => 
          comment.id === commentId ? { ...comment, status: 'rejected' } : comment
        )
      }));
    } catch (error) {
      console.error('Error rejecting comment:', error);
    }
  };

  const deleteComment = (commentId) => {
    try {
      setData(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => comment.id !== commentId)
      }));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const changePassword = (currentPassword, newPassword) => {
    try {
      if (currentPassword !== data.adminCredentials.password) {
        return { success: false, error: 'Current password is incorrect' };
      }
      
      if (newPassword.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }
      
      setData(prev => ({
        ...prev,
        adminCredentials: { ...prev.adminCredentials, password: newPassword }
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error changing password:', error);
      return { success: false, error: 'Failed to change password' };
    }
  };

  const updateAdminCredentials = (username, email) => {
    try {
      setData(prev => ({
        ...prev,
        adminCredentials: {
          ...prev.adminCredentials,
          username: username || prev.adminCredentials.username,
          email: email || prev.adminCredentials.email
        }
      }));
      return { success: true };
    } catch (error) {
      console.error('Error updating credentials:', error);
      return { success: false, error: 'Failed to update credentials' };
    }
  };

  const resetPassword = (username) => {
    try {
      if (username !== data.adminCredentials.username) {
        return { success: false, error: 'Username not found' };
      }
      
      const tempPassword = Math.random().toString(36).substring(2, 10);
      setData(prev => ({
        ...prev,
        adminCredentials: { ...prev.adminCredentials, password: tempPassword }
      }));
      
      return { 
        success: true, 
        tempPassword,
        message: `Temporary password: ${tempPassword}\nPlease change it after logging in.` 
      };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, error: 'Failed to reset password' };
    }
  };

  const value = {
    data,
    isAuthenticated,
    login,
    logout,
    updateBandInfo,
    updateTheme,
    updateTranslations,
    addUploadedFile,
    removeUploadedFile,
    approveComment,
    rejectComment,
    deleteComment,
    changePassword,
    updateAdminCredentials,
    resetPassword,
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
    themeUpdateTrigger
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useBandData = () => {
  const context = useContext(AdminContext);
  if (!context) {
    const saved = safeLocalStorage.getItem('bandAdminData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
    return initialData;
  }
  return context.data;
};