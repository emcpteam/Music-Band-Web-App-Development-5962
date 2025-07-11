import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AdminContext = createContext();

// Create a hook to use the admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

// Create a hook to access just the band data
export const useBandData = () => {
  const { data } = useAdmin();
  return data;
};

// Admin Provider Component
export const AdminProvider = ({ children }) => {
  // State for theme updates
  const [themeUpdateTrigger, setThemeUpdateTrigger] = useState(0);
  
  // Initial data with section visibility
  const [data, setData] = useState({
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
      // Section visibility controls
      sectionVisibility: {
        albums: true,
        merchandising: true,
        fanWall: true,
        podcast: true,
        gallery: true
      },
      // Footer settings
      footer: {
        copyrightText: "© 2024 Stellar Waves. All rights reserved.",
        customText: "Join us on a cosmic journey through sound and emotion.",
        showQuickLinks: true,
        showSocialLinks: true,
        embedCodes: {
          gdprBanner: "",
          cookieBanner: "",
          customScript: "",
          customHtml: ""
        },
        legalLinks: {
          privacyPolicy: "#privacy",
          termsOfService: "#terms",
          cookiePolicy: "#cookies",
          showLegalLinks: true
        },
        customLinks: [
          {
            label: "Press Kit",
            url: "#press",
            newTab: false
          }
        ]
      },
      // SEO settings
      seo: {
        title: "Stellar Waves - Cosmic Electronic Music",
        description: "Experience Stellar Waves' cosmic soundscapes. Listen to our latest albums, explore multimedia content, and join our stellar community.",
        keywords: "Stellar Waves, music, electronic, ambient, cosmic, soundscape, album",
        ogImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=630&fit=crop&crop=center",
        twitterCard: "summary_large_image",
        canonicalUrl: "",
        robots: "index,follow",
        author: "Stellar Waves",
        language: "en",
        structuredData: true
      },
      // Tracking codes
      tracking: {
        metaPixelCode: "",
        googleTagManagerCode: ""
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
      backgroundColor: "#FFFFFF",
      textColor: "#1F2937",
      fontFamily: "Poppins",
      heroBackgroundType: "gradient",
      heroBackgroundImage: "",
      heroOverlayOpacity: 0.3,
      gradientDirection: "45deg",
      gradientPattern: "linear",
      heroTitleColor: "#FFFFFF",
      heroTitleStyle: "gradient",
      heroTitleShadow: true
    },
    albums: [
      {
        id: 1,
        title: "Cosmic Dreams",
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center",
        releaseDate: "2023-05-15",
        description: "A journey through cosmic soundscapes and electronic dreams. The album explores themes of space, time, and human connection.",
        genre: "Electronic, Ambient",
        duration: "45:30",
        trackCount: 8,
        recordLabel: "Stellar Records",
        producer: "Alex Stellar",
        engineer: "Sam Waves",
        studio: "Cosmic Studio, Berlin",
        credits: {
          vocals: "Luna Echo",
          guitar: "Alex Stellar",
          bass: "Maya Deep",
          drums: "Tom Rhythm",
          keyboards: "Sam Waves",
          other: "Cosmic Choir (tracks 3, 7)"
        },
        liner_notes: "Recorded during the summer solstice of 2022, this album represents a journey into the depths of cosmic consciousness.",
        special_thanks: "Thanks to all the stellar beings who supported this journey.",
        isActive: true
      }
    ],
    songs: [
      {
        id: 1,
        title: "Stellar Drift",
        albumId: 1,
        duration: "5:24",
        audioUrl: "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3",
        lyrics: "Drifting through the cosmos\nStars align in perfect harmony\nTime dissolves into eternity\nAs we float through endless space\n\nCosmic waves carry us\nThrough dimensions unexplored\nEchoes of ancient wisdom\nGuide our stellar journey home",
        notes: "This track was inspired by a night of stargazing in the desert, where the Milky Way was perfectly visible. The synth pads represent the vast expanse of space, while the pulsing bassline symbolizes the heartbeat of the cosmos.",
        isActive: true
      },
      {
        id: 2,
        title: "Ocean's Echo",
        albumId: 1,
        duration: "6:15",
        audioUrl: "https://cdn.pixabay.com/audio/2022/10/15/audio_946bc7d2bb.mp3",
        lyrics: "Deep beneath the surface\nEchoes of ancient times\nRippling through consciousness\nLike waves upon the shore\n\nThe ocean speaks in rhythms\nTelling stories of the deep\nConnecting all existence\nIn its vast eternal sweep",
        notes: "We recorded the water sounds during a trip to the Norwegian fjords. The track blends organic water recordings with synthetic textures to create a dialog between nature and technology.",
        isActive: true
      },
      {
        id: 3,
        title: "Aurora Dreams",
        albumId: 1,
        duration: "4:42",
        audioUrl: "https://cdn.pixabay.com/audio/2022/05/16/audio_1808fbf07a.mp3",
        lyrics: "Colors dance across the sky\nCelestial ballet of light\nAurora whispers ancient tales\nAs we stand in awe below\n\nTime stands still in this moment\nBreath suspended in wonder\nAs the heavens paint their dreams\nAcross the canvas of night",
        notes: "This track attempts to capture the feeling of witnessing the Northern Lights for the first time. The arpeggiated synthesizers represent the dancing lights, while the pad swells embody the sense of wonder and awe.",
        isActive: true
      }
    ],
    podcasts: [
      {
        id: 1,
        title: "The Making of 'Cosmic Dreams'",
        description: "In this episode, we dive deep into the creative process behind our latest album 'Cosmic Dreams'. We discuss the inspiration, the recording process, and share some behind-the-scenes stories.",
        duration: "45:30",
        audioUrl: "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3",
        publishDate: "2023-06-01",
        isNew: true,
        isActive: true
      },
      {
        id: 2,
        title: "Sound Design Secrets",
        description: "We explore the world of sound design and share some of our favorite techniques for creating unique sonic textures. From field recordings to modular synthesis, discover how we craft our signature sound.",
        duration: "38:15",
        audioUrl: "https://cdn.pixabay.com/audio/2022/10/15/audio_946bc7d2bb.mp3",
        publishDate: "2023-07-15",
        isNew: false,
        isActive: true
      }
    ],
    media: [
      {
        id: 1,
        type: "image",
        title: "Studio Session",
        url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop&crop=center",
        description: "Recording synth parts for our upcoming album",
        category: "studio",
        isActive: true
      },
      {
        id: 2,
        type: "image",
        title: "Live at Cosmic Festival",
        url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop&crop=center",
        description: "Our headline performance at Cosmic Festival 2023",
        category: "live",
        isActive: true
      },
      {
        id: 3,
        type: "video",
        title: "Making of 'Stellar Drift'",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        description: "Behind the scenes look at how we created our most popular track",
        category: "studio",
        isActive: true
      }
    ],
    products: [
      {
        id: 1,
        name: "Cosmic Dreams Vinyl",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1603048588665-709f3d108ae6?w=400&h=400&fit=crop&crop=center",
        description: "Limited edition vinyl pressing of our 'Cosmic Dreams' album. Includes gatefold sleeve with cosmic artwork and liner notes.",
        category: "music",
        stock: 100,
        isLimited: true,
        isActive: true
      },
      {
        id: 2,
        name: "Stellar Waves T-Shirt",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=400&h=400&fit=crop&crop=center",
        description: "Black t-shirt with our cosmic logo design. 100% organic cotton, fair trade certified.",
        category: "apparel",
        stock: 50,
        isLimited: false,
        isActive: true
      },
      {
        id: 3,
        name: "Cosmic Poster Set",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=400&h=400&fit=crop&crop=center",
        description: "Set of 3 high-quality art prints featuring artwork from our albums. Perfect for decorating your space.",
        category: "art",
        stock: 30,
        isLimited: false,
        isActive: true
      }
    ],
    uploadedFiles: [],
    comments: [
      {
        id: 1,
        username: "CosmicDreamer",
        message: "Absolutely love the new album! 'Cosmic Dreams' has been on repeat for weeks. The production is out of this world! 🌟",
        timestamp: "2024-01-20T10:30:00Z",
        likes: 24,
        status: "approved"
      },
      {
        id: 2,
        username: "StellarFan92",
        message: "Your live show in Tokyo was incredible! The energy was electric and the visuals were stunning. Can't wait for the next tour! ⚡",
        timestamp: "2024-01-19T15:45:00Z",
        likes: 18,
        status: "approved"
      },
      {
        id: 3,
        username: "WaveRider",
        message: "Been following you since the beginning and it's amazing to see how your sound has evolved. Keep riding those stellar waves! 🌊",
        timestamp: "2024-01-17T20:00:00Z",
        likes: 15,
        status: "pending"
      }
    ],
    systemConfig: {
      shipping: {
        freeShippingThreshold: 50,
        rates: {
          domestic: 8.99,
          canada: 12.99,
          europe: 15.99,
          uk: 12.99,
          australia: 18.99,
          asia: 22.99,
          worldwide: 25.99
        },
        processing: {
          standardDays: 3,
          expressDays: 1,
          internationalDays: 7
        }
      },
      taxes: {
        enabled: true,
        rates: {
          US: 8.5,
          CA: 13.0,
          EU: 20.0,
          UK: 20.0,
          AU: 10.0,
          JP: 10.0
        },
        inclusive: false
      }
    }
  });

  // Function to update section visibility
  const updateSectionVisibility = (section, isVisible) => {
    setData(prev => ({
      ...prev,
      band: {
        ...prev.band,
        sectionVisibility: {
          ...prev.band.sectionVisibility,
          [section]: isVisible
        }
      }
    }));
  };

  // Save data to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('bandAdminData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving admin data to localStorage:', error);
    }
  }, [data]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('bandAdminData');
      if (savedData) {
        setData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading admin data from localStorage:', error);
    }
  }, []);

  // Mock authentication functions
  const login = (username, password) => {
    if (username === data.adminCredentials.username && password === 'admin123') {
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    // Simply return success as this is a mock function
    return { success: true };
  };

  const resetPassword = (username) => {
    if (username === data.adminCredentials.username) {
      return { success: true, message: 'Password reset link sent to your email' };
    }
    return { success: false, error: 'Username not found' };
  };

  // Mock data manipulation functions
  const changePassword = (currentPassword, newPassword) => {
    if (currentPassword === 'admin123') {
      return { success: true };
    }
    return { success: false, error: 'Current password is incorrect' };
  };

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

  // Album management
  const createAlbum = (albumData) => {
    const newAlbum = {
      id: Date.now(),
      ...albumData
    };
    setData(prev => ({
      ...prev,
      albums: [...prev.albums, newAlbum]
    }));
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
      // Also delete associated songs
      songs: prev.songs.filter(song => song.albumId !== id)
    }));
  };

  // Song management
  const createSong = (songData) => {
    const newSong = {
      id: Date.now(),
      ...songData
    };
    setData(prev => ({
      ...prev,
      songs: [...prev.songs, newSong]
    }));
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
      id: Date.now(),
      publishDate: new Date().toISOString(),
      ...podcastData
    };
    setData(prev => ({
      ...prev,
      podcasts: [...prev.podcasts, newPodcast]
    }));
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
      id: Date.now(),
      ...mediaData
    };
    setData(prev => ({
      ...prev,
      media: [...prev.media, newMedia]
    }));
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
      id: Date.now(),
      ...productData
    };
    setData(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
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
      const existingFiles = prev.uploadedFiles || [];
      const fileIndex = existingFiles.findIndex(file => file.id === fileData.id);
      
      if (fileIndex >= 0) {
        // Update existing file
        return {
          ...prev,
          uploadedFiles: existingFiles.map((file, index) => 
            index === fileIndex ? { ...file, ...fileData } : file
          )
        };
      } else {
        // Add new file
        return {
          ...prev,
          uploadedFiles: [...existingFiles, fileData]
        };
      }
    });
  };

  const removeUploadedFile = (fileId) => {
    setData(prev => ({
      ...prev,
      uploadedFiles: (prev.uploadedFiles || []).filter(file => file.id !== fileId)
    }));
  };

  // Comment moderation
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

  // Theme management
  const updateTheme = (themeData) => {
    setData(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...themeData
      }
    }));
    setThemeUpdateTrigger(prev => prev + 1);
  };

  // Translation management
  const updateTranslations = (translationsData) => {
    setData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        ...translationsData
      }
    }));
  };

  // Footer settings
  const updateFooterSettings = (footerData) => {
    setData(prev => ({
      ...prev,
      band: {
        ...prev.band,
        footer: {
          ...prev.band.footer,
          ...footerData
        }
      }
    }));
  };

  // SEO settings
  const updateSeoSettings = (seoData) => {
    setData(prev => ({
      ...prev,
      band: {
        ...prev.band,
        seo: {
          ...prev.band.seo,
          ...seoData
        }
      }
    }));
  };

  // System configuration
  const updateSystemConfiguration = (configData) => {
    setData(prev => ({
      ...prev,
      systemConfig: {
        ...prev.systemConfig,
        ...configData
      }
    }));
  };

  // Context value
  const value = {
    data,
    themeUpdateTrigger,
    isAuthenticated: true, // Mock authentication status
    login,
    logout,
    resetPassword,
    changePassword,
    updateAdminCredentials,
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
    updateTheme,
    updateTranslations,
    updateFooterSettings,
    updateSeoSettings,
    updateSystemConfiguration,
    updateSectionVisibility
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};