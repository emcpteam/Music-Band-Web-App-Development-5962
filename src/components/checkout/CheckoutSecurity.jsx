import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiShield, FiLock, FiCreditCard, FiCheck } = FiIcons;

const CheckoutSecurity = () => {
  return (
    <motion.div
      className="mt-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Security Badges */}
      <div className="inline-flex items-center space-x-6 p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg mb-8">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiShield} className="text-green-600 text-xl" />
          <span className="text-sm font-medium text-gray-700">256-bit SSL Encryption</span>
        </div>
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiLock} className="text-blue-600 text-xl" />
          <span className="text-sm font-medium text-gray-700">Secure Payment</span>
        </div>
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiCreditCard} className="text-purple-600 text-xl" />
          <span className="text-sm font-medium text-gray-700">Powered by Stripe</span>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <motion.div
          className="bg-white/70 backdrop-blur-md rounded-xl p-6 text-center"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiShield} className="text-green-600 text-xl" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Secure Checkout</h3>
          <p className="text-sm text-gray-600">
            Your payment information is encrypted and secure. We never store your card details.
          </p>
        </motion.div>

        <motion.div
          className="bg-white/70 backdrop-blur-md rounded-xl p-6 text-center"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiCheck} className="text-blue-600 text-xl" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Money Back Guarantee</h3>
          <p className="text-sm text-gray-600">
            Not satisfied? Get a full refund within 30 days of purchase, no questions asked.
          </p>
        </motion.div>

        <motion.div
          className="bg-white/70 backdrop-blur-md rounded-xl p-6 text-center"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiCreditCard} className="text-purple-600 text-xl" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">PCI Compliant</h3>
          <p className="text-sm text-gray-600">
            We meet the highest standards for payment security and data protection.
          </p>
        </motion.div>
      </div>

      {/* Customer Reviews Preview */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <SafeIcon key={i} icon={FiCheck} className="text-yellow-400 text-sm" />
            ))}
          </div>
          <span className="font-semibold text-gray-800">4.9/5</span>
          <span className="text-gray-600">from 2,847 reviews</span>
        </div>
        <p className="text-sm text-gray-600 italic">
          "Fast shipping, great quality merchandise, and excellent customer service. 
          Highly recommended!" - Sarah M.
        </p>
      </div>
    </motion.div>
  );
};

export default CheckoutSecurity;