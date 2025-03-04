import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/api/eventService';
import LoadingScreen from '../common/LoadingScreen';
import ErrorScreen from '../common/ErrorScreen';
import './VolunteerOpportunities.css';

const VolunteerOpportunities = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEventsByType('volunteer');
      setOpportunities(data);
      setError(null);
    } catch (err) {
      setError('Failed to load volunteer opportunities. Please try again later.');
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterOpportunities = (category) => {
    setFilter(category);
  };

  const getFilteredOpportunities = () => {
    if (filter === 'all') return opportunities;
    return opportunities.filter(opp => opp.category === filter);
  };

  const categories = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'fire-watch', label: 'Fire Watch' },
    { id: 'planting', label: 'Tree Planting' },
    { id: 'education', label: 'Education' },
    { id: 'maintenance', label: 'Forest Maintenance' }
  ];

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className="volunteer-opportunities">
      <div className="opportunities-header">
        <h2>Volunteer Opportunities</h2>
        <p>Join our community and make a difference in forest protection</p>
      </div>

      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${filter === category.id ? 'active' : ''}`}
            onClick={() => filterOpportunities(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="opportunities-grid">
        {getFilteredOpportunities().length === 0 ? (
          <div className="no-opportunities">
            <p>No opportunities available in this category at the moment.</p>
          </div>
        ) : (
          getFilteredOpportunities().map(opportunity => (
            <div key={opportunity.id} className="opportunity-card">
              <div className="opportunity-image">
                <img src={opportunity.imageUrl} alt={opportunity.title} />
                <div className="opportunity-category">
                  <span>{opportunity.category}</span>
                </div>
              </div>

              <div className="opportunity-content">
                <h3>{opportunity.title}</h3>
                
                <div className="opportunity-details">
                  <div className="detail-item">
                    <i className="icon-calendar"></i>
                    <span>{opportunity.commitment}</span>
                  </div>
                  <div className="detail-item">
                    <i className="icon-location"></i>
                    <span>{opportunity.location}</span>
                  </div>
                </div>

                <p className="opportunity-description">
                  {opportunity.description}
                </p>

                <div className="skills-required">
                  <h4>Skills Required</h4>
                  <div className="skills-tags">
                    {opportunity.requiredSkills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="opportunity-footer">
                  <button
                    className="apply-button"
                    onClick={() => navigate(`/volunteer/${opportunity.id}`)}
                  >
                    Apply Now
                  </button>
                  <div className="positions-available">
                    <i className="icon-users"></i>
                    <span>{opportunity.positionsAvailable} positions available</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VolunteerOpportunities;
