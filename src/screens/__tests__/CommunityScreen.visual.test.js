import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityScreen from '../CommunityScreen';
import useCommunity from '../../hooks/useCommunity';
import { getComputedStyle } from '../../test-utils';

// Mock the custom hooks
jest.mock('../../hooks/useCommunity');

// Mock window.getComputedStyle
window.getComputedStyle = getComputedStyle;

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

// Helper function to calculate contrast ratio
const getContrastRatio = (color1, color2) => {
  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const getRGB = (color) => {
    const hex = color.replace('#', '');
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16)
    };
  };

  const color1RGB = getRGB(color1);
  const color2RGB = getRGB(color2);

  const l1 = getLuminance(color1RGB.r, color1RGB.g, color1RGB.b);
  const l2 = getLuminance(color2RGB.r, color2RGB.g, color2RGB.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

describe('CommunityScreen Visual Accessibility', () => {
  beforeEach(() => {
    useCommunity.mockImplementation(() => ({
      ...mockData,
      loading: false,
      error: null,
      refreshEvents: jest.fn(),
      refreshAchievements: jest.fn()
    }));
  });

  describe('Color Contrast', () => {
    it('should meet WCAG AA contrast requirements for text', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const textElements = container.querySelectorAll('p, h1, h2, h3, span, button');
      textElements.forEach(element => {
        const style = window.getComputedStyle(element);
        const backgroundColor = style.backgroundColor;
        const color = style.color;
        const contrastRatio = getContrastRatio(backgroundColor, color);

        // WCAG AA requirements
        const fontSize = parseFloat(style.fontSize);
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && style.fontWeight >= 700);
        const requiredRatio = isLargeText ? 3 : 4.5;

        expect(contrastRatio).toBeGreaterThanOrEqual(
          requiredRatio,
          `Contrast ratio ${contrastRatio} is less than required ${requiredRatio} for element ${element.textContent}`
        );
      });
    });

    it('should maintain sufficient contrast for interactive elements', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const interactiveElements = container.querySelectorAll('button, a, [role="tab"]');
      interactiveElements.forEach(element => {
        const style = window.getComputedStyle(element);
        const backgroundColor = style.backgroundColor;
        const color = style.color;
        const contrastRatio = getContrastRatio(backgroundColor, color);

        expect(contrastRatio).toBeGreaterThanOrEqual(
          4.5,
          `Interactive element ${element.textContent} has insufficient contrast`
        );
      });
    });
  });

  describe('Focus Indicators', () => {
    it('should have visible focus indicators with sufficient contrast', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const focusableElements = container.querySelectorAll('button, a, [tabindex="0"]');
      focusableElements.forEach(element => {
        element.focus();
        const style = window.getComputedStyle(element);
        
        // Check outline visibility
        expect(style.outline).not.toBe('none');
        expect(style.outlineWidth).not.toBe('0px');

        // Check outline contrast
        const backgroundColor = style.backgroundColor;
        const outlineColor = style.outlineColor;
        const contrastRatio = getContrastRatio(backgroundColor, outlineColor);

        expect(contrastRatio).toBeGreaterThanOrEqual(
          3,
          `Focus indicator for ${element.textContent} has insufficient contrast`
        );
      });
    });
  });

  describe('Text Sizing', () => {
    it('should maintain readability when text is zoomed 200%', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      // Simulate 200% zoom
      const originalFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
      document.documentElement.style.fontSize = `${originalFontSize * 2}px`;

      const textElements = container.querySelectorAll('p, h1, h2, h3, span');
      textElements.forEach(element => {
        const style = window.getComputedStyle(element);
        
        // Check that text remains visible and doesn't overlap
        expect(style.overflow).not.toBe('hidden');
        expect(style.textOverflow).not.toBe('clip');
        expect(parseFloat(style.lineHeight)).toBeGreaterThan(1);
      });

      // Reset zoom
      document.documentElement.style.fontSize = `${originalFontSize}px`;
    });
  });

  describe('Visual Information', () => {
    it('should not rely solely on color to convey information', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const statusElements = container.querySelectorAll('[role="status"]');
      statusElements.forEach(element => {
        // Check for additional visual indicators beyond color
        const hasIcon = element.querySelector('i, svg');
        const hasText = element.textContent.length > 0;
        expect(hasIcon || hasText).toBe(true);
      });
    });

    it('should maintain spacing for touch targets', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const touchTargets = container.querySelectorAll('button, a, [role="button"]');
      touchTargets.forEach(element => {
        const style = window.getComputedStyle(element);
        const width = parseFloat(style.width);
        const height = parseFloat(style.height);
        
        // WCAG target size requirements
        expect(width).toBeGreaterThanOrEqual(44);
        expect(height).toBeGreaterThanOrEqual(44);
      });
    });
  });

  describe('Motion and Animation', () => {
    it('should respect reduced motion preferences', () => {
      // Mock prefers-reduced-motion media query
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));

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
});
