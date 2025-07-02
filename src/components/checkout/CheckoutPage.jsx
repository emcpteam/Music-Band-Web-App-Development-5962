import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import CheckoutProgress from './CheckoutProgress';
import CheckoutSecurity from './CheckoutSecurity';
import { useBandData } from '../../contexts/AdminContext';

const { FiArrowLeft, FiLock, FiShield, FiCreditCard, FiTruck, FiCheck } = FiIcons;

// Get Stripe configuration from admin settings
const getStripeConfig = () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('bandAdminData') || '{}');
    const stripeConfig = adminData.systemConfig?.stripe;
    
    if (stripeConfig?.testMode) {
      return stripeConfig.publishableKey || 'pk_test_51234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    } else {
      return stripeConfig.publishableKey || 'pk_test_51234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    }
  } catch (error) {
    console.error('Error reading Stripe config:', error);
    return 'pk_test_51234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  }
};

const stripePromise = loadStripe(getStripeConfig());

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getCartTotal, getCartItemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const bandData = useBandData();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState({
    shipping: null,
    billing: null,
    payment: null
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);

  // Exit intent detection
  useEffect(() => {
    let exitIntentShown = false;
    
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !exitIntentShown && cartItems.length > 0) {
        setShowExitIntent(true);
        exitIntentShown = true;
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [cartItems.length]);

  // Redirect checks
  useEffect(() => {
    console.log('CheckoutPage mounted');
    console.log('Cart items:', cartItems);
    console.log('Is authenticated:', isAuthenticated);

    // Redirect to main page if cart is empty
    if (cartItems.length === 0) {
      console.log('Cart is empty, redirecting to main page');
      navigate('/', { replace: true });
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login', { 
        state: { from: location, returnTo: '/checkout' },
        replace: true 
      });
      return;
    }
  }, [cartItems.length, isAuthenticated, navigate, location]);

  const steps = [
    { 
      id: 1, 
      name: 'Shipping', 
      description: 'Delivery information',
      icon: FiTruck,
      completed: !!checkoutData.shipping
    },
    { 
      id: 2, 
      name: 'Payment', 
      description: 'Secure payment',
      icon: FiCreditCard,
      completed: !!checkoutData.payment
    },
    { 
      id: 3, 
      name: 'Review', 
      description: 'Confirm order',
      icon: FiCheck,
      completed: false
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleBackToStore = () => {
    console.log('Back to store clicked');
    navigate('/', { replace: true });
  };

  const handleStepData = (step, data) => {
    setCheckoutData(prev => ({
      ...prev,
      [step]: data
    }));
    setErrors(prev => ({ ...prev, [step]: null }));
  };

  const handleError = (step, error) => {
    setErrors(prev => ({ ...prev, [step]: error }));
  };

  // Don't render if cart is empty or not authenticated
  if (cartItems.length === 0 || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiLock} className="text-2xl text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {cartItems.length === 0 ? 'Your cart is empty' : 'Authentication required'}
            </h1>
            <p className="text-gray-600 mb-8">
              {cartItems.length === 0 
                ? 'Add some items to your cart before proceeding to checkout.'
                : 'Please sign in to complete your purchase.'
              }
            </p>
            <motion.button
              onClick={handleBackToStore}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cartItems.length === 0 ? 'Continue Shopping' : 'Go to Sign In'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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
        </motion.div>

        {/* Progress Steps */}
        <CheckoutProgress 
          steps={steps} 
          currentStep={currentStep} 
          onStepClick={setCurrentStep}
        />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Elements stripe={stripePromise}>
              <CheckoutForm
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                checkoutData={checkoutData}
                onStepData={handleStepData}
                onError={handleError}
                errors={errors}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </Elements>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>

        {/* Security Section */}
        <CheckoutSecurity />

        {/* Exit Intent Modal */}
        <AnimatePresence>
          {showExitIntent && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitIntent(false)}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiShield} className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Wait! Don't leave yet
                </h3>
                <p className="text-gray-600 mb-6">
                  You're about to get some amazing {bandData.band.name} merchandise. 
                  Complete your order now and join thousands of satisfied fans!
                </p>
                <div className="space-y-3">
                  <motion.button
                    onClick={() => setShowExitIntent(false)}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Complete My Order
                  </motion.button>
                  <motion.button
                    onClick={handleBackToStore}
                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue Shopping
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CheckoutPage;