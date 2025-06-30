import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useLanguage } from '../../contexts/LanguageContext';

const { FiGlobe, FiChevronDown } = FiIcons;

const LanguageSelector = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, changeLanguage, availableLanguages, t } = useLanguage();
  
  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white/30 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <SafeIcon icon={FiGlobe} className="text-sm" />
        <span className="text-sm font-medium">{currentLang?.flag} {currentLang?.name}</span>
        <SafeIcon 
          icon={FiChevronDown} 
          className={`text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {availableLanguages.map((language) => (
              <motion.button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  currentLanguage === language.code
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-700'
                }`}
                whileHover={{ x: 2 }}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium whitespace-nowrap">{language.name}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSelector;