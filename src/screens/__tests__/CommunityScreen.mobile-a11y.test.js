import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityScreen from '../CommunityScreen';
import useCommunity from '../../hooks/useCommunity';
import { wcagCheckers, wcagUtils } from '../../test-utils/wcag-setup';

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

describe('CommunityScreen Mobile Accessibility', () => {
  beforeEach(() => {
    useCommunity.mockImplementation(() => ({
      ...mockData,
      loading: false,
      error: null,
      refreshEvents: jest.fn(),
      refreshAchievements: jest.fn()
    }));

    // Mock viewport for mobile device
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375 // iPhone SE width
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667 // iPhone SE height
    });

    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
  });

  describe('Touch Targets', () => {
    it('should have touch targets at least 44x44px', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const touchTargets = container.querySelectorAll('button, a, [role="button"]');
      touchTargets.forEach(target => {
        const rect = target.getBoundingClientRect();
        expect(rect.width).toBeGreaterThanOrEqual(44);
        expect(rect.height).toBeGreaterThanOrEqual(44);
      });
    });

    it('should have adequate spacing between touch targets', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const touchTargets = Array.from(container.querySelectorAll('button, a, [role="button"]'));
      touchTargets.forEach((target, index) => {
        const rect1 = target.getBoundingClientRect();
        touchTargets.slice(index + 1).forEach(otherTarget => {
          const rect2 = otherTarget.getBoundingClientRect();
          const horizontalGap = Math.abs(rect1.left - rect2.right);
          const verticalGap = Math.abs(rect1.top - rect2.bottom);
          
          // Minimum 8px gap between targets
          if (horizontalGap > 0) expect(horizontalGap).toBeGreaterThanOrEqual(8);
          if (verticalGap > 0) expect(verticalGap).toBeGreaterThanOrEqual(8);
        });
      });
    });
  });

  describe('Gestures', () => {
    it('should support touch gestures with accessible alternatives', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const swipeableElements = container.querySelectorAll('[role="tabpanel"]');
      swipeableElements.forEach(element => {
        // Check for button alternatives to swipe gestures
        const prevButton = element.querySelector('[aria-label*="previous"]');
        const nextButton = element.querySelector('[aria-label*="next"]');
        expect(prevButton || nextButton).toBeTruthy();
      });
    });

    it('should handle pinch-to-zoom appropriately', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const viewport = document.querySelector('meta[name="viewport"]');
      expect(viewport).toHaveAttribute(
        'content',
        expect.not.stringContaining('user-scalable=no')
      );
    });
  });

  describe('Orientation', () => {
    it('should adapt layout for different orientations', () => {
      const { container, rerender } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      // Test portrait mode
      window.innerWidth = 375;
      window.innerHeight = 667;
      window.dispatchEvent(new Event('resize'));
      rerender(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const portraitLayout = container.innerHTML;

      // Test landscape mode
      window.innerWidth = 667;
      window.innerHeight = 375;
      window.dispatchEvent(new Event('resize'));
      rerender(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const landscapeLayout = container.innerHTML;
      expect(portraitLayout).not.toBe(landscapeLayout);
    });

    it('should not restrict orientation', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const viewport = document.querySelector('meta[name="viewport"]');
      expect(viewport).toHaveAttribute(
        'content',
        expect.not.stringContaining('orientation=')
      );
    });
  });

  describe('Mobile Form Inputs', () => {
    it('should use appropriate input types for mobile', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        const type = input.getAttribute('type');
        expect(['text', 'email', 'tel', 'number', 'date', 'time']).toContain(type);
      });
    });

    it('should position form elements for thumb reach', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const formElements = container.querySelectorAll('input, select, textarea');
      formElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        // Check if element is within thumb-friendly zone
        expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight - 44);
      });
    });
  });

  describe('Mobile Performance', () => {
    it('should lazy load images appropriately', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const images = container.querySelectorAll('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });

    it('should use appropriate image sizes for mobile', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const images = container.querySelectorAll('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('srcset');
        // Check if smallest image is appropriate for mobile
        const sources = img.getAttribute('srcset').split(',');
        const smallestSize = parseInt(sources[0].split(' ')[1]);
        expect(smallestSize).toBeLessThanOrEqual(window.innerWidth);
      });
    });
  });

  describe('Mobile-specific ARIA', () => {
    it('should announce changes in view appropriately', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const liveRegions = screen.getAllByRole('status');
      liveRegions.forEach(region => {
        expect(region).toHaveAttribute('aria-live', 'polite');
      });
    });

    it('should handle mobile navigation patterns accessibly', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label');
      
      const menuButton = screen.queryByRole('button', { name: /menu/i });
      if (menuButton) {
        expect(menuButton).toHaveAttribute('aria-expanded');
        expect(menuButton).toHaveAttribute('aria-controls');
      }
    });
  });
});
