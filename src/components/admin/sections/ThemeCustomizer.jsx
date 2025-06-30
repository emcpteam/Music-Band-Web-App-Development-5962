import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../../common/SafeIcon';
import { useAdmin } from '../../../contexts/AdminContext';
import FileSelector from '../common/FileSelector';

const { FiPalette, FiSave, FiRotateCcw, FiEye, FiRefreshCw, FiImage, FiFolder, FiUpload } = FiIcons;

const ThemeCustomizer = () => {
  const { data, updateTheme } = useAdmin();
  const [theme, setTheme] = useState(data.theme);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(Date.now());
  const [showFileSelector, setShowFileSelector] = useState(false);

  const colorPresets = [
    { name: 'Cosmic Purple', primaryColor: '#8B5CF6', secondaryColor: '#EC4899', accentColor: '#06B6D4' },
    { name: 'Ocean Blue', primaryColor: '#3B82F6', secondaryColor: '#10B981', accentColor: '#F59E0B' },
    { name: 'Sunset Orange', primaryColor: '#F97316', secondaryColor: '#EF4444', accentColor: '#8B5CF6' },
    { name: 'Forest Green', primaryColor: '#10B981', secondaryColor: '#059669', accentColor: '#F59E0B' },
    { name: 'Royal Purple', primaryColor: '#7C3AED', secondaryColor: '#DB2777', accentColor: '#059669' },
    { name: 'Electric Blue', primaryColor: '#0EA5E9', secondaryColor: '#8B5CF6', accentColor: '#F59E0B' }
  ];

  const fontOptions = [
    { value: 'Poppins', label: 'Poppins (Modern)' },
    { value: 'Inter', label: 'Inter (Clean)' },
    { value: 'Roboto', label: 'Roboto (Classic)' },
    { value: 'Montserrat', label: 'Montserrat (Elegant)' },
    { value: 'Open Sans', label: 'Open Sans (Friendly)' },
    { value: 'Nunito', label: 'Nunito (Rounded)' },
    { value: 'Lato', label: 'Lato (Humanist)' },
    { value: 'Source Sans Pro', label: 'Source Sans Pro (Clean)' }
  ];

  const backgroundOptions = [
    { value: 'gradient', label: 'Gradient Background' },
    { value: 'image', label: 'Full Background Image' },
    { value: 'overlay', label: 'Image with Gradient Overlay' }
  ];

  // Apply theme changes immediately to CSS variables (live preview)
  useEffect(() => {
    if (theme) {
      const root = document.documentElement;
      
      // Set CSS custom properties for live preview
      root.style.setProperty('--theme-primary', theme.primaryColor);
      root.style.setProperty('--theme-secondary', theme.secondaryColor);
      root.style.setProperty('--theme-accent', theme.accentColor);
      root.style.setProperty('--theme-background', theme.backgroundColor);
      root.style.setProperty('--theme-text', theme.textColor);
      root.style.setProperty('--theme-font-family', theme.fontFamily);
      
      // Hero background settings
      root.style.setProperty('--theme-hero-bg-image', theme.heroBackgroundImage || '');
      root.style.setProperty('--theme-hero-bg-type', theme.heroBackgroundType || 'gradient');
      root.style.setProperty('--theme-hero-overlay-opacity', (theme.heroOverlayOpacity || 0.3));

      // Apply font family to body for live preview
      document.body.style.fontFamily = theme.fontFamily;

      // Create RGB values for transparency effects
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };

      const primaryRgb = hexToRgb(theme.primaryColor);
      const secondaryRgb = hexToRgb(theme.secondaryColor);
      const accentRgb = hexToRgb(theme.accentColor);

      if (primaryRgb && secondaryRgb && accentRgb) {
        root.style.setProperty('--theme-primary-rgb', `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`);
        root.style.setProperty('--theme-secondary-rgb', `${secondaryRgb.r},${secondaryRgb.g},${secondaryRgb.b}`);
        root.style.setProperty('--theme-accent-rgb', `${accentRgb.r},${accentRgb.g},${accentRgb.b}`);
      }

      // Force re-render of components that use theme
      window.dispatchEvent(new CustomEvent('themePreviewUpdate', {
        detail: { theme, timestamp: Date.now() }
      }));
    }
  }, [theme]);

  const handleColorChange = (field, value) => {
    setTheme(prev => ({ ...prev, [field]: value }));
  };

  const handleHeroBackgroundChange = (field, value) => {
    setTheme(prev => ({ ...prev, [field]: value }));
  };

  const applyPreset = (preset) => {
    setTheme(prev => ({ ...prev, ...preset }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateTheme(theme);
    setLastSaved(Date.now());
    setIsSaving(false);
  };

  const resetToDefault = () => {
    const defaultTheme = {
      primaryColor: "#8B5CF6",
      secondaryColor: "#EC4899",
      accentColor: "#06B6D4",
      backgroundColor: "#FFFFFF",
      textColor: "#1F2937",
      fontFamily: "Poppins",
      heroBackgroundType: "gradient",
      heroBackgroundImage: "",
      heroOverlayOpacity: 0.3
    };
    setTheme(defaultTheme);
  };

  const refreshPreview = () => {
    // Force a re-render of the preview
    setLastSaved(Date.now());
    // Trigger theme update event
    window.dispatchEvent(new CustomEvent('themePreviewUpdate', {
      detail: { theme, timestamp: Date.now() }
    }));
  };

  const handleFileSelect = (file) => {
    setTheme(prev => ({ ...prev, heroBackgroundImage: file.url }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setTheme(prev => ({ ...prev, heroBackgroundImage: imageUrl }));
      };
      reader.readAsDataURL(file);
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
        <h1 className="text-3xl font-bold text-gray-800">Theme Customizer</h1>
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={refreshPreview}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Refresh Preview"
          >
            <SafeIcon icon={FiRefreshCw} />
            <span>Refresh</span>
          </motion.button>
          <motion.button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
              previewMode 
                ? 'bg-blue-500 text-white' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiEye} />
            <span>{previewMode ? 'Exit Preview' : 'Live Preview Active'}</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customization Panel */}
        <div className="space-y-6">
          {/* Color Presets */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Color Presets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colorPresets.map((preset, index) => (
                <motion.button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex space-x-1">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.primaryColor }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.secondaryColor }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.accentColor }}
                      />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{preset.name}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Custom Colors</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={theme.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="w-12 h-12 border border-gray-200 rounded-xl cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/80 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={theme.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="w-12 h-12 border border-gray-200 rounded-xl cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/80 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accent Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={theme.accentColor}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      className="w-12 h-12 border border-gray-200 rounded-xl cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.accentColor}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/80 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={theme.textColor}
                      onChange={(e) => handleColorChange('textColor', e.target.value)}
                      className="w-12 h-12 border border-gray-200 rounded-xl cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.textColor}
                      onChange={(e) => handleColorChange('textColor', e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/80 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Background Customization */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <SafeIcon icon={FiImage} className="mr-2" />
              Hero Background
            </h2>
            
            {/* Background Type Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Type
                </label>
                <select
                  value={theme.heroBackgroundType || 'gradient'}
                  onChange={(e) => handleHeroBackgroundChange('heroBackgroundType', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400"
                >
                  {backgroundOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Background Image Upload/Selection */}
              {(theme.heroBackgroundType === 'image' || theme.heroBackgroundType === 'overlay') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Image
                  </label>
                  
                  {/* Image Upload Options */}
                  <div className="space-y-4">
                    {/* Direct Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="heroBackgroundUpload"
                      />
                      <label htmlFor="heroBackgroundUpload" className="cursor-pointer">
                        <SafeIcon icon={FiUpload} className="mx-auto text-2xl text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload background image</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB (1920x1080 recommended)</p>
                      </label>
                    </div>

                    {/* URL Input */}
                    <div className="flex items-center space-x-4">
                      <input
                        type="url"
                        value={theme.heroBackgroundImage || ''}
                        onChange={(e) => handleHeroBackgroundChange('heroBackgroundImage', e.target.value)}
                        className="flex-1 px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400"
                        placeholder="Or enter image URL..."
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowFileSelector(true)}
                        className="px-4 py-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <SafeIcon icon={FiFolder} />
                      </motion.button>
                    </div>

                    {/* Image Preview */}
                    {theme.heroBackgroundImage && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preview
                        </label>
                        <div className="w-full h-32 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                          <img
                            src={theme.heroBackgroundImage}
                            alt="Hero background preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full hidden items-center justify-center text-red-500">
                            <SafeIcon icon={FiImage} className="text-2xl" />
                            <span className="ml-2 text-sm">Failed to load image</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Overlay Opacity (for overlay type) */}
              {theme.heroBackgroundType === 'overlay' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overlay Opacity: {Math.round((theme.heroOverlayOpacity || 0.3) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.8"
                    step="0.1"
                    value={theme.heroOverlayOpacity || 0.3}
                    onChange={(e) => handleHeroBackgroundChange('heroOverlayOpacity', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>80%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Typography */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Typography</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={theme.fontFamily}
                onChange={(e) => handleColorChange('fontFamily', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400"
              >
                {fontOptions.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundImage: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.secondaryColor})`
              }}
            >
              <SafeIcon icon={FiSave} />
              <span>{isSaving ? 'Saving...' : 'Save Theme'}</span>
            </motion.button>
            <motion.button
              onClick={resetToDefault}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiRotateCcw} />
              <span>Reset to Default</span>
            </motion.button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Live Preview</h2>
          <div
            className="p-6 rounded-xl border-2 border-gray-200 min-h-[500px] relative overflow-hidden"
            style={{
              fontFamily: theme.fontFamily,
              ...(theme.heroBackgroundType === 'gradient' && {
                backgroundImage: `linear-gradient(135deg, ${theme.primaryColor}20, ${theme.secondaryColor}20)`
              }),
              ...(theme.heroBackgroundType === 'image' && theme.heroBackgroundImage && {
                backgroundImage: `url(${theme.heroBackgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }),
              ...(theme.heroBackgroundType === 'overlay' && theme.heroBackgroundImage && {
                backgroundImage: `linear-gradient(rgba(${theme.primaryColor.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(',')}, ${theme.heroOverlayOpacity || 0.3}), rgba(${theme.secondaryColor.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(',')}, ${theme.heroOverlayOpacity || 0.3})), url(${theme.heroBackgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              })
            }}
            key={`${lastSaved}-${theme.primaryColor}-${theme.secondaryColor}-${theme.heroBackgroundType}-${theme.heroBackgroundImage}`}
          >
            {/* Preview Header */}
            <div className="text-center mb-6 relative z-10">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{
                  backgroundImage: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                }}
              >
                <SafeIcon icon={FiPalette} className="text-white text-xl" />
              </div>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: theme.textColor }}
              >
                Band Name
              </h1>
              <p className="text-gray-600">Album Title - Preview</p>
            </div>

            {/* Preview Buttons */}
            <div className="space-y-3 mb-6 relative z-10">
              <button
                className="w-full py-3 rounded-xl text-white font-medium transition-all hover:shadow-lg"
                style={{
                  backgroundImage: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                }}
              >
                Primary Button
              </button>
              <button
                className="w-full py-3 rounded-xl text-white font-medium transition-all hover:shadow-lg"
                style={{ backgroundColor: theme.accentColor }}
              >
                Accent Button
              </button>
            </div>

            {/* Preview Content Card */}
            <div
              className="p-4 rounded-xl mb-4 relative z-10"
              style={{ backgroundColor: `${theme.primaryColor}10` }}
            >
              <h3
                className="font-semibold mb-2"
                style={{ color: theme.textColor }}
              >
                Sample Content
              </h3>
              <p style={{ color: theme.textColor }}>
                This is how your text content will look with the selected theme colors and typography. 
                The font family applied is {theme.fontFamily}.
              </p>
            </div>

            {/* Preview Music Player */}
            <div className="bg-white/80 rounded-xl p-4 relative z-10">
              <div className="flex items-center space-x-4 mb-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <SafeIcon icon={FiPalette} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4
                    className="font-medium"
                    style={{ color: theme.textColor }}
                  >
                    Sample Song
                  </h4>
                  <p className="text-sm text-gray-600">Artist Name</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundImage: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                    width: '35%'
                  }}
                />
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  className="p-2 rounded-full"
                  style={{
                    backgroundColor: `${theme.primaryColor}20`,
                    color: theme.primaryColor
                  }}
                >
                  ⏮
                </button>
                <button
                  className="p-3 rounded-full text-white"
                  style={{
                    backgroundImage: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                  }}
                >
                  ▶
                </button>
                <button
                  className="p-2 rounded-full"
                  style={{
                    backgroundColor: `${theme.primaryColor}20`,
                    color: theme.primaryColor
                  }}
                >
                  ⏭
                </button>
              </div>
            </div>

            {/* Theme Info */}
            <div className="mt-6 text-xs text-gray-500 space-y-1 relative z-10">
              <p><strong>Primary:</strong> {theme.primaryColor}</p>
              <p><strong>Secondary:</strong> {theme.secondaryColor}</p>
              <p><strong>Accent:</strong> {theme.accentColor}</p>
              <p><strong>Font:</strong> {theme.fontFamily}</p>
              <p><strong>Background:</strong> {theme.heroBackgroundType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* File Selector */}
      <FileSelector
        isOpen={showFileSelector}
        onClose={() => setShowFileSelector(false)}
        onSelect={handleFileSelect}
        fileTypes={['image']}
        title="Select Hero Background Image"
      />
    </motion.div>
  );
};

export default ThemeCustomizer;