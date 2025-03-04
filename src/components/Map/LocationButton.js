import React, { useState, useEffect } from 'react';
import { 
  Navigation,
  Loader,
  AlertTriangle,
  Shield,
  MapPin
} from 'lucide-react';
import useLocation from '../../hooks/useLocation';

const LocationButton = ({
  onClick,
  showAccuracy = false,
  variant = 'icon',
  className = ''
}) => {
  const { 
    currentLocation, 
    accuracy, 
    permissionStatus, 
    requestPermission,
    error: locationError,
    isHighAccuracy,
    toggleHighAccuracy
  } = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle location request
  const handleClick = async () => {
    if (permissionStatus === 'denied') {
      // Open settings if permission is denied
      window.open('app-settings://');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (permissionStatus === 'prompt') {
        await requestPermission();
      }

      onClick?.();
    } catch (err) {
      setError(err.message);
      console.error('Error handling location:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset error when location updates
  useEffect(() => {
    if (currentLocation) {
      setError(null);
    }
  }, [currentLocation]);

  // Icon only variant
  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={"p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 " + 
          (error || locationError ? "text-red-500" : "text-gray-700 dark:text-gray-300") + 
          " hover:text-emerald-500 dark:hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed " + 
          className}
      >
        {loading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : error || locationError ? (
          <AlertTriangle className="w-5 h-5" />
        ) : (
          <Navigation className="w-5 h-5" />
        )}
      </button>
    );
  }

  // Text variant
  if (variant === 'text') {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={"flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 " + 
          (error || locationError ? "text-red-500" : "text-gray-700 dark:text-gray-300") + 
          " hover:text-emerald-500 dark:hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed " + 
          className}
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Getting location...</span>
          </>
        ) : error || locationError ? (
          <>
            <AlertTriangle className="w-5 h-5" />
            <span>Location error</span>
          </>
        ) : (
          <>
            <Navigation className="w-5 h-5" />
            <span>Use my location</span>
          </>
        )}
      </button>
    );
  }

  // Status variant
  return (
    <div className={"flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 " + className}>
      {/* Status Icon */}
      <div className="relative">
        <div className={
          "w-10 h-10 rounded-lg flex items-center justify-center " + 
          (error || locationError ? 
            "bg-red-50 dark:bg-red-900/20" : 
            "bg-emerald-50 dark:bg-emerald-900/20"
          )}
        >
          {loading ? (
            <Loader className="w-5 h-5 text-emerald-500 animate-spin" />
          ) : error || locationError ? (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          ) : (
            <Navigation className="w-5 h-5 text-emerald-500" />
          )}
        </div>
        {currentLocation && !error && !locationError && (
          <div className="absolute -right-1 -top-1">
            <Shield className="w-4 h-4 text-emerald-500" />
          </div>
        )}
      </div>

      {/* Status Text */}
      <div className="flex-1">
        <p className="font-medium text-gray-900 dark:text-white">
          {loading ? 'Getting location...' :
            error || locationError ? 'Location error' :
            currentLocation ? 'Location active' :
            'Location inactive'}
        </p>
        {showAccuracy && currentLocation && accuracy && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Accuracy: ±{Math.round(accuracy)}m
          </p>
        )}
      </div>

      {/* Action Button */}
      {(error || locationError || !currentLocation) && (
        <button
          onClick={handleClick}
          disabled={loading}
          className="p-2 text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {permissionStatus === 'denied' ? 'Settings' : 'Enable'}
        </button>
      )}

      {/* Accuracy Toggle */}
      {currentLocation && !error && !locationError && (
        <button
          onClick={toggleHighAccuracy}
          className={"p-2 rounded-lg transition-colors " + 
            (isHighAccuracy ? 
              "bg-emerald-500 text-white" : 
              "text-gray-500 dark:text-gray-400 hover:text-emerald-500"
            )}
        >
          <MapPin className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default LocationButton;
