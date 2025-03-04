import React, { useState, useEffect } from 'react';
import { Shield, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import LoadingScreen from '../components/common/LoadingScreen';
import ErrorScreen from '../components/common/ErrorScreen';

const InterventionScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [incidents, setIncidents] = useState([]);

  // Mock data for demonstration
  const mockIncidents = [
    {
      id: 1,
      type: 'pollution',
      severity: 'high',
      location: 'River Thames, London',
      status: 'pending',
      reportedAt: '2024-01-20T10:30:00Z',
      description: 'Chemical spill detected in river'
    },
    {
      id: 2,
      type: 'deforestation',
      severity: 'medium',
      location: 'Amazon Forest, Brazil',
      status: 'in_progress',
      reportedAt: '2024-01-19T15:45:00Z',
      description: 'Illegal logging activity reported'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchIncidents = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIncidents(mockIncidents);
        setLoading(false);
      } catch (err) {
        setError('Failed to load incidents');
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'in_progress':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'in_progress':
        return Shield;
      case 'completed':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      default:
        return AlertTriangle;
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Intervention Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and respond to environmental incidents
          </p>
        </div>
      </div>

      {/* Incident List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid gap-6">
          {incidents.map((incident) => {
            const StatusIcon = getStatusIcon(incident.status);
            return (
              <div
                key={incident.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <StatusIcon 
                        className={`w-5 h-5 ${getStatusColor(incident.status)}`} 
                      />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        incident.severity === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {incident.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {incident.description}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{incident.location}</span>
                      <span>•</span>
                      <span>{new Date(incident.reportedAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                      onClick={() => {
                        // TODO: Implement accept action
                        console.log('Accept incident:', incident.id);
                      }}
                    >
                      Accept
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => {
                        // TODO: Implement view details action
                        console.log('View details:', incident.id);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InterventionScreen;
