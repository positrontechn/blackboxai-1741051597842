import { useState, useEffect, useCallback } from 'react';
import offlineService from '../services/offline/offlineService';
import { ERROR_MESSAGES } from '../constants';

const useOffline = (options = {}) => {
  // State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState({
    syncing: false,
    progress: null
  });
  const [pendingUploads, setPendingUploads] = useState([]);
  const [storageStats, setStorageStats] = useState({
    usage: 0,
    quota: 0,
    available: 0,
    reports: 0,
    media: 0
  });
  const [error, setError] = useState(null);

  // Initialize offline service
  useEffect(() => {
    const init = async () => {
      try {
        await offlineService.initialize();
        await updateStorageStats();

        // Auto sync if online
        if (navigator.onLine && options.autoSync) {
          syncData();
        }
      } catch (err) {
        setError(err.message);
        console.error('Error initializing offline service:', err);
      }
    };

    init();

    // Subscribe to offline service updates
    offlineService.addListener(handleOfflineUpdate);
    return () => offlineService.removeListener(handleOfflineUpdate);
  }, [options.autoSync]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (options.autoSync && pendingUploads.length > 0) {
        syncData();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [options.autoSync, pendingUploads]);

  // Handle offline service updates
  const handleOfflineUpdate = useCallback((state) => {
    setSyncStatus({
      syncing: state.syncInProgress,
      progress: state.syncProgress
    });
    setPendingUploads(state.pendingUploads);
    setStorageStats(state.storageStats);
  }, []);

  // Update storage statistics
  const updateStorageStats = useCallback(async () => {
    try {
      setError(null);
      const stats = await offlineService.updateStorageStats();
      setStorageStats(stats);
      return stats;
    } catch (err) {
      setError(err.message);
      console.error('Error updating storage stats:', err);
      throw err;
    }
  }, []);

  // Sync data with server
  const syncData = useCallback(async () => {
    if (!isOnline || syncStatus.syncing) return;

    try {
      setError(null);
      await offlineService.syncReports();
      await updateStorageStats();
    } catch (err) {
      setError(ERROR_MESSAGES.offline.sync);
      console.error('Error syncing data:', err);
      throw err;
    }
  }, [isOnline, syncStatus.syncing, updateStorageStats]);

  // Clear offline data
  const clearOfflineData = useCallback(async () => {
    try {
      setError(null);
      await offlineService.clearCache();
      await updateStorageStats();
    } catch (err) {
      setError(err.message);
      console.error('Error clearing offline data:', err);
      throw err;
    }
  }, [updateStorageStats]);

  // Check storage availability
  const checkStorageAvailability = useCallback(async (size) => {
    try {
      if (storageStats.available < size) {
        throw new Error(ERROR_MESSAGES.offline.quota);
      }
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [storageStats.available]);

  // Save data for offline use
  const saveOfflineData = useCallback(async (key, data) => {
    try {
      setError(null);
      await offlineService.cacheResponse(key, data);
      await updateStorageStats();
    } catch (err) {
      setError(err.message);
      console.error('Error saving offline data:', err);
      throw err;
    }
  }, [updateStorageStats]);

  // Get offline data
  const getOfflineData = useCallback(async (key) => {
    try {
      setError(null);
      return await offlineService.getCachedResponse(key);
    } catch (err) {
      setError(err.message);
      console.error('Error getting offline data:', err);
      throw err;
    }
  }, []);

  // Calculate storage usage percentage
  const storageUsagePercentage = (storageStats.usage / storageStats.quota) * 100;

  // Check if sync is needed
  const shouldSync = isOnline && pendingUploads.length > 0 && !syncStatus.syncing;

  return {
    // State
    isOnline,
    syncStatus,
    pendingUploads,
    storageStats,
    error,

    // Actions
    syncData,
    clearOfflineData,
    checkStorageAvailability,
    saveOfflineData,
    getOfflineData,
    updateStorageStats,

    // Computed
    storageUsagePercentage,
    shouldSync,

    // Helpers
    hasPendingUploads: pendingUploads.length > 0,
    isStorageFull: storageUsagePercentage >= 90,
    canSync: isOnline && !syncStatus.syncing,
    isSyncing: syncStatus.syncing,
    syncProgress: syncStatus.progress
  };
};

export default useOffline;
