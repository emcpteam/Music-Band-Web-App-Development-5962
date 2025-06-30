import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUser, FiSettings, FiLogOut, FiX, FiMail, FiCalendar, FiShield } = FiIcons;

const UserProfile = () => {
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowProfile(false);
  };

  const handleAdminAccess = () => {
    setShowProfile(false);
    navigate('/admin');
  };

  return (
    <>
      {/* Profile Button */}
      <motion.button
        onClick={() => setShowProfile(true)}
        className="fixed top-20 right-4 z-40 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <SafeIcon icon={FiUser} className="text-lg" />
      </motion.button>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfile(false)}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Your Profile
                </h2>
                <button
                  onClick={() => setShowProfile(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-gray-400" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiUser} className="text-white text-2xl" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Stellar Fan
                </h3>
                
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
                  <SafeIcon icon={FiMail} className="text-xs" />
                  <span>cosmic.fan@stellar.com</span>
                </div>

                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <SafeIcon icon={FiCalendar} className="text-xs" />
                  <span>Member since January 2024</span>
                </div>
              </div>

              {/* Profile Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800">12</div>
                  <div className="text-xs text-gray-600">Songs Liked</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800">3</div>
                  <div className="text-xs text-gray-600">Playlists</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800">8</div>
                  <div className="text-xs text-gray-600">Comments</div>
                </div>
              </div>

              {/* Menu Options */}
              <div className="space-y-3">
                <motion.button
                  className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SafeIcon icon={FiSettings} className="text-gray-600" />
                  <span className="text-gray-700">Account Settings</span>
                </motion.button>

                <motion.button
                  onClick={handleAdminAccess}
                  className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-colors text-left border border-purple-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SafeIcon icon={FiShield} className="text-purple-600" />
                  <span className="text-purple-700 font-medium">Admin Access</span>
                </motion.button>

                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SafeIcon icon={FiLogOut} className="text-red-600" />
                  <span className="text-red-700">Sign Out</span>
                </motion.button>
              </div>

              {/* Quest Membership Badge */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiSettings} className="text-white text-sm" />
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-800">Premium Member</h4>
                    <p className="text-sm text-purple-600">Exclusive access to all content</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserProfile;