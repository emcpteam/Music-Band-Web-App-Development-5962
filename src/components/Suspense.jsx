import React from 'react';
import SafeIcon from './common/SafeIcon';
import { FiLoader } from 'react-icons/fi';

const LoadingSpinner = () => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
  </div>
);

const SuspenseWrapper = ({ children }) => (
  <React.Suspense fallback={<LoadingSpinner />}>
    {children}
  </React.Suspense>
);

export default SuspenseWrapper;