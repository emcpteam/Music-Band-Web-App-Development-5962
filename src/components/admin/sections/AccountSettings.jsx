import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../../common/SafeIcon';
import { useAdmin } from '../../../contexts/AdminContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import LanguageSelector from '../../common/LanguageSelector';

const { FiUser, FiLock, FiSave, FiEye, FiEyeOff, FiMail, FiShield } = FiIcons;

const AccountSettings = () => {
  const { data, changePassword, updateAdminCredentials } = useAdmin();
  const { ta } = useLanguage();
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [credentialsForm, setCredentialsForm] = useState({
    username: data.adminCredentials.username,
    email: data.adminCredentials.email
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState({
    password: false,
    credentials: false
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoading({ ...isLoading, password: true });
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessages({ password: { type: 'error', text: ta('passwordMismatch') } });
      setIsLoading({ ...isLoading, password: false });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setMessages({ password: { type: 'error', text: ta('passwordTooShort') } });
      setIsLoading({ ...isLoading, password: false });
      return;
    }
    
    const result = changePassword(passwordForm.currentPassword, passwordForm.newPassword);
    
    setTimeout(() => {
      if (result.success) {
        setMessages({ password: { type: 'success', text: ta('passwordUpdated') } });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessages({ password: { type: 'error', text: ta(result.error === 'Current password is incorrect' ? 'incorrectPassword' : 'error') } });
      }
      setIsLoading({ ...isLoading, password: false });
    }, 1000);
  };

  const handleCredentialsUpdate = async (e) => {
    e.preventDefault();
    setIsLoading({ ...isLoading, credentials: true });
    
    setTimeout(() => {
      const result = updateAdminCredentials(credentialsForm.username, credentialsForm.email);
      
      if (result.success) {
        setMessages({ credentials: { type: 'success', text: ta('credentialsUpdated') } });
      } else {
        setMessages({ credentials: { type: 'error', text: ta('error') } });
      }
      setIsLoading({ ...isLoading, credentials: false });
    }, 1000);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{ta('accountSettings')}</h1>
        <LanguageSelector />
      </div>

      {/* Admin Credentials */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <SafeIcon icon={FiUser} className="mr-2" />
          {ta('adminCredentials')}
        </h2>
        
        <form onSubmit={handleCredentialsUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ta('adminUsername')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={credentialsForm.username}
                  onChange={(e) => setCredentialsForm({ ...credentialsForm, username: e.target.value })}
                  className="w-full px-4 py-3 pl-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder={ta('enterUsername')}
                  required
                />
                <SafeIcon icon={FiUser} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ta('emailAddress')}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={credentialsForm.email}
                  onChange={(e) => setCredentialsForm({ ...credentialsForm, email: e.target.value })}
                  className="w-full px-4 py-3 pl-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="admin@example.com"
                  required
                />
                <SafeIcon icon={FiMail} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
          
          {messages.credentials && (
            <div className={`p-3 rounded-lg ${
              messages.credentials.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {messages.credentials.text}
            </div>
          )}
          
          <div className="flex justify-end">
            <motion.button
              type="submit"
              disabled={isLoading.credentials}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiSave} />
              <span>{isLoading.credentials ? ta('loading') : ta('updateCredentials')}</span>
            </motion.button>
          </div>
        </form>
      </div>

      {/* Password Management */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <SafeIcon icon={FiLock} className="mr-2" />
          {ta('passwordManagement')}
        </h2>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {ta('currentPassword')}
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full px-4 py-3 pl-12 pr-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                placeholder={ta('enterCurrentPassword')}
                required
              />
              <SafeIcon icon={FiLock} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={showPasswords.current ? FiEyeOff : FiEye} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ta('newPassword')}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-3 pl-12 pr-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder={ta('enterNewPassword')}
                  required
                  minLength={6}
                />
                <SafeIcon icon={FiShield} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={showPasswords.new ? FiEyeOff : FiEye} />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ta('confirmPassword')}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 pl-12 pr-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder={ta('confirmNewPassword')}
                  required
                  minLength={6}
                />
                <SafeIcon icon={FiShield} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={showPasswords.confirm ? FiEyeOff : FiEye} />
                </button>
              </div>
            </div>
          </div>
          
          {messages.password && (
            <div className={`p-3 rounded-lg ${
              messages.password.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {messages.password.text}
            </div>
          )}
          
          <div className="flex justify-end">
            <motion.button
              type="submit"
              disabled={isLoading.password}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiLock} />
              <span>{isLoading.password ? ta('loading') : ta('updatePassword')}</span>
            </motion.button>
          </div>
        </form>
      </div>

      {/* Security Information */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <SafeIcon icon={FiShield} className="mr-2 text-blue-600" />
          Security Tips
        </h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• Use a strong password with at least 6 characters</p>
          <p>• Include a mix of letters, numbers, and special characters</p>
          <p>• Don't share your admin credentials with anyone</p>
          <p>• Change your password regularly for better security</p>
          <p>• Log out when leaving the admin panel unattended</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountSettings;