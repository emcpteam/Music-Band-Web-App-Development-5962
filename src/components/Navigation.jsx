import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useBandData } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './common/LanguageSelector';

const { FiMenu, FiX, FiMusic, FiImage, FiMic, FiMessageCircle, FiShoppingBag, FiHome, FiShield } = FiIcons;

const Navigation = ({ onNavigate, refs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const bandData = useBandData();
  const { t } = useLanguage();

  const navItems = [
    { icon: FiHome, label: t('home'), ref: refs.heroRef },
    { icon: FiMusic, label: t('music'), ref: refs.musicRef },
    { icon: FiImage, label: t('gallery'), ref: refs.bookletRef },
    { icon: FiMic, label: t('podcast'), ref: refs.podcastRef },
    { icon: FiMessageCircle, label: t('fanWall'), ref: refs.fanWallRef },
    { icon: FiShoppingBag, label: t('merch'), ref: refs.merchRef },
  ];

  const handleAdminAccess = () => {
    navigate('/admin');
    setIsOpen(false);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiMusic} className="text-white text-sm" />
              </div>
              <span className="font-semibold text-gray-800">{bandData.band.name}</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  onClick={() => onNavigate(item.ref)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SafeIcon icon={item.icon} className="text-sm" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              ))}
              
              {/* Language Selector - Desktop */}
              <LanguageSelector />
              
              {/* Admin Access - Desktop */}
              <motion.button
                onClick={handleAdminAccess}
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={t('adminAccess')}
              >
                <SafeIcon icon={FiShield} className="text-sm" />
                <span className="text-sm font-medium">{t('admin')}</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={isOpen ? FiX : FiMenu} className="text-xl text-gray-600" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            className="md:hidden bg-white/90 backdrop-blur-md border-t border-white/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  onClick={() => {
                    onNavigate(item.ref);
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-3 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <SafeIcon icon={item.icon} className="text-sm" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              ))}
              
              {/* Language Selector - Mobile */}
              <div className="px-3 py-2">
                <LanguageSelector />
              </div>
              
              {/* Admin Access - Mobile */}
              <motion.button
                onClick={handleAdminAccess}
                className="flex items-center space-x-3 w-full px-3 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors border-t border-purple-100 mt-2 pt-3"
                whileHover={{ x: 5 }}
              >
                <SafeIcon icon={FiShield} className="text-sm" />
                <span className="text-sm font-medium">{t('adminAccess')}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16"></div>
    </>
  );
};

export default Navigation;