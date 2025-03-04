import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/api/eventService';
import LoadingScreen from '../common/LoadingScreen';
import ErrorScreen from '../common/ErrorScreen';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = (eventType) => {
    setFilter(eventType);
  };

  const getFilteredEvents = () => {
    if (filter === 'all') return events;
    return events.filter(event => event.type === filter);
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h2>Community Events</h2>
        <div className="event-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => filterEvents('all')}
          >
            All Events
          </button>
          <button 
            className={`filter-btn ${filter === 'planting' ? 'active' : ''}`}
            onClick={() => filterEvents('planting')}
          >
            Planting Days
          </button>
          <button 
            className={`filter-btn ${filter === 'volunteer' ? 'active' : ''}`}
            onClick={() => filterEvents('volunteer')}
          >
            Volunteer
          </button>
        </div>
      </div>

      <div className="events-grid">
        {getFilteredEvents().length === 0 ? (
          <div className="no-events">
            <p>No events found</p>
          </div>
        ) : (
          getFilteredEvents().map((event) => (
            <div key={event.id} className="event-card">
              {event.imageUrl && (
                <div className="event-image">
                  <img src={event.imageUrl} alt={event.title} />
                </div>
              )}
              <div className="event-content">
                <h3>{event.title}</h3>
                <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
                <p className="event-description">{event.description}</p>
                <div className="event-footer">
                  <span className="event-location">{event.location}</span>
                  <button 
                    className="join-btn"
                    onClick={() => window.location.href = `/event/${event.id}`}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;
