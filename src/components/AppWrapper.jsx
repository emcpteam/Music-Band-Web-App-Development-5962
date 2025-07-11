import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from '../contexts/AdminContext';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { CartProvider } from '../contexts/CartContext';
import SuspenseWrapper from './Suspense';
import ErrorBoundary from './ErrorBoundary';

// Lazy load components
const LoginPage = React.lazy(() => import('./auth/LoginPage'));
const ProtectedRoute = React.lazy(() => import('./auth/ProtectedRoute'));
const MainApp = React.lazy(() => import('./MainApp'));
const AdminLogin = React.lazy(() => import('./admin/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./admin/AdminDashboard'));
const CheckoutPage = React.lazy(() => import('./checkout/CheckoutPage'));
const OrderSuccess = React.lazy(() => import('./checkout/OrderSuccess'));
const CartDrawer = React.lazy(() => import('./cart/CartDrawer'));

function AppWrapper() {
  return (
    <ErrorBoundary>
      <AdminProvider>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <CartProvider>
                <Router>
                  <SuspenseWrapper>
                    <Routes>
                      <Route path="/admin" element={<AdminLogin />} />
                      <Route
                        path="/admin/dashboard"
                        element={
                          <ProtectedRoute>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <CheckoutPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/order-success"
                        element={
                          <ProtectedRoute>
                            <OrderSuccess />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/" element={<MainApp />} />
                      <Route path="*" element={<MainApp />} />
                    </Routes>
                    <CartDrawer />
                  </SuspenseWrapper>
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