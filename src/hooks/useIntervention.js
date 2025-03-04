import { useState, useCallback } from 'react';
import apiClient from '../services/api/apiClient';

const useIntervention = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch assigned incidents
  const fetchAssignedIncidents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/intervention/incidents');
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch incidents');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Accept an incident
  const acceptIncident = useCallback(async (incidentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post(`/api/intervention/incidents/${incidentId}/accept`);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to accept incident');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update incident status
  const updateIncidentStatus = useCallback(async (incidentId, status, notes) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.patch(`/api/intervention/incidents/${incidentId}/status`, {
        status,
        notes
      });
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update incident status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get incident details
  const getIncidentDetails = useCallback(async (incidentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/api/intervention/incidents/${incidentId}`);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch incident details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchAssignedIncidents,
    acceptIncident,
    updateIncidentStatus,
    getIncidentDetails
  };
};

export default useIntervention;
