import React,{useState} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../../common/SafeIcon';
import {useAdmin} from '../../../contexts/AdminContext';

const {FiSave,FiGlobe,FiSearch,FiTag,FiFileText,FiEye,FiRefreshCw} = FiIcons;

const SeoSettings = () => {
  const {data,updateSeoSettings} = useAdmin();
  const [isSaving,setIsSaving] = useState(false);
  
  const [seoData,setSeoData] = useState({
    title: data.band.seo?.title || `${data.band.name} - Official Website`,
    description: data.band.seo?.description || `Experience ${data.band.name}'s cosmic soundscapes. Listen to our latest albums, explore multimedia content, and join our stellar community.`,
    keywords: data.band.seo?.keywords || `${data.band.name}, music, electronic, ambient, cosmic, soundscape, album`,
    ogImage: data.band.seo?.ogImage || data.band.logo,
    twitterCard: data.band.seo?.twitterCard || 'summary_large_image',
    canonicalUrl: data.band.seo?.canonicalUrl || '',
    robots: data.band.seo?.robots || 'index, follow',
    author: data.band.seo?.author || data.band.name,
    language: data.band.seo?.language || 'en',
    structuredData: data.band.seo?.structuredData !== false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve,1000));
    
    updateSeoSettings(seoData);
    setIsSaving(false);
  };

  const handleChange = (field,value) => {
    setSeoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePreview = () => {
    return {
      title: seoData.title,
      description: seoData.description.slice(0,160),
      url: window.location.origin
    };
  };

  const preview = generatePreview();

  const resetToDefaults = () => {
    setSeoData({
      title: `${data.band.name} - Official Website`,
      description: `Experience ${data.band.name}'s cosmic soundscapes. Listen to our latest albums, explore multimedia content, and join our stellar community.`,
      keywords: `${data.band.name}, music, electronic, ambient, cosmic, soundscape, album`,
      ogImage: data.band.logo,
      twitterCard: 'summary_large_image',
      canonicalUrl: '',
      robots: 'index, follow',
      author: data.band.name,
      language: 'en',
      structuredData: true
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0,y: 20 }}
      animate={{ opacity: 1,y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">SEO & Meta Tags</h1>
        <motion.button
          onClick={resetToDefaults}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SafeIcon icon={FiRefreshCw} className="text-sm" />
          <span>Reset to Defaults</span>
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Meta Tags */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <SafeIcon icon={FiGlobe} className="mr-2" />
            Basic Meta Tags
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title *
              </label>
              <input
                type="text"
                value={seoData.title}
                onChange={(e) => handleChange('title',e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="Your Band Name - Official Website"
                maxLength="60"
                required
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">
                  Recommended: 50-60 characters for optimal display
                </p>
                <span className={`text-xs ${seoData.title.length > 60 ? 'text-red-500' : 'text-gray-500'}`}>
                  {seoData.title.length}/60
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description *
              </label>
              <textarea
                value={seoData.description}
                onChange={(e) => handleChange('description',e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none"
                rows="4"
                placeholder="Describe your band and music in an engaging way..."
                maxLength="160"
                required
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">
                  Recommended: 150-160 characters for optimal display
                </p>
                <span className={`text-xs ${seoData.description.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
                  {seoData.description.length}/160
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords
              </label>
              <input
                type="text"
                value={seoData.keywords}
                onChange={(e) => handleChange('keywords',e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="band name, genre, music, album, songs"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate keywords with commas. Focus on relevant terms your audience might search for.
              </p>
            </div>
          </div>
        </div>

        {/* Open Graph & Social Media */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <SafeIcon icon={FiTag} className="mr-2" />
            Social Media & Open Graph
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Media Image (Open Graph)
              </label>
              <input
                type="url"
                value={seoData.ogImage}
                onChange={(e) => handleChange('ogImage',e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="https://your-site.com/social-image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended size: 1200x630px. This image appears when your site is shared on social media.
              </p>
              {seoData.ogImage && (
                <div className="mt-3">
                  <img
                    src={seoData.ogImage}
                    alt="Social media preview"
                    className="w-32 h-16 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Card Type
              </label>
              <select
                value={seoData.twitterCard}
                onChange={(e) => handleChange('twitterCard',e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary with Large Image</option>
                <option value="app">App</option>
                <option value="player">Player</option>
              </select>
            </div>
          </div>
        </div>

        {/* Technical SEO */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <SafeIcon icon={FiSearch} className="mr-2" />
            Technical SEO
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canonical URL
              </label>
              <input
                type="url"
                value={seoData.canonicalUrl}
                onChange={(e) => handleChange('canonicalUrl',e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="https://your-site.com (leave empty to use current domain)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Helps prevent duplicate content issues. Leave empty to use the current domain.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Robots Directive
                </label>
                <select
                  value={seoData.robots}
                  onChange={(e) => handleChange('robots',e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                >
                  <option value="index, follow">Index, Follow (Recommended)</option>
                  <option value="noindex, follow">No Index, Follow</option>
                  <option value="index, nofollow">Index, No Follow</option>
                  <option value="noindex, nofollow">No Index, No Follow</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={seoData.language}
                  onChange={(e) => handleChange('language',e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                >
                  <option value="en">English</option>
                  <option value="it">Italian</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={seoData.author}
                onChange={(e) => handleChange('author',e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="Band name or website author"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="structuredData"
                checked={seoData.structuredData}
                onChange={(e) => handleChange('structuredData',e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="structuredData" className="text-sm text-gray-700">
                Enable structured data (Schema.org markup) for better search results
              </label>
            </div>
          </div>
        </div>

        {/* Search Preview */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <SafeIcon icon={FiEye} className="mr-2" />
            Search Engine Preview
          </h2>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="max-w-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <span className="text-green-700 text-sm">{preview.url}</span>
              </div>
              <h3 className="text-blue-600 text-lg font-medium hover:underline cursor-pointer mb-1">
                {preview.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {preview.description}
                {preview.description.length >= 160 && '...'}
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">SEO Tips</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• Keep titles under 60 characters and descriptions under 160 characters</p>
              <p>• Include your band name and main keywords in the title</p>
              <p>• Write compelling descriptions that encourage clicks</p>
              <p>• Use high-quality images (1200x630px) for social media sharing</p>
              <p>• Update meta tags when you release new content</p>
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
            <span>{isSaving ? 'Saving...' : 'Save SEO Settings'}</span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default SeoSettings;