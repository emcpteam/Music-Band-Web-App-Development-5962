import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

// Safe localStorage operations
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage.getItem failed:', error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('localStorage.setItem failed:', error);
      return false;
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('localStorage.removeItem failed:', error);
      return false;
    }
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = safeLocalStorage.getItem('cartItems');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing cart items:', error);
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    safeLocalStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity, addedAt: Date.now() }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getShippingCost = (subtotal, shippingAddress) => {
    // Get shipping configuration from localStorage (admin settings)
    let shippingConfig = null;
    try {
      const adminData = JSON.parse(safeLocalStorage.getItem('bandAdminData') || '{}');
      shippingConfig = adminData.systemConfig?.shipping;
    } catch (error) {
      console.error('Error reading shipping config:', error);
    }

    // Use admin-configured free shipping threshold or default
    const freeShippingThreshold = shippingConfig?.freeShippingThreshold || 50;
    if (subtotal >= freeShippingThreshold) return 0;

    // Use admin-configured shipping rates or defaults
    const defaultRates = {
      domestic: 8.99,
      canada: 12.99,
      europe: 15.99,
      uk: 12.99,
      australia: 18.99,
      asia: 22.99,
      worldwide: 25.99
    };

    const shippingRates = shippingConfig?.rates || defaultRates;
    const country = shippingAddress?.country || 'US';

    // Map countries to regions
    const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'IE', 'FI', 'SE', 'DK', 'NO'];
    const asiaCountries = ['JP', 'CN', 'KR', 'SG', 'TH', 'MY', 'PH', 'VN', 'ID'];

    if (country === 'US') return shippingRates.domestic;
    if (country === 'CA') return shippingRates.canada;
    if (country === 'GB') return shippingRates.uk;
    if (country === 'AU') return shippingRates.australia;
    if (euCountries.includes(country)) return shippingRates.europe;
    if (asiaCountries.includes(country)) return shippingRates.asia;
    
    return shippingRates.worldwide;
  };

  const getTaxAmount = (subtotal, shippingAddress) => {
    // Get tax configuration from localStorage (admin settings)
    let taxConfig = null;
    try {
      const adminData = JSON.parse(safeLocalStorage.getItem('bandAdminData') || '{}');
      taxConfig = adminData.systemConfig?.taxes;
    } catch (error) {
      console.error('Error reading tax config:', error);
    }

    // Check if taxes are enabled
    if (!taxConfig?.enabled) return 0;

    // Default tax rates
    const defaultTaxRates = {
      US: 0.085, // 8.5% average
      CA: 0.13,  // 13% average
      EU: 0.20,  // 20% average VAT
      UK: 0.20,  // 20% VAT
      AU: 0.10,  // 10% GST
      JP: 0.10   // 10% consumption tax
    };

    const taxRates = taxConfig?.rates ? 
      Object.keys(taxConfig.rates).reduce((acc, key) => {
        acc[key] = taxConfig.rates[key] / 100; // Convert percentage to decimal
        return acc;
      }, {}) : 
      defaultTaxRates;

    const country = shippingAddress?.country || 'US';
    const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'IE', 'FI', 'SE', 'DK', 'NO'];

    let taxRate = 0;
    if (country === 'US') taxRate = taxRates.US || defaultTaxRates.US;
    else if (country === 'CA') taxRate = taxRates.CA || defaultTaxRates.CA;
    else if (country === 'GB') taxRate = taxRates.UK || defaultTaxRates.UK;
    else if (country === 'AU') taxRate = taxRates.AU || defaultTaxRates.AU;
    else if (country === 'JP') taxRate = taxRates.JP || defaultTaxRates.JP;
    else if (euCountries.includes(country)) taxRate = taxRates.EU || defaultTaxRates.EU;

    return subtotal * taxRate;
  };

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getShippingCost,
    getTaxAmount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};