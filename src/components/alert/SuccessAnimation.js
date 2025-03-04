import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import Logo from '../Logo/Logo';

const SuccessAnimation = ({
  message = 'Success!',
  subMessage = '',
  duration = 2000,
  onComplete,
  showLogo = true,
  variant = 'full',
  className = ''
}) => {
  const circleRef = useRef(null);
  const checkRef = useRef(null);

  // Start animation sequence
  useEffect(() => {
    // Get animation elements
    const circle = circleRef.current;
    const check = checkRef.current;
    if (!circle || !check) return;

    // Reset animations
    circle.style.animation = 'none';
    check.style.animation = 'none';
    void circle.offsetWidth; // Trigger reflow
    void check.offsetWidth;

    // Start animations
    circle.style.animation = 'success-circle 0.6s cubic-bezier(0.15, 0.85, 0.35, 1.3) forwards';
    check.style.animation = 'success-check 0.4s ease-out 0.3s forwards';

    // Handle completion
    if (onComplete) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onComplete]);

  // Full screen variant
  if (variant === 'full') {
    return (
      <div className={"fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center " + className}>
        {/* Logo */}
        {showLogo && (
          <div className="mb-12">
            <Logo variant="dark" size="lg" animated />
          </div>
        )}

        {/* Success Animation */}
        <div className="relative mb-8">
          {/* Background Circle */}
          <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full" />

          {/* Animated Circle */}
          <svg
            ref={circleRef}
            className="absolute inset-0 w-24 h-24"
            viewBox="0 0 100 100"
          >
            <circle
              className="stroke-emerald-500 fill-none"
              strokeWidth="4"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="44"
              strokeDasharray="276"
              strokeDashoffset="276"
            />
          </svg>

          {/* Check Icon */}
          <div
            ref={checkRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 scale-50"
          >
            <Check className="w-12 h-12 text-emerald-500" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {message}
          </h1>
          {subMessage && (
            <p className="text-gray-600 dark:text-gray-400">
              {subMessage}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={"flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg " + className}>
        <div className="relative">
          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-800/50 rounded-full" />
          <Check className="absolute inset-0 m-auto w-4 h-4 text-emerald-500 animate-success-check" />
        </div>
        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
          {message}
        </span>
      </div>
    );
  }

  // Overlay variant
  return (
    <div className={"fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center " + className}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-full" />
            <Check className="absolute inset-0 m-auto w-5 h-5 text-emerald-500 animate-success-check" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">
              {message}
            </p>
            {subMessage && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {subMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Animation keyframes
const styles = `
  @keyframes success-circle {
    0% {
      stroke-dashoffset: 276;
      transform: rotate(-90deg);
    }
    100% {
      stroke-dashoffset: 0;
      transform: rotate(-90deg);
    }
  }

  @keyframes success-check {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-success-check {
    animation: success-check 0.4s ease-out forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    @keyframes success-circle {
      0% {
        stroke-dashoffset: 276;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }

    @keyframes success-check {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default SuccessAnimation;
