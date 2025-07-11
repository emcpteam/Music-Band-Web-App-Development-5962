import React, { Suspense } from 'react'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy load AppWrapper
const AppWrapper = React.lazy(() => import('./components/AppWrapper'))

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <AppWrapper />
      </Suspense>
    </ErrorBoundary>
  )
}

export default App