import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAdmin } from '../../contexts/AdminContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../common/LanguageSelector';

const { FiLock, FiUser, FiEye, FiEyeOff, FiArrowLeft, FiRefreshCw } = FiIcons;

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const { login, resetPassword } = useAuth();
  const { data } = useAdmin();
  const { ta } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = login(formData.username, formData.password);
      
      if (result.success) {
        // Navigate to dashboard
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 100);
      } else {
        setError(result.error || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    }

    setLoading(false);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetMessage('');

    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = resetPassword(resetUsername);
    if (result.success) {
      setResetMessage(result.message);
      setShowReset(false);
      setResetUsername('');
      // Auto-fill the username for convenience
      setFormData(prev => ({ ...prev, username: resetUsername }));
    } else {
      setResetMessage(result.message);
    }

    setLoading(false);
  };

  const goBack = () => {
    navigate('/');
  };

  if (showReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <LanguageSelector />
          </div>
          
          <motion.div
            className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Button */}
            <motion.button
              onClick={() => setShowReset(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
              whileHover={{ x: -2 }}
            >
              <SafeIcon icon={FiArrowLeft} className="text-sm" />
              <span className="text-sm">{ta('backToLogin')}</span>
            </motion.button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiRefreshCw} className="text-white text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{ta('resetPassword')}</h1>
              <p className="text-gray-600">{ta('resetInstructions')}</p>
            </div>

            <form onSubmit={handleReset} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {ta('adminUsername')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={resetUsername}
                    onChange={(e) => setResetUsername(e.target.value)}
                    className="w-full px-4 py-3 pl-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder={ta('enterUsername')}
                    required
                  />
                  <SafeIcon icon={FiUser} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {resetMessage && (
                  <p className="mt-2 text-sm text-blue-600">{resetMessage}</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? ta('loading') : ta('sendResetLink')}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <motion.button
            onClick={goBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            whileHover={{ x: -2 }}
          >
            <SafeIcon icon={FiArrowLeft} className="text-sm" />
            <span className="text-sm">Back to Main Site</span>
          </motion.button>
          <LanguageSelector />
        </div>

        <motion.div
          className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiLock} className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Login</h1>
            <p className="text-gray-600">Access the band management dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ta('adminUsername')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 pl-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder={ta('enterUsername')}
                  required
                />
                <SafeIcon icon={FiUser} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 pl-12 pr-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="Enter admin password"
                  required
                />
                <SafeIcon icon={FiLock} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="text-sm text-purple-600 hover:text-purple-700 underline"
              >
                {ta('forgotPassword')}
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? ta('loading') : 'Login to Dashboard'}
            </motion.button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Username:</strong> admin</p>
              <p><strong>Password:</strong> admin123</p>
              <p className="mt-2 text-blue-600">Or try: demo / demo123</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;