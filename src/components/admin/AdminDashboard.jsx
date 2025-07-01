import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAdmin } from '../../contexts/AdminContext';
import { useLanguage } from '../../contexts/LanguageContext';

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
import WebsiteSettings from './sections/WebsiteSettings';
import LanguageSelector from '../common/LanguageSelector';

const {
  FiHome, FiSettings, FiPalette, FiMusic, FiMic, FiImage, FiShoppingBag,
  FiLogOut, FiMenu, FiX, FiDisc, FiHeadphones, FiUpload, FiMessageCircle,
  FiUser, FiGlobe, FiTool, FiLayers, FiSearch, FiEye, FiToggleLeft
} = FiIcons;

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, data, isAuthenticated } = useAdmin();
  const { ta } = useLanguage();
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { id: 'overview', label: ta('overview'), icon: FiHome },
    { id: 'website', label: 'Website Settings', icon: FiEye },
    { id: 'band', label: ta('bandSettings'), icon: FiSettings },
    { id: 'theme', label: ta('themeCustomizer'), icon: FiPalette },
    { id: 'albums', label: ta('albums'), icon: FiDisc },
    { id: 'songs', label: ta('songs'), icon: FiMusic },
    { id: 'podcasts', label: ta('podcasts'), icon: FiMic },
    { id: 'media', label: ta('mediaGallery'), icon: FiImage },
    { id: 'products', label: ta('merchandise'), icon: FiShoppingBag },
    { id: 'uploads', label: ta('fileManager'), icon: FiUpload },
    { id: 'comments', label: ta('comments'), icon: FiMessageCircle },
    { id: 'footer', label: 'Footer Settings', icon: FiLayers },
    { id: 'seo', label: 'SEO & Meta Tags', icon: FiSearch },
    { id: 'translations', label: ta('translationManager'), icon: FiGlobe },
    { id: 'config', label: 'System Config', icon: FiTool },
    { id: 'account', label: ta('accountSettings'), icon: FiUser }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'website':
        return <WebsiteSettings />;
      case 'band':
        return <BandSettings />;
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
      case 'uploads':
        return <FileUploadManager />;
      case 'comments':
        return <CommentModeration />;
      case 'footer':
        return <FooterSettings />;
      case 'seo':
        return <SeoSettings />;
      case 'translations':
        return <TranslationManager />;
      case 'config':
        return <SystemConfiguration />;
      case 'account':
        return <AccountSettings />;
      default:
        return <OverviewSection />;
    }
  };

  const OverviewSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">{ta('dashboardOverview')}</h1>
        <div className="text-sm text-gray-600">
          {ta('welcomeBack')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{ta('totalAlbums')}</p>
              <p className="text-2xl font-bold text-gray-800">{data.albums.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiDisc} className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{ta('totalSongs')}</p>
              <p className="text-2xl font-bold text-gray-800">{data.songs.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiMusic} className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{ta('podcastEpisodes')}</p>
              <p className="text-2xl font-bold text-gray-800">{data.podcasts.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiHeadphones} className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{ta('products')}</p>
              <p className="text-2xl font-bold text-gray-800">{data.products.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiShoppingBag} className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* New Stats Row for File Management and Comments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{ta('pendingComments')}</p>
              <p className="text-2xl font-bold text-gray-800">
                {data.comments?.filter(c => c.status === 'pending').length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiMessageCircle} className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{ta('uploadedFiles')}</p>
              <p className="text-2xl font-bold text-gray-800">
                {data.uploadedFiles?.length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUpload} className="text-indigo-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{ta('mediaItems')}</p>
              <p className="text-2xl font-bold text-gray-800">{data.media.length}</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiImage} className="text-pink-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{ta('recentSongs')}</h3>
          <div className="space-y-3">
            {data.songs.slice(0, 3).map(song => (
              <div key={song.id} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiMusic} className="text-white text-sm" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{song.title}</p>
                  <p className="text-sm text-gray-600">{song.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{ta('quickActions')}</h3>
          <div className="space-y-3">
            <button
              onClick={() => setActiveSection('website')}
              className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
            >
              <SafeIcon icon={FiEye} className="text-purple-600" />
              <span className="text-gray-700">Website Settings</span>
            </button>
            <button
              onClick={() => setActiveSection('uploads')}
              className="w-full flex items-center space-x-3 p-3 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
            >
              <SafeIcon icon={FiUpload} className="text-indigo-600" />
              <span className="text-gray-700">{ta('uploadFiles')}</span>
            </button>
            <button
              onClick={() => setActiveSection('comments')}
              className="w-full flex items-center space-x-3 p-3 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors"
            >
              <SafeIcon icon={FiMessageCircle} className="text-yellow-600" />
              <span className="text-gray-700">{ta('moderateComments')}</span>
            </button>
            <button
              onClick={() => setActiveSection('footer')}
              className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
            >
              <SafeIcon icon={FiLayers} className="text-green-600" />
              <span className="text-gray-700">Footer Settings</span>
            </button>
            <button
              onClick={() => setActiveSection('seo')}
              className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              <SafeIcon icon={FiSearch} className="text-blue-600" />
              <span className="text-gray-700">SEO & Meta Tags</span>
            </button>
            <button
              onClick={() => setActiveSection('config')}
              className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
            >
              <SafeIcon icon={FiTool} className="text-purple-600" />
              <span className="text-gray-700">System Configuration</span>
            </button>
            <button
              onClick={() => setActiveSection('translations')}
              className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              <SafeIcon icon={FiGlobe} className="text-blue-600" />
              <span className="text-gray-700">{ta('translationManager')}</span>
            </button>
            <button
              onClick={() => setActiveSection('songs')}
              className="w-full flex items-center space-x-3 p-3 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors"
            >
              <SafeIcon icon={FiMusic} className="text-pink-600" />
              <span className="text-gray-700">{ta('addNewSong')}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 bg-white/70 backdrop-blur-md rounded-xl shadow-lg"
          whileTap={{ scale: 0.95 }}
        >
          <SafeIcon icon={sidebarOpen ? FiX : FiMenu} className="text-xl text-gray-700" />
        </motion.button>
      </div>

      {/* Language Selector */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-full w-64 bg-white/70 backdrop-blur-md shadow-xl z-40 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiMusic} className="text-white text-lg" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">{ta('adminPanel')}</h2>
              <p className="text-sm text-gray-600">{data.band.name}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map(item => (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={item.icon} className="text-lg" />
                <span className="font-medium">{item.label}</span>
                
                {/* Show pending count for comments */}
                {item.id === 'comments' && data.comments?.filter(c => c.status === 'pending').length > 0 && (
                  <span className="ml-auto bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    {data.comments.filter(c => c.status === 'pending').length}
                  </span>
                )}
                
                {/* Highlight new features */}
                {(item.id === 'website' || item.id === 'footer' || item.id === 'seo' || item.id === 'config') && (
                  <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    NEW
                  </span>
                )}
              </motion.button>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <motion.button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SafeIcon icon={FiLogOut} className="text-lg" />
              <span className="font-medium">{ta('logout')}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:ml-64 p-6 lg:p-8 pt-20 lg:pt-8">
        {renderContent()}
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;