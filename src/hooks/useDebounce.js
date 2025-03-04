import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for debouncing values
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Object} options - Additional options
 * @param {boolean} options.leading - Whether to invoke on the leading edge
 * @param {boolean} options.trailing - Whether to invoke on the trailing edge
 * @returns {[*, Function]} Tuple of [debouncedValue, cancelDebounce]
 */
const useDebounce = (value, delay = 500, options = {}) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef(null);
  const leadingCallRef = useRef(false);

  // Store the latest value and options in refs
  const valueRef = useRef(value);
  const optionsRef = useRef(options);
  valueRef.current = value;
  optionsRef.current = options;

  // Cancel debounce timeout
  const cancelDebounce = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Update debounced value
  useEffect(() => {
    // Handle leading edge
    if (optionsRef.current.leading && !leadingCallRef.current) {
      setDebouncedValue(valueRef.current);
      leadingCallRef.current = true;
      return;
    }

    // Cancel previous timeout
    cancelDebounce();

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(valueRef.current);
      leadingCallRef.current = false;
    }, delay);

    // Cleanup on unmount or value change
    return cancelDebounce;
  }, [value, delay, cancelDebounce]);

  return [debouncedValue, cancelDebounce];
};

/**
 * Custom hook for debouncing functions
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Object} options - Additional options
 * @param {boolean} options.leading - Whether to invoke on the leading edge
 * @param {boolean} options.trailing - Whether to invoke on the trailing edge
 * @returns {[Function, Function]} Tuple of [debouncedFn, cancelDebounce]
 */
export const useDebouncedCallback = (fn, delay = 500, options = {}) => {
  const timeoutRef = useRef(null);
  const fnRef = useRef(fn);
  const leadingCallRef = useRef(false);

  // Store the latest function and options in refs
  fnRef.current = fn;
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Cancel debounce timeout
  const cancelDebounce = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Create debounced function
  const debouncedFn = useCallback((...args) => {
    // Handle leading edge
    if (optionsRef.current.leading && !leadingCallRef.current) {
      fnRef.current(...args);
      leadingCallRef.current = true;
      return;
    }

    // Cancel previous timeout
    cancelDebounce();

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      fnRef.current(...args);
      leadingCallRef.current = false;
    }, delay);
  }, [delay, cancelDebounce]);

  // Cleanup on unmount
  useEffect(() => cancelDebounce, [cancelDebounce]);

  return [debouncedFn, cancelDebounce];
};

/**
 * Custom hook for debouncing async functions
 * @param {Function} fn - Async function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Object} options - Additional options
 * @param {boolean} options.leading - Whether to invoke on the leading edge
 * @param {boolean} options.trailing - Whether to invoke on the trailing edge
 * @returns {[Function, Function]} Tuple of [debouncedFn, cancelDebounce]
 */
export const useDebouncedAsync = (fn, delay = 500, options = {}) => {
  const timeoutRef = useRef(null);
  const fnRef = useRef(fn);
  const leadingCallRef = useRef(false);
  const pendingPromiseRef = useRef(null);

  // Store the latest function and options in refs
  fnRef.current = fn;
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Cancel debounce timeout and reject pending promise
  const cancelDebounce = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (pendingPromiseRef.current) {
      pendingPromiseRef.current.reject(new Error('Debounce cancelled'));
      pendingPromiseRef.current = null;
    }
  }, []);

  // Create debounced async function
  const debouncedFn = useCallback(async (...args) => {
    // Cancel previous timeout and promise
    cancelDebounce();

    // Create new promise
    return new Promise((resolve, reject) => {
      pendingPromiseRef.current = { resolve, reject };

      // Handle leading edge
      if (optionsRef.current.leading && !leadingCallRef.current) {
        fnRef.current(...args)
          .then(resolve)
          .catch(reject)
          .finally(() => {
            leadingCallRef.current = true;
            pendingPromiseRef.current = null;
          });
        return;
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        fnRef.current(...args)
          .then(resolve)
          .catch(reject)
          .finally(() => {
            leadingCallRef.current = false;
            pendingPromiseRef.current = null;
          });
      }, delay);
    });
  }, [delay, cancelDebounce]);

  // Cleanup on unmount
  useEffect(() => cancelDebounce, [cancelDebounce]);

  return [debouncedFn, cancelDebounce];
};

export default useDebounce;
