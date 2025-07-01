import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { QuestLogin } from '@questlabs/react-sdk';
import { useAuth } from '../../contexts/AuthContext';
import { useBandData } from '../../contexts/AdminContext';
import questConfig from '../../config/questConfig';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiMusic, FiStar, FiHeadphones, FiHeart, FiZap } = FiIcons;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const bandData = useBandData();

  // Get login page configuration
  const loginConfig = bandData.band.loginPage || {};
  const theme = bandData.theme || {};

  const handleLogin = ({ userId, token, newUser }) => {
    const result = login({ userId, token, newUser });
    if (result.newUser) {
      navigate('/onboarding');
    } else {
      navigate('/');
    }
  };

  // Get background style based on configuration
  const getBackgroundStyle = () => {
    switch (loginConfig.backgroundType) {
      case 'image':
        return loginConfig.backgroundImage ? {
          backgroundImage: `url(${loginConfig.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {};
      case 'solid':
        return {
          backgroundColor: loginConfig.backgroundColor || theme.primaryColor || '#8B5CF6'
        };
      case 'gradient':
      default:
        return {
          background: `linear-gradient(135deg, ${theme.primaryColor || '#8B5CF6'}, ${theme.secondaryColor || '#EC4899'})`
        };
    }
  };

  // Get logo to display
  const logoToUse = loginConfig.useCustomLogo && loginConfig.logoImage 
    ? loginConfig.logoImage 
    : bandData.band.logo;

  // Icon mapping for features
  const iconMap = {
    FiMusic,
    FiStar,
    FiHeadphones,
    FiHeart,
    FiZap
  };

  // Get enabled features
  const enabledFeatures = (loginConfig.features || []).filter(feature => feature.enabled !== false);

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={getBackgroundStyle()}
    >
      {/* Background overlay for image backgrounds */}
      {loginConfig.backgroundType === 'image' && loginConfig.backgroundImage && (
        <div className="absolute inset-0 bg-black/20"></div>
      )}

      <div className="w-full max-w-6xl mx-auto relative z-10">
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
                {logoToUse && (
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img 
                      src={logoToUse} 
                      alt={bandData.band.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {bandData.band.name}
                </h1>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {loginConfig.title || "Welcome Back to the Cosmos"}
              </h2>
              <p className="text-xl text-white/90 font-light mb-8 leading-relaxed">
                {loginConfig.subtitle || "Join our stellar community and unlock exclusive content, behind-the-scenes access, and personalized music experiences crafted just for you."}
              </p>
            </div>

            {/* Feature Highlights */}
            {enabledFeatures.length > 0 && (
              <div className="space-y-4 mb-8">
                {enabledFeatures.map((feature, index) => {
                  const IconComponent = iconMap[feature.icon] || FiStar;
                  return (
                    <motion.div
                      key={index}
                      className="flex items-center justify-center lg:justify-start space-x-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    >
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <SafeIcon icon={IconComponent} className="text-white" />
                      </div>
                      <span className="text-white font-medium">{feature.title}</span>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Floating Elements */}
            <div className="hidden lg:block relative">
              <motion.div
                className="absolute -top-20 -right-10 w-20 h-20 bg-white/20 rounded-full opacity-60"
                animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-10 -left-5 w-16 h-16 bg-white/20 rounded-full opacity-60"
                animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>

          {/* Right: Authentication Section */}
          <motion.div
            className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl"
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
                accent={theme.primaryColor || questConfig.PRIMARY_COLOR}
                style={{ width: '100%', maxWidth: '400px' }}
              />
            </div>

            {/* Terms and Privacy Links */}
            {loginConfig.showTerms !== false && (
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  {loginConfig.termsText || "By signing in, you agree to our"}{' '}
                  <a 
                    href={loginConfig.termsLink || "#terms"} 
                    className="text-purple-600 hover:text-purple-700 underline"
                  >
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a 
                    href={loginConfig.privacyLink || "#privacy"} 
                    className="text-purple-600 hover:text-purple-700 underline"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;