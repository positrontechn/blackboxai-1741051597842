import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityScreen from '../CommunityScreen';
import useCommunity from '../../hooks/useCommunity';
import { socialUtils, socialCheckers } from '../../test-utils/social-a11y-setup';

// Mock the custom hooks
jest.mock('../../hooks/useCommunity');

const mockData = {
  notifications: {
    unread: 3,
    categories: ['system', 'social', 'activity'],
    preferences: {
      email: true,
      push: true,
      inApp: true
    }
  },
  alerts: {
    priority: [],
    general: [],
    settings: []
  }
};

describe('CommunityScreen Notification Accessibility', () => {
  beforeEach(() => {
    useCommunity.mockImplementation(() => ({
      ...mockData,
      loading: false,
      error: null
    }));
  });

  describe('Notification Center', () => {
    it('should handle notification center accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showNotificationCenter={true} />
        </BrowserRouter>
      );

      // Check notification center container
      const centerContainer = container.querySelector('[data-notification-center]');
      expect(centerContainer).toHaveAttribute('role', 'region');
      expect(centerContainer).toHaveAttribute('aria-label', 'Notification center');

      // Check notification list
      const list = centerContainer.querySelector('[role="list"]');
      expect(list).toHaveAttribute('aria-label', 'Notifications');

      // Check notification items
      const items = list.querySelectorAll('[role="listitem"]');
      items.forEach(item => {
        expect(item).toHaveAttribute('aria-labelledby');
        expect(item).toHaveAttribute('aria-describedby');
      });
    });

    it('should announce new notifications', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showNotificationCenter={true} />
        </BrowserRouter>
      );

      // Simulate new notification
      fireEvent(window, new CustomEvent('newNotification', {
        detail: { type: 'social', message: 'New friend request' }
      }));

      // Check announcement
      const announcement = screen.getByRole('alert');
      expect(announcement).toHaveAttribute('aria-live', 'assertive');
      expect(announcement).toHaveTextContent(/new friend request/i);
    });
  });

  describe('Notification Badge', () => {
    it('should handle notification badges accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showNotificationBadges={true} />
        </BrowserRouter>
      );

      // Check badge container
      const badgeContainer = container.querySelector('[data-notification-badge]');
      expect(badgeContainer).toHaveAttribute('aria-label', 'Unread notifications');
      expect(badgeContainer).toHaveAttribute('role', 'status');
      expect(badgeContainer).toHaveAttribute('aria-live', 'polite');
      expect(badgeContainer).toHaveAttribute('aria-atomic', 'true');
    });

    it('should announce badge count updates', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showNotificationBadges={true} />
        </BrowserRouter>
      );

      // Update badge count
      fireEvent(window, new CustomEvent('badgeUpdate', { detail: { count: 5 } }));

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/5 unread notifications/i);
    });
  });

  describe('Notification Settings', () => {
    it('should handle notification settings accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showNotificationSettings={true} />
        </BrowserRouter>
      );

      // Check settings container
      const settingsContainer = container.querySelector('[data-notification-settings]');
      expect(settingsContainer).toHaveAttribute('role', 'region');
      expect(settingsContainer).toHaveAttribute('aria-label', 'Notification settings');

      // Check setting groups
      const groups = settingsContainer.querySelectorAll('[role="group"]');
      groups.forEach(group => {
        expect(group).toHaveAttribute('aria-labelledby');
        const label = document.getElementById(group.getAttribute('aria-labelledby'));
        expect(label).toHaveTextContent(/notification type/i);
      });

      // Check setting controls
      const controls = settingsContainer.querySelectorAll('[role="switch"]');
      controls.forEach(control => {
        expect(control).toHaveAttribute('aria-checked');
        expect(control).toHaveAttribute('aria-label');
      });
    });

    it('should announce settings changes', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showNotificationSettings={true} />
        </BrowserRouter>
      );

      // Toggle setting
      const toggle = screen.getByRole('switch', { name: /email notifications/i });
      fireEvent.click(toggle);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/email notifications (enabled|disabled)/i);
    });
  });

  describe('Priority Alerts', () => {
    it('should handle priority alerts accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showPriorityAlerts={true} />
        </BrowserRouter>
      );

      // Check alert container
      const alertContainer = container.querySelector('[data-priority-alerts]');
      expect(alertContainer).toHaveAttribute('role', 'alertdialog');
      expect(alertContainer).toHaveAttribute('aria-label', 'Priority alert');
      expect(alertContainer).toHaveAttribute('aria-modal', 'true');

      // Check alert actions
      const actions = alertContainer.querySelector('[role="group"]');
      expect(actions).toHaveAttribute('aria-label', 'Alert actions');
      
      const buttons = actions.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('should announce priority alerts immediately', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showPriorityAlerts={true} />
        </BrowserRouter>
      );

      // Trigger priority alert
      fireEvent(window, new CustomEvent('priorityAlert', {
        detail: { message: 'System maintenance required' }
      }));

      // Check announcement
      const announcement = screen.getByRole('alert');
      expect(announcement).toHaveAttribute('aria-live', 'assertive');
      expect(announcement).toHaveTextContent(/system maintenance/i);
    });
  });

  describe('Toast Notifications', () => {
    it('should handle toast notifications accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showToastNotifications={true} />
        </BrowserRouter>
      );

      // Check toast container
      const toastContainer = container.querySelector('[data-toast-notifications]');
      expect(toastContainer).toHaveAttribute('aria-label', 'Notifications');
      expect(toastContainer).toHaveAttribute('role', 'region');

      // Check individual toasts
      const toasts = toastContainer.querySelectorAll('[role="alert"]');
      toasts.forEach(toast => {
        expect(toast).toHaveAttribute('aria-live', 'polite');
        expect(toast).toHaveAttribute('aria-atomic', 'true');
      });
    });

    it('should handle toast dismissal accessibly', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showToastNotifications={true} />
        </BrowserRouter>
      );

      // Show and dismiss toast
      fireEvent(window, new CustomEvent('showToast', {
        detail: { message: 'Action completed' }
      }));

      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss notification');
      
      fireEvent.click(dismissButton);

      // Check dismissal announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/notification dismissed/i);
    });
  });

  describe('Notification Categories', () => {
    it('should handle notification filtering accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showNotificationFilters={true} />
        </BrowserRouter>
      );

      // Check filter container
      const filterContainer = container.querySelector('[data-notification-filters]');
      expect(filterContainer).toHaveAttribute('role', 'group');
      expect(filterContainer).toHaveAttribute('aria-label', 'Notification filters');

      // Check filter options
      const options = filterContainer.querySelectorAll('[role="radio"]');
      options.forEach(option => {
        expect(option).toHaveAttribute('aria-checked');
        expect(option).toHaveAttribute('aria-label');
      });
    });

    it('should announce filter changes', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showNotificationFilters={true} />
        </BrowserRouter>
      );

      // Change filter
      const filter = screen.getByRole('radio', { name: /social notifications/i });
      fireEvent.click(filter);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/showing social notifications/i);
    });
  });
});
