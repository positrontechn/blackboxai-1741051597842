/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Format date to readable string
 * @param {string|number|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    dateStyle: 'medium',
    timeStyle: 'short'
  };
  return new Intl.DateTimeFormat(
    navigator.language,
    { ...defaultOptions, ...options }
  ).format(new Date(date));
};

/**
 * Format relative time
 * @param {string|number|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return new Intl.RelativeTimeFormat(navigator.language, {
        numeric: 'auto'
      }).format(-interval, unit);
    }
  }

  return 'just now';
};

/**
 * Calculate distance between two points
 * @param {Object} point1 - First point {lat, lng}
 * @param {Object} point2 - Second point {lat, lng}
 * @returns {number} Distance in meters
 */
export const calculateDistance = (point1, point2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = point1.lat * Math.PI / 180;
  const φ2 = point2.lat * Math.PI / 180;
  const Δφ = (point2.lat - point1.lat) * Math.PI / 180;
  const Δλ = (point2.lng - point1.lng) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

/**
 * Format distance
 * @param {number|Object} distance - Distance in meters or points {lat, lng}
 * @param {Object} [point2] - Second point if first arg is point
 * @returns {string} Formatted distance
 */
export const formatDistance = (distance, point2) => {
  let meters = typeof distance === 'number' ? 
    distance : 
    calculateDistance(distance, point2);

  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

/**
 * Validate file
 * @param {File} file - File to validate
 * @param {Object} config - Validation config
 * @returns {boolean} Is valid
 */
export const validateFile = (file, config) => {
  if (!file) return false;
  if (config.maxSize && file.size > config.maxSize) return false;
  if (config.allowedTypes && !config.allowedTypes.includes(file.type)) return false;
  return true;
};

/**
 * Retry async function
 * @param {Function} fn - Function to retry
 * @param {number} attempts - Number of attempts
 * @param {number} delay - Delay between attempts
 * @returns {Promise} Function result
 */
export const retry = async (fn, attempts = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (attempts === 1) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, attempts - 1, delay);
  }
};

/**
 * Debounce function
 * @param {Function} fn - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (fn, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      fn(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Limit in ms
 * @returns {Function} Throttled function
 */
export const throttle = (fn, limit = 300) => {
  let waiting = false;
  return function executedFunction(...args) {
    if (!waiting) {
      fn(...args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
};

/**
 * Deep clone object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
    );
  }
  return obj;
};

/**
 * Deep merge objects
 * @param {...Object} objects - Objects to merge
 * @returns {Object} Merged object
 */
export const deepMerge = (...objects) => {
  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];
      
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = Array.from(new Set([...pVal, ...oVal]));
      }
      else if (pVal instanceof Object && oVal instanceof Object) {
        prev[key] = deepMerge(pVal, oVal);
      }
      else {
        prev[key] = oVal;
      }
    });
    return prev;
  }, {});
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Format number
 * @param {number} number - Number to format
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} Formatted number
 */
export const formatNumber = (number, options = {}) => {
  return new Intl.NumberFormat(navigator.language, options).format(number);
};

/**
 * Get browser locale
 * @returns {string} Browser locale
 */
export const getBrowserLocale = () => {
  return navigator.languages?.[0] || navigator.language || 'en';
};

/**
 * Get device type
 * @returns {string} Device type
 */
export const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

/**
 * Check if device supports touch
 * @returns {boolean} Has touch support
 */
export const hasTouchSupport = () => {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
};

/**
 * Check if device prefers reduced motion
 * @returns {boolean} Prefers reduced motion
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if device is in dark mode
 * @returns {boolean} Is dark mode
 */
export const isDarkMode = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};
