import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { QuestLogin } from '@questlabs/react-sdk';
import { useAuth } from '../../contexts/AuthContext';
import questConfig from '../../config/questConfig';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiMusic, FiStar, FiHeadphones } = FiIcons;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = ({ userId, token, newUser }) => {
    const result = login({ userId, token, newUser });
    
    if (result.newUser) {
      navigate('/onboarding');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Branding Section */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                  <SafeIcon icon={FiMusic} className="text-white text-2xl" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Stellar Waves
                </h1>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Welcome Back to the Cosmos
              </h2>
              
              <p className="text-xl text-gray-600 font-light mb-8 leading-relaxed">
                Join our stellar community and unlock exclusive content, behind-the-scenes access, 
                and personalized music experiences crafted just for you.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4 mb-8">
              <motion.div 
                className="flex items-center justify-center lg:justify-start space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiMusic} className="text-purple-600" />
                </div>
                <span className="text-gray-700 font-medium">Exclusive music releases and demos</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center justify-center lg:justify-start space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiStar} className="text-pink-600" />
                </div>
                <span className="text-gray-700 font-medium">Behind-the-scenes content and stories</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center justify-center lg:justify-start space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiHeadphones} className="text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">Personalized listening experience</span>
              </motion.div>
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

          {/* Right: Authentication Section */}
          <motion.div
            className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Sign In to Continue
              </h3>
              <p className="text-gray-600">
                Access your cosmic music journey
              </p>
            </div>

            <div className="w-full max-w-sm mx-auto">
              <QuestLogin
                onSubmit={handleLogin}
                email={true}
                google={false}
                accent={questConfig.PRIMARY_COLOR}
                style={{
                  width: '100%',
                  maxWidth: '400px'
                }}
              />
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                By signing in, you agree to our{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;