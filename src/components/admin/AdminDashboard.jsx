import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAdmin } from '../../contexts/AdminContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../common/LanguageSelector';

// Import all sections
const BandSettings = React.lazy(() => import('./sections/BandSettings'));
const ThemeCustomizer = React.lazy(() => import('./sections/ThemeCustomizer'));
const AlbumManager = React.lazy(() => import('./sections/AlbumManager'));
const SongManager = React.lazy(() => import('./sections/SongManager'));
const PodcastManager = React.lazy(() => import('./sections/PodcastManager'));
const MediaManager = React.lazy(() => import('./sections/MediaManager'));
const ProductManager = React.lazy(() => import('./sections/ProductManager'));
const FileUploadManager = React.lazy(() => import('./sections/FileUploadManager'));
const CommentModeration = React.lazy(() => import('./sections/CommentModeration'));
const AccountSettings = React.lazy(() => import('./sections/AccountSettings'));
const TranslationManager = React.lazy(() => import('./sections/TranslationManager'));
const SystemConfiguration = React.lazy(() => import('./sections/SystemConfiguration'));
const FooterSettings = React.lazy(() => import('./sections/FooterSettings'));
const SeoSettings = React.lazy(() => import('./sections/SeoSettings'));

const { FiHome, FiSettings, FiPalette, FiMusic, FiMic, FiImage, FiShoppingBag, FiLogOut, FiMenu, FiX, FiDisc, FiHeadphones, FiUpload, FiMessageCircle, FiUser, FiGlobe, FiTool, FiLayers, FiSearch } = FiIcons;

const AdminDashboard = () => {
  // ... rest of the component code remains the same ...
};

export default AdminDashboard;