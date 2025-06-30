import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { QuestProvider } from '@questlabs/react-sdk'
import '@questlabs/react-sdk/dist/style.css'
import { AuthProvider } from '../contexts/AuthContext'
import { AdminProvider } from '../contexts/AdminContext'
import { LanguageProvider } from '../contexts/LanguageContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import questConfig from '../config/questConfig'
import LoginPage from './auth/LoginPage'
import OnboardingPage from './auth/OnboardingPage'
import ProtectedRoute from './auth/ProtectedRoute'
import MainApp from './MainApp'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
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
                <Router>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route 
                      path="/onboarding" 
                      element={
                        <ProtectedRoute>
                          <OnboardingPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/*" 
                      element={
                        <ProtectedRoute requireOnboarding={true}>
                          <MainApp />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </Router>
              </ThemeProvider>
            </AdminProvider>
          </AuthProvider>
        </LanguageProvider>
      </QuestProvider>
    </ErrorBoundary>
  )
}

export default AppWrapper