import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../../common/SafeIcon';
import { useAdmin } from '../../../contexts/AdminContext';
import { useLanguage } from '../../../contexts/LanguageContext';

const { FiSave, FiUser, FiMail, FiLink, FiGlobe, FiToggleLeft, FiToggleRight } = FiIcons;

const BandSettings = () => {
  const { data, updateBandSettings } = useAdmin();
  const { ta } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: data.band.name || "Stellar Waves",
    tagline: data.band.tagline || "Cosmic electronic soundscapes",
    description: data.band.description || "An electronic music project exploring the intersection of ambient, downtempo, and cosmic soundscapes.",
    email: data.band.email || "contact@stellarwaves.com",
    socialLinks: {
      instagram: data.band.socialLinks?.instagram || "",
      spotify: data.band.socialLinks?.spotify || "",
      youtube: data.band.socialLinks?.youtube || "",
      bandcamp: data.band.socialLinks?.bandcamp || ""
    },
    sectionVisibility: {
      gallery: data.band.sectionVisibility?.gallery !== false,
      podcast: data.band.sectionVisibility?.podcast !== false,
      fanWall: data.band.sectionVisibility?.fanWall !== false,
      merchandising: data.band.sectionVisibility?.merchandising !== false
    }
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSocialChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };
  
  const handleVisibilityChange = (section, value) => {
    setFormData(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [section]: value
      }
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update settings
      updateBandSettings(formData);
      
      // Show success message
      setSaveMessage({
        type: 'success',
        text: 'Band settings updated successfully!'
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating band settings:', error);
      
      // Show error message
      setSaveMessage({
        type: 'error',
        text: 'An error occurred while updating settings.'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Band Settings</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <SafeIcon icon={FiUser} className="mr-2" />
            Basic Information
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Band Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="Your band name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="A short phrase describing your music"
              />
              <p className="text-xs text-gray-500 mt-1">A brief phrase that appears beneath your band name</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none"
                rows="4"
                placeholder="Describe your band and music style..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="contact@yourband.com"
                />
                <SafeIcon
                  icon={FiMail}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Social Links */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <SafeIcon icon={FiLink} className="mr-2" />
            Social Media Links
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.socialLinks.instagram}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="https://instagram.com/yourbandname"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spotify URL
              </label>
              <input
                type="url"
                value={formData.socialLinks.spotify}
                onChange={(e) => handleSocialChange('spotify', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="https://open.spotify.com/artist/yourid"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                value={formData.socialLinks.youtube}
                onChange={(e) => handleSocialChange('youtube', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="https://youtube.com/@yourbandname"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bandcamp URL
              </label>
              <input
                type="url"
                value={formData.socialLinks.bandcamp}
                onChange={(e) => handleSocialChange('bandcamp', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="https://yourbandname.bandcamp.com"
              />
            </div>
          </div>
        </div>
        
        {/* Section Visibility */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <SafeIcon icon={FiGlobe} className="mr-2" />
            Website Sections
          </h2>
          
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Enable or disable sections of your website. Disabled sections won't be visible to visitors.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-800">Gallery Section</h3>
                  <p className="text-sm text-gray-600">Visual content and media</p>
                </div>
                <div onClick={() => handleVisibilityChange('gallery', !formData.sectionVisibility.gallery)} className="cursor-pointer">
                  <SafeIcon 
                    icon={formData.sectionVisibility.gallery ? FiToggleRight : FiToggleLeft} 
                    className={`text-2xl ${formData.sectionVisibility.gallery ? 'text-purple-600' : 'text-gray-400'}`} 
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-800">Podcast Section</h3>
                  <p className="text-sm text-gray-600">Audio podcast episodes</p>
                </div>
                <div onClick={() => handleVisibilityChange('podcast', !formData.sectionVisibility.podcast)} className="cursor-pointer">
                  <SafeIcon 
                    icon={formData.sectionVisibility.podcast ? FiToggleRight : FiToggleLeft} 
                    className={`text-2xl ${formData.sectionVisibility.podcast ? 'text-purple-600' : 'text-gray-400'}`} 
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-800">Fan Wall</h3>
                  <p className="text-sm text-gray-600">Fan comments and interaction</p>
                </div>
                <div onClick={() => handleVisibilityChange('fanWall', !formData.sectionVisibility.fanWall)} className="cursor-pointer">
                  <SafeIcon 
                    icon={formData.sectionVisibility.fanWall ? FiToggleRight : FiToggleLeft} 
                    className={`text-2xl ${formData.sectionVisibility.fanWall ? 'text-purple-600' : 'text-gray-400'}`} 
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-800">Merchandise Store</h3>
                  <p className="text-sm text-gray-600">Products and e-commerce</p>
                </div>
                <div onClick={() => handleVisibilityChange('merchandising', !formData.sectionVisibility.merchandising)} className="cursor-pointer">
                  <SafeIcon 
                    icon={formData.sectionVisibility.merchandising ? FiToggleRight : FiToggleLeft} 
                    className={`text-2xl ${formData.sectionVisibility.merchandising ? 'text-purple-600' : 'text-gray-400'}`} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Save Message */}
        {saveMessage && (
          <div className={`p-4 rounded-xl ${saveMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            {saveMessage.text}
          </div>
        )}
        
        {/* Save Button */}
        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiSave} />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default BandSettings;