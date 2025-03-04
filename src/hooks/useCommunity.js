import { useState, useEffect, useCallback } from 'react';
import { eventService } from '../services/api/eventService';

const useCommunity = () => {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [volunteerOpportunities, setVolunteerOpportunities] = useState([]);
  const [achievements, setAchievements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all community events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents();
      setEvents(data);
      
      // Filter featured events (planting days)
      const featured = data.filter(event => event.type === 'planting');
      setFeaturedEvents(featured);

      // Filter volunteer opportunities
      const opportunities = data.filter(event => event.type === 'volunteer');
      setVolunteerOpportunities(opportunities);

      setError(null);
    } catch (err) {
      setError('Failed to load community events. Please try again later.');
      console.error('Error fetching community events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch community achievements
  const fetchAchievements = useCallback(async () => {
    try {
      const data = await eventService.getCommunityAchievements();
      setAchievements(data);
    } catch (err) {
      console.error('Error fetching community achievements:', err);
      // Don't set error state here as it's not critical
    }
  }, []);

  // Register for an event
  const registerForEvent = useCallback(async (eventId, userId) => {
    try {
      await eventService.registerForEvent(eventId, userId);
      // Update local state to reflect registration
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, isRegistered: true }
            : event
        )
      );
      return true;
    } catch (err) {
      console.error('Error registering for event:', err);
      throw err;
    }
  }, []);

  // Get event by ID
  const getEventById = useCallback((eventId) => {
    return events.find(event => event.id === eventId);
  }, [events]);

  // Filter events by type
  const filterEventsByType = useCallback((type) => {
    return events.filter(event => event.type === type);
  }, [events]);

  // Initial data fetch
  useEffect(() => {
    fetchEvents();
    fetchAchievements();
  }, [fetchEvents, fetchAchievements]);

  return {
    events,
    featuredEvents,
    volunteerOpportunities,
    achievements,
    loading,
    error,
    registerForEvent,
    getEventById,
    filterEventsByType,
    refreshEvents: fetchEvents,
    refreshAchievements: fetchAchievements
  };
};

export default useCommunity;
