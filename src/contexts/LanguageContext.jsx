import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Default translations (fallback)
const defaultTranslations = {
  en: {
    // Navigation
    home: 'Home',
    music: 'Music',
    gallery: 'Gallery',
    podcast: 'Podcast',
    fanWall: 'Fan Wall',
    merch: 'Merch',
    admin: 'Admin',
    // Hero Section
    listenNow: 'Listen Now',
    // Music Player
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
    // Multimedia Booklet
    multimediaBooklet: 'Multimedia Booklet',
    visualJourney: 'Explore our visual journey through music and art',
    allMedia: 'All Media',
    studio: 'Studio',
    liveShows: 'Live Shows',
    artwork: 'Artwork',
    backstage: 'Backstage',
    fanArt: 'Fan Art',
    playVideo: 'Play Video',
    viewImage: 'View Image',
    noMediaAvailable: 'No Media Available',
    mediaWillAppear: 'Media content will appear here when added by the band.',
    // Podcast Diary
    podcastDiary: 'Podcast Diary',
    intimateConversations: 'Intimate conversations and behind-the-scenes stories',
    noPodcastEpisodes: 'No Podcast Episodes Yet',
    podcastsWillAppear: 'Podcast episodes will appear here when published by the band.',
    neverMissEpisode: 'Never Miss an Episode',
    subscribeNotification: 'Subscribe to our podcast diary and get notified when we drop new episodes',
    subscribeSpotify: 'Subscribe on Spotify',
    subscribeApple: 'Subscribe on Apple Podcasts',
    play: 'Play',
    pause: 'Pause',
    new: 'New',
    // Fan Wall
    shareThoughts: 'Share your thoughts and connect with fellow fans',
    shareYourThoughts: 'Share Your Thoughts',
    yourName: 'Your Name',
    yourMessage: 'Your Message',
    enterName: 'Enter your name...',
    shareThoughtsAbout: 'Share your thoughts about our music...',
    postComment: 'Post Comment',
    cancel: 'Cancel',
    thankYouComment: 'Thank you for your comment! It will be visible after review by our moderators.',
    communityGuidelines: 'Community Guidelines',
    beRespectful: '• Be respectful and kind to fellow fans',
    shareConstructive: '• Share constructive feedback and positive vibes',
    keepDiscussions: '• Keep discussions music-related and family-friendly',
    noSpam: '• No spam, self-promotion, or offensive content',
    allModerated: '• All comments are moderated to ensure a safe space for everyone',
    reviewNote: 'All comments are reviewed before being published to ensure a positive experience for everyone.',
    // Merchandising
    merchandise: 'Merchandise',
    showSupport: 'Show your support with exclusive',
    gear: 'gear',
    allItems: 'All Items',
    musicItems: 'Music',
    apparel: 'Apparel',
    accessories: 'Accessories',
    artPrints: 'Art & Prints',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    freeShipping: 'Free shipping',
    limited: 'LIMITED',
    lowStock: 'LOW STOCK',
    inStock: 'in stock',
    noProductsAvailable: 'No Products Available',
    productsWillAppear: 'Products will appear here when added by the band.',
    freeShippingOver: 'On orders over $50 worldwide',
    premiumQuality: 'Premium Quality',
    highQualityMaterials: 'High-quality materials and prints',
    fanApproved: 'Fan Approved',
    lovedByFans: 'Loved by thousands of fans',
    // Footer
    madeWith: 'Made with',
    forFans: 'for our fans',
    quickLinks: 'Quick Links',
    connectWithUs: 'Connect With Us',
    allRightsReserved: 'All rights reserved.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    cookiePolicy: 'Cookie Policy',
    bandcampStore: 'Bandcamp Store',
    // User Profile
    yourProfile: 'Your Profile',
    stellarFan: 'Stellar Fan',
    memberSince: 'Member since January 2024',
    songsLiked: 'Songs Liked',
    playlists: 'Playlists',
    comments: 'Comments',
    accountSettings: 'Account Settings',
    adminAccess: 'Admin Access',
    signOut: 'Sign Out',
    premiumMember: 'Premium Member',
    exclusiveAccess: 'Exclusive access to all content',
    // Auth
    welcomeBack: 'Welcome Back to the Cosmos',
    joinCommunity: 'Join our stellar community and unlock exclusive content, behind-the-scenes access, and personalized music experiences crafted just for you.',
    exclusiveMusic: 'Exclusive music releases and demos',
    behindScenes: 'Behind-the-scenes content and stories',
    personalizedExperience: 'Personalized listening experience',
    signInToContinue: 'Sign In to Continue',
    accessJourney: 'Access your cosmic music journey',
    agreeTerms: 'By signing in, you agree to our',
    and: 'and',
    // Common
    loading: 'Loading...',
    preparingExperience: 'Preparing your cosmic experience',
    authRequired: 'Authentication Required',
    pleaseSignIn: 'Please sign in to continue with onboarding.',
    goToSignIn: 'Go to Sign In',
    // Language Selector
    language: 'Language',
    english: 'English',
    italian: 'Italian',
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
    // Hero Section
    listenNow: 'Ascolta Ora',
    // Music Player
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
    // Multimedia Booklet
    multimediaBooklet: 'Booklet Multimediale',
    visualJourney: 'Esplora il nostro viaggio visivo attraverso musica e arte',
    allMedia: 'Tutti i Media',
    studio: 'Studio',
    liveShows: 'Concerti Live',
    artwork: 'Artwork',
    backstage: 'Backstage',
    fanArt: 'Fan Art',
    playVideo: 'Riproduci Video',
    viewImage: 'Visualizza Immagine',
    noMediaAvailable: 'Nessun Media Disponibile',
    mediaWillAppear: 'I contenuti multimediali appariranno qui quando aggiunti dalla band.',
    // Podcast Diary
    podcastDiary: 'Diario Podcast',
    intimateConversations: 'Conversazioni intime e storie dietro le quinte',
    noPodcastEpisodes: 'Nessun Episodio Podcast Ancora',
    podcastsWillAppear: 'Gli episodi del podcast appariranno qui quando pubblicati dalla band.',
    neverMissEpisode: 'Non Perdere Mai un Episodio',
    subscribeNotification: 'Iscriviti al nostro diario podcast e ricevi notifiche quando pubblichiamo nuovi episodi',
    subscribeSpotify: 'Iscriviti su Spotify',
    subscribeApple: 'Iscriviti su Apple Podcasts',
    play: 'Riproduci',
    pause: 'Pausa',
    new: 'Nuovo',
    // Fan Wall
    shareThoughts: 'Condividi i tuoi pensieri e connettiti con altri fan',
    shareYourThoughts: 'Condividi i Tuoi Pensieri',
    yourName: 'Il Tuo Nome',
    yourMessage: 'Il Tuo Messaggio',
    enterName: 'Inserisci il tuo nome...',
    shareThoughtsAbout: 'Condividi i tuoi pensieri sulla nostra musica...',
    postComment: 'Pubblica Commento',
    cancel: 'Annulla',
    thankYouComment: 'Grazie per il tuo commento! Sarà visibile dopo la revisione dei nostri moderatori.',
    communityGuidelines: 'Linee Guida della Community',
    beRespectful: '• Sii rispettoso e gentile con gli altri fan',
    shareConstructive: '• Condividi feedback costruttivi e vibrazioni positive',
    keepDiscussions: '• Mantieni le discussioni relative alla musica e adatte alle famiglie',
    noSpam: '• No spam, auto-promozione o contenuti offensivi',
    allModerated: '• Tutti i commenti sono moderati per garantire uno spazio sicuro per tutti',
    reviewNote: 'Tutti i commenti vengono revisionati prima della pubblicazione per garantire un\'esperienza positiva per tutti.',
    // Merchandising
    merchandise: 'Merchandising',
    showSupport: 'Mostra il tuo supporto con',
    gear: 'merchandise esclusivo',
    allItems: 'Tutti gli Articoli',
    musicItems: 'Musica',
    apparel: 'Abbigliamento',
    accessories: 'Accessori',
    artPrints: 'Arte e Stampe',
    addToCart: 'Aggiungi al Carrello',
    buyNow: 'Compra Ora',
    freeShipping: 'Spedizione gratuita',
    limited: 'LIMITATO',
    lowStock: 'SCORTE LIMITATE',
    inStock: 'disponibili',
    noProductsAvailable: 'Nessun Prodotto Disponibile',
    productsWillAppear: 'I prodotti appariranno qui quando aggiunti dalla band.',
    freeShippingOver: 'Su ordini superiori a $50 in tutto il mondo',
    premiumQuality: 'Qualità Premium',
    highQualityMaterials: 'Materiali e stampe di alta qualità',
    fanApproved: 'Approvato dai Fan',
    lovedByFans: 'Amato da migliaia di fan',
    // Footer
    madeWith: 'Fatto con',
    forFans: 'per i nostri fan',
    quickLinks: 'Link Rapidi',
    connectWithUs: 'Connettiti con Noi',
    allRightsReserved: 'Tutti i diritti riservati.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Termini di Servizio',
    cookiePolicy: 'Cookie Policy',
    bandcampStore: 'Store Bandcamp',
    // User Profile
    yourProfile: 'Il Tuo Profilo',
    stellarFan: 'Fan Stellare',
    memberSince: 'Membro da Gennaio 2024',
    songsLiked: 'Canzoni Piaciute',
    playlists: 'Playlist',
    comments: 'Commenti',
    accountSettings: 'Impostazioni Account',
    adminAccess: 'Accesso Admin',
    signOut: 'Disconnetti',
    premiumMember: 'Membro Premium',
    exclusiveAccess: 'Accesso esclusivo a tutti i contenuti',
    // Auth
    welcomeBack: 'Bentornato nel Cosmo',
    joinCommunity: 'Unisciti alla nostra comunità stellare e sblocca contenuti esclusivi, accesso dietro le quinte ed esperienze musicali personalizzate create apposta per te.',
    exclusiveMusic: 'Rilasci musicali esclusivi e demo',
    behindScenes: 'Contenuti e storie dietro le quinte',
    personalizedExperience: 'Esperienza di ascolto personalizzata',
    signInToContinue: 'Accedi per Continuare',
    accessJourney: 'Accedi al tuo viaggio musicale cosmico',
    agreeTerms: 'Effettuando l\'accesso, accetti i nostri',
    and: 'e',
    // Common
    loading: 'Caricamento...',
    preparingExperience: 'Preparando la tua esperienza cosmica',
    authRequired: 'Autenticazione Richiesta',
    pleaseSignIn: 'Effettua l\'accesso per continuare con l\'onboarding.',
    goToSignIn: 'Vai all\'Accesso',
    // Language Selector
    language: 'Lingua',
    english: 'Inglese',
    italian: 'Italiano',
  }
};

