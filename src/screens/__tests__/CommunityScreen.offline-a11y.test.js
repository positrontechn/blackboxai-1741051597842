import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
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

describe('CommunityScreen Offline Accessibility', () => {
  beforeEach(() => {
    useCommunity.mockImplementation(() => ({
      ...mockData,
      loading: false,
      error: null,
      refreshEvents: jest.fn(),
      refreshAchievements: jest.fn()
    }));
  });

  describe('Offline Detection and Notification', () => {
    it('should announce when going offline', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      act(() => {
        window.dispatchEvent(new Event('offline'));
      });

      const offlineAlert = screen.getByRole('alert');
      expect(offlineAlert).toHaveTextContent(/offline/i);
      expect(offlineAlert).toHaveAttribute('aria-live', 'assertive');
    });

    it('should announce when coming back online', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      act(() => {
        window.dispatchEvent(new Event('online'));
      });

      const onlineAlert = screen.getByRole('alert');
      expect(onlineAlert).toHaveTextContent(/online/i);
      expect(onlineAlert).toHaveAttribute('aria-live', 'assertive');
    });
  });

  describe('Offline Content Availability', () => {
    it('should indicate which content is available offline', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const offlineElements = container.querySelectorAll('[data-offline-available]');
      offlineElements.forEach(element => {
        expect(element).toHaveAttribute('aria-label', expect.stringContaining('available offline'));
      });
    });

    it('should provide offline alternatives for interactive features', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const interactiveElements = container.querySelectorAll('button, [role="button"]');
      interactiveElements.forEach(element => {
        const offlineAction = element.getAttribute('data-offline-action');
        if (offlineAction === 'disabled') {
          expect(element).toHaveAttribute('aria-disabled', 'true');
          expect(element).toHaveAttribute('aria-label', expect.stringContaining('requires internet'));
        }
      });
    });
  });

  describe('Offline Data Synchronization', () => {
    it('should announce sync status accessibly', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const syncStatus = screen.getByRole('status');
      expect(syncStatus).toHaveAttribute('aria-live', 'polite');
      
      // Simulate sync
      act(() => {
        syncStatus.textContent = 'Syncing data...';
      });
      expect(syncStatus).toHaveTextContent(/syncing/i);
    });

    it('should indicate pending changes that need sync', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const pendingElements = screen.getAllByRole('listitem', { 
        name: /pending sync/i 
      });
      
      pendingElements.forEach(element => {
        expect(element).toHaveAttribute('aria-label', expect.stringContaining('will be synchronized'));
      });
    });
  });

  describe('Offline Form Handling', () => {
    it('should queue form submissions when offline', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const forms = document.querySelectorAll('form[data-offline-submit]');
      forms.forEach(form => {
        expect(form).toHaveAttribute('aria-description', expect.stringContaining('saved offline'));
      });
    });

    it('should provide feedback for queued actions', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      const feedback = screen.getByRole('status');
      expect(feedback).toHaveTextContent(/saved offline/i);
      expect(feedback).toHaveAttribute('aria-live', 'assertive');
    });
  });

  describe('Offline Error Handling', () => {
    it('should provide accessible error messages for offline-only features', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const onlineOnlyFeatures = document.querySelectorAll('[data-requires-connection]');
      onlineOnlyFeatures.forEach(feature => {
        fireEvent.click(feature);
        const errorMessage = screen.getByRole('alert');
        expect(errorMessage).toHaveTextContent(/requires internet/i);
        expect(errorMessage).toHaveAttribute('aria-live', 'assertive');
      });
    });

    it('should suggest offline alternatives when available', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const features = document.querySelectorAll('[data-offline-alternative]');
      features.forEach(feature => {
        expect(feature).toHaveAttribute(
          'aria-description',
          expect.stringContaining('offline alternative available')
        );
      });
    });
  });

  describe('Offline Navigation', () => {
    it('should indicate which routes are available offline', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const navigationLinks = screen.getAllByRole('link');
      navigationLinks.forEach(link => {
        const isOfflineAvailable = link.getAttribute('data-offline-available');
        if (isOfflineAvailable === 'true') {
          expect(link).toHaveAttribute('aria-label', expect.stringContaining('available offline'));
        } else {
          expect(link).toHaveAttribute('aria-label', expect.stringContaining('requires internet'));
        }
      });
    });

    it('should maintain focus when routes change offline', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        link.focus();
        fireEvent.click(link);
        
        // Focus should move to main content or error message
        const newFocus = document.activeElement;
        expect(newFocus).toHaveAttribute('role', expect.stringMatching(/main|alert/));
      });
    });
  });

  describe('Offline Performance', () => {
    it('should load cached images with fallbacks', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const images = document.querySelectorAll('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('data-offline-src');
        expect(img).toHaveAttribute('alt');
        
        // Simulate image load failure
        fireEvent.error(img);
        
        // Should show fallback
        expect(img.src).toContain('offline-placeholder');
      });
    });

    it('should prioritize critical offline content', () => {
      render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const criticalContent = document.querySelectorAll('[data-offline-priority="high"]');
      criticalContent.forEach(content => {
        expect(content).toHaveAttribute('data-cache-first', 'true');
      });
    });
  });
});
