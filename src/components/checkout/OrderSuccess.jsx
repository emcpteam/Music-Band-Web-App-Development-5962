import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useBandData } from '../../contexts/AdminContext';

const { FiCheck, FiMail, FiTruck, FiCalendar, FiDownload, FiHome, FiShare2 } = FiIcons;

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order');
  const [orderData, setOrderData] = useState(null);
  const bandData = useBandData();

  useEffect(() => {
    // Get order data from localStorage
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder);
        if (order.orderNumber === orderNumber) {
          setOrderData(order);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error parsing order data:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [orderNumber, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDelivery = () => {
    const orderDate = new Date(orderData.orderDate);
    const deliveryDate = new Date(orderDate);
    
    // Add shipping days based on location
    const country = orderData.shippingInfo.country;
    let shippingDays = 7; // Default
    
    if (country === 'US' || country === 'CA') {
      shippingDays = 5;
    } else if (['GB', 'DE', 'FR', 'IT', 'ES'].includes(country)) {
      shippingDays = 7;
    } else {
      shippingDays = 14;
    }
    
    deliveryDate.setDate(deliveryDate.getDate() + shippingDays);
    return deliveryDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${bandData.band.name} Order`,
          text: `Just ordered some awesome merch from ${bandData.band.name}!`,
          url: window.location.origin
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin);
      alert('Link copied to clipboard!');
    }
  };

  const downloadInvoice = () => {
    // In a real app, you would generate a PDF invoice
    // For demo purposes, we'll create a simple text receipt
    const receiptData = `
${bandData.band.name} - Order Receipt
Order Number: ${orderData.orderNumber}
Order Date: ${formatDate(orderData.orderDate)}

BILLING TO:
${orderData.shippingInfo.firstName} ${orderData.shippingInfo.lastName}
${orderData.shippingInfo.address}
${orderData.shippingInfo.city}, ${orderData.shippingInfo.state} ${orderData.shippingInfo.postalCode}
${orderData.shippingInfo.country}

ITEMS ORDERED:
${orderData.items.map(item => 
  `${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
).join('\n')}

SUMMARY:
Subtotal: ${formatPrice(orderData.subtotal)}
Shipping: ${orderData.shippingCost === 0 ? 'Free' : formatPrice(orderData.shippingCost)}
Tax: ${formatPrice(orderData.taxAmount)}
Total: ${formatPrice(orderData.total)}

Thank you for your order!
    `;

    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${orderData.orderNumber}-receipt.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SafeIcon icon={FiCheck} className="text-3xl text-green-600" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-4">
            Thank you for supporting {bandData.band.name}
          </p>
          <p className="text-lg text-purple-600 font-medium">
            Order #{orderData.orderNumber}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Order Items */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Items Ordered</h2>
              <div className="space-y-4">
                {orderData.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {item.category} • Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-purple-600">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <SafeIcon icon={FiTruck} className="mr-2" />
                Shipping Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Shipping Address</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>{orderData.shippingInfo.firstName} {orderData.shippingInfo.lastName}</p>
                    <p>{orderData.shippingInfo.address}</p>
                    {orderData.shippingInfo.address2 && <p>{orderData.shippingInfo.address2}</p>}
                    <p>
                      {orderData.shippingInfo.city}, {orderData.shippingInfo.state} {orderData.shippingInfo.postalCode}
                    </p>
                    <p>{orderData.shippingInfo.country}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Delivery Estimate</h3>
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <SafeIcon icon={FiCalendar} className="text-sm" />
                    <span>Expected by {getEstimatedDelivery()}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    You'll receive tracking information via email once your order ships.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Summary & Actions */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Order Summary */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(orderData.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {orderData.shippingCost === 0 ? 'Free' : formatPrice(orderData.shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(orderData.taxAmount)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-purple-600">
                      {formatPrice(orderData.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <SafeIcon icon={FiMail} className="mr-2" />
                What's Next?
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-semibold text-xs">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Confirmation Email</p>
                    <p className="text-gray-600">Check your inbox for order details</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-600 font-semibold text-xs">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Processing</p>
                    <p className="text-gray-600">We'll prepare your order for shipping</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-semibold text-xs">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Shipping</p>
                    <p className="text-gray-600">Tracking info sent to your email</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                onClick={downloadInvoice}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiDownload} />
                <span>Download Receipt</span>
              </motion.button>

              <motion.button
                onClick={handleShare}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-100 text-blue-600 rounded-xl font-medium hover:bg-blue-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiShare2} />
                <span>Share Purchase</span>
              </motion.button>

              <motion.button
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiHome} />
                <span>Back to Store</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;