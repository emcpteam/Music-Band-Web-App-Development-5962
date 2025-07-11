import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CartButton from './cart/CartButton';

const { FiMenu, FiX, FiHome, FiMusic, FiImage, FiMic, FiMessageCircle, FiShoppingBag, FiUser, FiLogOut } = FiIcons;

const Navigation = ({ onNavigate, refs }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { data } = useAdmin();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // Get section visibility settings
  const { sectionVisibility } = data.band;

  // Filter navigation items based on visibility settings
  const navItems = [
    { icon: FiHome, label: t('home'), ref: refs.heroRef, visible: true },
    { icon: FiMusic, label: t('music'), ref: refs.musicRef, visible: true },
    { icon: FiImage, label: t('gallery'), ref: refs.bookletRef, visible: sectionVisibility.gallery },
    { icon: FiMic, label: t('podcast'), ref: refs.podcastRef, visible: sectionVisibility.podcast },
    { icon: FiMessageCircle, label: t('fanWall'), ref: refs.fanWallRef, visible: sectionVisibility.fanWall },
    { icon: FiShoppingBag, label: t('merch'), ref: refs.merchRef, visible: sectionVisibility.merchandising }
  ].filter(item => item.visible !== false);

  const handleNavigate = (ref) => {
    onNavigate(ref);
    setMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    navigate('/admin');
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-2"
              style={{ background: `linear-gradient(45deg, var(--theme-primary), var(--theme-secondary))` }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiMusic} className="text-white text-lg" />
            </motion.div>
            <span className="font-bold text-gray-800">{data.band.name}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => handleNavigate(item.ref)}
                className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-current"
                whileHover={{ scale: 1.05, color: 'var(--theme-primary)' }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={item.icon} className="text-sm" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Right Section: Admin & Cart */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={handleAdminClick}
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SafeIcon icon={FiUser} className="text-sm" />
                  <span className="text-sm font-medium hidden sm:inline">Admin</span>
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SafeIcon icon={FiLogOut} className="text-sm" />
                  <span className="text-sm font-medium hidden sm:inline">Logout</span>
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={handleAdminClick}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiUser} className="text-sm" />
                <span className="text-sm font-medium hidden sm:inline">Admin</span>
              </motion.button>
            )}

            {/* Cart Button */}
            <CartButton />

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <SafeIcon icon={mobileMenuOpen ? FiX : FiMenu} className="text-xl" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: mobileMenuOpen ? 1 : 0, height: mobileMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-4 bg-white/90 backdrop-blur-md shadow-lg">
          <div className="space-y-2">
            {navItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => handleNavigate(item.ref)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={item.icon} className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navigation;