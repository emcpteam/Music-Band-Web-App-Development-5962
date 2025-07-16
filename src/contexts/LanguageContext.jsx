import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Translations
const translations = {
  en: {
    // Navigation
    home: 'Home',
    music: 'Music',
    gallery: 'Gallery',
    podcast: 'Podcast',
    fanWall: 'Fan Wall',
    merch: 'Merch',
    admin: 'Admin',
    
    // Music Player
    musicPlayer: 'Music Player',
    immersiveExperience: 'Immerse yourself in our cosmic soundscape',
    lyricsNotes: 'Lyrics & Notes',
    trackList: 'Track List',
    like: 'Like',
    share: 'Share',
    listenNow: 'Listen Now',
    noSongsYet: 'No songs available yet',
    songsWillAppear: 'Songs will appear here when added by the band.',
    noLyricsAvailable: 'No lyrics available for this track.',
    artistNotes: 'Artist Notes',
    
    // Merchandising
    merchandise: 'Merchandise',
    showSupport: 'Show your support with',
    gear: 'gear',
    allItems: 'All Items',
    musicItems: 'Music',
    apparel: 'Apparel',
    artPrints: 'Art & Prints',
    accessories: 'Accessories',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    limited: 'Limited',
    lowStock: 'Low Stock',
    inStock: 'in stock',
    freeShipping: 'Free shipping',
    freeShippingOver: 'Free shipping on orders over $50',
    premiumQuality: 'Premium Quality',
    highQualityMaterials: 'High-quality materials and craftsmanship',
    fanApproved: 'Fan Approved',
    lovedByFans: 'Loved by fans worldwide',
    noProductsAvailable: 'No products available',
    productsWillAppear: 'Products will appear here when added by the band.',
    
    // Common
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
    // Navigation
    home: 'Home',
    music: 'Musica',
    gallery: 'Galleria',
    podcast: 'Podcast',
    fanWall: 'Muro dei Fan',
    merch: 'Merchandising',
    admin: 'Admin',
    
    // Music Player
    musicPlayer: 'Lettore Musicale',
    immersiveExperience: 'Immergiti nel nostro paesaggio sonoro cosmico',
    lyricsNotes: 'Testi e Note',
    trackList: 'Lista Tracce',
    like: 'Mi Piace',
    share: 'Condividi',
    listenNow: 'Ascolta Ora',
    noSongsYet: 'Nessuna canzone ancora disponibile',
    songsWillAppear: 'Le canzoni appariranno qui quando aggiunte dalla band.',
    noLyricsAvailable: 'Nessun testo disponibile per questa traccia.',
    artistNotes: 'Note dell\'Artista',
    
    // Merchandising
    merchandise: 'Merchandising',
    showSupport: 'Mostra il tuo supporto con',
    gear: 'articoli',
    allItems: 'Tutti gli Articoli',
    musicItems: 'Musica',
    apparel: 'Abbigliamento',
    artPrints: 'Arte e Stampe',
    accessories: 'Accessori',
    addToCart: 'Aggiungi al Carrello',
    buyNow: 'Compra Ora',
    limited: 'Limitato',
    lowStock: 'Scorte Limitate',
    inStock: 'disponibili',
    freeShipping: 'Spedizione gratuita',
    freeShippingOver: 'Spedizione gratuita per ordini superiori a $50',
    premiumQuality: 'Qualità Premium',
    highQualityMaterials: 'Materiali e lavorazione di alta qualità',
    fanApproved: 'Approvato dai Fan',
    lovedByFans: 'Amato dai fan di tutto il mondo',
    noProductsAvailable: 'Nessun prodotto disponibile',
    productsWillAppear: 'I prodotti appariranno qui quando aggiunti dalla band.',
    
    // Common
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
};

// Admin translations
const adminTranslations = {
  en: {
    // Dashboard
    dashboardOverview: 'Dashboard Overview',
    welcomeBack: 'Welcome back!',
    totalAlbums: 'Total Albums',
    totalSongs: 'Total Songs',
    podcastEpisodes: 'Podcast Episodes',
    products: 'Products',
    pendingComments: 'Pending Comments',
    uploadedFiles: 'Uploaded Files',
    mediaItems: 'Media Items',
    recentSongs: 'Recent Songs',
    quickActions: 'Quick Actions',
    uploadFiles: 'Upload Files',
    moderateComments: 'Moderate Comments',
    addNewSong: 'Add New Song',
    
    // Settings
    bandSettings: 'Band Settings',
    themeCustomizer: 'Theme Customizer',
    albums: 'Albums',
    songs: 'Songs',
    podcasts: 'Podcasts',
    mediaGallery: 'Media Gallery',
    merchandise: 'Merchandise',
    fileManager: 'File Manager',
    comments: 'Comments',
    translationManager: 'Translation Manager',
    accountSettings: 'Account Settings',
    systemConfiguration: 'System Configuration',
    adminPanel: 'Admin Panel',
    logout: 'Logout',
    
    // Account Settings
    adminCredentials: 'Admin Credentials',
    adminUsername: 'Admin Username',
    emailAddress: 'Email Address',
    enterUsername: 'Enter username',
    updateCredentials: 'Update Credentials',
    passwordManagement: 'Password Management',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    enterCurrentPassword: 'Enter current password',
    enterNewPassword: 'Enter new password',
    confirmNewPassword: 'Confirm new password',
    updatePassword: 'Update Password',
    credentialsUpdated: 'Credentials updated successfully',
    passwordUpdated: 'Password updated successfully',
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    incorrectPassword: 'Current password is incorrect',
    error: 'An error occurred',
    
    // Common
    overview: 'Overview',
    loading: 'Loading...',
    forgotPassword: 'Forgot Password?',
    backToLogin: 'Back to Login',
    resetPassword: 'Reset Password',
    resetInstructions: 'Enter your username to receive password reset instructions',
    sendResetLink: 'Send Reset Link'
  },
  
  it: {
    // Dashboard
    dashboardOverview: 'Panoramica Dashboard',
    welcomeBack: 'Bentornato!',
    totalAlbums: 'Album Totali',
    totalSongs: 'Canzoni Totali',
    podcastEpisodes: 'Episodi Podcast',
    products: 'Prodotti',
    pendingComments: 'Commenti in Attesa',
    uploadedFiles: 'File Caricati',
    mediaItems: 'Elementi Media',
    recentSongs: 'Canzoni Recenti',
    quickActions: 'Azioni Rapide',
    uploadFiles: 'Carica File',
    moderateComments: 'Modera Commenti',
    addNewSong: 'Aggiungi Nuova Canzone',
    
    // Settings
    bandSettings: 'Impostazioni Band',
    themeCustomizer: 'Personalizzatore Tema',
    albums: 'Album',
    songs: 'Canzoni',
    podcasts: 'Podcast',
    mediaGallery: 'Galleria Media',
    merchandise: 'Merchandising',
    fileManager: 'Gestore File',
    comments: 'Commenti',
    translationManager: 'Gestore Traduzioni',
    accountSettings: 'Impostazioni Account',
    systemConfiguration: 'Configurazione Sistema',
    adminPanel: 'Pannello Admin',
    logout: 'Esci',
    
    // Account Settings
    adminCredentials: 'Credenziali Admin',
    adminUsername: 'Username Admin',
    emailAddress: 'Indirizzo Email',
    enterUsername: 'Inserisci username',
    updateCredentials: 'Aggiorna Credenziali',
    passwordManagement: 'Gestione Password',
    currentPassword: 'Password Attuale',
    newPassword: 'Nuova Password',
    confirmPassword: 'Conferma Password',
    enterCurrentPassword: 'Inserisci password attuale',
    enterNewPassword: 'Inserisci nuova password',
    confirmNewPassword: 'Conferma nuova password',
    updatePassword: 'Aggiorna Password',
    credentialsUpdated: 'Credenziali aggiornate con successo',
    passwordUpdated: 'Password aggiornata con successo',
    passwordMismatch: 'Le password non corrispondono',
    passwordTooShort: 'La password deve essere di almeno 6 caratteri',
    incorrectPassword: 'Password attuale non corretta',
    error: 'Si è verificato un errore',
    
    // Common
    overview: 'Panoramica',
    loading: 'Caricamento...',
    forgotPassword: 'Password Dimenticata?',
    backToLogin: 'Torna al Login',
    resetPassword: 'Reimposta Password',
    resetInstructions: 'Inserisci il tuo username per ricevere le istruzioni di reset della password',
    sendResetLink: 'Invia Link di Reset'
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    try {
      // Default to Italian
      return localStorage.getItem('selectedLanguage') || 'it';
    } catch (error) {
      return 'it'; // Default to Italian if localStorage fails
    }
  });

  // Save language preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('selectedLanguage', currentLanguage);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  }, [currentLanguage]);

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
  };

  // Frontend translations
  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  // Admin translations
  const ta = (key) => {
    return adminTranslations[currentLanguage]?.[key] || adminTranslations.en[key] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t, // Frontend translations
    ta, // Admin translations
    availableLanguages: [
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