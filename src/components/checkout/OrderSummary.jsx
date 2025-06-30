import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useCart } from '../../contexts/CartContext';

const { FiShoppingBag, FiTruck, FiPercent, FiDollarSign } = FiIcons;

const OrderSummary = () => {
  const { cartItems, getCartTotal, getShippingCost, getTaxAmount } = useCart();

  const subtotal = getCartTotal();
  const shippingCost = getShippingCost(subtotal, { country: 'US' }); // Default to US for display
  const taxAmount = getTaxAmount(subtotal, { country: 'US' });
  const total = subtotal + shippingCost + taxAmount;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <motion.div
      className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg sticky top-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <SafeIcon icon={FiShoppingBag} className="mr-2" />
        Order Summary
      </h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 text-sm truncate">
                {item.name}
              </h3>
              <p className="text-xs text-gray-600 capitalize">
                {item.category} • Qty: {item.quantity}
              </p>
              {item.isLimited && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                  Limited
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="font-semibold text-purple-600 text-sm">
                {formatPrice(item.price * item.quantity)}
              </p>
              <p className="text-xs text-gray-500">
                {formatPrice(item.price)} each
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-3 border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiDollarSign} className="text-sm text-gray-500" />
            <span className="text-gray-700">Subtotal</span>
          </div>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiTruck} className="text-sm text-gray-500" />
            <span className="text-gray-700">Shipping</span>
          </div>
          <span className="font-medium">
            {shippingCost === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatPrice(shippingCost)
            )}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiPercent} className="text-sm text-gray-500" />
            <span className="text-gray-700">Tax</span>
          </div>
          <span className="font-medium">{formatPrice(taxAmount)}</span>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-800">Total</span>
            <span className="text-xl font-bold text-purple-600">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping Notice */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
        <div className="flex items-center space-x-2 mb-2">
          <SafeIcon icon={FiTruck} className="text-green-600" />
          <span className="font-medium text-green-800">Shipping Information</span>
        </div>
        <div className="text-sm text-green-700 space-y-1">
          {subtotal >= 50 ? (
            <p>🎉 You qualify for free shipping!</p>
          ) : (
            <p>Add {formatPrice(50 - subtotal)} more for free shipping</p>
          )}
          <p>• Standard shipping: 5-7 business days</p>
          <p>• Express shipping available at checkout</p>
          <p>• International shipping: 10-14 business days</p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-4 p-3 bg-gray-50 rounded-xl">
        <div className="text-xs text-gray-600 space-y-1">
          <p className="font-medium">🔒 Secure Checkout</p>
          <p>• 256-bit SSL encryption</p>
          <p>• PCI DSS compliant</p>
          <p>• Powered by Stripe</p>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;