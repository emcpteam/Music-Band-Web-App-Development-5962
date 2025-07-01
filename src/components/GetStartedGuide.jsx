import React from 'react';
import { motion } from 'framer-motion';
import { GetStarted } from '@questlabs/react-sdk';
import { useAuth } from '../contexts/AuthContext';
import { useBandData } from '../contexts/AdminContext';
import questConfig from '../config/questConfig';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiStar, FiMusic, FiHeart } = FiIcons;

const GetStartedGuide = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const bandData = useBandData();
  
  const userId = user?.userId || localStorage.getItem('quest_userId') || questConfig.USER_ID;
  const primaryColor = bandData?.theme?.primaryColor || questConfig.PRIMARY_COLOR;

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(45deg, ${primaryColor}, #EC4899)` }}
            >
              <SafeIcon icon={FiStar} className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Welcome to {bandData?.band?.name || 'Stellar Waves'}!
              </h2>
              <p className="text-gray-600 text-sm">
                Let's get you started on your cosmic music journey
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <SafeIcon icon={FiIcons.FiX} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isAuthenticated && userId ? (
            <div className="w-full max-w-2xl mx-auto">
              <GetStarted
                questId={questConfig.GET_STARTED_QUESTID}
                uniqueUserId={userId}
                accent={primaryColor}
                autoHide={false}
              >
                <GetStarted.Header />
                <GetStarted.Progress />
                <GetStarted.Content />
                <GetStarted.Footer />
              </GetStarted>
            </div>
          ) : (
            /* Fallback for non-authenticated users */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiMusic} className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Welcome to {bandData?.band?.name || 'Stellar Waves'}!
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Discover our cosmic soundscapes, explore exclusive content, and join our stellar community.
              </p>
              
              {/* Feature highlights */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <SafeIcon icon={FiMusic} className="text-purple-600" />
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">Exclusive Music</h4>
                  <p className="text-sm text-gray-600">Access our complete discography and unreleased tracks</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <SafeIcon icon={FiStar} className="text-pink-600" />
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">Behind the Scenes</h4>
                  <p className="text-sm text-gray-600">Explore our creative process and studio sessions</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <SafeIcon icon={FiHeart} className="text-blue-600" />
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">Community</h4>
                  <p className="text-sm text-gray-600">Connect with fellow fans and share your experience</p>
                </div>
              </div>

              <motion.button
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-medium text-white transition-all"
                style={{ background: `linear-gradient(45deg, ${primaryColor}, #EC4899)` }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Exploring
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GetStartedGuide;