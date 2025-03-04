import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/api/eventService';
import LoadingScreen from '../common/LoadingScreen';
import ErrorScreen from '../common/ErrorScreen';
import './CommunityAchievements.css';

const CommunityAchievements = () => {
  const [achievements, setAchievements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const data = await eventService.getCommunityAchievements();
      setAchievements(data);
      setError(null);
    } catch (err) {
      setError('Failed to load community achievements. Please try again later.');
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;
  if (!achievements) return null;

  const {
    totalEvents,
    treesPlanted,
    volunteersActive,
    areaProtected,
    firesReported,
    responseTime,
    topContributors,
    recentMilestones
  } = achievements;

  return (
    <div className="community-achievements">
      <div className="achievements-header">
        <h2>Community Impact</h2>
        <p>Together, we're making a difference in protecting our forests</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <i className="icon-tree"></i>
          <div className="stat-content">
            <h3>{treesPlanted.toLocaleString()}</h3>
            <p>Trees Planted</p>
          </div>
        </div>

        <div className="stat-card">
          <i className="icon-users"></i>
          <div className="stat-content">
            <h3>{volunteersActive.toLocaleString()}</h3>
            <p>Active Volunteers</p>
          </div>
        </div>

        <div className="stat-card">
          <i className="icon-map"></i>
          <div className="stat-content">
            <h3>{areaProtected} km²</h3>
            <p>Area Protected</p>
          </div>
        </div>

        <div className="stat-card">
          <i className="icon-alert-triangle"></i>
          <div className="stat-content">
            <h3>{firesReported}</h3>
            <p>Fires Reported</p>
          </div>
        </div>
      </div>

      <div className="achievements-grid">
        <div className="achievement-section response-time">
          <h3>Average Response Time</h3>
          <div className="response-indicator">
            <div className="time-display">
              <span className="time">{responseTime}</span>
              <span className="unit">minutes</span>
            </div>
            <div className="response-bar">
              <div 
                className="progress" 
                style={{ width: `${Math.min((responseTime / 30) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="achievement-section top-contributors">
          <h3>Top Contributors</h3>
          <div className="contributors-list">
            {topContributors.map((contributor, index) => (
              <div key={contributor.id} className="contributor-item">
                <div className="contributor-rank">{index + 1}</div>
                <img 
                  src={contributor.avatar} 
                  alt={contributor.name}
                  className="contributor-avatar" 
                />
                <div className="contributor-info">
                  <span className="contributor-name">{contributor.name}</span>
                  <span className="contribution-count">
                    {contributor.contributions} contributions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="achievement-section recent-milestones">
          <h3>Recent Milestones</h3>
          <div className="milestones-timeline">
            {recentMilestones.map((milestone, index) => (
              <div key={index} className="milestone-item">
                <div className="milestone-date">
                  {new Date(milestone.date).toLocaleDateString()}
                </div>
                <div className="milestone-content">
                  <h4>{milestone.title}</h4>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="join-community">
        <h3>Be Part of Our Success</h3>
        <p>Join our community and help us protect more forests</p>
        <button className="join-button" onClick={() => window.location.href = '/volunteer'}>
          Become a Volunteer
        </button>
      </div>
    </div>
  );
};

export default CommunityAchievements;
