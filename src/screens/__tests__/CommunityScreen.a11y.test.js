import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityScreen from '../CommunityScreen';
import useCommunity from '../../hooks/useCommunity';
import {
  runAccessibilityTests,
  mockMatchMedia,
  checkFocusVisibility,
  checkTouchTargetSize,
  checkTextSpacing,
  simulateColorVision
} from '../../test-utils/accessibility-setup';

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('WCAG Compliance', () => {
    it('should pass axe accessibility tests', async () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );
      await runAccessibilityTests(container);
    });

    it('should maintain accessibility in different color vision modes', async () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const colorVisionTypes = ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'];

      for (const type of colorVisionTypes) {
        const removeFilter = simulateColorVision(type);
        await runAccessibilityTests(container);
        removeFilter();
      }
    });
  });

  describe('Focus Management', () => {
    it('should have visible focus indicators on all interactive elements', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const interactiveElements = container.querySelectorAll('button, a, [tabindex="0"]');
      interactiveElements.forEach(element => {
        element.focus();
        const focusState = checkFocusVisibility(element);
        expect(focusState.isVisible).toBe(true);
      });
    });

    it('should maintain focus order that matches visual order', async () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const focusableElements = screen.getAllByRole('button');
      const visualOrder = [...focusableElements].map(el => el.getBoundingClientRect().top);
      const isSorted = visualOrder.every((val, idx, arr) => !idx || arr[idx - 1] <= val);
      expect(isSorted).toBe(true);
    });
  });

  describe('Touch Targets', () => {
    it('should have appropriately sized touch targets', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const touchTargets = container.querySelectorAll('button, a, [role="button"]');
      touchTargets.forEach(element => {
        const size = checkTouchTargetSize(element);
        expect(size.meetsRequirement).toBe(true);
      });
    });
  });

  describe('Text Spacing', () => {
    it('should maintain readable text spacing', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const textElements = container.querySelectorAll('p, h1, h2, h3, span');
      textElements.forEach(element => {
        const spacing = checkTextSpacing(element);
        expect(spacing.meetsRequirement).toBe(true);
      });
    });
  });

  describe('Reduced Motion', () => {
    it('should respect reduced motion preferences', () => {
      mockMatchMedia(true);

      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const animatedElements = container.querySelectorAll('.animated, .transition');
      animatedElements.forEach(element => {
        const style = window.getComputedStyle(element);
        expect(style.animation).toBe('none');
        expect(style.transition).toBe('none');
      });
    });
  });

  describe('ARIA Attributes', () => {
    it('should have proper ARIA landmarks', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    });

    it('should have proper ARIA labels and descriptions', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const tabs = screen.getAllByRole('tab');
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-selected');
        expect(tab).toHaveAttribute('aria-controls');
      });

      const panels = screen.getAllByRole('tabpanel');
      panels.forEach(panel => {
        expect(panel).toHaveAttribute('aria-labelledby');
      });
    });
  });

  describe('Error States', () => {
    it('should announce errors appropriately', () => {
      useCommunity.mockImplementation(() => ({
        loading: false,
        error: 'Error loading community data',
        refreshEvents: jest.fn(),
        refreshAchievements: jest.fn()
      }));

      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Error loading community data');
      expect(errorMessage).toHaveAttribute('aria-live', 'assertive');
    });
  });
});
