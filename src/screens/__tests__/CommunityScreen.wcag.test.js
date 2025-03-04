import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import CommunityScreen from '../CommunityScreen';
import useCommunity from '../../hooks/useCommunity';

expect.extend(toHaveNoViolations);

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

describe('CommunityScreen WCAG Compliance', () => {
  beforeEach(() => {
    useCommunity.mockImplementation(() => ({
      ...mockData,
      loading: false,
      error: null,
      refreshEvents: jest.fn(),
      refreshAchievements: jest.fn()
    }));
  });

  describe('1. Perceivable', () => {
    it('should provide text alternatives for non-text content', () => {
      renderWithRouter(<CommunityScreen />);
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });

    it('should provide captions for multimedia content', () => {
      renderWithRouter(<CommunityScreen />);
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        expect(video).toHaveAttribute('aria-label');
        const captions = video.querySelector('track[kind="captions"]');
        expect(captions).toBeInTheDocument();
      });
    });

    it('should maintain content structure when styles are disabled', () => {
      const { container } = renderWithRouter(<CommunityScreen />);
      const mainContent = container.querySelector('main');
      expect(mainContent).toBeInTheDocument();
      expect(mainContent).toHaveAttribute('role', 'main');
    });

    it('should not rely solely on color to convey information', () => {
      renderWithRouter(<CommunityScreen />);
      const statusElements = screen.getAllByRole('status');
      statusElements.forEach(element => {
        const hasIcon = element.querySelector('i, svg');
        const hasText = element.textContent.length > 0;
        expect(hasIcon || hasText).toBe(true);
      });
    });
  });

  describe('2. Operable', () => {
    it('should be fully keyboard accessible', () => {
      renderWithRouter(<CommunityScreen />);
      const interactiveElements = screen.getAllByRole('button');
      interactiveElements.forEach(element => {
        element.focus();
        expect(document.activeElement).toBe(element);
      });
    });

    it('should have sufficient time to read content', () => {
      renderWithRouter(<CommunityScreen />);
      const notifications = screen.queryAllByRole('alert');
      notifications.forEach(notification => {
        expect(notification).toHaveAttribute('aria-live');
      });
    });

    it('should not contain content that flashes more than three times per second', () => {
      const { container } = renderWithRouter(<CommunityScreen />);
      const animatedElements = container.querySelectorAll('.animated, .transition');
      animatedElements.forEach(element => {
        const style = window.getComputedStyle(element);
        const animationDuration = parseFloat(style.animationDuration);
        expect(animationDuration).toBeGreaterThan(0.333); // 1/3 second
      });
    });

    it('should provide ways to help users navigate and find content', () => {
      renderWithRouter(<CommunityScreen />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByText(/skip to main content/i)).toBeInTheDocument();
    });
  });

  describe('3. Understandable', () => {
    it('should have readable text content', () => {
      const { container } = renderWithRouter(<CommunityScreen />);
      const textElements = container.querySelectorAll('p, h1, h2, h3, span');
      textElements.forEach(element => {
        const style = window.getComputedStyle(element);
        expect(parseFloat(style.lineHeight)).toBeGreaterThanOrEqual(1.5);
      });
    });

    it('should make pages appear and operate in predictable ways', () => {
      renderWithRouter(<CommunityScreen />);
      const tabs = screen.getAllByRole('tab');
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-selected');
        expect(tab).toHaveAttribute('aria-controls');
      });
    });

    it('should help users avoid and correct mistakes', () => {
      renderWithRouter(<CommunityScreen />);
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          expect(input).toHaveAttribute('aria-invalid');
          const errorId = input.getAttribute('aria-describedby');
          if (errorId) {
            expect(document.getElementById(errorId)).toBeInTheDocument();
          }
        });
      });
    });
  });

  describe('4. Robust', () => {
    it('should have valid ARIA attributes', async () => {
      const { container } = renderWithRouter(<CommunityScreen />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should maintain functionality across different viewports', () => {
      const { container } = renderWithRouter(<CommunityScreen />);
      const mainContent = container.querySelector('main');
      expect(mainContent).toHaveStyle({ maxWidth: '100%' });
    });
  });

  describe('Error States', () => {
    it('should handle errors accessibly', () => {
      useCommunity.mockImplementation(() => ({
        loading: false,
        error: 'Error loading community data',
        refreshEvents: jest.fn(),
        refreshAchievements: jest.fn()
      }));

      renderWithRouter(<CommunityScreen />);
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Error loading community data');
      expect(errorMessage).toHaveAttribute('aria-live', 'assertive');
    });
  });

  describe('Loading States', () => {
    it('should indicate loading state accessibly', () => {
      useCommunity.mockImplementation(() => ({
        loading: true,
        error: null
      }));

      renderWithRouter(<CommunityScreen />);
      const loadingIndicator = screen.getByRole('status');
      expect(loadingIndicator).toHaveAttribute('aria-busy', 'true');
    });
  });
});
