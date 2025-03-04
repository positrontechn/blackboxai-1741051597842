import React, { useEffect } from 'react';
import { 
  MapPin,
  Shield,
  Settings,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import useLocation from '../../hooks/useLocation';

const LocationPermission = ({
  onGranted,
  onDenied,
  variant = 'full',
  className = ''
}) => {
  const { 
    permissionStatus, 
    requestPermission, 
    error 
  } = useLocation();

  // Request permission when component mounts
  useEffect(() => {
    if (permissionStatus === 'prompt') {
      requestPermission()
        .then(status => {
          if (status === 'granted') {
            onGranted?.();
          } else {
            onDenied?.();
          }
        })
        .catch(error => {
          console.error('Error requesting location permission:', error);
          onDenied?.();
        });
    }
  }, [permissionStatus, requestPermission, onGranted, onDenied]);

  // Full screen variant
  if (variant === 'full') {
    return (
      <div className={"fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center p-4 " + className}>
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
            <MapPin className="w-12 h-12 text-emerald-500" />
          </div>
          <div className="absolute -right-2 -top-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center max-w-sm mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Location Access Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            GreenSentinel needs access to your location to help you report and 
            track environmental incidents in your area.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your location data is only used within the app and is never shared 
            without your consent.
          </p>
        </div>

        {/* Actions */}
        {permissionStatus === 'denied' ? (
          <div className="space-y-4">
            <button
              onClick={() => window.open('app-settings://')}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2"
            >
              <Settings className="w-5 h-5" />
              <span>Open Settings</span>
            </button>
            <button
              onClick={onDenied}
              className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Continue Without Location
            </button>
          </div>
        ) : (
          <button
            onClick={requestPermission}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          >
            Allow Location Access
          </button>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* Help Link */}
        <button
          onClick={() => window.open('/help/location-access', '_blank')}
          className="mt-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Learn more about location access</span>
        </button>
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={"p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg " + className}>
        <div className="flex items-start gap-4">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-800/50 rounded-lg">
            <MapPin className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white mb-2">
              Enable Location Access
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Allow location access to report and track incidents in your area.
            </p>
            <button
              onClick={requestPermission}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm"
            >
              Allow Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Minimal variant
  return (
    <button
      onClick={requestPermission}
      className={"flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 " + className}
    >
      <MapPin className="w-5 h-5" />
      <span>Enable Location</span>
    </button>
  );
};

export default LocationPermission;
