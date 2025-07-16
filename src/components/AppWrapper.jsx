import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from '../contexts/AdminContext';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { CartProvider } from '../contexts/CartContext';
import ErrorBoundary from './ErrorBoundary';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
  </div>
);

// Import components directly to avoid suspense issues with nested lazy loading
import MainApp from './MainApp';
import AdminLogin from './auth/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import CheckoutPage from './checkout/CheckoutPage';
import OrderSuccess from './checkout/OrderSuccess';
import CartDrawer from './cart/CartDrawer';
import ProtectedRoute from './auth/ProtectedRoute';

function AppWrapper() {
  return (
    <ErrorBoundary>
      <AdminProvider>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <CartProvider>
                <Router>
                  <Routes>
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/admin/dashboard/*" element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />

                    {/* Checkout Routes */}
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/order-success" element={
                      <ProtectedRoute>
                        <OrderSuccess />
                      </ProtectedRoute>
                    } />

                    {/* Main Site Routes */}
                    <Route path="/" element={<MainApp />} />
                    <Route path="*" element={<MainApp />} />
                  </Routes>
                  
                  <CartDrawer />
                </Router>
              </CartProvider>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </AdminProvider>
    </ErrorBoundary>
  );
}

export default AppWrapper;