import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useBandData } from '../contexts/AdminContext';

const { FiInstagram, FiMusic, FiYoutube, FiMail, FiHeart, FiExternalLink } = FiIcons;

const Footer = () => {
  const bandData = useBandData();
  const footerSettings = bandData.band.footer || {};

  const socialLinks = [
    { icon: FiInstagram, label: 'Instagram', url: bandData.band.socialLinks.instagram },
    { icon: FiMusic, label: 'Spotify', url: bandData.band.socialLinks.spotify },
    { icon: FiYoutube, label: 'YouTube', url: bandData.band.socialLinks.youtube },
    { icon: FiMusic, label: 'Bandcamp', url: bandData.band.socialLinks.bandcamp }
  ].filter(link => link.url); // Only show links that have URLs

  // Prepare legal links
  const legalLinks = [];
  if (footerSettings.legalLinks?.showLegalLinks) {
    if (footerSettings.legalLinks.privacyPolicy) {
      legalLinks.push({ label: 'Privacy Policy', url: footerSettings.legalLinks.privacyPolicy });
    }
    if (footerSettings.legalLinks.termsOfService) {
      legalLinks.push({ label: 'Terms of Service', url: footerSettings.legalLinks.termsOfService });
    }
    if (footerSettings.legalLinks.cookiePolicy) {
      legalLinks.push({ label: 'Cookie Policy', url: footerSettings.legalLinks.cookiePolicy });
    }
  }

  // Combine legal links with custom links
  const allCustomLinks = [...legalLinks, ...(footerSettings.customLinks || [])];

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center md:justify-start mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                <SafeIcon icon={FiMusic} className="text-white text-xl" />
              </div>
              <h3 className="text-2xl font-bold">{bandData.band.name}</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              {bandData.band.description}
            </p>
            
            {/* Custom Footer Text */}
            {footerSettings.customText && (
              <p className="text-gray-300 leading-relaxed mb-6">
                {footerSettings.customText}
              </p>
            )}

            <div className="flex items-center justify-center md:justify-start space-x-1 text-sm text-gray-400">
              <span>Made with</span>
              <SafeIcon icon={FiHeart} className="text-red-400 mx-1" />
              <span>for our fans</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          {footerSettings.showQuickLinks !== false && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <div className="space-y-3">
                <a href="#music" className="block text-gray-300 hover:text-white transition-colors">
                  Music Player
                </a>
                <a href="#gallery" className="block text-gray-300 hover:text-white transition-colors">
                  Gallery
                </a>
                <a href="#podcast" className="block text-gray-300 hover:text-white transition-colors">
                  Podcast Diary
                </a>
                <a href="#fanwall" className="block text-gray-300 hover:text-white transition-colors">
                  Fan Wall
                </a>
                <a href="#merch" className="block text-gray-300 hover:text-white transition-colors">
                  Merchandise
                </a>
              </div>
            </motion.div>
          )}

          {/* Contact & Social */}
          <motion.div
            className="text-center md:text-right"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold mb-6">Connect With Us</h4>
            
            {/* Social Links */}
            {footerSettings.showSocialLinks !== false && socialLinks.length > 0 && (
              <div className="flex justify-center md:justify-end space-x-4 mb-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    title={social.label}
                  >
                    <SafeIcon icon={social.icon} className="text-lg" />
                  </motion.a>
                ))}
              </div>
            )}

            <div className="space-y-3">
              {bandData.band.email && (
                <motion.a
                  href={`mailto:${bandData.band.email}`}
                  className="flex items-center justify-center md:justify-end space-x-2 text-gray-300 hover:text-white transition-colors"
                  whileHover={{ x: -2 }}
                >
                  <SafeIcon icon={FiMail} className="text-sm" />
                  <span>{bandData.band.email}</span>
                </motion.a>
              )}
              
              {bandData.band.socialLinks.bandcamp && (
                <motion.a
                  href={bandData.band.socialLinks.bandcamp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-end space-x-2 text-gray-300 hover:text-white transition-colors"
                  whileHover={{ x: -2 }}
                >
                  <SafeIcon icon={FiExternalLink} className="text-sm" />
                  <span>Bandcamp Store</span>
                </motion.a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Custom Links Section */}
        {allCustomLinks.length > 0 && (
          <motion.div
            className="border-t border-gray-700 mt-8 pt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex flex-wrap items-center justify-center space-x-6 text-sm text-gray-400">
              {allCustomLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target={link.newTab ? '_blank' : '_self'}
                  rel={link.newTab ? 'noopener noreferrer' : undefined}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-gray-700 mt-12 pt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              {footerSettings.copyrightText || `© 2024 ${bandData.band.name}. All rights reserved.`}
            </p>
          </div>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-10 left-10 w-2 h-2 bg-purple-400 rounded-full opacity-60"
            animate={{
              y: [0, -10, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-10 right-20 w-1 h-1 bg-pink-400 rounded-full opacity-60"
            animate={{
              y: [0, 10, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      {/* Embed Codes Section - GDPR, Cookie Banners, etc. */}
      {footerSettings.embedCodes && (
        <div className="footer-embeds">
          {/* GDPR Banner */}
          {footerSettings.embedCodes.gdprBanner && (
            <div dangerouslySetInnerHTML={{ __html: footerSettings.embedCodes.gdprBanner }} />
          )}
          
          {/* Cookie Banner */}
          {footerSettings.embedCodes.cookieBanner && (
            <div dangerouslySetInnerHTML={{ __html: footerSettings.embedCodes.cookieBanner }} />
          )}
          
          {/* Custom Script */}
          {footerSettings.embedCodes.customScript && (
            <div dangerouslySetInnerHTML={{ __html: footerSettings.embedCodes.customScript }} />
          )}
          
          {/* Custom HTML */}
          {footerSettings.embedCodes.customHtml && (
            <div dangerouslySetInnerHTML={{ __html: footerSettings.embedCodes.customHtml }} />
          )}
        </div>
      )}
    </footer>
  );
};

export default Footer;