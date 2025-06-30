import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { FiUser, FiMail, FiPhone, FiMapPin, FiCreditCard, FiLock, FiCheck } = FiIcons;

const CheckoutForm = ({ currentStep, setCurrentStep }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { cartItems, getCartTotal, getShippingCost, getTaxAmount, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US'
  });

  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    sameAsShipping: true
  });

  const [orderNotes, setOrderNotes] = useState('');

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'AU', name: 'Australia' },
    { code: 'JP', name: 'Japan' },
    { code: 'BR', name: 'Brazil' }
  ];

  const subtotal = getCartTotal();
  const shippingCost = getShippingCost(subtotal, shippingInfo);
  const taxAmount = getTaxAmount(subtotal, shippingInfo);
  const total = subtotal + shippingCost + taxAmount;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'postalCode', 'country'];
    const missingFields = requiredFields.filter(field => !shippingInfo[field]);
    
    if (missingFields.length > 0) {
      setError('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    const cardElement = elements.getElement(CardElement);

    // Create payment method
    const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: `${billingInfo.sameAsShipping ? shippingInfo.firstName : billingInfo.firstName} ${billingInfo.sameAsShipping ? shippingInfo.lastName : billingInfo.lastName}`,
        email: billingInfo.sameAsShipping ? shippingInfo.email : billingInfo.email,
        address: {
          line1: billingInfo.sameAsShipping ? shippingInfo.address : billingInfo.address,
          line2: billingInfo.sameAsShipping ? shippingInfo.address2 : billingInfo.address2,
          city: billingInfo.sameAsShipping ? shippingInfo.city : billingInfo.city,
          state: billingInfo.sameAsShipping ? shippingInfo.state : billingInfo.state,
          postal_code: billingInfo.sameAsShipping ? shippingInfo.postalCode : billingInfo.postalCode,
          country: billingInfo.sameAsShipping ? shippingInfo.country : billingInfo.country,
        },
      },
    });

    if (paymentError) {
      setError(paymentError.message);
      setLoading(false);
      return;
    }

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(3);
    }, 2000);
  };

  const handleCompleteOrder = () => {
    console.log('Completing order...'); // Debug log
    
    // Generate order number
    const orderNumber = 'SW-' + Date.now().toString().slice(-8);
    
    // Save order to localStorage
    const orderData = {
      orderNumber,
      items: cartItems,
      shippingInfo,
      billingInfo,
      subtotal,
      shippingCost,
      taxAmount,
      total,
      orderNotes,
      orderDate: new Date().toISOString(),
      status: 'confirmed'
    };

    try {
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      console.log('Order saved to localStorage'); // Debug log
    } catch (error) {
      console.error('Error saving order:', error);
    }
    
    // Clear cart
    clearCart();
    
    // Navigate to success page with multiple fallbacks
    try {
      navigate(`/order-success?order=${orderNumber}`);
    } catch (error) {
      console.error('Navigate failed:', error);
      // Fallback: Direct hash change
      window.location.hash = `#/order-success?order=${orderNumber}`;
    }
    
    // Additional fallback with delay
    setTimeout(() => {
      if (!window.location.hash.includes('order-success')) {
        window.location.hash = `#/order-success?order=${orderNumber}`;
      }
    }, 100);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  if (currentStep === 1) {
    return (
      <motion.div
        className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <SafeIcon icon={FiMapPin} className="mr-2" />
          Shipping Information
        </h2>

        <form onSubmit={handleShippingSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={shippingInfo.firstName}
                onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={shippingInfo.lastName}
                onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={shippingInfo.email}
                  onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                  className="w-full px-4 py-3 pl-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  required
                />
                <SafeIcon icon={FiMail} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                  className="w-full px-4 py-3 pl-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                />
                <SafeIcon icon={FiPhone} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              value={shippingInfo.address}
              onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
              placeholder="123 Main Street"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apartment, suite, etc. (optional)
            </label>
            <input
              type="text"
              value={shippingInfo.address2}
              onChange={(e) => setShippingInfo({...shippingInfo, address2: e.target.value})}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
              placeholder="Apt 4B"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={shippingInfo.city}
                onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State / Province
              </label>
              <input
                type="text"
                value={shippingInfo.state}
                onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code *
              </label>
              <input
                type="text"
                value={shippingInfo.postalCode}
                onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <select
              value={shippingInfo.country}
              onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
              required
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Notes (optional)
            </label>
            <textarea
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none"
              rows="3"
              placeholder="Special delivery instructions..."
            />
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue to Payment
          </motion.button>
        </form>
      </motion.div>
    );
  }

  if (currentStep === 2) {
    return (
      <motion.div
        className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <SafeIcon icon={FiCreditCard} className="mr-2" />
          Payment Information
        </h2>

        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Billing Address */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sameAsShipping"
                checked={billingInfo.sameAsShipping}
                onChange={(e) => setBillingInfo({...billingInfo, sameAsShipping: e.target.checked})}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="sameAsShipping" className="text-sm text-gray-700">
                Billing address same as shipping address
              </label>
            </div>

            {!billingInfo.sameAsShipping && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-800">Billing Address</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={billingInfo.firstName}
                    onChange={(e) => setBillingInfo({...billingInfo, firstName: e.target.value})}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={billingInfo.lastName}
                    onChange={(e) => setBillingInfo({...billingInfo, lastName: e.target.value})}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                    required
                  />
                </div>

                <input
                  type="text"
                  placeholder="Street Address"
                  value={billingInfo.address}
                  onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={billingInfo.city}
                    onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={billingInfo.state}
                    onChange={(e) => setBillingInfo({...billingInfo, state: e.target.value})}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={billingInfo.postalCode}
                    onChange={(e) => setBillingInfo({...billingInfo, postalCode: e.target.value})}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Credit Card */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800 flex items-center">
              <SafeIcon icon={FiLock} className="mr-2 text-green-600" />
              Credit Card Information
            </h3>
            
            <div className="p-4 bg-white border border-gray-200 rounded-xl">
              <CardElement options={cardElementOptions} />
            </div>

            <div className="text-xs text-gray-500">
              Your payment information is encrypted and secure. We use Stripe for secure payment processing.
            </div>
          </div>

          <div className="flex space-x-4">
            <motion.button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back to Shipping
            </motion.button>
            <motion.button
              type="submit"
              disabled={loading || !stripe}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Processing...' : `Pay ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}`}
            </motion.button>
          </div>
        </form>
      </motion.div>
    );
  }

  if (currentStep === 3) {
    return (
      <motion.div
        className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <SafeIcon icon={FiCheck} className="text-2xl text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your order. Your payment has been processed successfully.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-medium text-gray-800 mb-2">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{shippingCost === 0 ? 'Free' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(taxAmount)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total:</span>
              <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}</span>
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleCompleteOrder}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Complete Order
        </motion.button>
      </motion.div>
    );
  }
};

export default CheckoutForm;