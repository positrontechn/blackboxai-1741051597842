import { ERROR_MESSAGES } from '../../constants';

class OfflineService {
  constructor() {
    this.listeners = new Set();
    this.db = null;
    this.syncInProgress = false;
    this.syncProgress = null;
    this.pendingUploads = [];
    this.storageStats = {
      usage: 0,
      quota: 0,
      available: 0,
      reports: 0,
      media: 0
    };
  }

  /**
   * Initialize offline service
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      // Check IndexedDB support
      if (!('indexedDB' in window)) {
        throw new Error('IndexedDB not supported');
      }

      // Open database
      this.db = await new Promise((resolve, reject) => {
        const request = indexedDB.open('GreenSentinel', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;

          // Create stores
          if (!db.objectStoreNames.contains('reports')) {
            db.createObjectStore('reports', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('media')) {
            db.createObjectStore('media', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('cache')) {
            db.createObjectStore('cache', { keyPath: 'key' });
          }
        };
      });

      // Update storage stats
      await this.updateStorageStats();
    } catch (error) {
      console.error('Error initializing offline service:', error);
      throw error;
    }
  }

  /**
   * Save report to offline storage
   * @param {Object} report - Report to save
   * @returns {Promise<Object>} Saved report
   */
  async saveReport(report) {
    try {
      await this.putToStore('reports', report);
      this.pendingUploads.push(report);
      await this.updateStorageStats();
      this.notifyListeners();
      return report;
    } catch (error) {
      console.error('Error saving report:', error);
      throw error;
    }
  }

  /**
   * Get offline reports
   * @returns {Promise<Array>} Reports
   */
  async getOfflineReports() {
    try {
      return await this.getAllFromStore('reports');
    } catch (error) {
      console.error('Error getting offline reports:', error);
      throw error;
    }
  }

  /**
   * Update report status
   * @param {string} id - Report ID
   * @param {string} status - New status
   * @returns {Promise<void>}
   */
  async updateReportStatus(id, status) {
    try {
      const report = await this.getFromStore('reports', id);
      if (!report) throw new Error('Report not found');

      report.status = status;
      await this.putToStore('reports', report);

      if (status === 'synced') {
        this.pendingUploads = this.pendingUploads.filter(r => r.id !== id);
      }

      this.notifyListeners();
    } catch (error) {
      console.error('Error updating report status:', error);
      throw error;
    }
  }

  /**
   * Cache response
   * @param {string} key - Cache key
   * @param {*} data - Data to cache
   * @returns {Promise<void>}
   */
  async cacheResponse(key, data) {
    try {
      await this.putToStore('cache', { key, data });
      await this.updateStorageStats();
    } catch (error) {
      console.error('Error caching response:', error);
      throw error;
    }
  }

  /**
   * Get cached response
   * @param {string} key - Cache key
   * @returns {Promise<*>} Cached data
   */
  async getCachedResponse(key) {
    try {
      const entry = await this.getFromStore('cache', key);
      return entry?.data;
    } catch (error) {
      console.error('Error getting cached response:', error);
      throw error;
    }
  }

  /**
   * Put data in store
   * @param {string} storeName - Store name
   * @param {Object} data - Data to store
   * @returns {Promise<void>}
   */
  async putToStore(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get data from store
   * @param {string} storeName - Store name
   * @param {string} key - Data key
   * @returns {Promise<*>} Stored data
   */
  async getFromStore(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all data from store
   * @param {string} storeName - Store name
   * @returns {Promise<Array>} All stored data
   */
  async getAllFromStore(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete from store
   * @param {string} storeName - Store name
   * @param {string} key - Data key
   * @returns {Promise<void>}
   */
  async deleteFromStore(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear store
   * @param {string} storeName - Store name
   * @returns {Promise<void>}
   */
  async clearStore(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Update storage statistics
   * @returns {Promise<Object>} Storage stats
   */
  async updateStorageStats() {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        this.storageStats.usage = estimate.usage || 0;
        this.storageStats.quota = estimate.quota || 0;
        this.storageStats.available = estimate.quota - estimate.usage;
      }

      const reports = await this.getAllFromStore('reports');
      const media = await this.getAllFromStore('media');
      this.storageStats.reports = reports.length;
      this.storageStats.media = media.length;

      this.notifyListeners();
      return this.storageStats;
    } catch (error) {
      console.error('Error updating storage stats:', error);
      throw error;
    }
  }

  /**
   * Clear cache
   * @returns {Promise<void>}
   */
  async clearCache() {
    try {
      await this.clearStore('cache');
      await this.updateStorageStats();
      this.notifyListeners();
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
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
      syncInProgress: this.syncInProgress,
      syncProgress: this.syncProgress,
      pendingUploads: this.pendingUploads,
      storageStats: this.storageStats
    };

    this.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('Error in offline service listener:', error);
      }
    });
  }

  /**
   * Clean up resources
   */
  cleanup() {
    if (this.db) {
      this.db.close();
    }
    this.listeners.clear();
    this.pendingUploads = [];
  }
}

export default new OfflineService();
