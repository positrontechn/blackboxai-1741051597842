import { MAP_CONFIG, ERROR_MESSAGES } from '../../constants';

class LocationService {
  constructor() {
    this.listeners = new Set();
    this.watching = false;
    this.watchId = null;
    this.currentPosition = null;
    this.permissionStatus = null;
    this.error = null;
    this.history = [];
    this.isHighAccuracy = MAP_CONFIG.locationOptions.enableHighAccuracy;
  }

  /**
   * Initialize permission status
   * @returns {Promise<string>} Permission status
   */
  async initPermissionStatus() {
    try {
      if (!('permissions' in navigator)) {
        this.permissionStatus = 'prompt';
        return this.permissionStatus;
      }

      const result = await navigator.permissions.query({ name: 'geolocation' });
      this.permissionStatus = result.state;
      
      result.addEventListener('change', () => {
        this.permissionStatus = result.state;
        this.notifyListeners();
      });

      return this.permissionStatus;
    } catch (error) {
      console.error('Error initializing permission status:', error);
      this.permissionStatus = 'prompt';
      return this.permissionStatus;
    }
  }

  /**
   * Request location permission
   * @returns {Promise<string>} Permission status
   */
  async requestPermission() {
    try {
      const position = await this.getCurrentPosition();
      this.permissionStatus = 'granted';
      this.notifyListeners();
      return this.permissionStatus;
    } catch (error) {
      this.permissionStatus = 'denied';
      this.notifyListeners();
      throw error;
    }
  }

  /**
   * Get current position
   * @param {Object} options - Position options
   * @returns {Promise<Object>} Position
   */
  getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error(ERROR_MESSAGES.location.unavailable));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = this.formatPosition(position);
          this.currentPosition = location;
          this.error = null;
          this.history.push(location);
          this.notifyListeners();
          resolve(location);
        },
        (error) => {
          const formattedError = this.formatError(error);
          this.error = formattedError;
          this.notifyListeners();
          reject(formattedError);
        },
        {
          enableHighAccuracy: this.isHighAccuracy,
          timeout: MAP_CONFIG.locationOptions.timeout,
          maximumAge: MAP_CONFIG.locationOptions.maximumAge,
          ...options
        }
      );
    });
  }

  /**
   * Start watching position
   * @param {Object} options - Watch options
   */
  startWatching(options = {}) {
    if (this.watching) return;

    if (!navigator.geolocation) {
      this.error = new Error(ERROR_MESSAGES.location.unavailable);
      this.notifyListeners();
      return;
    }

    this.watching = true;
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = this.formatPosition(position);
        this.currentPosition = location;
        this.error = null;
        this.history.push(location);
        this.notifyListeners();
      },
      (error) => {
        const formattedError = this.formatError(error);
        this.error = formattedError;
        this.notifyListeners();
      },
      {
        enableHighAccuracy: this.isHighAccuracy,
        timeout: MAP_CONFIG.locationOptions.timeout,
        maximumAge: MAP_CONFIG.locationOptions.maximumAge,
        ...options
      }
    );
  }

  /**
   * Stop watching position
   */
  stopWatching() {
    if (!this.watching) return;

    if (navigator.geolocation && this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    this.watching = false;
    this.watchId = null;
  }

  /**
   * Toggle high accuracy mode
   */
  toggleHighAccuracy() {
    this.isHighAccuracy = !this.isHighAccuracy;
    if (this.watching) {
      this.stopWatching();
      this.startWatching();
    }
    this.notifyListeners();
  }

  /**
   * Format position object
   * @param {Object} position - Geolocation position
   * @returns {Object} Formatted position
   */
  formatPosition(position) {
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp
    };
  }

  /**
   * Format error object
   * @param {Object} error - Geolocation error
   * @returns {Error} Formatted error
   */
  formatError(error) {
    switch (error.code) {
      case 1:
        return new Error(ERROR_MESSAGES.location.denied);
      case 2:
        return new Error(ERROR_MESSAGES.location.unavailable);
      case 3:
        return new Error(ERROR_MESSAGES.location.timeout);
      default:
        return error;
    }
  }

  /**
   * Add state change listener
   * @param {Function} listener - Listener function
   */
  addListener(listener) {
    this.listeners.add(listener);
  }

  /**
   * Remove state change listener
   * @param {Function} listener - Listener function
   */
  removeListener(listener) {
    this.listeners.delete(listener);
  }

  /**
   * Notify all listeners
   */
  notifyListeners() {
    const state = {
      position: this.currentPosition,
      permissionStatus: this.permissionStatus,
      error: this.error,
      watching: this.watching,
      history: this.history,
      isHighAccuracy: this.isHighAccuracy
    };

    this.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('Error in location service listener:', error);
      }
    });
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.stopWatching();
    this.listeners.clear();
  }
}

export default new LocationService();
