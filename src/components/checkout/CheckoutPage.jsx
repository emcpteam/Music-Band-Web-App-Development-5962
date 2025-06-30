import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';

const { FiArrowLeft, FiLock, FiShield } = FiIcons;

// Initialize Stripe (use test key for demo)
const stripePromise = loadStripe('pk_test_51234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, getCartItemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    console.log('CheckoutPage mounted'); // Debug log
    console.log('Cart items:', cartItems); // Debug log
    console.log('Is authenticated:', isAuthenticated); // Debug log

    // Redirect to main page if cart is empty
    if (cartItems.length === 0) {
      console.log('Cart is empty, redirecting to main page');
      navigate('/');
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }
  }, [cartItems.length, isAuthenticated, navigate]);

  const steps = [
    { id: 1, name: 'Shipping', description: 'Delivery information' },
    { id: 2, name: 'Payment', description: 'Secure payment' },
    { id: 3, name: 'Review', description: 'Confirm order' }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleBackToStore = () => {
    console.log('Back to store clicked'); // Debug log
    navigate('/');
  };

  // Don't render if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before proceeding to checkout.</p>
          <motion.button
            onClick={handleBackToStore}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue Shopping
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={handleBackToStore}
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            whileHover={{ x: -2 }}
          >
            <SafeIcon icon={FiArrowLeft} className="text-sm" />
            <span className="text-sm font-medium">Back to Store</span>
          </motion.button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Secure Checkout</h1>
            <p className="text-gray-600 flex items-center justify-center space-x-2 mt-1">
              <SafeIcon icon={FiLock} className="text-sm" />
              <span>SSL Encrypted & Secure</span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600">Order Summary</p>
            <p className="font-semibold text-gray-800">
              {getCartItemCount()} items • {formatPrice(getCartTotal())}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep >= step.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.id}
                  </div>
                  <div className="text-center mt-2">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-purple-600' : 'text-gray-600'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 transition-all ${
                      currentStep > step.id ? 'bg-purple-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                currentStep={currentStep} 
                setCurrentStep={setCurrentStep}
              />
            </Elements>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>

        {/* Security Badges */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="inline-flex items-center space-x-6 p-4 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiShield} className="text-green-600" />
              <span className="text-sm text-gray-700">256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiLock} className="text-blue-600" />
              <span className="text-sm text-gray-700">Secure Payment</span>
            </div>
            <div className="text-sm text-gray-700">
              Powered by <strong>Stripe</strong>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;