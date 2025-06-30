import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../../common/SafeIcon';
import { useAdmin } from '../../../contexts/AdminContext';
import { useLanguage } from '../../../contexts/LanguageContext';

const { FiSave, FiCode, FiLink, FiShield, FiEye, FiEyeOff, FiPlus, FiTrash2, FiAlertTriangle } = FiIcons;

const FooterSettings = () => {
  const { data, updateFooterSettings } = useAdmin();
  const { ta } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState({
    gdprBanner: false,
    cookieBanner: false,
    customScript: false,
    customHtml: false
  });

  const [footerData, setFooterData] = useState({
    copyrightText: data.band.footer?.copyrightText || "© 2024 Stellar Waves. All rights reserved.",
    customText: data.band.footer?.customText || "",
    showQuickLinks: data.band.footer?.showQuickLinks ?? true,
    showSocialLinks: data.band.footer?.showSocialLinks ?? true,
    embedCodes: {
      gdprBanner: data.band.footer?.embedCodes?.gdprBanner || "",
      cookieBanner: data.band.footer?.embedCodes?.cookieBanner || "",
      customScript: data.band.footer?.embedCodes?.customScript || "",
      customHtml: data.band.footer?.embedCodes?.customHtml || ""
    },
    legalLinks: {
      privacyPolicy: data.band.footer?.legalLinks?.privacyPolicy || "#privacy",
      termsOfService: data.band.footer?.legalLinks?.termsOfService || "#terms",
      cookiePolicy: data.band.footer?.legalLinks?.cookiePolicy || "#cookies",
      showLegalLinks: data.band.footer?.legalLinks?.showLegalLinks ?? true
    },
    customLinks: data.band.footer?.customLinks || []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    updateFooterSettings(footerData);
    setIsSaving(false);
  };

  const handleChange = (field, value) => {
    setFooterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmbedCodeChange = (type, value) => {
    setFooterData(prev => ({
      ...prev,
      embedCodes: {
        ...prev.embedCodes,
        [type]: value
      }
    }));
  };

  const handleLegalLinkChange = (field, value) => {
    setFooterData(prev => ({
      ...prev,
      legalLinks: {
        ...prev.legalLinks,
        [field]: value
      }
    }));
  };

  const addCustomLink = () => {
    setFooterData(prev => ({
      ...prev,
      customLinks: [...prev.customLinks, { label: "", url: "", newTab: false }]
    }));
  };

  const updateCustomLink = (index, field, value) => {
    setFooterData(prev => ({
      ...prev,
      customLinks: prev.customLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeCustomLink = (index) => {
    setFooterData(prev => ({
      ...prev,
      customLinks: prev.customLinks.filter((_, i) => i !== index)
    }));
  };

  const toggleEmbedCodeVisibility = (type) => {
    setShowEmbedCode(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Footer Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Footer Content */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Footer Content</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Copyright Text
              </label>
              <input
                type="text"
                value={footerData.copyrightText}
                onChange={(e) => handleChange('copyrightText', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="© 2024 Your Band Name. All rights reserved."
              />
              <p className="text-xs text-gray-500 mt-1">This text will appear in the footer copyright section</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Footer Text (Optional)
              </label>
              <textarea
                value={footerData.customText}
                onChange={(e) => handleChange('customText', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none"
                rows="3"
                placeholder="Add any custom text that should appear in the footer..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showQuickLinks"
                  checked={footerData.showQuickLinks}
                  onChange={(e) => handleChange('showQuickLinks', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="showQuickLinks" className="text-sm text-gray-700">
                  Show Quick Links section
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showSocialLinks"
                  checked={footerData.showSocialLinks}
                  onChange={(e) => handleChange('showSocialLinks', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="showSocialLinks" className="text-sm text-gray-700">
                  Show Social Media Links
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <SafeIcon icon={FiShield} className="mr-2" />
            Legal Links
          </h2>

          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="showLegalLinks"
                checked={footerData.legalLinks.showLegalLinks}
                onChange={(e) => handleLegalLinkChange('showLegalLinks', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="showLegalLinks" className="text-sm text-gray-700">
                Show Legal Links in Footer
              </label>
            </div>

            {footerData.legalLinks.showLegalLinks && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Privacy Policy URL
                  </label>
                  <input
                    type="text"
                    value={footerData.legalLinks.privacyPolicy}
                    onChange={(e) => handleLegalLinkChange('privacyPolicy', e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="#privacy or https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Terms of Service URL
                  </label>
                  <input
                    type="text"
                    value={footerData.legalLinks.termsOfService}
                    onChange={(e) => handleLegalLinkChange('termsOfService', e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="#terms or https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cookie Policy URL
                  </label>
                  <input
                    type="text"
                    value={footerData.legalLinks.cookiePolicy}
                    onChange={(e) => handleLegalLinkChange('cookiePolicy', e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="#cookies or https://..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Custom Links */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <SafeIcon icon={FiLink} className="mr-2" />
              Custom Links
            </h2>
            <motion.button
              type="button"
              onClick={addCustomLink}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiPlus} className="text-sm" />
              <span>Add Link</span>
            </motion.button>
          </div>

          <div className="space-y-4">
            {footerData.customLinks.map((link, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateCustomLink(index, 'label', e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                    placeholder="Link Label"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                    placeholder="https://... or #anchor"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={link.newTab}
                    onChange={(e) => updateCustomLink(index, 'newTab', e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-600">New Tab</span>
                </div>
                <motion.button
                  type="button"
                  onClick={() => removeCustomLink(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <SafeIcon icon={FiTrash2} className="text-sm" />
                </motion.button>
              </div>
            ))}

            {footerData.customLinks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No custom links added yet. Click "Add Link" to create your first custom footer link.</p>
              </div>
            )}
          </div>
        </div>

        {/* Embed Codes - GDPR, Cookie Banners, etc. */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <SafeIcon icon={FiCode} className="mr-2" />
            Embed Codes & Scripts
          </h2>

          <div className="space-y-6">
            {/* GDPR Banner */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  GDPR Compliance Banner
                </label>
                <button
                  type="button"
                  onClick={() => toggleEmbedCodeVisibility('gdprBanner')}
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                >
                  <SafeIcon icon={showEmbedCode.gdprBanner ? FiEyeOff : FiEye} className="text-sm" />
                  <span className="text-sm">{showEmbedCode.gdprBanner ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <textarea
                type={showEmbedCode.gdprBanner ? 'text' : 'password'}
                value={footerData.embedCodes.gdprBanner}
                onChange={(e) => handleEmbedCodeChange('gdprBanner', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none font-mono text-sm"
                rows="4"
                placeholder="<!-- Paste your GDPR banner script here -->"
                style={{ filter: showEmbedCode.gdprBanner ? 'none' : 'blur(3px)' }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Examples: Cookiebot, OneTrust, CookieYes, or custom GDPR compliance scripts
              </p>
            </div>

            {/* Cookie Banner */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cookie Consent Banner
                </label>
                <button
                  type="button"
                  onClick={() => toggleEmbedCodeVisibility('cookieBanner')}
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                >
                  <SafeIcon icon={showEmbedCode.cookieBanner ? FiEyeOff : FiEye} className="text-sm" />
                  <span className="text-sm">{showEmbedCode.cookieBanner ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <textarea
                value={footerData.embedCodes.cookieBanner}
                onChange={(e) => handleEmbedCodeChange('cookieBanner', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none font-mono text-sm"
                rows="4"
                placeholder="<!-- Paste your cookie consent banner script here -->"
                style={{ filter: showEmbedCode.cookieBanner ? 'none' : 'blur(3px)' }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Examples: Cookie Consent, Termly, or other cookie notification services
              </p>
            </div>

            {/* Custom Script */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Custom JavaScript
                </label>
                <button
                  type="button"
                  onClick={() => toggleEmbedCodeVisibility('customScript')}
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                >
                  <SafeIcon icon={showEmbedCode.customScript ? FiEyeOff : FiEye} className="text-sm" />
                  <span className="text-sm">{showEmbedCode.customScript ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <textarea
                value={footerData.embedCodes.customScript}
                onChange={(e) => handleEmbedCodeChange('customScript', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none font-mono text-sm"
                rows="4"
                placeholder="<script>
// Your custom JavaScript code here
console.log('Custom footer script loaded');
</script>"
                style={{ filter: showEmbedCode.customScript ? 'none' : 'blur(3px)' }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Add any custom JavaScript that should run on all pages
              </p>
            </div>

            {/* Custom HTML */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Custom HTML/Widgets
                </label>
                <button
                  type="button"
                  onClick={() => toggleEmbedCodeVisibility('customHtml')}
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                >
                  <SafeIcon icon={showEmbedCode.customHtml ? FiEyeOff : FiEye} className="text-sm" />
                  <span className="text-sm">{showEmbedCode.customHtml ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <textarea
                value={footerData.embedCodes.customHtml}
                onChange={(e) => handleEmbedCodeChange('customHtml', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none font-mono text-sm"
                rows="4"
                placeholder="<!-- Custom HTML widgets, badges, or other elements -->"
                style={{ filter: showEmbedCode.customHtml ? 'none' : 'blur(3px)' }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Add custom HTML elements, widgets, badges, or third-party embeds
              </p>
            </div>
          </div>

          {/* Security Warning */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex items-start space-x-3">
              <SafeIcon icon={FiAlertTriangle} className="text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Security Notice</p>
                <ul className="space-y-1 text-xs">
                  <li>• Only add scripts from trusted sources</li>
                  <li>• Test all embed codes thoroughly before going live</li>
                  <li>• These scripts will be loaded on every page of your website</li>
                  <li>• Malicious scripts can compromise your website security</li>
                </ul>
              </div>
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
            <span>{isSaving ? 'Saving...' : 'Save Footer Settings'}</span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default FooterSettings;