import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { QuestProvider } from '@questlabs/react-sdk'
import '@questlabs/react-sdk/dist/style.css'
import { AuthProvider } from '../contexts/AuthContext'
import { AdminProvider } from '../contexts/AdminContext'
import { LanguageProvider } from '../contexts/LanguageContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import { CartProvider } from '../contexts/CartContext'
import questConfig from '../config/questConfig'
import LoginPage from './auth/LoginPage'
import OnboardingPage from './auth/OnboardingPage'
import ProtectedRoute from './auth/ProtectedRoute'
import MainApp from './MainApp'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import CheckoutPage from './checkout/CheckoutPage'
import OrderSuccess from './checkout/OrderSuccess'
import CartDrawer from './cart/CartDrawer'
import ErrorBoundary from './ErrorBoundary'

const AppWrapper = () => {
  return (
    <ErrorBoundary>
      <QuestProvider
        apiKey={questConfig.APIKEY}
        entityId={questConfig.ENTITYID}
        apiType="PRODUCTION"
      >
        <LanguageProvider>
          <AuthProvider>
            <AdminProvider>
              <ThemeProvider>
                <CartProvider>
                  <Router>
                    <Routes>
                      {/* Auth Routes */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route 
                        path="/onboarding" 
                        element={
                          <ProtectedRoute>
                            <OnboardingPage />
                          </ProtectedRoute>
                        } 
                      />

                      {/* Admin Routes */}
                      <Route path="/admin" element={<AdminLogin />} />
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />

                      {/* E-commerce Routes */}
                      <Route 
                        path="/checkout" 
                        element={
                          <ProtectedRoute requireOnboarding={true}>
                            <CheckoutPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/order-success" 
                        element={
                          <ProtectedRoute requireOnboarding={true}>
                            <OrderSuccess />
                          </ProtectedRoute>
                        } 
                      />

                      {/* Main App - Default Route */}
                      <Route 
                        path="/" 
                        element={
                          <ProtectedRoute requireOnboarding={true}>
                            <MainApp />
                          </ProtectedRoute>
                        } 
                      />

                      {/* Catch-all route for any other paths */}
                      <Route 
                        path="*" 
                        element={
                          <ProtectedRoute requireOnboarding={true}>
                            <MainApp />
                          </ProtectedRoute>
                        } 
                      />
                    </Routes>
                    <CartDrawer />
                  </Router>
                </CartProvider>
              </ThemeProvider>
            </AdminProvider>
          </AuthProvider>
        </LanguageProvider>
      </QuestProvider>
    </ErrorBoundary>
  )
}

export default AppWrapper