import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/api/eventService';
import { userService } from '../../services/api/userService';
import LoadingScreen from '../common/LoadingScreen';
import ErrorScreen from '../common/ErrorScreen';
import './EventDetails.css';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEventById(eventId);
      setEvent(data);
      setError(null);
    } catch (err) {
      setError('Failed to load event details. Please try again later.');
      console.error('Error fetching event details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setRegistering(true);
      // TODO: Get actual userId from auth context
      const userId = 'current-user-id';
      await eventService.registerForEvent(eventId, userId);
      // Show success message or update UI
      setEvent(prev => ({
        ...prev,
        isRegistered: true
      }));
    } catch (err) {
      setError('Failed to register for event. Please try again.');
      console.error('Error registering for event:', err);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;
  if (!event) return <ErrorScreen message="Event not found" />;

  return (
    <div className="event-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Events
      </button>

      <div className="event-details-content">
        {event.imageUrl && (
          <div className="event-details-image">
            <img src={event.imageUrl} alt={event.title} />
          </div>
        )}

        <div className="event-details-info">
          <h1>{event.title}</h1>
          
          <div className="event-meta">
            <div className="meta-item">
              <i className="icon-calendar"></i>
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="meta-item">
              <i className="icon-location"></i>
              <span>{event.location}</span>
            </div>
            <div className="meta-item">
              <i className="icon-people"></i>
              <span>{event.participantCount} participants</span>
            </div>
          </div>

          <div className="event-description">
            <h2>About this Event</h2>
            <p>{event.description}</p>
          </div>

          {event.requirements && (
            <div className="event-requirements">
              <h2>Requirements</h2>
              <ul>
                {event.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {event.schedule && (
            <div className="event-schedule">
              <h2>Schedule</h2>
              <ul>
                {event.schedule.map((item, index) => (
                  <li key={index}>
                    <span className="time">{item.time}</span>
                    <span className="activity">{item.activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="event-action">
            {!event.isRegistered ? (
              <button 
                className="register-button"
                onClick={handleRegister}
                disabled={registering}
              >
                {registering ? 'Registering...' : 'Register for Event'}
              </button>
            ) : (
              <div className="registered-badge">
                You're registered for this event!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
