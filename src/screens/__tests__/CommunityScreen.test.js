import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityScreen from '../CommunityScreen';
import useCommunity from '../../hooks/useCommunity';

// Mock the custom hook
jest.mock('../../hooks/useCommunity');

// Mock the child components
jest.mock('../../components/community/EventList', () => {
  return function MockEventList({ events }) {
    return <div data-testid="event-list">Events: {events.length}</div>;
  };
});

jest.mock('../../components/community/PlantingDayCard', () => {
  return function MockPlantingDayCard({ event }) {
    return <div data-testid="planting-day-card">{event.title}</div>;
  };
});

jest.mock('../../components/community/VolunteerOpportunities', () => {
  return function MockVolunteerOpportunities({ opportunities }) {
    return <div data-testid="volunteer-opportunities">Opportunities: {opportunities.length}</div>;
  };
});

jest.mock('../../components/community/CommunityAchievements', () => {
  return function MockCommunityAchievements({ achievements }) {
    return <div data-testid="community-achievements">Achievements</div>;
  };
});

const mockEvents = [
  { id: 1, title: 'Event 1', type: 'general' },
  { id: 2, title: 'Event 2', type: 'general' }
];

const mockFeaturedEvents = [
  { id: 3, title: 'Planting Day 1', type: 'planting' },
  { id: 4, title: 'Planting Day 2', type: 'planting' }
];

const mockVolunteerOpportunities = [
  { id: 5, title: 'Volunteer 1' },
  { id: 6, title: 'Volunteer 2' }
];

const mockAchievements = {
  totalEvents: 100,
  treesPlanted: 1000,
  volunteersActive: 50
};

describe('CommunityScreen', () => {
  beforeEach(() => {
    // Reset mock implementation before each test
    useCommunity.mockImplementation(() => ({
      events: mockEvents,
      featuredEvents: mockFeaturedEvents,
      volunteerOpportunities: mockVolunteerOpportunities,
      achievements: mockAchievements,
      loading: false,
      error: null,
      refreshEvents: jest.fn(),
      refreshAchievements: jest.fn()
    }));
  });

  it('renders loading animation when loading', () => {
    useCommunity.mockImplementation(() => ({
      loading: true,
      error: null
    }));

    render(
      <BrowserRouter>
        <CommunityScreen />
      </BrowserRouter>
    );

    expect(screen.getByTestId('community-loading')).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    const errorMessage = 'Failed to load community data';
    useCommunity.mockImplementation(() => ({
      loading: false,
      error: errorMessage
    }));

    render(
      <BrowserRouter>
        <CommunityScreen />
      </BrowserRouter>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders events tab by default', () => {
    render(
      <BrowserRouter>
        <CommunityScreen />
      </BrowserRouter>
    );

    expect(screen.getByTestId('event-list')).toBeInTheDocument();
    expect(screen.getByText('Events: 2')).toBeInTheDocument();
  });

  it('switches between tabs correctly', async () => {
    render(
      <BrowserRouter>
        <CommunityScreen />
      </BrowserRouter>
    );

    // Click volunteer tab
    fireEvent.click(screen.getByText('Volunteer'));
    await waitFor(() => {
      expect(screen.getByTestId('volunteer-opportunities')).toBeInTheDocument();
    });

    // Click achievements tab
    fireEvent.click(screen.getByText('Achievements'));
    await waitFor(() => {
      expect(screen.getByTestId('community-achievements')).toBeInTheDocument();
    });

    // Click events tab
    fireEvent.click(screen.getByText('Events'));
    await waitFor(() => {
      expect(screen.getByTestId('event-list')).toBeInTheDocument();
    });
  });

  it('renders featured planting days when available', () => {
    render(
      <BrowserRouter>
        <CommunityScreen />
      </BrowserRouter>
    );

    expect(screen.getByText('Featured Planting Days')).toBeInTheDocument();
    expect(screen.getAllByTestId('planting-day-card')).toHaveLength(2);
  });

  it('handles retry action when error occurs', async () => {
    const refreshEvents = jest.fn();
    const refreshAchievements = jest.fn();
    
    useCommunity.mockImplementation(() => ({
      loading: false,
      error: 'Error loading data',
      refreshEvents,
      refreshAchievements
    }));

    render(
      <BrowserRouter>
        <CommunityScreen />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Retry'));

    expect(refreshEvents).toHaveBeenCalled();
    expect(refreshAchievements).toHaveBeenCalled();
  });
});
