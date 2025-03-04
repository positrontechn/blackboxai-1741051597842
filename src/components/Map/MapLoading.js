import React from 'react';
import { 
  Map,
  Loader,
  Database,
  Cloud,
  Layers,
  Wifi
} from 'lucide-react';

const MapLoading = ({ 
  message = 'Loading map...',
  showSteps = true,
  variant = 'full',
  className = ''
}) => {
  // Loading steps
  const steps = [
    {
      icon: Database,
      label: 'Loading data...',
      color: 'text-blue-500',
      delay: 0
    },
    {
      icon: Cloud,
      label: 'Syncing reports...',
      color: 'text-purple-500',
      delay: 200
    },
    {
      icon: Layers,
      label: 'Preparing map...',
      color: 'text-orange-500',
      delay: 400
    },
    {
      icon: Wifi,
      label: 'Checking connection...',
      color: 'text-emerald-500',
      delay: 600
    }
  ];

  // Full screen variant
  if (variant === 'full') {
    return (
      <div className={"fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center " + className}>
        {/* Main Loading Indicator */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
            <Map className="w-12 h-12 text-emerald-500" />
          </div>
          <div className="absolute -right-2 -top-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center animate-spin">
              <Loader className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {message}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please wait while we prepare the map
          </p>
        </div>

        {/* Loading Steps */}
        {showSteps && (
          <div className="max-w-sm w-full">
            <div className="grid grid-cols-2 gap-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center"
                  style={{
                    animationDelay: `${step.delay}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards',
                    opacity: 0,
                    transform: 'translateY(20px)'
                  }}
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-3 animate-pulse">
                    <step.icon className={"w-6 h-6 " + step.color} />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 animate-progress-indeterminate" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Overlay variant
  if (variant === 'overlay') {
    return (
      <div className={"absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center " + className}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <Loader className="w-5 h-5 text-emerald-500 animate-spin" />
            <span className="text-gray-900 dark:text-white">
              {message}
            </span>
          </div>
        </div>
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
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes progress-indeterminate {
    0% {
      transform: translateX(-100%);
      width: 50%;
    }
    100% {
      transform: translateX(100%);
      width: 50%;
    }
  }

  .animate-progress-indeterminate {
    animation: progress-indeterminate 1.5s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-progress-indeterminate {
      animation: none;
    }

    .animate-pulse {
      animation: none;
    }

    .animate-spin {
      animation: none;
    }

    [style*="animation"] {
      animation: none !important;
      transform: none !important;
      opacity: 1 !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default MapLoading;
