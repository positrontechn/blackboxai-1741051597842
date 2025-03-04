import React from 'react';
import { 
  AlertTriangle,
  RefreshCcw,
  ArrowLeft,
  HelpCircle,
  Wifi,
  Database,
  Server
} from 'lucide-react';
import Logo from '../Logo/Logo';

const ErrorScreen = ({
  error,
  action,
  showLogo = true,
  variant = 'full',
  className = ''
}) => {
  // Get error details
  const getErrorDetails = () => {
    if (typeof error === 'string') {
      return {
        title: 'Error',
        message: error,
        icon: AlertTriangle
      };
    }

    // Network error
    if (error?.name === 'NetworkError' || error?.message?.includes('network')) {
      return {
        title: 'Network Error',
        message: 'Please check your internet connection and try again.',
        icon: Wifi
      };
    }

    // Server error
    if (error?.status >= 500) {
      return {
        title: 'Server Error',
        message: 'Something went wrong on our end. Please try again later.',
        icon: Server
      };
    }

    // Database error
    if (error?.name === 'DatabaseError' || error?.message?.includes('database')) {
      return {
        title: 'Database Error',
        message: 'Unable to access data. Please try again later.',
        icon: Database
      };
    }

    // Default error
    return {
      title: 'Something Went Wrong',
      message: error?.message || 'An unexpected error occurred. Please try again.',
      icon: AlertTriangle
    };
  };

  const { title, message, icon: Icon } = getErrorDetails();

  // Full screen variant
  if (variant === 'full') {
    return (
      <div className={"fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center p-4 " + className}>
        {/* Logo */}
        {showLogo && (
          <div className="mb-12">
            <Logo variant="dark" size="lg" />
          </div>
        )}

        {/* Error Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
            <Icon className="w-12 h-12 text-red-500" />
          </div>
          <div className="absolute -right-2 -top-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center animate-bounce">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center max-w-sm mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {action ? (
            <button
              onClick={action.onClick}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
            >
              {action.icon || <RefreshCcw className="w-5 h-5" />}
              <span>{action.label}</span>
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
            >
              <RefreshCcw className="w-5 h-5" />
              <span>Try Again</span>
            </button>
          )}
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Help Link */}
        <button
          onClick={() => window.open('/help', '_blank')}
          className="mt-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Need help? Contact support</span>
        </button>
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={"p-4 bg-red-50 dark:bg-red-900/20 rounded-lg " + className}>
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-100 dark:bg-red-800/50 rounded-lg">
            <Icon className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white mb-2">
              {title}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {message}
            </p>
            {action && (
              <button
                onClick={action.onClick}
                className="text-sm text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-2"
              >
                {action.icon || <RefreshCcw className="w-4 h-4" />}
                <span>{action.label}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Minimal variant
  return (
    <div className={"flex items-center gap-2 text-red-500 " + className}>
      <Icon className="w-5 h-5" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default ErrorScreen;
