import React from 'react';
import { Loader } from 'lucide-react';
import Logo from '../Logo/Logo';

const LoadingScreen = ({
  message = 'Loading...',
  showLogo = true,
  variant = 'full',
  className = ''
}) => {
  // Full screen variant
  if (variant === 'full') {
    return (
      <div className={"fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center " + className}>
        {/* Logo */}
        {showLogo && (
          <div className="mb-8">
            <Logo variant="dark" size="lg" animated />
          </div>
        )}

        {/* Loading Spinner */}
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-spin-slow" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader className="w-8 h-8 text-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            {message}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please wait while we load your content
          </p>
        </div>
      </div>
    );
  }

  // Overlay variant
  if (variant === 'overlay') {
    return (
      <div className={"absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center " + className}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <Loader className="w-6 h-6 text-emerald-500 animate-spin" />
            <span className="text-gray-900 dark:text-white">
              {message}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={"flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg " + className}>
        <div className="relative">
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-spin-slow" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader className="w-4 h-4 text-emerald-500 animate-pulse" />
          </div>
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {message}
        </span>
      </div>
    );
  }

  // Minimal variant
  return (
    <div className={"flex items-center justify-center p-4 " + className}>
      <Loader className="w-6 h-6 text-emerald-500 animate-spin" />
    </div>
  );
};

// Animation keyframes
const styles = `
  @keyframes spin-slow {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .animate-spin-slow {
    animation: spin-slow 2s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-spin-slow {
      animation: none;
    }

    .animate-pulse {
      animation: none;
    }

    .animate-spin {
      animation: none;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default LoadingScreen;
