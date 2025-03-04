import React, { useState, useEffect } from 'react';
import { 
  WifiOff,
  Wifi,
  Database,
  RefreshCcw,
  X,
  AlertTriangle
} from 'lucide-react';
import useOffline from '../../hooks/useOffline';

const OfflineIndicator = ({
  variant = 'banner',
  className = ''
}) => {
  const { 
    isOnline, 
    syncStatus, 
    pendingUploads, 
    syncData,
    storageStats 
  } = useOffline();

  const [showBanner, setShowBanner] = useState(!isOnline);
  const [showDetails, setShowDetails] = useState(false);

  // Update banner visibility when online status changes
  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true);
    }
  }, [isOnline]);

  // Handle sync
  const handleSync = async () => {
    if (!isOnline || syncStatus.syncing) return;
    try {
      await syncData();
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  };

  // Banner variant
  if (variant === 'banner' && showBanner) {
    return (
      <div className={"fixed top-0 inset-x-0 z-50 pt-safe " + className}>
        {/* Offline Banner */}
        <div className="bg-red-500 text-white">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <WifiOff className="w-5 h-5" />
                <span className="font-medium">You're offline</span>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="p-1 hover:bg-red-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sync Status */}
        {pendingUploads.length > 0 && (
          <div className="bg-yellow-500 text-white">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5" />
                  <span className="font-medium">
                    {pendingUploads.length} items pending sync
                  </span>
                </div>
                <button
                  onClick={handleSync}
                  disabled={!isOnline || syncStatus.syncing}
                  className="p-1 hover:bg-yellow-600 rounded-lg disabled:opacity-50"
                >
                  <RefreshCcw className={"w-5 h-5 " + (syncStatus.syncing ? "animate-spin" : "")} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Status variant
  if (variant === 'status') {
    return (
      <div className={"flex items-center gap-3 p-4 rounded-lg " + 
        (isOnline ? 
          "bg-emerald-50 dark:bg-emerald-900/20" : 
          "bg-red-50 dark:bg-red-900/20"
        ) + " " + className}
      >
        <div className={"p-2 rounded-lg " + 
          (isOnline ? 
            "bg-emerald-100 dark:bg-emerald-800/50" : 
            "bg-red-100 dark:bg-red-800/50"
          )}
        >
          {isOnline ? (
            <Wifi className="w-5 h-5 text-emerald-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
        </div>
        <div className="flex-1">
          <p className={"font-medium " + 
            (isOnline ? 
              "text-emerald-700 dark:text-emerald-300" : 
              "text-red-700 dark:text-red-300"
            )}
          >
            {isOnline ? 'Online' : 'Offline'}
          </p>
          {pendingUploads.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {pendingUploads.length} items pending sync
            </p>
          )}
        </div>
        {pendingUploads.length > 0 && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <Database className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  // Details variant
  if (variant === 'details' || showDetails) {
    return (
      <div className={"bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden " + className}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Offline Storage
            </h3>
            <div className="flex items-center gap-2">
              {!isOnline && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <WifiOff className="w-4 h-4" />
                  <span>Offline</span>
                </div>
              )}
              {pendingUploads.length > 0 && (
                <button
                  onClick={handleSync}
                  disabled={!isOnline || syncStatus.syncing}
                  className="p-2 text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 disabled:opacity-50 rounded-lg"
                >
                  <RefreshCcw className={"w-5 h-5 " + (syncStatus.syncing ? "animate-spin" : "")} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Storage Stats */}
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Storage Used
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.round(storageStats.usage / 1024 / 1024)}MB
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{
                    width: `${(storageStats.usage / storageStats.quota) * 100}%`
                  }}
                />
              </div>
            </div>

            {pendingUploads.length > 0 && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    Pending Uploads
                  </p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    {pendingUploads.length} items will be synced when online
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default OfflineIndicator;
