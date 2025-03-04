import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PlantingDayCard.css';

const PlantingDayCard = ({ event }) => {
  const navigate = useNavigate();
  const {
    id,
    title,
    date,
    location,
    imageUrl,
    treesPlanned,
    volunteersNeeded,
    currentVolunteers,
    description
  } = event;

  const handleCardClick = () => {
    navigate(`/event/${id}`);
  };

  const getProgressPercentage = () => {
    return Math.min((currentVolunteers / volunteersNeeded) * 100, 100);
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="planting-day-card" onClick={handleCardClick}>
      <div className="planting-day-image">
        <img src={imageUrl} alt={title} />
        <div className="planting-day-date">
          <span>{formatDate(date)}</span>
        </div>
      </div>

      <div className="planting-day-content">
        <h3>{title}</h3>
        <p className="planting-day-location">
          <i className="icon-location"></i>
          {location}
        </p>
        
        <div className="planting-day-stats">
          <div className="stat-item">
            <i className="icon-tree"></i>
            <span>{treesPlanned} trees to plant</span>
          </div>
          <div className="stat-item">
            <i className="icon-people"></i>
            <span>{currentVolunteers}/{volunteersNeeded} volunteers</span>
          </div>
        </div>

        <div className="volunteer-progress">
          <div 
            className="progress-bar" 
            style={{ width: `${getProgressPercentage()}%` }}
          />
          <span className="progress-text">
            {volunteersNeeded - currentVolunteers} spots remaining
          </span>
        </div>

        <p className="planting-day-description">{description}</p>

        <div className="planting-day-footer">
          <button 
            className="join-button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/event/${id}/register`);
            }}
          >
            Join Planting Day
          </button>
          
          <div className="equipment-note">
            <i className="icon-info"></i>
            <span>Equipment provided</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantingDayCard;
