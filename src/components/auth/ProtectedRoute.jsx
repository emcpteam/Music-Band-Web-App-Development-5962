import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiLoader } = FiIcons;

const ProtectedRoute = ({ children, requireOnboarding = false }) => {
  const { isAuthenticated, loading, isOnboardingComplete } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <SafeIcon icon={FiLoader} className="text-white text-2xl" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Loading...
          </h3>
          <p className="text-gray-600">
            Preparing your cosmic experience
          </p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  if (requireOnboarding && !isOnboardingComplete()) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default ProtectedRoute;