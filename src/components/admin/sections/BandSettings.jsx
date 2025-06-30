import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../../common/SafeIcon';
import { useAdmin } from '../../../contexts/AdminContext';
import FileSelector from '../common/FileSelector';

const { FiSave, FiUpload, FiMail, FiInstagram, FiMusic, FiFolder, FiCode, FiBarChart3 } = FiIcons;

const BandSettings = () => {
  const { data, updateBandInfo } = useAdmin();
  const [formData, setFormData] = useState(data.band);
  const [isSaving, setIsSaving] = useState(false);
  const [showFileSelector, setShowFileSelector] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateBandInfo(formData);
    setIsSaving(false);
  };

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

  const handleTrackingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      tracking: {
        ...prev.tracking,
        [field]: value
      }
    }));
  };

  const handleFileSelect = (file) => {
    setFormData(prev => ({
      ...prev,
      logo: file.url
    }));
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
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Band Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="Enter band name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="contact@band.com"
                  required
                />
                <SafeIcon icon={FiMail} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
              placeholder="Your band's tagline"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none"
              rows="4"
              placeholder="Tell your story..."
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo/Avatar
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={formData.logo}
                  alt="Band logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => handleChange('logo', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="Enter URL or select image"
                />
              </div>
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
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Social Media</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="https://instagram.com/bandname"
                />
                <SafeIcon icon={FiInstagram} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spotify
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.socialLinks.spotify}
                  onChange={(e) => handleSocialChange('spotify', e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="https://spotify.com/artist/bandname"
                />
                <SafeIcon icon={FiMusic} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.socialLinks.youtube}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="https://youtube.com/bandname"
                />
                <SafeIcon icon={FiMusic} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bandcamp
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.socialLinks.bandcamp}
                  onChange={(e) => handleSocialChange('bandcamp', e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="https://bandname.bandcamp.com"
                />
                <SafeIcon icon={FiMusic} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics & Tracking */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <SafeIcon icon={FiBarChart3} className="text-purple-600 text-xl" />
            <h2 className="text-xl font-semibold text-gray-800">Analytics & Tracking</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Pixel Conversion Code
              </label>
              <div className="relative">
                <textarea
                  value={formData.tracking?.metaPixelCode || ''}
                  onChange={(e) => handleTrackingChange('metaPixelCode', e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none"
                  rows="4"
                  placeholder="<!-- Meta Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>"
                />
                <SafeIcon icon={FiCode} className="absolute left-4 top-4 text-gray-400" />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Paste your complete Meta Pixel code here. This will be added to all pages for conversion tracking.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Tag Manager Code
              </label>
              <div className="relative">
                <textarea
                  value={formData.tracking?.googleTagManagerCode || ''}
                  onChange={(e) => handleTrackingChange('googleTagManagerCode', e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none"
                  rows="4"
                  placeholder="<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXX');</script>
<!-- End Google Tag Manager -->"
                />
                <SafeIcon icon={FiCode} className="absolute left-4 top-4 text-gray-400" />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Paste your Google Tag Manager container code here. Replace GTM-XXXXXX with your actual container ID.
              </p>
            </div>
          </div>

          {/* Analytics Help Section */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <SafeIcon icon={FiBarChart3} className="mr-2 text-blue-600" />
              Analytics Setup Help
            </h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Meta Pixel:</strong> Track conversions, optimize ads, and build audiences for your Facebook and Instagram campaigns.</p>
              <p><strong>Google Tag Manager:</strong> Manage all your tracking codes in one place, including Google Analytics, conversion tracking, and more.</p>
              <p><strong>Note:</strong> These codes will be automatically added to all pages on your website. Make sure to test them after saving.</p>
            </div>
          </div>
        </div>

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
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </motion.button>
        </div>
      </form>

      {/* File Selector */}
      <FileSelector
        isOpen={showFileSelector}
        onClose={() => setShowFileSelector(false)}
        onSelect={handleFileSelect}
        fileTypes={['image']}
        title="Select Band Logo"
      />
    </motion.div>
  );
};

export default BandSettings;