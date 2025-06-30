import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useCart } from '../../contexts/CartContext';

const { FiShoppingCart } = FiIcons;

const CartButton = () => {
  const { getCartItemCount, setIsCartOpen } = useCart();
  const itemCount = getCartItemCount();

  return (
    <motion.button
      onClick={() => setIsCartOpen(true)}
      className="relative p-3 bg-white/20 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white/30 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Shopping Cart"
    >
      <SafeIcon icon={FiShoppingCart} className="text-xl" />
      
      {itemCount > 0 && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          key={itemCount}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </motion.div>
      )}
    </motion.button>
  );
};

export default CartButton;