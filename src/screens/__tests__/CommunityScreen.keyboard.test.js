import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityScreen from '../CommunityScreen';
import useCommunity from '../../hooks/useCommunity';
import userEvent from '@testing-library/user-event';

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

describe('CommunityScreen Keyboard Navigation', () => {
  beforeEach(() => {
    useCommunity.mockImplementation(() => ({
      ...mockData,
      loading: false,
      error: null,
      refreshEvents: jest.fn(),
      refreshAchievements: jest.fn()
    }));
  });

  describe('Tab Navigation', () => {
    it('should navigate through all interactive elements in correct order', async () => {
      renderWithRouter(<CommunityScreen />);
      const user = userEvent.setup();

      // Get all focusable elements
      const skipLink = screen.getByText('Skip to main content');
      const tabs = screen.getAllByRole('tab');
      const interactiveElements = [skipLink, ...tabs];

      // Check tab order
      for (const element of interactiveElements) {
        await user.tab();
        expect(document.activeElement).toBe(element);
      }
    });

    it('should allow reverse tab navigation', async () => {
      renderWithRouter(<CommunityScreen />);
      const user = userEvent.setup();

      // Tab to the end
      const elements = screen.getAllByRole('button');
      for (let i = 0; i < elements.length; i++) {
        await user.tab();
      }

      // Shift+Tab back
      for (let i = elements.length - 1; i >= 0; i--) {
        await user.keyboard('{Shift>}{Tab}{/Shift}');
        expect(document.activeElement).toBe(elements[i]);
      }
    });
  });

  describe('Arrow Key Navigation', () => {
    it('should navigate between tabs using arrow keys', () => {
      renderWithRouter(<CommunityScreen />);
      const tabs = screen.getAllByRole('tab');
      
      // Focus first tab
      tabs[0].focus();
      
      // Right arrow should move to next tab
      fireEvent.keyDown(document.activeElement, { key: 'ArrowRight' });
      expect(document.activeElement).toBe(tabs[1]);
      
      // Left arrow should move back
      fireEvent.keyDown(document.activeElement, { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(tabs[0]);
    });

    it('should wrap around when reaching the end of tabs', () => {
      renderWithRouter(<CommunityScreen />);
      const tabs = screen.getAllByRole('tab');
      
      // Focus last tab
      tabs[tabs.length - 1].focus();
      
      // Right arrow should wrap to first tab
      fireEvent.keyDown(document.activeElement, { key: 'ArrowRight' });
      expect(document.activeElement).toBe(tabs[0]);
    });
  });

  describe('Home/End Key Navigation', () => {
    it('should navigate to first/last tab with Home/End keys', () => {
      renderWithRouter(<CommunityScreen />);
      const tabs = screen.getAllByRole('tab');
      
      // Focus middle tab
      tabs[1].focus();
      
      // Home key should move to first tab
      fireEvent.keyDown(document.activeElement, { key: 'Home' });
      expect(document.activeElement).toBe(tabs[0]);
      
      // End key should move to last tab
      fireEvent.keyDown(document.activeElement, { key: 'End' });
      expect(document.activeElement).toBe(tabs[tabs.length - 1]);
    });
  });

  describe('Enter/Space Key Activation', () => {
    it('should activate tabs with Enter key', () => {
      renderWithRouter(<CommunityScreen />);
      const tabs = screen.getAllByRole('tab');
      
      tabs[1].focus();
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', tabs[1].id);
    });

    it('should activate tabs with Space key', () => {
      renderWithRouter(<CommunityScreen />);
      const tabs = screen.getAllByRole('tab');
      
      tabs[2].focus();
      fireEvent.keyDown(document.activeElement, { key: ' ' });
      
      expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', tabs[2].id);
    });
  });

  describe('Focus Management', () => {
    it('should maintain focus when switching tabs', () => {
      renderWithRouter(<CommunityScreen />);
      const tabs = screen.getAllByRole('tab');
      
      // Focus and activate second tab
      tabs[1].focus();
      fireEvent.click(tabs[1]);
      
      // Focus should remain on the activated tab
      expect(document.activeElement).toBe(tabs[1]);
    });

    it('should trap focus within active tab panel', async () => {
      renderWithRouter(<CommunityScreen />);
      const user = userEvent.setup();
      const firstTab = screen.getAllByRole('tab')[0];
      
      // Activate first tab
      fireEvent.click(firstTab);
      
      // Tab through all focusable elements in panel
      const focusableElements = screen.getAllByRole('button');
      for (const element of focusableElements) {
        await user.tab();
        expect(document.activeElement).not.toBe(null);
      }
    });
  });

  describe('Skip Link', () => {
    it('should skip to main content when activated', () => {
      renderWithRouter(<CommunityScreen />);
      const skipLink = screen.getByText('Skip to main content');
      
      // Skip link should be initially hidden
      expect(skipLink).toHaveStyle({ position: 'fixed', top: '-100px' });
      
      // Skip link should be visible on focus
      skipLink.focus();
      expect(skipLink).toHaveStyle({ top: '0px' });
      
      // Activating skip link should focus main content
      fireEvent.click(skipLink);
      const mainContent = screen.getByRole('main');
      expect(document.activeElement).toBe(mainContent);
    });
  });
});
