import { API_CONFIG, ERROR_MESSAGES } from '../../constants';
import apiClient from '../api/apiClient';
import { retry } from '../../utils/helpers';

class GeocodingService {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  /**
   * Get address from coordinates
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<string>} Address
   */
  async reverseGeocode(lat, lng) {
    try {
      // Check cache
      const cacheKey = `${lat},${lng}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      // Check pending requests
      if (this.pendingRequests.has(cacheKey)) {
        return this.pendingRequests.get(cacheKey);
      }

      // Create new request
      const request = retry(
        async () => {
          const response = await apiClient.client.get(
            `${API_CONFIG.endpoints.geocoding}/reverse`, {
              params: { lat, lng }
            }
          );

          // Cache result
          const address = response.data.address;
          this.cache.set(cacheKey, address);
          this.pendingRequests.delete(cacheKey);

          return address;
        },
        API_CONFIG.retryAttempts,
        API_CONFIG.retryDelay
      );

      // Store pending request
      this.pendingRequests.set(cacheKey, request);

      return request;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw new Error(ERROR_MESSAGES.api.server);
    }
  }

  /**
   * Get coordinates from address
   * @param {string} address - Address to geocode
   * @returns {Promise<Object>} Coordinates
   */
  async geocode(address) {
    try {
      // Check cache
      if (this.cache.has(address)) {
        return this.cache.get(address);
      }

      // Check pending requests
      if (this.pendingRequests.has(address)) {
        return this.pendingRequests.get(address);
      }

      // Create new request
      const request = retry(
        async () => {
          const response = await apiClient.client.get(
            `${API_CONFIG.endpoints.geocoding}/forward`, {
              params: { address }
            }
          );

          // Cache result
          const location = response.data.location;
          this.cache.set(address, location);
          this.pendingRequests.delete(address);

          return location;
        },
        API_CONFIG.retryAttempts,
        API_CONFIG.retryDelay
      );

      // Store pending request
      this.pendingRequests.set(address, request);

      return request;
    } catch (error) {
      console.error('Error geocoding:', error);
      throw new Error(ERROR_MESSAGES.api.server);
    }
  }

  /**
   * Get address suggestions
   * @param {string} query - Search query
   * @returns {Promise<Array>} Suggestions
   */
  async getSuggestions(query) {
    try {
      // Check cache
      if (this.cache.has(query)) {
        return this.cache.get(query);
      }

      // Check pending requests
      if (this.pendingRequests.has(query)) {
        return this.pendingRequests.get(query);
      }

      // Create new request
      const request = retry(
        async () => {
          const response = await apiClient.client.get(
            `${API_CONFIG.endpoints.geocoding}/suggestions`, {
              params: { query }
            }
          );

          // Cache result
          const suggestions = response.data.suggestions;
          this.cache.set(query, suggestions);
          this.pendingRequests.delete(query);

          return suggestions;
        },
        API_CONFIG.retryAttempts,
        API_CONFIG.retryDelay
      );

      // Store pending request
      this.pendingRequests.set(query, request);

      return request;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      throw new Error(ERROR_MESSAGES.api.server);
    }
  }

  /**
   * Get place details
   * @param {string} placeId - Place ID
   * @returns {Promise<Object>} Place details
   */
  async getPlaceDetails(placeId) {
    try {
      // Check cache
      if (this.cache.has(placeId)) {
        return this.cache.get(placeId);
      }

      // Check pending requests
      if (this.pendingRequests.has(placeId)) {
        return this.pendingRequests.get(placeId);
      }

      // Create new request
      const request = retry(
        async () => {
          const response = await apiClient.client.get(
            `${API_CONFIG.endpoints.geocoding}/details`, {
              params: { placeId }
            }
          );

          // Cache result
          const details = response.data.details;
          this.cache.set(placeId, details);
          this.pendingRequests.delete(placeId);

          return details;
        },
        API_CONFIG.retryAttempts,
        API_CONFIG.retryDelay
      );

      // Store pending request
      this.pendingRequests.set(placeId, request);

      return request;
    } catch (error) {
      console.error('Error getting place details:', error);
      throw new Error(ERROR_MESSAGES.api.server);
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}

export default new GeocodingService();
