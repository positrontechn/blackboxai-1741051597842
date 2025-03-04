import { API_CONFIG, ERROR_MESSAGES } from '../../constants';
import apiClient from './apiClient';
import offlineService from '../offline/offlineService';
import { generateId } from '../../utils/helpers';

class ReportService {
  constructor() {
    this.listeners = new Set();
    this.reports = [];
    this.statistics = null;
    this.syncInProgress = false;
  }

  /**
   * Get all reports
   * @param {Object} filters - Report filters
   * @returns {Promise<Array>} Reports
   */
  async getReports(filters = {}) {
    try {
      // Get online reports
      let reports = [];
      if (navigator.onLine) {
        const response = await apiClient.client.get(API_CONFIG.endpoints.reports, {
          params: filters
        });
        reports = response.data;
      }

      // Get offline reports
      const offlineReports = await offlineService.getOfflineReports();
      reports = [...reports, ...offlineReports];

      // Apply filters
      if (filters.type) {
        reports = reports.filter(report => report.type === filters.type);
      }
      if (filters.status) {
        reports = reports.filter(report => report.status === filters.status);
      }
      if (filters.startDate) {
        reports = reports.filter(report => 
          new Date(report.timestamp) >= new Date(filters.startDate)
        );
      }
      if (filters.endDate) {
        reports = reports.filter(report => 
          new Date(report.timestamp) <= new Date(filters.endDate)
        );
      }

      // Sort by timestamp
      reports.sort((a, b) => b.timestamp - a.timestamp);

      this.reports = reports;
      this.notifyListeners();
      return reports;
    } catch (error) {
      console.error('Error getting reports:', error);
      throw error;
    }
  }

  /**
   * Get single report
   * @param {string} id - Report ID
   * @returns {Promise<Object>} Report
   */
  async getReport(id) {
    try {
      // Check offline storage first
      const offlineReport = await offlineService.getFromStore('reports', id);
      if (offlineReport) {
        return offlineReport;
      }

      // Get from API
      const response = await apiClient.client.get(
        `${API_CONFIG.endpoints.reports}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting report:', error);
      throw error;
    }
  }

  /**
   * Submit new report
   * @param {Object} data - Report data
   * @returns {Promise<Object>} Submitted report
   */
  async submitReport(data) {
    try {
      // Generate ID for offline storage
      const report = {
        ...data,
        id: generateId(),
        timestamp: Date.now(),
        status: 'pending'
      };

      // Save to offline storage
      await offlineService.saveReport(report);

      // Try to sync immediately if online
      if (navigator.onLine) {
        await this.syncReport(report);
      }

      this.reports = [report, ...this.reports];
      this.notifyListeners();
      return report;
    } catch (error) {
      console.error('Error submitting report:', error);
      throw error;
    }
  }

  /**
   * Update existing report
   * @param {string} id - Report ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} Updated report
   */
  async updateReport(id, data) {
    try {
      // Update offline first
      const report = await this.getReport(id);
      if (!report) {
        throw new Error('Report not found');
      }

      const updatedReport = {
        ...report,
        ...data,
        status: 'pending'
      };

      await offlineService.saveReport(updatedReport);

      // Try to sync immediately if online
      if (navigator.onLine) {
        await this.syncReport(updatedReport);
      }

      this.reports = this.reports.map(r => 
        r.id === id ? updatedReport : r
      );
      this.notifyListeners();
      return updatedReport;
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  }

  /**
   * Delete report
   * @param {string} id - Report ID
   * @returns {Promise<void>}
   */
  async deleteReport(id) {
    try {
      // Delete from API if online
      if (navigator.onLine) {
        await apiClient.client.delete(
          `${API_CONFIG.endpoints.reports}/${id}`
        );
      }

      // Delete from offline storage
      await offlineService.deleteFromStore('reports', id);

      this.reports = this.reports.filter(r => r.id !== id);
      this.notifyListeners();
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }

  /**
   * Sync single report
   * @param {Object} report - Report to sync
   * @returns {Promise<Object>} Synced report
   */
  async syncReport(report) {
    try {
      // Upload media files first
      const mediaPromises = report.photos?.map(photo => 
        apiClient.uploadFile(
          `${API_CONFIG.endpoints.media}/upload`,
          photo.blob
        )
      ) || [];

      const mediaResults = await Promise.all(mediaPromises);
      const mediaUrls = mediaResults.map(result => result.data.url);

      // Submit report with media URLs
      const response = await apiClient.client.post(
        API_CONFIG.endpoints.reports,
        {
          ...report,
          photos: mediaUrls
        }
      );

      // Update offline status
      await offlineService.updateReportStatus(report.id, 'synced');

      return response.data;
    } catch (error) {
      console.error('Error syncing report:', error);
      throw error;
    }
  }

  /**
   * Sync all pending reports
   * @returns {Promise<void>}
   */
  async syncReports() {
    if (this.syncInProgress) return;

    try {
      this.syncInProgress = true;
      this.notifyListeners();

      const pendingReports = await offlineService.getOfflineReports();
      const total = pendingReports.length;
      let completed = 0;

      for (const report of pendingReports) {
        try {
          await this.syncReport(report);
          completed++;
          this.notifyListeners();
        } catch (error) {
          console.error('Error syncing report:', error);
        }
      }

      await this.getReports();
    } finally {
      this.syncInProgress = false;
      this.notifyListeners();
    }
  }

  /**
   * Get report statistics
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics() {
    try {
      if (navigator.onLine) {
        const response = await apiClient.client.get(
          `${API_CONFIG.endpoints.reports}/statistics`
        );
        this.statistics = response.data;
      } else {
        const reports = await offlineService.getOfflineReports();
        this.statistics = {
          total: reports.length,
          pending: reports.filter(r => r.status === 'pending').length,
          synced: reports.filter(r => r.status === 'synced').length,
          byType: reports.reduce((acc, r) => {
            acc[r.type] = (acc[r.type] || 0) + 1;
            return acc;
          }, {})
        };
      }

      this.notifyListeners();
      return this.statistics;
    } catch (error) {
      console.error('Error getting statistics:', error);
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
      reports: this.reports,
      statistics: this.statistics,
      syncInProgress: this.syncInProgress
    };

    this.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('Error in report service listener:', error);
      }
    });
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.listeners.clear();
    this.reports = [];
    this.statistics = null;
  }
}

export default new ReportService();
