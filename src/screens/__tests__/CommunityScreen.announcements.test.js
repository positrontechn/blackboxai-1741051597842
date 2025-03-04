import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityScreen from '../CommunityScreen';
import useCommunity from '../../hooks/useCommunity';

// Mock the custom hooks
jest.mock('../../hooks/useCommunity');

const mockData = {
  events: [
    { id: '1', title: 'Event 1', type: 'general' },
    { id: '2', title: 'Event 2', type: 'general' }
  ],
  featuredEvents: [
    { id: '3', title: 'Planting Day 1', type: 'planting' },
    { id: '4', title: 'Planting Day 2', type: 'planting' }
  ],
  volunteerOpportunities: [
    { id: '5', title: 'Volunteer 1' },
    { id: '6', title: 'Volunteer 2' }
  ],
  achievements: {
    totalEvents: 100,
    treesPlanted: 1000,
    volunteersActive: 50
  }
};

const renderWithRouter = (ui) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('CommunityScreen Screen Reader Announcements', () => {
  beforeEach(() => {
    useCommunity.mockImplementation(() => ({
      ...mockData,
      loading: false,
      error: null,
      refreshEvents: jest.fn(),
      refreshAchievements: jest.fn()
    }));
  });

  describe('Loading States', () => {
    it('should announce when content is loading', () => {
      useCommunity.mockImplementation(() => ({
        ...mockData,
        loading: true,
        error: null
      }));

      renderWithRouter(<CommunityScreen />);
      
      const loadingMessage = screen.getByRole('alert');
      expect(loadingMessage).toHaveAttribute('aria-live', 'polite');
      expect(loadingMessage).toHaveTextContent(/loading/i);
    });

    it('should announce when content has loaded', () => {
      const { rerender } = renderWithRouter(<CommunityScreen />);
      
      // Simulate loading completion
      act(() => {
        useCommunity.mockImplementation(() => ({
          ...mockData,
          loading: false,
          error: null
        }));
        rerender(<CommunityScreen />);
      });

      const statusMessage = screen.getByRole('status');
      expect(statusMessage).toHaveAttribute('aria-live', 'polite');
      expect(statusMessage).toHaveTextContent(/content loaded/i);
    });
  });

  describe('Tab Panel Updates', () => {
    it('should announce tab panel changes', () => {
      renderWithRouter(<CommunityScreen />);
      
      const tabs = screen.getAllByRole('tab');
      fireEvent.click(tabs[1]);

      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/volunteer opportunities/i);
    });

    it('should announce number of items in new tab panel', () => {
      renderWithRouter(<CommunityScreen />);
      
      const tabs = screen.getAllByRole('tab');
      fireEvent.click(tabs[1]);

      const announcement = screen.getByRole('status');
      expect(announcement).toHaveTextContent(/showing.*opportunities/i);
    });
  });

  describe('Error States', () => {
    it('should announce error messages', () => {
      useCommunity.mockImplementation(() => ({
        ...mockData,
        loading: false,
        error: 'Failed to load community data'
      }));

      renderWithRouter(<CommunityScreen />);
      
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'assertive');
      expect(errorMessage).toHaveTextContent(/failed to load/i);
    });

    it('should announce when errors are resolved', () => {
      const { rerender } = renderWithRouter(<CommunityScreen />);
      
      // Simulate error resolution
      act(() => {
        useCommunity.mockImplementation(() => ({
          ...mockData,
          loading: false,
          error: null
        }));
        rerender(<CommunityScreen />);
      });

      const statusMessage = screen.getByRole('status');
      expect(statusMessage).toHaveAttribute('aria-live', 'polite');
      expect(statusMessage).toHaveTextContent(/content loaded successfully/i);
    });
  });

  describe('Dynamic Content Updates', () => {
    it('should announce new events when they appear', () => {
      const { rerender } = renderWithRouter(<CommunityScreen />);
      
      // Simulate new event addition
      act(() => {
        useCommunity.mockImplementation(() => ({
          ...mockData,
          events: [...mockData.events, { id: '7', title: 'New Event', type: 'general' }],
          loading: false,
          error: null
        }));
        rerender(<CommunityScreen />);
      });

      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/new event added/i);
    });

    it('should announce achievement updates', () => {
      const { rerender } = renderWithRouter(<CommunityScreen />);
      
      // Simulate achievement update
      act(() => {
        useCommunity.mockImplementation(() => ({
          ...mockData,
          achievements: {
            ...mockData.achievements,
            treesPlanted: 1001
          },
          loading: false,
          error: null
        }));
        rerender(<CommunityScreen />);
      });

      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/achievement updated/i);
    });
  });

  describe('Interactive Elements', () => {
    it('should announce button states', () => {
      renderWithRouter(<CommunityScreen />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-pressed');
      });
    });

    it('should announce expanded/collapsed states', () => {
      renderWithRouter(<CommunityScreen />);
      
      const expandableElements = screen.getAllByRole('button', { expanded: false });
      expandableElements.forEach(element => {
        fireEvent.click(element);
        expect(element).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Progress Updates', () => {
    it('should announce loading progress', () => {
      renderWithRouter(<CommunityScreen />);
      
      const progressIndicator = screen.getByRole('progressbar');
      expect(progressIndicator).toHaveAttribute('aria-valuemin', '0');
      expect(progressIndicator).toHaveAttribute('aria-valuemax', '100');
      expect(progressIndicator).toHaveAttribute('aria-valuenow');
    });

    it('should announce completion of operations', () => {
      renderWithRouter(<CommunityScreen />);
      
      const completionMessage = screen.getByRole('status');
      expect(completionMessage).toHaveAttribute('aria-live', 'polite');
      expect(completionMessage).toHaveTextContent(/completed/i);
    });
  });
});
