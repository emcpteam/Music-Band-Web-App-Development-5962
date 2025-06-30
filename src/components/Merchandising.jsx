import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useBandData } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

const { FiShoppingBag, FiStar, FiShoppingCart, FiTruck, FiHeart, FiZap, FiPlus } = FiIcons;

const categories = [
  { id: 'all', label: 'allItems', icon: FiShoppingBag },
  { id: 'music', label: 'musicItems', icon: FiZap },
  { id: 'apparel', label: 'apparel', icon: FiShoppingBag },
  { id: 'art', label: 'artPrints', icon: FiStar },
  { id: 'accessories', label: 'accessories', icon: FiHeart }
];

const Merchandising = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [addingToCart, setAddingToCart] = useState({});
  const bandData = useBandData();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const products = bandData.products.filter(product => product.isActive);
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleAddToCart = async (product) => {
    setAddingToCart({ ...addingToCart, [product.id]: true });
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addToCart(product);
    setAddingToCart({ ...addingToCart, [product.id]: false });
    
    // Show success feedback
    const button = document.getElementById(`add-to-cart-${product.id}`);
    if (button) {
      button.textContent = 'Added!';
      setTimeout(() => {
        button.textContent = t('addToCart');
      }, 1500);
    }
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBuyNow = (product) => {
    console.log('Buy Now clicked for:', product.name); // Debug log
    
    // Add to cart
    addToCart(product);
    
    // Navigate to checkout with multiple fallbacks
    try {
      navigate('/checkout');
    } catch (error) {
      console.error('Navigate failed:', error);
      // Fallback: Direct hash change
      window.location.hash = '#/checkout';
    }
    
    // Additional fallback with delay
    setTimeout(() => {
      if (!window.location.hash.includes('checkout')) {
        window.location.hash = '#/checkout';
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mr-4">
              <SafeIcon icon={FiShoppingBag} className="text-white text-2xl" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              {t('merchandise')}
            </h2>
          </div>
          <p className="text-xl text-gray-600 font-light">
            {t('showSupport')} {bandData.band.name} {t('gear')}
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg'
                  : 'bg-white/70 backdrop-blur-md text-gray-600 hover:bg-white/90'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={category.icon} className="text-sm" />
              <span className="font-medium">{t(category.label)}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" layout>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                layout
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {product.isLimited && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        {t('limited')}
                      </span>
                    )}
                    {product.stock < 50 && (
                      <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                        {t('lowStock')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <SafeIcon
                      icon={FiHeart}
                      className={`text-lg ${
                        favorites.includes(product.id)
                          ? 'text-red-500 fill-current'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <span className="text-xl font-bold text-orange-600">${product.price}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiShoppingBag} className="text-xs" />
                      <span className="capitalize">{product.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiStar} className="text-xs" />
                      <span>{product.stock} {t('inStock')}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600 flex items-center space-x-1">
                      <SafeIcon icon={FiTruck} className="text-xs" />
                      <span>{t('freeShipping')}</span>
                    </span>
                  </div>

                  <div className="flex space-x-3">
                    <motion.button
                      id={`add-to-cart-${product.id}`}
                      onClick={() => handleAddToCart(product)}
                      disabled={addingToCart[product.id]}
                      className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {addingToCart[product.id] ? (
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <SafeIcon icon={FiPlus} className="text-sm" />
                          <span>{t('addToCart')}</span>
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      onClick={() => handleBuyNow(product)}
                      className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t('buyNow')}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiShoppingBag} className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {selectedCategory === 'all' 
                ? t('noProductsAvailable') 
                : `No ${t(categories.find(c => c.id === selectedCategory)?.label || 'products')} Products`}
            </h3>
            <p className="text-gray-600">{t('productsWillAppear')}</p>
          </div>
        )}

        {/* Shipping Info */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mb-3">
                <SafeIcon icon={FiTruck} className="text-white text-xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">{t('freeShippingOver')}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mb-3">
                <SafeIcon icon={FiStar} className="text-white text-xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{t('premiumQuality')}</h3>
              <p className="text-sm text-gray-600">{t('highQualityMaterials')}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mb-3">
                <SafeIcon icon={FiHeart} className="text-white text-xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{t('fanApproved')}</h3>
              <p className="text-sm text-gray-600">{t('lovedByFans')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Merchandising;