import React, { useState } from 'react';
import { 
  Moon,
  Sun,
  Bell,
  Globe,
  Database,
  Shield,
  Trash2,
  HelpCircle,
  FileText,
  Mail,
  AlertTriangle,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  ChevronRight
} from 'lucide-react';
import Header from '../components/Navigation/Header';
import useOffline from '../hooks/useOffline';

const SettingsScreen = () => {
  const { storageStats, clearOfflineData } = useOffline();

  // Settings state
  const [settings, setSettings] = useState({
    theme: 'system',
    notifications: {
      enabled: true,
      alerts: true,
      updates: true,
      marketing: false
    },
    privacy: {
      locationHistory: true,
      analytics: true,
      sharing: true
    },
    offline: {
      autoSync: true,
      savePhotos: true
    }
  });

  // Settings sections
  const sections = [
    {
      title: 'Appearance',
      items: [
        {
          id: 'theme',
          icon: settings.theme === 'dark' ? Moon : Sun,
          label: 'Theme',
          value: settings.theme === 'system' 
            ? 'System' 
            : settings.theme === 'dark' 
              ? 'Dark' 
              : 'Light',
          type: 'select',
          options: [
            { value: 'system', label: 'System' },
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' }
          ]
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'notifications.enabled',
          icon: Bell,
          label: 'Enable Notifications',
          value: settings.notifications.enabled,
          type: 'toggle'
        },
        {
          id: 'notifications.alerts',
          icon: AlertTriangle,
          label: 'Incident Alerts',
          value: settings.notifications.alerts,
          type: 'toggle',
          disabled: !settings.notifications.enabled
        },
        {
          id: 'notifications.updates',
          icon: Globe,
          label: 'App Updates',
          value: settings.notifications.updates,
          type: 'toggle',
          disabled: !settings.notifications.enabled
        }
      ]
    },
    {
      title: 'Privacy',
      items: [
        {
          id: 'privacy.locationHistory',
          icon: Globe,
          label: 'Location History',
          value: settings.privacy.locationHistory,
          type: 'toggle',
          description: 'Save your location history to improve incident reporting'
        },
        {
          id: 'privacy.analytics',
          icon: Shield,
          label: 'Usage Analytics',
          value: settings.privacy.analytics,
          type: 'toggle',
          description: 'Help us improve by sharing anonymous usage data'
        }
      ]
    },
    {
      title: 'Offline Storage',
      items: [
        {
          id: 'offline.autoSync',
          icon: Database,
          label: 'Auto Sync',
          value: settings.offline.autoSync,
          type: 'toggle',
          description: 'Automatically sync data when online'
        },
        {
          id: 'offline.storage',
          icon: Database,
          label: 'Storage Used',
          value: `${Math.round(storageStats.usage / 1024 / 1024)}MB of ${Math.round(storageStats.quota / 1024 / 1024)}MB`,
          type: 'info'
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          icon: HelpCircle,
          label: 'Help Center',
          type: 'link',
          href: '/help'
        },
        {
          id: 'contact',
          icon: Mail,
          label: 'Contact Support',
          type: 'link',
          href: '/contact'
        },
        {
          id: 'privacy',
          icon: FileText,
          label: 'Privacy Policy',
          type: 'link',
          href: '/privacy'
        }
      ]
    }
  ];

  // Handle setting change
  const handleSettingChange = (id, value) => {
    setSettings(prev => {
      const keys = id.split('.');
      if (keys.length === 1) {
        return { ...prev, [id]: value };
      }
      return {
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value
        }
      };
    });
  };

  // Render setting item
  const renderSettingItem = (item) => {
    switch (item.type) {
      case 'toggle':
        return (
          <button
            onClick={() => !item.disabled && handleSettingChange(item.id, !item.value)}
            className={`
              p-2 rounded-lg transition-colors
              ${item.disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            {item.value ? (
              <ToggleRight className="w-6 h-6 text-emerald-500" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-gray-400" />
            )}
          </button>
        );

      case 'select':
        return (
          <select
            value={item.value}
            onChange={(e) => handleSettingChange(item.id, e.target.value)}
            className="bg-transparent text-right text-gray-900 dark:text-white"
          >
            {item.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'link':
        return (
          <button
            onClick={() => window.location.href = item.href}
            className="p-2 text-gray-400 hover:text-gray-600 
              dark:hover:text-gray-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Settings" />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl border 
              border-gray-200 dark:border-gray-700"
          >
            <div className="px-6 py-4 border-b border-gray-200 
              dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="px-6 py-4 flex items-center gap-4"
                >
                  <item.icon className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.label}
                      </div>
                      {renderSettingItem(item)}
                    </div>
                    {item.description && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Clear Data */}
        <button
          onClick={() => {
            if (window.confirm('Are you sure? This will clear all offline data.')) {
              clearOfflineData();
            }
          }}
          className="w-full flex items-center justify-center gap-2 p-4 
            bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 
            dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40"
        >
          <Trash2 className="w-5 h-5" />
          <span>Clear Offline Data</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;