// Admin translations
export const adminTranslations = {
  en: {
    // Dashboard
    dashboardOverview: 'Dashboard Overview',
    welcomeBack: 'Welcome back, Admin',
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
    // Navigation
    adminPanel: 'Admin Panel',
    overview: 'Overview',
    bandSettings: 'Band Settings',
    themeCustomizer: 'Theme Customizer',
    albums: 'Albums',
    songs: 'Songs',
    podcasts: 'Podcasts',
    mediaGallery: 'Media Gallery',
    merchandise: 'Merchandise',
    fileManager: 'File Manager',
    comments: 'Comments',
    accountSettings: 'Account Settings',
    translationManager: 'Translation Manager',
    logout: 'Logout',
    // Band Settings
    basicInformation: 'Basic Information',
    bandName: 'Band Name',
    emailAddress: 'Email Address',
    tagline: 'Tagline',
    description: 'Description',
    logoAvatar: 'Logo/Avatar',
    socialMedia: 'Social Media',
    analyticsTracking: 'Analytics & Tracking',
    metaPixelCode: 'Meta Pixel Conversion Code',
    googleTagManagerCode: 'Google Tag Manager Code',
    trackingCodeHelp: 'Paste your tracking codes here. They will be automatically added to all pages.',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    enterBandName: 'Enter band name',
    enterImageURL: 'Enter URL or select image',
    tellYourStory: 'Tell your story...',
    yourTagline: 'Your band\'s tagline',
    // Password Management
    passwordManagement: 'Password Management',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    enterCurrentPassword: 'Enter your current password',
    enterNewPassword: 'Enter new password (min 6 characters)',
    confirmNewPassword: 'Confirm your new password',
    updatePassword: 'Update Password',
    passwordUpdated: 'Password updated successfully!',
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    incorrectPassword: 'Current password is incorrect',
    adminCredentials: 'Admin Credentials',
    adminUsername: 'Admin Username',
    enterUsername: 'Enter admin username',
    updateCredentials: 'Update Credentials',
    credentialsUpdated: 'Credentials updated successfully!',
    resetPassword: 'Reset Password',
    forgotPassword: 'Forgot Password?',
    resetInstructions: 'Enter your admin username to reset your password',
    sendResetLink: 'Send Reset Instructions',
    resetEmailSent: 'Reset instructions sent! Check your email.',
    backToLogin: 'Back to Login',
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    create: 'Create',
    update: 'Update',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
  },
  it: {
    // Dashboard
    dashboardOverview: 'Panoramica Dashboard',
    welcomeBack: 'Bentornato, Admin',
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
    // Navigation
    adminPanel: 'Pannello Admin',
    overview: 'Panoramica',
    bandSettings: 'Impostazioni Band',
    themeCustomizer: 'Personalizza Tema',
    albums: 'Album',
    songs: 'Canzoni',
    podcasts: 'Podcast',
    mediaGallery: 'Galleria Media',
    merchandise: 'Merchandising',
    fileManager: 'Gestore File',
    comments: 'Commenti',
    accountSettings: 'Impostazioni Account',
    translationManager: 'Gestore Traduzioni',
    logout: 'Disconnetti',
    // Band Settings
    basicInformation: 'Informazioni di Base',
    bandName: 'Nome della Band',
    emailAddress: 'Indirizzo Email',
    tagline: 'Slogan',
    description: 'Descrizione',
    logoAvatar: 'Logo/Avatar',
    socialMedia: 'Social Media',
    analyticsTracking: 'Analytics e Tracciamento',
    metaPixelCode: 'Codice Meta Pixel Conversione',
    googleTagManagerCode: 'Codice Google Tag Manager',
    trackingCodeHelp: 'Incolla qui i tuoi codici di tracciamento. Verranno aggiunti automaticamente a tutte le pagine.',
    saveChanges: 'Salva Modifiche',
    saving: 'Salvando...',
    enterBandName: 'Inserisci nome della band',
    enterImageURL: 'Inserisci URL o seleziona immagine',
    tellYourStory: 'Racconta la tua storia...',
    yourTagline: 'Lo slogan della tua band',
    // Password Management
    passwordManagement: 'Gestione Password',
    changePassword: 'Cambia Password',
    currentPassword: 'Password Attuale',
    newPassword: 'Nuova Password',
    confirmPassword: 'Conferma Nuova Password',
    enterCurrentPassword: 'Inserisci la tua password attuale',
    enterNewPassword: 'Inserisci nuova password (min 6 caratteri)',
    confirmNewPassword: 'Conferma la tua nuova password',
    updatePassword: 'Aggiorna Password',
    passwordUpdated: 'Password aggiornata con successo!',
    passwordMismatch: 'Le password non corrispondono',
    passwordTooShort: 'La password deve essere di almeno 6 caratteri',
    incorrectPassword: 'La password attuale è errata',
    adminCredentials: 'Credenziali Admin',
    adminUsername: 'Nome Utente Admin',
    enterUsername: 'Inserisci nome utente admin',
    updateCredentials: 'Aggiorna Credenziali',
    credentialsUpdated: 'Credenziali aggiornate con successo!',
    resetPassword: 'Reimposta Password',
    forgotPassword: 'Password Dimenticata?',
    resetInstructions: 'Inserisci il tuo nome utente admin per reimpostare la password',
    sendResetLink: 'Invia Istruzioni Reset',
    resetEmailSent: 'Istruzioni reset inviate! Controlla la tua email.',
    backToLogin: 'Torna al Login',
    // Common
    save: 'Salva',
    cancel: 'Annulla',
    delete: 'Elimina',
    edit: 'Modifica',
    add: 'Aggiungi',
    create: 'Crea',
    update: 'Aggiorna',
    close: 'Chiudi',
    yes: 'Sì',
    no: 'No',
    confirm: 'Conferma',
    loading: 'Caricamento...',
    error: 'Errore',
    success: 'Successo',
    warning: 'Attenzione',
    info: 'Info',
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    try {
      return localStorage.getItem('selectedLanguage') || 'en';
    } catch (error) {
      return 'en';
    }
  });

  // Try to get admin context for custom translations
  let adminData = null;
  try {
    // Dynamic import to avoid circular dependency
    const saved = localStorage.getItem('bandAdminData');
    if (saved) {
      adminData = JSON.parse(saved);
    }
  } catch (error) {
    // Use defaults
  }

  useEffect(() => {
    try {
      localStorage.setItem('selectedLanguage', currentLanguage);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  }, [currentLanguage]);

  const getTranslations = () => {
    // Use custom translations from admin if available, otherwise use defaults
    const customTranslations = adminData?.translations || {};
    
    return {
      en: { ...defaultTranslations.en, ...customTranslations.en },
      it: { ...defaultTranslations.it, ...customTranslations.it }
    };
  };

  const t = (key) => {
    const translations = getTranslations();
    return translations[currentLanguage]?.[key] || defaultTranslations[currentLanguage]?.[key] || key;
  };

  const ta = (key) => {
    return adminTranslations[currentLanguage]?.[key] || key;
  };

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t, // Frontend translations
    ta, // Admin translations
    availableLanguages: [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'it', name: 'Italiano', flag: '🇮🇹' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};