import apiClient from './apiClient';

const EVENT_ENDPOINT = '/api/events';

export const eventService = {
  // Get all community events
  getAllEvents: async () => {
    try {
      const response = await apiClient.get(EVENT_ENDPOINT);
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Get event by ID
  getEventById: async (eventId) => {
    try {
      const response = await apiClient.get(`${EVENT_ENDPOINT}/${eventId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${eventId}:`, error);
      throw error;
    }
  },

  // Get events by type (planting, volunteer, etc.)
  getEventsByType: async (eventType) => {
    try {
      const response = await apiClient.get(`${EVENT_ENDPOINT}/type/${eventType}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching events of type ${eventType}:`, error);
      throw error;
    }
  },

  // Register for an event
  registerForEvent: async (eventId, userId) => {
    try {
      const response = await apiClient.post(`${EVENT_ENDPOINT}/${eventId}/register`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  },

  // Get user's registered events
  getUserEvents: async (userId) => {
    try {
      const response = await apiClient.get(`${EVENT_ENDPOINT}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user events:', error);
      throw error;
    }
  },

  // Get upcoming events
  getUpcomingEvents: async () => {
    try {
      const response = await apiClient.get(`${EVENT_ENDPOINT}/upcoming`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  },

  // Get community achievements
  getCommunityAchievements: async () => {
    try {
      const response = await apiClient.get(`${EVENT_ENDPOINT}/achievements`);
      return response.data;
    } catch (error) {
      console.error('Error fetching community achievements:', error);
      throw error;
    }
  }
};

export default eventService;
