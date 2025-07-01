import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../../common/SafeIcon';
import { useAdmin } from '../../../contexts/AdminContext';
import FileSelector from '../common/FileSelector';

const { FiSave, FiToggleLeft, FiToggleRight, FiStar, FiMusic, FiImage, FiMic, FiMessageCircle, FiShoppingBag, FiEye, FiEyeOff, FiFolder, FiUpload } = FiIcons;

const WebsiteSettings = () => {
  const { data, updateSectionsConfig, updateLoginPageConfig } = useAdmin();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('sections');
  const [showFileSelector, setShowFileSelector] = useState(false);
  const [fileSelectFor, setFileSelectFor] = useState('');

  const [sectionsConfig, setSectionsConfig] = useState(data.band.sections || {});
  const [loginPageConfig, setLoginPageConfig] = useState(data.band.loginPage || {});

  const sections = [
    { key: 'hero', label: 'Hero Section', icon: FiStar, description: 'Main landing area with band info' },
    { key: 'music', label: 'Music Player', icon: FiMusic, description: 'Audio player and track listings' },
    { key: 'gallery', label: 'Multimedia Gallery', icon: FiImage, description: 'Photos and videos showcase' },
    { key: 'podcast', label: 'Podcast Diary', icon: FiMic, description: 'Podcast episodes and audio content' },
    { key: 'fanWall', label: 'Fan Wall', icon: FiMessageCircle, description: 'Fan comments and community' },
    { key: 'merchandising', label: 'Merchandising', icon: FiShoppingBag, description: 'Products and e-commerce' }
  ];

  const backgroundTypes = [
    { value: 'gradient', label: 'Gradient Background' },
    { value: 'image', label: 'Background Image' },
    { value: 'solid', label: 'Solid Color' }
  ];

  const handleSectionToggle = (sectionKey, field) => {
    setSectionsConfig(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: !prev[sectionKey]?.[field]
      }
    }));
  };

  const handleLoginPageChange = (field, value) => {
    setLoginPageConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureToggle = (index) => {
    setLoginPageConfig(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, enabled: !feature.enabled } : feature
      )
    }));
  };

  const handleAddFeature = () => {
    setLoginPageConfig(prev => ({
      ...prev,
      features: [
        ...prev.features,
        {
          icon: "FiStar",
          title: "New feature",
          enabled: true
        }
      ]
    }));
  };

  const handleRemoveFeature = (index) => {
    setLoginPageConfig(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleFeatureChange = (index, field, value) => {
    setLoginPageConfig(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (activeTab === 'sections') {
      updateSectionsConfig(sectionsConfig);
    } else {
      updateLoginPageConfig(loginPageConfig);
    }
    
    setIsSaving(false);
  };

  const handleFileSelect = (file) => {
    if (fileSelectFor === 'loginBackground') {
      handleLoginPageChange('backgroundImage', file.url);
    } else if (fileSelectFor === 'loginLogo') {
      handleLoginPageChange('logoImage', file.url);
    }
    setShowFileSelector(false);
    setFileSelectFor('');
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        if (type === 'background') {
          handleLoginPageChange('backgroundImage', imageUrl);
        } else if (type === 'logo') {
          handleLoginPageChange('logoImage', imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'sections', label: 'Website Sections', icon: FiEye },
    { id: 'login', label: 'Login Page', icon: FiStar }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Website Settings</h1>
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SafeIcon icon={FiSave} />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white/70 backdrop-blur-md text-gray-600 hover:bg-white/90'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SafeIcon icon={tab.icon} className="text-sm" />
            <span className="font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Sections Configuration */}
      {activeTab === 'sections' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Website Sections Control</h2>
          <p className="text-gray-600 mb-8">
            Control which sections are visible on your website and whether they appear in the navigation menu.
          </p>

          <div className="space-y-6">
            {sections.map(section => {
              const sectionConfig = sectionsConfig[section.key] || { enabled: true, showInNavigation: true };
              return (
                <div key={section.key} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <SafeIcon icon={section.icon} className="text-xl text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{section.label}</h3>
                        <p className="text-gray-600 text-sm">{section.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">
                          {sectionConfig.enabled ? 'Active' : 'Disabled'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {sectionConfig.showInNavigation ? 'In Navigation' : 'Hidden from Nav'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Enable/Disable Section */}
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">Enable Section:</span>
                      <motion.button
                        onClick={() => handleSectionToggle(section.key, 'enabled')}
                        className={`flex items-center w-12 h-6 rounded-full transition-all ${
                          sectionConfig.enabled ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="w-4 h-4 bg-white rounded-full shadow-md"
                          animate={{
                            x: sectionConfig.enabled ? 32 : 4
                          }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.button>
                    </div>

                    {/* Show in Navigation */}
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">Show in Navigation:</span>
                      <motion.button
                        onClick={() => handleSectionToggle(section.key, 'showInNavigation')}
                        disabled={!sectionConfig.enabled}
                        className={`flex items-center w-12 h-6 rounded-full transition-all ${
                          sectionConfig.showInNavigation && sectionConfig.enabled 
                            ? 'bg-blue-500' 
                            : 'bg-gray-300'
                        } ${!sectionConfig.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="w-4 h-4 bg-white rounded-full shadow-md"
                          animate={{
                            x: (sectionConfig.showInNavigation && sectionConfig.enabled) ? 32 : 4
                          }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.button>
                    </div>
                  </div>

                  {!sectionConfig.enabled && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> This section will be completely hidden from the website when disabled.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Section Control Guide</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• <strong>Enable Section:</strong> Controls whether the section appears on the website at all</p>
              <p>• <strong>Show in Navigation:</strong> Controls whether the section appears in the navigation menu</p>
              <p>• <strong>Disabled sections:</strong> Are completely hidden from visitors</p>
              <p>• <strong>Hidden from navigation:</strong> Section exists but visitors must navigate manually</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Login Page Configuration */}
      {activeTab === 'login' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Basic Content */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Login Page Content</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                <input
                  type="text"
                  value={loginPageConfig.title || ''}
                  onChange={(e) => handleLoginPageChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="Welcome Back to the Cosmos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle/Description</label>
                <textarea
                  value={loginPageConfig.subtitle || ''}
                  onChange={(e) => handleLoginPageChange('subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none"
                  rows="3"
                  placeholder="Join our stellar community and unlock exclusive content..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Terms Text</label>
                  <input
                    type="text"
                    value={loginPageConfig.termsText || ''}
                    onChange={(e) => handleLoginPageChange('termsText', e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="By signing in, you agree to our"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showTerms"
                    checked={loginPageConfig.showTerms !== false}
                    onChange={(e) => handleLoginPageChange('showTerms', e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="showTerms" className="text-sm text-gray-700">
                    Show terms and privacy links
                  </label>
                </div>
              </div>

              {loginPageConfig.showTerms !== false && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Terms of Service Link</label>
                    <input
                      type="text"
                      value={loginPageConfig.termsLink || ''}
                      onChange={(e) => handleLoginPageChange('termsLink', e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                      placeholder="#terms or https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Policy Link</label>
                    <input
                      type="text"
                      value={loginPageConfig.privacyLink || ''}
                      onChange={(e) => handleLoginPageChange('privacyLink', e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                      placeholder="#privacy or https://..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Background Customization */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Background Customization</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Type</label>
                <select
                  value={loginPageConfig.backgroundType || 'gradient'}
                  onChange={(e) => handleLoginPageChange('backgroundType', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                >
                  {backgroundTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {loginPageConfig.backgroundType === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'background')}
                        className="hidden"
                        id="loginBackgroundUpload"
                      />
                      <label htmlFor="loginBackgroundUpload" className="cursor-pointer">
                        <SafeIcon icon={FiUpload} className="mx-auto text-2xl text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload background image</p>
                      </label>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="url"
                        value={loginPageConfig.backgroundImage || ''}
                        onChange={(e) => handleLoginPageChange('backgroundImage', e.target.value)}
                        className="flex-1 px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        placeholder="Or enter image URL..."
                      />
                      <motion.button
                        type="button"
                        onClick={() => {
                          setFileSelectFor('loginBackground');
                          setShowFileSelector(true);
                        }}
                        className="px-4 py-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <SafeIcon icon={FiFolder} />
                      </motion.button>
                    </div>
                    {loginPageConfig.backgroundImage && (
                      <div className="mt-3">
                        <img
                          src={loginPageConfig.backgroundImage}
                          alt="Background preview"
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {loginPageConfig.backgroundType === 'solid' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={loginPageConfig.backgroundColor || '#8B5CF6'}
                      onChange={(e) => handleLoginPageChange('backgroundColor', e.target.value)}
                      className="w-12 h-12 border border-gray-200 rounded-xl cursor-pointer"
                    />
                    <input
                      type="text"
                      value={loginPageConfig.backgroundColor || '#8B5CF6'}
                      onChange={(e) => handleLoginPageChange('backgroundColor', e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/80 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Logo Customization */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Logo Customization</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useCustomLogo"
                  checked={loginPageConfig.useCustomLogo || false}
                  onChange={(e) => handleLoginPageChange('useCustomLogo', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="useCustomLogo" className="text-sm text-gray-700">
                  Use custom logo instead of band logo
                </label>
              </div>

              {loginPageConfig.useCustomLogo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Logo Image</label>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'logo')}
                        className="hidden"
                        id="loginLogoUpload"
                      />
                      <label htmlFor="loginLogoUpload" className="cursor-pointer">
                        <SafeIcon icon={FiUpload} className="mx-auto text-2xl text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload logo image</p>
                      </label>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="url"
                        value={loginPageConfig.logoImage || ''}
                        onChange={(e) => handleLoginPageChange('logoImage', e.target.value)}
                        className="flex-1 px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        placeholder="Or enter logo URL..."
                      />
                      <motion.button
                        type="button"
                        onClick={() => {
                          setFileSelectFor('loginLogo');
                          setShowFileSelector(true);
                        }}
                        className="px-4 py-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <SafeIcon icon={FiFolder} />
                      </motion.button>
                    </div>
                    {loginPageConfig.logoImage && (
                      <div className="mt-3">
                        <img
                          src={loginPageConfig.logoImage}
                          alt="Logo preview"
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Features List */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Feature Highlights</h2>
              <motion.button
                onClick={handleAddFeature}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiStar} className="text-sm" />
                <span>Add Feature</span>
              </motion.button>
            </div>

            <div className="space-y-4">
              {loginPageConfig.features?.map((feature, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={feature.enabled}
                      onChange={() => handleFeatureToggle(index)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-600">Enabled</span>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={feature.icon}
                      onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                      placeholder="Icon name (e.g., FiMusic)"
                    />
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                      placeholder="Feature description"
                    />
                  </div>
                  <motion.button
                    onClick={() => handleRemoveFeature(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <SafeIcon icon={FiEyeOff} className="text-sm" />
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* File Selector */}
      <FileSelector
        isOpen={showFileSelector}
        onClose={() => setShowFileSelector(false)}
        onSelect={handleFileSelect}
        fileTypes={['image']}
        title="Select Image"
      />
    </motion.div>
  );
};

export default WebsiteSettings;