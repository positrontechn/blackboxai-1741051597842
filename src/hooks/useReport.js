import { useState, useEffect, useCallback } from 'react';
import reportService from '../services/api/reportService';
import { ERROR_MESSAGES } from '../constants';
import { calculateDistance } from '../utils/helpers';

const useReport = (options = {}) => {
  // State
  const [reports, setReports] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  // Load reports on mount and when filters change
  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get reports
        const data = await reportService.getReports(filters);
        setReports(data);

        // Get metrics if needed
        if (options.includeMetrics) {
          const stats = await reportService.getStatistics();
          setMetrics(stats);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading reports:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [filters, options.includeMetrics]);

  // Subscribe to report service updates
  useEffect(() => {
    const handleUpdate = (state) => {
      setReports(state.reports);
      if (options.includeMetrics) {
        setMetrics(state.statistics);
      }
    };

    reportService.addListener(handleUpdate);
    return () => reportService.removeListener(handleUpdate);
  }, [options.includeMetrics]);

  // Get single report
  const getReport = useCallback(async (id) => {
    try {
      setError(null);
      return await reportService.getReport(id);
    } catch (err) {
      setError(err.message);
      console.error('Error getting report:', err);
      throw err;
    }
  }, []);

  // Submit new report
  const submitReport = useCallback(async (data) => {
    try {
      setError(null);
      return await reportService.submitReport(data);
    } catch (err) {
      setError(err.message);
      console.error('Error submitting report:', err);
      throw err;
    }
  }, []);

  // Update existing report
  const updateReport = useCallback(async (id, data) => {
    try {
      setError(null);
      return await reportService.updateReport(id, data);
    } catch (err) {
      setError(err.message);
      console.error('Error updating report:', err);
      throw err;
    }
  }, []);

  // Delete report
  const deleteReport = useCallback(async (id) => {
    try {
      setError(null);
      await reportService.deleteReport(id);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting report:', err);
      throw err;
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Get report metrics
  const getMetrics = useCallback(async () => {
    try {
      setError(null);
      const stats = await reportService.getStatistics();
      setMetrics(stats);
      return stats;
    } catch (err) {
      setError(err.message);
      console.error('Error getting metrics:', err);
      throw err;
    }
  }, []);

  // Sync reports
  const syncReports = useCallback(async () => {
    try {
      setError(null);
      await reportService.syncReports();
    } catch (err) {
      setError(ERROR_MESSAGES.offline.sync);
      console.error('Error syncing reports:', err);
      throw err;
    }
  }, []);

  // Get report by type
  const getReportsByType = useCallback((type) => {
    return reports.filter(report => report.type === type);
  }, [reports]);

  // Get report by status
  const getReportsByStatus = useCallback((status) => {
    return reports.filter(report => report.status === status);
  }, [reports]);

  // Get report by date range
  const getReportsByDateRange = useCallback((startDate, endDate) => {
    return reports.filter(report => {
      const timestamp = new Date(report.timestamp);
      return timestamp >= startDate && timestamp <= endDate;
    });
  }, [reports]);

  // Get nearby reports
  const getNearbyReports = useCallback((location, radius) => {
    return reports.filter(report => {
      const distance = calculateDistance(location, report.location);
      return distance <= radius;
    });
  }, [reports]);

  // Calculate report statistics
  const calculateStatistics = useCallback(() => {
    return {
      total: reports.length,
      byType: reports.reduce((acc, report) => {
        acc[report.type] = (acc[report.type] || 0) + 1;
        return acc;
      }, {}),
      byStatus: reports.reduce((acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1;
        return acc;
      }, {})
    };
  }, [reports]);

  return {
    // State
    reports,
    metrics,
    loading,
    error,
    filters,

    // Actions
    getReport,
    submitReport,
    updateReport,
    deleteReport,
    updateFilters,
    clearFilters,
    getMetrics,
    syncReports,

    // Helpers
    getReportsByType,
    getReportsByStatus,
    getReportsByDateRange,
    getNearbyReports,
    calculateStatistics,
    hasReports: reports.length > 0,
    hasMetrics: metrics !== null,
    isFiltered: Object.keys(filters).length > 0
  };
};

export default useReport;
