import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import EventList from '../components/community/EventList';
import PlantingDayCard from '../components/community/PlantingDayCard';
import VolunteerOpportunities from '../components/community/VolunteerOpportunities';
import CommunityAchievements from '../components/community/CommunityAchievements';
import CommunityErrorBoundary from '../components/community/CommunityErrorBoundary';
import CommunityLoadingAnimation from '../components/community/CommunityLoadingAnimation';
import useCommunity from '../hooks/useCommunity';
import useCommunityKeyboard from '../hooks/useCommunityKeyboard';
import './CommunityScreen.css';
import '../components/community/CommunityTransitions.css';

const TABS = ['events', 'volunteer', 'achievements'];

const CommunityScreen = () => {
  const [activeTab, setActiveTab] = useState('events');
  const {
    events,
    featuredEvents,
    volunteerOpportunities,
    achievements,
    loading,
    error,
    refreshEvents,
    refreshAchievements
  } = useCommunity();

  const { getTabProps, getPanelProps } = useCommunityKeyboard(activeTab, setActiveTab, TABS);

  const handleRetry = () => {
    refreshEvents();
    refreshAchievements();
  };

  if (loading) return <CommunityLoadingAnimation />;

  const renderContent = () => {
    const content = {
      events: (
        <div {...getPanelProps('events')}>
          <CommunityErrorBoundary onRetry={handleRetry}>
            {featuredEvents.length > 0 && (
              <div className="featured-planting-days">
                <h2>Featured Planting Days</h2>
                <div className="planting-days-grid">
                  {featuredEvents.map(event => (
                    <CSSTransition
                      key={event.id}
                      classNames="card"
                      appear={true}
                      timeout={500}
                    >
                      <PlantingDayCard event={event} />
                    </CSSTransition>
                  ))}
                </div>
              </div>
            )}
            <EventList events={events} />
          </CommunityErrorBoundary>
        </div>
      ),
      volunteer: (
        <div {...getPanelProps('volunteer')}>
          <CommunityErrorBoundary onRetry={handleRetry}>
            <VolunteerOpportunities opportunities={volunteerOpportunities} />
          </CommunityErrorBoundary>
        </div>
      ),
      achievements: (
        <div {...getPanelProps('achievements')}>
          <CommunityErrorBoundary onRetry={handleRetry}>
            <CommunityAchievements achievements={achievements} />
          </CommunityErrorBoundary>
        </div>
      )
    };

    return (
      <TransitionGroup>
        <CSSTransition
          key={activeTab}
          timeout={300}
          classNames="tab-transition"
          unmountOnExit
        >
          <div className="tab-content">
            {content[activeTab]}
          </div>
        </CSSTransition>
      </TransitionGroup>
    );
  };

  if (error) {
    return (
      <div className="community-screen" role="main">
        <div className="community-header">
          <h1>Community Hub</h1>
        </div>
        <CommunityErrorBoundary onRetry={handleRetry}>
          <div className="community-error-container" role="alert">
            {error}
          </div>
        </CommunityErrorBoundary>
      </div>
    );
  }

  return (
    <div className="community-screen" role="main">
      <div className="community-header">
        <h1>Community Hub</h1>
        <p>Join forces with fellow citizens to protect our forests</p>
      </div>

      <div className="community-navigation" role="tablist" aria-label="Community Sections">
        {TABS.map(tab => (
          <button
            key={tab}
            {...getTabProps(tab)}
            className={`nav-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            <i className={`icon-${
              tab === 'events' ? 'calendar' :
              tab === 'volunteer' ? 'users' : 'award'
            }`} aria-hidden="true"></i>
            <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          </button>
        ))}
      </div>

      <div className="community-content">
        {renderContent()}
      </div>

      {/* Skip link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
    </div>
  );
};

export default CommunityScreen;
