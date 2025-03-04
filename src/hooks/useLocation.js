import { useState, useEffect, useCallback } from 'react';
import locationService from '../services/location/locationService';
import geocodingService from '../services/location/geocodingService';
import { MAP_CONFIG } from '../constants';

const useLocation = (options = {}) => {
  // State
  const [currentLocation, setCurrentLocation] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [error, setError] = useState(null);
  const [watching, setWatching] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const [heading, setHeading] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [history, setHistory] = useState([]);
  const [isHighAccuracy, setIsHighAccuracy] = useState(
    options.highAccuracy ?? MAP_CONFIG.locationOptions.enableHighAccuracy
  );

  // Initialize location service
  useEffect(() => {
    const init = async () => {
      try {
        const status = await locationService.initPermissionStatus();
        setPermissionStatus(status);

        if (status === 'granted' && options.startWatching) {
          startWatching();
        }
      } catch (err) {
        setError(err.message);
        console.error('Error initializing location:', err);
      }
    };

    init();

    // Subscribe to location updates
    locationService.addListener(handleLocationUpdate);
    return () => {
      locationService.removeListener(handleLocationUpdate);
      stopWatching();
    };
  }, [options.startWatching]);

  // Handle location updates
  const handleLocationUpdate = useCallback((state) => {
    if (state.position) {
      setCurrentLocation(state.position);
      setAccuracy(state.position.accuracy);
      setHeading(state.position.heading);
      setSpeed(state.position.speed);
    }
    if (state.permissionStatus) {
      setPermissionStatus(state.permissionStatus);
    }
    if (state.error) {
      setError(state.error);
    }
    if (state.history) {
      setHistory(state.history);
    }
  }, []);

  // Request location permission
  const requestPermission = useCallback(async () => {
    try {
      setError(null);
      const status = await locationService.requestPermission();
      setPermissionStatus(status);
      return status;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Get current position
  const getCurrentPosition = useCallback(async (opts = {}) => {
    try {
      setError(null);
      const position = await locationService.getCurrentPosition({
        ...opts,
        enableHighAccuracy: isHighAccuracy
      });
      setCurrentLocation(position);
      return position;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [isHighAccuracy]);

  // Start watching position
  const startWatching = useCallback(() => {
    try {
      locationService.startWatching({
        enableHighAccuracy: isHighAccuracy
      });
      setWatching(true);
    } catch (err) {
      setError(err.message);
      console.error('Error starting location watch:', err);
    }
  }, [isHighAccuracy]);

  // Stop watching position
  const stopWatching = useCallback(() => {
    locationService.stopWatching();
    setWatching(false);
  }, []);

  // Toggle high accuracy mode
  const toggleHighAccuracy = useCallback(() => {
    setIsHighAccuracy(prev => {
      const next = !prev;
      if (watching) {
        stopWatching();
        locationService.startWatching({
          enableHighAccuracy: next
        });
        setWatching(true);
      }
      return next;
    });
  }, [watching, stopWatching]);

  // Get address from coordinates
  const getAddress = useCallback(async (lat, lng) => {
    try {
      setError(null);
      return await geocodingService.reverseGeocode(lat, lng);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Get coordinates from address
  const getCoordinates = useCallback(async (address) => {
    try {
      setError(null);
      return await geocodingService.geocode(address);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Get address suggestions
  const getSuggestions = useCallback(async (query) => {
    try {
      setError(null);
      return await geocodingService.getSuggestions(query);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Computed values
  const locationStatus = isHighAccuracy ? 
    (accuracy <= MAP_CONFIG.locationOptions.highAccuracyThreshold ? 'high' : 'low') : 
    'standard';

  const movementStatus = !speed ? 'stationary' :
    speed < 1 ? 'stationary' :
    speed < 5 ? 'walking' :
    speed < 15 ? 'running' : 
    'vehicle';

  const locationAge = currentLocation?.timestamp ? 
    Date.now() - currentLocation.timestamp : 
    null;

  return {
    // State
    currentLocation,
    permissionStatus,
    error,
    watching,
    accuracy,
    heading,
    speed,
    history,
    isHighAccuracy,

    // Actions
    requestPermission,
    getCurrentPosition,
    startWatching,
    stopWatching,
    toggleHighAccuracy,
    getAddress,
    getCoordinates,
    getSuggestions,

    // Computed
    locationStatus,
    movementStatus,
    locationAge,

    // Helpers
    hasPermission: permissionStatus === 'granted',
    needsPermission: permissionStatus === 'prompt',
    isBlocked: permissionStatus === 'denied',
    isAccurate: accuracy <= MAP_CONFIG.locationOptions.highAccuracyThreshold,
    isMoving: speed > 0,
    hasHistory: history.length > 0
  };
};

export default useLocation;
