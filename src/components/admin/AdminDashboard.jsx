import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAdmin } from '../../contexts/AdminContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

// Import sections
import BandSettings from './sections/BandSettings';
import ThemeCustomizer from './sections/ThemeCustomizer';
import AlbumManager from './sections/AlbumManager';
import SongManager from './sections/SongManager';
import PodcastManager from './sections/PodcastManager';
import MediaManager from './sections/MediaManager';
import ProductManager from './sections/ProductManager';
import FileUploadManager from './sections/FileUploadManager';
import CommentModeration from './sections/CommentModeration';
import AccountSettings from './sections/AccountSettings';
import TranslationManager from './sections/TranslationManager';
import SystemConfiguration from './sections/SystemConfiguration';
import FooterSettings from './sections/FooterSettings';
import SeoSettings from './sections/SeoSettings';

const { 
  FiHome, FiSettings, FiPalette, FiMusic, FiMic, FiImage, 
  FiShoppingBag, FiLogOut, FiMenu, FiX, FiDisc, 
  FiHeadphones, FiUpload, FiMessageCircle, FiUser, 
  FiGlobe, FiTool, FiLayers, FiSearch 
} = FiIcons;

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { data } = useAdmin();
  const { logout } = useAuth();
  const { ta } = useLanguage();
  const navigate = useNavigate();

  const sections = [
    { id: 'dashboard', label: ta('dashboardOverview'), icon: FiHome },
    { id: 'band-settings', label: ta('bandSettings'), icon: FiSettings },
    { id: 'theme', label: ta('themeCustomizer'), icon: FiPalette },
    { id: 'albums', label: ta('albums'), icon: FiDisc },
    { id: 'songs', label: ta('songs'), icon: FiMusic },
    { id: 'podcasts', label: ta('podcasts'), icon: FiMic },
    { id: 'media', label: ta('mediaGallery'), icon: FiImage },
    { id: 'products', label: ta('merchandise'), icon: FiShoppingBag },
    { id: 'files', label: ta('fileManager'), icon: FiUpload },
    { id: 'comments', label: ta('comments'), icon: FiMessageCircle },
    { id: 'translations', label: ta('translationManager'), icon: FiGlobe },
    { id: 'system', label: ta('systemConfiguration'), icon: FiTool },
    { id: 'account', label: ta('accountSettings'), icon: FiUser }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'band-settings': 
        return <div>Band Settings Content</div>;
      case 'theme': 
        return <ThemeCustomizer />;
      case 'albums': 
        return <AlbumManager />;
      case 'songs': 
        return <SongManager />;
      case 'podcasts': 
        return <PodcastManager />;
      case 'media': 
        return <MediaManager />;
      case 'products': 
        return <ProductManager />;
      case 'files': 
        return <FileUploadManager />;
      case 'comments': 
        return <CommentModeration />;
      case 'translations': 
        return <TranslationManager />;
      case 'system': 
        return <SystemConfiguration />;
      case 'account': 
        return <AccountSettings />;
      default: 
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              {ta('dashboardOverview')}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Welcome to Admin Dashboard</h3>
                <p className="text-gray-600">
                  This is your control center for managing your band's website. Use the sidebar navigation to access different sections.
                </p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Albums:</span>
                    <span className="font-semibold">{data.albums.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Songs:</span>
                    <span className="font-semibold">{data.songs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Products:</span>
                    <span className="font-semibold">{data.products.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveSection('albums')}
                    className="w-full py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-left px-4"
                  >
                    Manage Albums
                  </button>
                  <button 
                    onClick={() => setActiveSection('songs')}
                    className="w-full py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-left px-4"
                  >
                    Manage Songs
                  </button>
                  <button 
                    onClick={() => setActiveSection('theme')}
                    className="w-full py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-left px-4"
                  >
                    Customize Theme
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <motion.button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-3 bg-white rounded-full shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SafeIcon icon={mobileMenuOpen ? FiX : FiMenu} className="text-xl text-gray-600" />
        </motion.button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiSettings} className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {ta('adminPanel')}
              </h2>
              <p className="text-sm text-gray-500">{data.band.name}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={section.icon} className="text-lg" />
                <span className="font-medium">{section.label}</span>
              </motion.button>
            ))}

            <motion.button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <SafeIcon icon={FiLogOut} className="text-lg" />
              <span className="font-medium">{ta('logout')}</span>
            </motion.button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="p-8">
          {renderSection()}
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;