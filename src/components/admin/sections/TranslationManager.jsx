import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../../common/SafeIcon';
import { useAdmin } from '../../../contexts/AdminContext';
import { useLanguage } from '../../../contexts/LanguageContext';

const { FiGlobe, FiSave, FiSearch, FiEdit, FiX, FiRefreshCw, FiDownload, FiUpload } = FiIcons;

const TranslationManager = () => {
  const { data, updateTranslations } = useAdmin();
  const { ta, availableLanguages } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState('it');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingKey, setEditingKey] = useState(null);
  const [translations, setTranslations] = useState(data.translations || {});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Translation categories for better organization
  const categories = [
    { id: 'all', label: 'All Translations', icon: FiGlobe },
    { id: 'navigation', label: 'Navigation', icon: FiGlobe },
    { id: 'music', label: 'Music Player', icon: FiGlobe },
    { id: 'admin', label: 'Admin Panel', icon: FiGlobe },
    { id: 'auth', label: 'Authentication', icon: FiGlobe },
    { id: 'common', label: 'Common', icon: FiGlobe }
  ];

  // Get all translation keys organized by category
  const getTranslationsByCategory = () => {
    const currentTranslations = translations[selectedLanguage] || {};
    
    const categorizedKeys = {
      navigation: ['home', 'music', 'gallery', 'podcast', 'fanWall', 'merch', 'admin'],
      music: ['musicPlayer', 'immersiveExperience', 'lyricsNotes', 'trackList', 'like', 'share', 'noSongsYet'],
      admin: ['dashboardOverview', 'welcomeBack', 'totalAlbums', 'totalSongs', 'bandSettings', 'themeCustomizer'],
      auth: ['welcomeBack', 'joinCommunity', 'exclusiveMusic', 'signInToContinue', 'accessJourney'],
      common: ['loading', 'save', 'cancel', 'delete', 'edit', 'add', 'create', 'update', 'close']
    };

    if (selectedCategory === 'all') {
      return Object.keys(currentTranslations);
    }

    return categorizedKeys[selectedCategory] || [];
  };

  const filteredKeys = getTranslationsByCategory().filter(key =>
    key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (translations[selectedLanguage]?.[key] || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTranslationChange = (key, value) => {
    setTranslations(prev => ({
      ...prev,
      [selectedLanguage]: {
        ...prev[selectedLanguage],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateTranslations(translations);
    setIsSaving(false);
    setEditingKey(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(translations[selectedLanguage], null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `translations_${selectedLanguage}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTranslations = JSON.parse(e.target.result);
          setTranslations(prev => ({
            ...prev,
            [selectedLanguage]: {
              ...prev[selectedLanguage],
              ...importedTranslations
            }
          }));
        } catch (error) {
          alert('Error importing file. Please check the JSON format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all translations to default? This cannot be undone.')) {
      // Reset to default Italian translations
      const defaultItalianTranslations = {
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
      };
      
      setTranslations(prev => ({
        ...prev,
        [selectedLanguage]: defaultItalianTranslations
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Translation Manager</h1>
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiDownload} className="text-sm" />
            <span>Export</span>
          </motion.button>
          
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-translations"
            />
            <motion.label
              htmlFor="import-translations"
              className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiUpload} className="text-sm" />
              <span>Import</span>
            </motion.label>
          </div>
        </div>
      </div>

      {/* Language & Category Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Language</h3>
          <div className="space-y-2">
            {availableLanguages.map(lang => (
              <motion.button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                  selectedLanguage === lang.code
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {selectedLanguage === lang.code && lang.code !== 'en' && (
                  <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-full">
                    Editable
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Category</h3>
          <div className="space-y-2">
            {categories.map(category => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={category.icon} className="text-sm" />
                <span className="font-medium">{category.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg mb-8">
        <div className="relative">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search translations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Editing: <span className="font-medium">{availableLanguages.find(l => l.code === selectedLanguage)?.name}</span>
            {selectedLanguage === 'en' && (
              <span className="ml-2 text-orange-600">(Read-only - English is the base language)</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={resetToDefault}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiRefreshCw} className="text-sm" />
              <span>Reset to Default</span>
            </motion.button>
            <motion.button
              onClick={handleSave}
              disabled={isSaving || selectedLanguage === 'en'}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiSave} />
              <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Translation Editor */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Translations ({filteredKeys.length} items)
        </h3>
        
        {filteredKeys.length > 0 ? (
          <div className="space-y-4">
            {filteredKeys.map(key => (
              <motion.div
                key={key}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <code className="px-2 py-1 bg-purple-100 text-purple-600 rounded text-sm font-mono">
                      {key}
                    </code>
                    {editingKey === key && (
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        Editing
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {editingKey === key ? (
                      <>
                        <motion.button
                          onClick={() => setEditingKey(null)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <SafeIcon icon={FiX} className="text-sm" />
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        onClick={() => setEditingKey(key)}
                        disabled={selectedLanguage === 'en'}
                        className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors disabled:opacity-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <SafeIcon icon={FiEdit} className="text-sm" />
                      </motion.button>
                    )}
                  </div>
                </div>
                
                {editingKey === key ? (
                  <textarea
                    value={translations[selectedLanguage]?.[key] || ''}
                    onChange={(e) => handleTranslationChange(key, e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 transition-colors resize-none"
                    rows="3"
                    placeholder="Enter translation..."
                  />
                ) : (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Current Translation ({availableLanguages.find(l => l.code === selectedLanguage)?.name})
                      </label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                        {translations[selectedLanguage]?.[key] || (
                          <span className="text-red-500 italic">No translation available</span>
                        )}
                      </p>
                    </div>
                    {selectedLanguage !== 'en' && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          English Reference
                        </label>
                        <p className="text-gray-600 bg-blue-50 p-3 rounded-lg">
                          {translations.en?.[key] || key}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiGlobe} className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Translations Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try a different search term' : 'Select a category to view translations'}
            </p>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <SafeIcon icon={FiGlobe} className="mr-2 text-blue-600" />
          Translation Guidelines
        </h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• <strong>Keep context:</strong> Consider where the text appears in the interface</p>
          <p>• <strong>Maintain tone:</strong> Keep the same friendly, engaging tone as English</p>
          <p>• <strong>Check length:</strong> Ensure translations fit well in the UI layout</p>
          <p>• <strong>Use variables:</strong> Preserve any {`{variables}`} exactly as they appear</p>
          <p>• <strong>Test thoroughly:</strong> Preview changes on the live site after saving</p>
          <p>• <strong>Export/Import:</strong> Use these features to backup or bulk edit translations</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TranslationManager;