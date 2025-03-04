import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import CommunityScreen from '../CommunityScreen';
import useCommunity from '../../hooks/useCommunity';

// Mock the custom hooks
jest.mock('../../hooks/useCommunity');

// Mock data
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

describe('CommunityScreen Accessibility', () => {
  beforeEach(() => {
    useCommunity.mockImplementation(() => ({
      ...mockData,
      loading: false,
      error: null,
      refreshEvents: jest.fn(),
      refreshAchievements: jest.fn()
    }));
  });

  it('should have no accessibility violations', async () => {
    const { container } = renderWithRouter(<CommunityScreen />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('Keyboard Navigation', () => {
    it('should allow tab navigation through all interactive elements', () => {
      renderWithRouter(<CommunityScreen />);
      const interactiveElements = screen.getAllByRole('button');
      interactiveElements.forEach(element => {
        element.focus();
        expect(document.activeElement).toBe(element);
      });
    });

    it('should have a visible focus indicator', () => {
      renderWithRouter(<CommunityScreen />);
      const firstTab = screen.getAllByRole('tab')[0];
      firstTab.focus();
      expect(document.activeElement).toBe(firstTab);
      expect(firstTab).toHaveStyle({ outline: expect.any(String) });
    });
  });

  describe('ARIA Attributes', () => {
    it('should have proper tab panel structure', () => {
      renderWithRouter(<CommunityScreen />);
      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveAttribute('aria-label', 'Community Sections');

      const tabs = screen.getAllByRole('tab');
      const panels = screen.getAllByRole('tabpanel');

      tabs.forEach((tab, index) => {
        expect(tab).toHaveAttribute('aria-selected');
        expect(tab).toHaveAttribute('aria-controls', `${mockData.events[index]?.type || 'events'}-panel`);
      });

      panels.forEach((panel, index) => {
        expect(panel).toHaveAttribute('aria-labelledby');
        expect(panel).toHaveAttribute('tabindex', '0');
      });
    });

    it('should have proper heading structure', () => {
      renderWithRouter(<CommunityScreen />);
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Community Hub');

      const subHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(subHeadings.length).toBeGreaterThan(0);
    });
  });

  describe('Error States', () => {
    it('should handle error states accessibly', () => {
      useCommunity.mockImplementation(() => ({
        loading: false,
        error: 'Error loading community data',
        refreshEvents: jest.fn(),
        refreshAchievements: jest.fn()
      }));

      renderWithRouter(<CommunityScreen />);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Error loading community data');
    });
  });

  describe('Loading States', () => {
    it('should indicate loading state accessibly', () => {
      useCommunity.mockImplementation(() => ({
        loading: true,
        error: null
      }));

      renderWithRouter(<CommunityScreen />);
      expect(screen.getByTestId('community-loading')).toHaveAttribute('aria-label');
    });
  });

  describe('Color Contrast', () => {
    it('should maintain sufficient color contrast', async () => {
      const { container } = renderWithRouter(<CommunityScreen />);
      const results = await axe(container);
      const contrastViolations = results.violations.filter(
        violation => violation.id === 'color-contrast'
      );
      expect(contrastViolations).toHaveLength(0);
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper alt text for images', () => {
      renderWithRouter(<CommunityScreen />);
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });

    it('should have proper button labels', () => {
      renderWithRouter(<CommunityScreen />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });
  });
});
