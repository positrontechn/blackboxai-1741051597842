import React from 'react';
import { render, screen } from '@testing-library/react';
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

describe('CommunityScreen WCAG 2.1 Compliance', () => {
  beforeEach(() => {
    useCommunity.mockImplementation(() => ({
      ...mockData,
      loading: false,
      error: null,
      refreshEvents: jest.fn(),
      refreshAchievements: jest.fn()
    }));
  });

  describe('Principle 1: Perceivable', () => {
    describe('1.1 Text Alternatives', () => {
      it('should provide text alternatives for all non-text content (1.1.1)', async () => {
        const { container } = render(
          <BrowserRouter>
            <CommunityScreen />
          </BrowserRouter>
        );

        const textAlternatives = wcagUtils.getTextAlternatives(container);
        textAlternatives.forEach(({ element, alt, ariaLabel, ariaLabelledby }) => {
          expect(wcagCheckers.hasTextAlternative(element)).toBe(true);
        });
      });
    });

    describe('1.3 Adaptable', () => {
      it('should present content in a meaningful sequence (1.3.2)', () => {
        const { container } = render(
          <BrowserRouter>
            <CommunityScreen />
          </BrowserRouter>
        );

        const headingStructure = wcagUtils.getHeadingStructure(container);
        let previousLevel = 0;

        headingStructure.forEach(({ level }) => {
          // Headings should not skip levels going down
          if (previousLevel !== 0) {
            expect(level - previousLevel).toBeLessThanOrEqual(1);
          }
          previousLevel = level;
        });
      });

      it('should use semantic markup for structure (1.3.1)', () => {
        const { container } = render(
          <BrowserRouter>
            <CommunityScreen />
          </BrowserRouter>
        );

        const landmarks = wcagUtils.getLandmarks(container);
        expect(landmarks.length).toBeGreaterThan(0);

        // Check for proper list markup
        const lists = container.querySelectorAll('ul, ol');
        lists.forEach(list => {
          expect(Array.from(list.children).every(child => child.tagName === 'LI')).toBe(true);
        });
      });
    });

    describe('1.4 Distinguishable', () => {
      it('should have sufficient color contrast (1.4.3)', () => {
        const { container } = render(
          <BrowserRouter>
            <CommunityScreen />
          </BrowserRouter>
        );

        const textElements = container.querySelectorAll('p, h1, h2, h3, span, button');
        textElements.forEach(element => {
          const style = window.getComputedStyle(element);
          expect(
            wcagCheckers.hasAdequateContrast(style.color, style.backgroundColor)
          ).toBe(true);
        });
      });

      it('should be readable when text is resized up to 200% (1.4.4)', () => {
        const { container } = render(
          <BrowserRouter>
            <CommunityScreen />
          </BrowserRouter>
        );

        const textElements = container.querySelectorAll('p, h1, h2, h3, span');
        textElements.forEach(element => {
          const style = window.getComputedStyle(element);
          expect(style.maxHeight).not.toBe('none');
          expect(style.overflow).not.toBe('hidden');
        });
      });
    });
  });

  describe('Principle 2: Operable', () => {
    describe('2.1 Keyboard Accessible', () => {
      it('should be fully operable through keyboard (2.1.1)', () => {
        const { container } = render(
          <BrowserRouter>
            <CommunityScreen />
          </BrowserRouter>
        );

        const interactiveElements = wcagUtils.getFocusableElements(container);
        interactiveElements.forEach(element => {
          expect(wcagCheckers.isKeyboardAccessible(element)).toBe(true);
        });
      });

      it('should have no keyboard traps (2.1.2)', () => {
        const { container } = render(
          <BrowserRouter>
            <CommunityScreen />
          </BrowserRouter>
        );

        const focusableElements = Array.from(wcagUtils.getFocusableElements(container));
        focusableElements.forEach((element, index) => {
          element.focus();
          expect(document.activeElement).toBe(element);
          
          // Should be able to move focus away
          const nextElement = focusableElements[(index + 1) % focusableElements.length];
          nextElement.focus();
          expect(document.activeElement).toBe(nextElement);
        });
      });
    });

    describe('2.4 Navigable', () => {
      it('should have descriptive page title and headings (2.4.2)', () => {
        render(
          <BrowserRouter>
            <CommunityScreen />
          </BrowserRouter>
        );

        const mainHeading = screen.getByRole('heading', { level: 1 });
        expect(mainHeading).toHaveTextContent(/community/i);
      });

      it('should have a logical focus order (2.4.3)', () => {
        const { container } = render(
          <BrowserRouter>
            <CommunityScreen />
          </BrowserRouter>
        );

        const focusableElements = Array.from(wcagUtils.getFocusableElements(container));
        expect(wcagCheckers.hasLogicalFocusOrder(focusableElements)).toBe(true);
      });

      it('should have visible focus indicators (2.4.7)', () => {
        const { container } = render(
          <BrowserRouter>
            <CommunityScreen />
          </BrowserRouter>
        );

        const focusableElements = wcagUtils.getFocusableElements(container);
        focusableElements.forEach(element => {
          element.focus();
          const style = window.getComputedStyle(element);
          expect(style.outline || style.boxShadow).not.toBe('none');
        });
      });
    });
  });

  describe('Principle 3: Understandable', () => {
    describe('3.2 Predictable', () => {
      it('should have consistent navigation (3.2.3)', () => {
        const { container } = render(
          <BrowserRouter>
            <CommunityScreen />
          </BrowserRouter>
        );

        const navigation = container.querySelector('[role="navigation"]');
        expect(navigation).toBeInTheDocument();
      });
    });

    describe('3.3 Input Assistance', () => {
      it('should identify errors in forms (3.3.1)', () => {
        const { container } = render(
          <BrowserRouter>
            <CommunityScreen />
          </BrowserRouter>
        );

        const forms = container.querySelectorAll('form');
        forms.forEach(form => {
          expect(wcagCheckers.hasErrorIdentification(form)).toBe(true);
        });
      });
    });
  });

  describe('Principle 4: Robust', () => {
    describe('4.1 Compatible', () => {
      it('should have valid ARIA attributes (4.1.2)', () => {
        const { container } = render(
          <BrowserRouter>
            <CommunityScreen />
          </BrowserRouter>
        );

        const elementsWithRoles = container.querySelectorAll('[role]');
        elementsWithRoles.forEach(element => {
          expect(wcagCheckers.hasValidARIA(element)).toBe(true);
        });
      });
    });
  });

  describe('Loading and Error States', () => {
    it('should announce loading state accessibly', () => {
      useCommunity.mockImplementation(() => ({
        loading: true,
        error: null
      }));

      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const loadingElement = screen.getByRole('status');
      expect(loadingElement).toHaveAttribute('aria-busy', 'true');
    });

    it('should announce errors accessibly', () => {
      useCommunity.mockImplementation(() => ({
        loading: false,
        error: 'Error loading community data'
      }));

      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Error loading community data');
    });
  });
});
