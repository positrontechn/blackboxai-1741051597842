import axios from 'axios';
import { API_CONFIG, ERROR_MESSAGES } from '../../constants';
import { retry } from '../../utils/helpers';

class ApiClient {
  constructor() {
    this.client = null;
    this.uploadClient = null;
    this.pendingRequests = new Map();
    this.initialize();
  }

  /**
   * Initialize API clients
   */
  initialize() {
    // Create main API client
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': API_CONFIG.userAgent
      }
    });

    // Create upload client with different timeout
    this.uploadClient = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout * 2,
      headers: {
        'Content-Type': 'multipart/form-data',
        'User-Agent': API_CONFIG.userAgent
      }
    });

    // Add request interceptors
    this.client.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    );
    this.uploadClient.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    );

    // Add response interceptors
    this.client.interceptors.response.use(
      this.handleResponse,
      this.handleResponseError
    );
    this.uploadClient.interceptors.response.use(
      this.handleResponse,
      this.handleResponseError
    );
  }

  /**
   * Handle request
   * @param {Object} config - Request config
   * @returns {Object} Modified config
   */
  handleRequest = (config) => {
    // Add auth token
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID
    const requestId = Math.random().toString(36).substring(7);
    config.headers['X-Request-ID'] = requestId;

    // Add timestamp
    config.headers['X-Request-Time'] = Date.now();

    // Add pending request
    this.pendingRequests.set(requestId, {
      url: config.url,
      method: config.method,
      timestamp: Date.now()
    });

    return config;
  };

  /**
   * Handle request error
   * @param {Error} error - Request error
   * @returns {Promise} Rejected promise
   */
  handleRequestError = (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  };

  /**
   * Handle response
   * @param {Object} response - Response object
   * @returns {Object} Response data
   */
  handleResponse = (response) => {
    // Remove pending request
    const requestId = response.config.headers['X-Request-ID'];
    this.pendingRequests.delete(requestId);

    // Add response time
    const requestTime = response.config.headers['X-Request-Time'];
    const responseTime = Date.now() - requestTime;
    console.debug(`Request completed in ${responseTime}ms:`, {
      url: response.config.url,
      method: response.config.method,
      status: response.status
    });

    return response;
  };

  /**
   * Handle response error
   * @param {Error} error - Response error
   * @returns {Promise} Rejected promise
   */
  handleResponseError = (error) => {
    // Remove pending request
    const requestId = error.config?.headers['X-Request-ID'];
    if (requestId) {
      this.pendingRequests.delete(requestId);
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error(ERROR_MESSAGES.api.network));
    }

    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error(ERROR_MESSAGES.api.timeout));
    }

    // Handle auth errors
    if (error.response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      return Promise.reject(new Error(ERROR_MESSAGES.api.auth));
    }

    // Handle server errors
    if (error.response.status >= 500) {
      return Promise.reject(new Error(ERROR_MESSAGES.api.server));
    }

    return Promise.reject(error);
  };

  /**
   * Upload file
   * @param {string} url - Upload URL
   * @param {File} file - File to upload
   * @param {Object} options - Upload options
   * @returns {Promise} Upload response
   */
  async uploadFile(url, file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      return await retry(
        () => this.uploadClient.post(url, formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            options.onProgress?.(progress);
          }
        }),
        API_CONFIG.retryAttempts,
        API_CONFIG.retryDelay
      );
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  /**
   * Get pending requests
   * @returns {Array} Pending requests
   */
  getPendingRequests() {
    return Array.from(this.pendingRequests.values());
  }

  /**
   * Cancel all pending requests
   */
  cancelPendingRequests() {
    this.pendingRequests.clear();
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.cancelPendingRequests();
  }
}

export default new ApiClient();
