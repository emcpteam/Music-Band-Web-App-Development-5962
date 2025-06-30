import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../../common/SafeIcon';
import { useAdmin } from '../../../contexts/AdminContext';
import { useLanguage } from '../../../contexts/LanguageContext';

const { 
  FiSettings, 
  FiSave, 
  FiTruck, 
  FiCreditCard, 
  FiMail, 
  FiShield, 
  FiGlobe,
  FiDollarSign,
  FiPercent,
  FiPackage,
  FiMapPin,
  FiKey,
  FiEye,
  FiEyeOff
} = FiIcons;

const SystemConfiguration = () => {
  const { data, updateSystemConfiguration } = useAdmin();
  const { ta } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('shipping');
  const [showStripeKeys, setShowStripeKeys] = useState({
    publishable: false,
    secret: false,
    webhook: false
  });

  const [config, setConfig] = useState({
    shipping: {
      freeShippingThreshold: data.systemConfig?.shipping?.freeShippingThreshold || 50,
      rates: {
        domestic: data.systemConfig?.shipping?.rates?.domestic || 8.99,
        canada: data.systemConfig?.shipping?.rates?.canada || 12.99,
        europe: data.systemConfig?.shipping?.rates?.europe || 15.99,
        uk: data.systemConfig?.shipping?.rates?.uk || 12.99,
        australia: data.systemConfig?.shipping?.rates?.australia || 18.99,
        asia: data.systemConfig?.shipping?.rates?.asia || 22.99,
        worldwide: data.systemConfig?.shipping?.rates?.worldwide || 25.99
      },
      processing: {
        standardDays: data.systemConfig?.shipping?.processing?.standardDays || 3,
        expressDays: data.systemConfig?.shipping?.processing?.expressDays || 1,
        internationalDays: data.systemConfig?.shipping?.processing?.internationalDays || 7
      }
    },
    stripe: {
      publishableKey: data.systemConfig?.stripe?.publishableKey || '',
      secretKey: data.systemConfig?.stripe?.secretKey || '',
      webhookSecret: data.systemConfig?.stripe?.webhookSecret || '',
      currency: data.systemConfig?.stripe?.currency || 'USD',
      testMode: data.systemConfig?.stripe?.testMode ?? true
    },
    taxes: {
      enabled: data.systemConfig?.taxes?.enabled ?? true,
      rates: {
        US: data.systemConfig?.taxes?.rates?.US || 8.5,
        CA: data.systemConfig?.taxes?.rates?.CA || 13.0,
        EU: data.systemConfig?.taxes?.rates?.EU || 20.0,
        UK: data.systemConfig?.taxes?.rates?.UK || 20.0,
        AU: data.systemConfig?.taxes?.rates?.AU || 10.0,
        JP: data.systemConfig?.taxes?.rates?.JP || 10.0
      },
      inclusive: data.systemConfig?.taxes?.inclusive ?? false
    },
    email: {
      provider: data.systemConfig?.email?.provider || 'smtp',
      smtp: {
        host: data.systemConfig?.email?.smtp?.host || '',
        port: data.systemConfig?.email?.smtp?.port || 587,
        username: data.systemConfig?.email?.smtp?.username || '',
        password: data.systemConfig?.email?.smtp?.password || '',
        secure: data.systemConfig?.email?.smtp?.secure ?? true
      },
      templates: {
        orderConfirmation: data.systemConfig?.email?.templates?.orderConfirmation ?? true,
        shipmentTracking: data.systemConfig?.email?.templates?.shipmentTracking ?? true,
        promotionalEmails: data.systemConfig?.email?.templates?.promotionalEmails ?? false
      }
    },
    security: {
      enableRateLimiting: data.systemConfig?.security?.enableRateLimiting ?? true,
      maxLoginAttempts: data.systemConfig?.security?.maxLoginAttempts || 5,
      sessionTimeout: data.systemConfig?.security?.sessionTimeout || 30,
      requireHttps: data.systemConfig?.security?.requireHttps ?? true,
      enableCORS: data.systemConfig?.security?.enableCORS ?? true
    },
    inventory: {
      trackInventory: data.systemConfig?.inventory?.trackInventory ?? true,
      lowStockThreshold: data.systemConfig?.inventory?.lowStockThreshold || 10,
      outOfStockBehavior: data.systemConfig?.inventory?.outOfStockBehavior || 'hide',
      allowBackorders: data.systemConfig?.inventory?.allowBackorders ?? false
    }
  });

  const tabs = [
    { id: 'shipping', label: 'Shipping & Fulfillment', icon: FiTruck },
    { id: 'payment', label: 'Payment & Stripe', icon: FiCreditCard },
    { id: 'taxes', label: 'Taxes & Pricing', icon: FiPercent },
    { id: 'email', label: 'Email Settings', icon: FiMail },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'inventory', label: 'Inventory', icon: FiPackage }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateSystemConfiguration(config);
    setIsSaving(false);
  };

  const handleConfigChange = (section, field, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedConfigChange = (section, subsection, field, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const toggleKeyVisibility = (keyType) => {
    setShowStripeKeys(prev => ({
      ...prev,
      [keyType]: !prev[keyType]
    }));
  };

  const renderShippingTab = () => (
    <div className="space-y-8">
      {/* Free Shipping Threshold */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <SafeIcon icon={FiTruck} className="mr-2" />
          Free Shipping Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Free Shipping Threshold ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={config.shipping.freeShippingThreshold}
              onChange={(e) => handleConfigChange('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
              placeholder="50.00"
            />
            <p className="text-xs text-gray-500 mt-1">Orders above this amount get free shipping</p>
          </div>
        </div>
      </div>

      {/* Shipping Rates */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <SafeIcon icon={FiMapPin} className="mr-2" />
          Shipping Rates by Region
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domestic (US) - $
            </label>
            <input
              type="number"
              step="0.01"
              value={config.shipping.rates.domestic}
              onChange={(e) => handleNestedConfigChange('shipping', 'rates', 'domestic', parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Canada - $
            </label>
            <input
              type="number"
              step="0.01"
              value={config.shipping.rates.canada}
              onChange={(e) => handleNestedConfigChange('shipping', 'rates', 'canada', parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Europe - $
            </label>
            <input
              type="number"
              step="0.01"
              value={config.shipping.rates.europe}
              onChange={(e) => handleNestedConfigChange('shipping', 'rates', 'europe', parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              United Kingdom - $
            </label>
            <input
              type="number"
              step="0.01"
              value={config.shipping.rates.uk}
              onChange={(e) => handleNestedConfigChange('shipping', 'rates', 'uk', parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Australia - $
            </label>
            <input
              type="number"
              step="0.01"
              value={config.shipping.rates.australia}
              onChange={(e) => handleNestedConfigChange('shipping', 'rates', 'australia', parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asia - $
            </label>
            <input
              type="number"
              step="0.01"
              value={config.shipping.rates.asia}
              onChange={(e) => handleNestedConfigChange('shipping', 'rates', 'asia', parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Processing Times */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <SafeIcon icon={FiPackage} className="mr-2" />
          Processing & Delivery Times
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Standard Processing (days)
            </label>
            <input
              type="number"
              value={config.shipping.processing.standardDays}
              onChange={(e) => handleNestedConfigChange('shipping', 'processing', 'standardDays', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Express Processing (days)
            </label>
            <input
              type="number"
              value={config.shipping.processing.expressDays}
              onChange={(e) => handleNestedConfigChange('shipping', 'processing', 'expressDays', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              International Processing (days)
            </label>
            <input
              type="number"
              value={config.shipping.processing.internationalDays}
              onChange={(e) => handleNestedConfigChange('shipping', 'processing', 'internationalDays', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentTab = () => (
    <div className="space-y-8">
      {/* Stripe Configuration */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <SafeIcon icon={FiCreditCard} className="mr-2" />
          Stripe Configuration
        </h3>
        
        <div className="space-y-6">
          {/* Test/Live Mode Toggle */}
          <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="testMode"
                checked={config.stripe.testMode}
                onChange={(e) => handleNestedConfigChange('stripe', '', 'testMode', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="testMode" className="text-sm font-medium text-yellow-800">
                Test Mode (Use test API keys)
              </label>
            </div>
            {config.stripe.testMode && (
              <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-medium rounded-full">
                TEST MODE ACTIVE
              </span>
            )}
          </div>

          {/* API Keys */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publishable Key {config.stripe.testMode ? '(Test)' : '(Live)'}
              </label>
              <div className="relative">
                <input
                  type={showStripeKeys.publishable ? 'text' : 'password'}
                  value={config.stripe.publishableKey}
                  onChange={(e) => handleNestedConfigChange('stripe', '', 'publishableKey', e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder={config.stripe.testMode ? 'pk_test_...' : 'pk_live_...'}
                />
                <button
                  type="button"
                  onClick={() => toggleKeyVisibility('publishable')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={showStripeKeys.publishable ? FiEyeOff : FiEye} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret Key {config.stripe.testMode ? '(Test)' : '(Live)'}
              </label>
              <div className="relative">
                <input
                  type={showStripeKeys.secret ? 'text' : 'password'}
                  value={config.stripe.secretKey}
                  onChange={(e) => handleNestedConfigChange('stripe', '', 'secretKey', e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder={config.stripe.testMode ? 'sk_test_...' : 'sk_live_...'}
                />
                <button
                  type="button"
                  onClick={() => toggleKeyVisibility('secret')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={showStripeKeys.secret ? FiEyeOff : FiEye} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook Secret
              </label>
              <div className="relative">
                <input
                  type={showStripeKeys.webhook ? 'text' : 'password'}
                  value={config.stripe.webhookSecret}
                  onChange={(e) => handleNestedConfigChange('stripe', '', 'webhookSecret', e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="whsec_..."
                />
                <button
                  type="button"
                  onClick={() => toggleKeyVisibility('webhook')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={showStripeKeys.webhook ? FiEyeOff : FiEye} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={config.stripe.currency}
                onChange={(e) => handleNestedConfigChange('stripe', '', 'currency', e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="JPY">JPY - Japanese Yen</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stripe Help */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Stripe Setup Guide</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p>1. Create a Stripe account at stripe.com</p>
            <p>2. Get your API keys from the Stripe Dashboard → Developers → API keys</p>
            <p>3. For webhooks, create an endpoint at your-domain.com/stripe/webhook</p>
            <p>4. Use test keys for development, live keys for production</p>
            <p>5. Never share your secret keys publicly</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTaxesTab = () => (
    <div className="space-y-8">
      {/* Tax Configuration */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <SafeIcon icon={FiPercent} className="mr-2" />
          Tax Configuration
        </h3>
        
        <div className="space-y-6">
          {/* Tax Settings */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="taxEnabled"
                checked={config.taxes.enabled}
                onChange={(e) => handleNestedConfigChange('taxes', '', 'enabled', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="taxEnabled" className="text-sm font-medium text-gray-700">
                Enable tax calculation
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="taxInclusive"
                checked={config.taxes.inclusive}
                onChange={(e) => handleNestedConfigChange('taxes', '', 'inclusive', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="taxInclusive" className="text-sm font-medium text-gray-700">
                Prices include tax
              </label>
            </div>
          </div>

          {/* Tax Rates by Country */}
          {config.taxes.enabled && (
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-4">Tax Rates by Country (%)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    United States
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.taxes.rates.US}
                    onChange={(e) => handleNestedConfigChange('taxes', 'rates', 'US', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canada
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.taxes.rates.CA}
                    onChange={(e) => handleNestedConfigChange('taxes', 'rates', 'CA', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    European Union
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.taxes.rates.EU}
                    onChange={(e) => handleNestedConfigChange('taxes', 'rates', 'EU', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    United Kingdom
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.taxes.rates.UK}
                    onChange={(e) => handleNestedConfigChange('taxes', 'rates', 'UK', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Australia
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.taxes.rates.AU}
                    onChange={(e) => handleNestedConfigChange('taxes', 'rates', 'AU', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Japan
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.taxes.rates.JP}
                    onChange={(e) => handleNestedConfigChange('taxes', 'rates', 'JP', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderEmailTab = () => (
    <div className="space-y-8">
      {/* SMTP Configuration */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <SafeIcon icon={FiMail} className="mr-2" />
          Email Configuration
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Provider
            </label>
            <select
              value={config.email.provider}
              onChange={(e) => handleNestedConfigChange('email', '', 'provider', e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
            >
              <option value="smtp">SMTP</option>
              <option value="sendgrid">SendGrid</option>
              <option value="mailgun">Mailgun</option>
            </select>
          </div>

          {config.email.provider === 'smtp' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={config.email.smtp.host}
                  onChange={(e) => handleNestedConfigChange('email', 'smtp', 'host', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Port
                </label>
                <input
                  type="number"
                  value={config.email.smtp.port}
                  onChange={(e) => handleNestedConfigChange('email', 'smtp', 'port', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="587"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={config.email.smtp.username}
                  onChange={(e) => handleNestedConfigChange('email', 'smtp', 'username', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="your-email@gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={config.email.smtp.password}
                  onChange={(e) => handleNestedConfigChange('email', 'smtp', 'password', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="App password or SMTP password"
                />
              </div>
            </div>
          )}

          {/* Email Templates */}
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-4">Email Templates</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="orderConfirmation"
                  checked={config.email.templates.orderConfirmation}
                  onChange={(e) => handleNestedConfigChange('email', 'templates', 'orderConfirmation', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="orderConfirmation" className="text-sm font-medium text-gray-700">
                  Send order confirmation emails
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="shipmentTracking"
                  checked={config.email.templates.shipmentTracking}
                  onChange={(e) => handleNestedConfigChange('email', 'templates', 'shipmentTracking', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="shipmentTracking" className="text-sm font-medium text-gray-700">
                  Send shipment tracking emails
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="promotionalEmails"
                  checked={config.email.templates.promotionalEmails}
                  onChange={(e) => handleNestedConfigChange('email', 'templates', 'promotionalEmails', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="promotionalEmails" className="text-sm font-medium text-gray-700">
                  Enable promotional emails
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-8">
      {/* Security Settings */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <SafeIcon icon={FiShield} className="mr-2" />
          Security Settings
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={config.security.maxLoginAttempts}
                onChange={(e) => handleNestedConfigChange('security', '', 'maxLoginAttempts', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={config.security.sessionTimeout}
                onChange={(e) => handleNestedConfigChange('security', '', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enableRateLimiting"
                checked={config.security.enableRateLimiting}
                onChange={(e) => handleNestedConfigChange('security', '', 'enableRateLimiting', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="enableRateLimiting" className="text-sm font-medium text-gray-700">
                Enable rate limiting
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requireHttps"
                checked={config.security.requireHttps}
                onChange={(e) => handleNestedConfigChange('security', '', 'requireHttps', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="requireHttps" className="text-sm font-medium text-gray-700">
                Require HTTPS
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enableCORS"
                checked={config.security.enableCORS}
                onChange={(e) => handleNestedConfigChange('security', '', 'enableCORS', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="enableCORS" className="text-sm font-medium text-gray-700">
                Enable CORS
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventoryTab = () => (
    <div className="space-y-8">
      {/* Inventory Settings */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <SafeIcon icon={FiPackage} className="mr-2" />
          Inventory Management
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="trackInventory"
              checked={config.inventory.trackInventory}
              onChange={(e) => handleNestedConfigChange('inventory', '', 'trackInventory', e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="trackInventory" className="text-sm font-medium text-gray-700">
              Track inventory levels
            </label>
          </div>

          {config.inventory.trackInventory && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  value={config.inventory.lowStockThreshold}
                  onChange={(e) => handleNestedConfigChange('inventory', '', 'lowStockThreshold', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Show low stock warning when quantity falls below this number</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Out of Stock Behavior
                </label>
                <select
                  value={config.inventory.outOfStockBehavior}
                  onChange={(e) => handleNestedConfigChange('inventory', '', 'outOfStockBehavior', e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                >
                  <option value="hide">Hide product</option>
                  <option value="show">Show as out of stock</option>
                  <option value="disable">Show but disable purchase</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowBackorders"
                  checked={config.inventory.allowBackorders}
                  onChange={(e) => handleNestedConfigChange('inventory', '', 'allowBackorders', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="allowBackorders" className="text-sm font-medium text-gray-700">
                  Allow backorders when out of stock
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">System Configuration</h1>
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SafeIcon icon={FiSave} />
          <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto">
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white/70 backdrop-blur-md text-gray-600 hover:bg-white/90'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SafeIcon icon={tab.icon} className="text-sm" />
            <span className="text-sm font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'shipping' && renderShippingTab()}
        {activeTab === 'payment' && renderPaymentTab()}
        {activeTab === 'taxes' && renderTaxesTab()}
        {activeTab === 'email' && renderEmailTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'inventory' && renderInventoryTab()}
      </motion.div>

      {/* Save Button (Fixed) */}
      <div className="fixed bottom-8 right-8 z-40">
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <SafeIcon icon={FiSave} />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SystemConfiguration;