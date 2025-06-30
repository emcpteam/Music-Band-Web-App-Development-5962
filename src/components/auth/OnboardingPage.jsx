import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { OnBoarding } from '@questlabs/react-sdk';
import { useAuth } from '../../contexts/AuthContext';
import questConfig from '../../config/questConfig';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiMusic, FiStar, FiHeart, FiZap } = FiIcons;

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();
  const [answers, setAnswers] = useState({});

  const userId = user?.userId || localStorage.getItem('quest_userId');
  const token = user?.token || localStorage.getItem('quest_token');

  const getAnswers = () => {
    completeOnboarding();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Welcome Section */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                  <SafeIcon icon={FiStar} className="text-white text-2xl" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome!
                </h1>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Let's Personalize Your Cosmic Journey
              </h2>
              
              <p className="text-xl text-gray-600 font-light mb-8 leading-relaxed">
                Help us understand your music preferences so we can create a stellar experience 
                tailored just for you. This will only take a moment!
              </p>
            </div>

            {/* What to Expect */}
            <div className="space-y-4 mb-8">
              <motion.div 
                className="flex items-center justify-center lg:justify-start space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiHeart} className="text-purple-600" />
                </div>
                <span className="text-gray-700 font-medium">Personalized music recommendations</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center justify-center lg:justify-start space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiMusic} className="text-pink-600" />
                </div>
                <span className="text-gray-700 font-medium">Curated playlists based on your taste</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center justify-center lg:justify-start space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiZap} className="text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">Early access to new releases</span>
              </motion.div>
            </div>

            {/* Progress Indicator */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Setup Progress</span>
                <span className="text-sm font-medium text-purple-600">Almost there!</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>

            {/* Floating Elements */}
            <div className="hidden lg:block relative">
              <motion.div
                className="absolute -top-20 -right-10 w-20 h-20 bg-purple-200 rounded-full opacity-60"
                animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-10 -left-5 w-16 h-16 bg-pink-200 rounded-full opacity-60"
                animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>

          {/* Right: Onboarding Component */}
          <motion.div
            className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-full max-w-sm mx-auto">
              {userId && token ? (
                <OnBoarding
                  userId={userId}
                  token={token}
                  questId={questConfig.QUEST_ONBOARDING_QUESTID}
                  answer={answers}
                  setAnswer={setAnswers}
                  getAnswers={getAnswers}
                  accent={questConfig.PRIMARY_COLOR}
                  singleChoose="modal1"
                  multiChoice="modal2"
                  style={{
                    width: '100%',
                    maxWidth: '400px'
                  }}
                >
                  <OnBoarding.Header />
                  <OnBoarding.Content />
                  <OnBoarding.Footer />
                </OnBoarding>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={FiZap} className="text-red-500 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Authentication Required
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Please sign in to continue with onboarding.
                  </p>
                  <motion.button
                    onClick={() => navigate('/login')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Go to Sign In
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;