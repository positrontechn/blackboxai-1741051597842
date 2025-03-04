import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityScreen from '../CommunityScreen';
import useCommunity from '../../hooks/useCommunity';
import { mediaUtils, mediaCheckers } from '../../test-utils/media-a11y-setup';

// Mock the custom hooks
jest.mock('../../hooks/useCommunity');

const mockData = {
  errors: {
    current: null,
    history: [],
    types: ['network', 'validation', 'permission', 'server']
  },
  recovery: {
    options: ['retry', 'refresh', 'fallback'],
    automatic: true
  }
};

describe('CommunityScreen Error Accessibility', () => {
  beforeEach(() => {
    useCommunity.mockImplementation(() => ({
      ...mockData,
      loading: false,
      error: null
    }));
  });

  describe('Error Messages', () => {
    it('should handle error messages accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showErrorMessages={true} />
        </BrowserRouter>
      );

      // Check error container
      const errorContainer = container.querySelector('[data-error-messages]');
      expect(errorContainer).toHaveAttribute('role', 'alert');
      expect(errorContainer).toHaveAttribute('aria-live', 'assertive');
      expect(errorContainer).toHaveAttribute('aria-atomic', 'true');

      // Check error content
      const errorContent = errorContainer.querySelector('[role="status"]');
      expect(errorContent).toHaveAttribute('aria-label', 'Error details');
      expect(errorContent).toHaveAttribute('aria-describedby');
    });

    it('should announce error occurrences', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showErrorMessages={true} />
        </BrowserRouter>
      );

      // Trigger error
      fireEvent(window, new CustomEvent('error', {
        detail: { type: 'network', message: 'Connection failed' }
      }));

      // Check announcement
      const announcement = screen.getByRole('alert');
      expect(announcement).toHaveAttribute('aria-live', 'assertive');
      expect(announcement).toHaveTextContent(/connection failed/i);
    });
  });

  describe('Error Recovery', () => {
    it('should handle recovery options accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showErrorRecovery={true} />
        </BrowserRouter>
      );

      // Check recovery container
      const recoveryContainer = container.querySelector('[data-error-recovery]');
      expect(recoveryContainer).toHaveAttribute('role', 'region');
      expect(recoveryContainer).toHaveAttribute('aria-label', 'Error recovery options');

      // Check recovery buttons
      const buttons = recoveryContainer.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
        expect(button).toHaveAttribute('aria-describedby');
      });
    });

    it('should announce recovery attempts', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showErrorRecovery={true} />
        </BrowserRouter>
      );

      // Attempt recovery
      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/attempting to recover/i);
    });
  });

  describe('Error Boundaries', () => {
    it('should handle error boundaries accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showErrorBoundaries={true} />
        </BrowserRouter>
      );

      // Check boundary container
      const boundaryContainer = container.querySelector('[data-error-boundary]');
      expect(boundaryContainer).toHaveAttribute('role', 'alert');
      expect(boundaryContainer).toHaveAttribute('aria-label', 'Application error');

      // Check fallback UI
      const fallback = boundaryContainer.querySelector('[role="region"]');
      expect(fallback).toHaveAttribute('aria-label', 'Error fallback content');
      expect(fallback).toHaveAttribute('aria-describedby');
    });

    it('should announce boundary errors', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showErrorBoundaries={true} />
        </BrowserRouter>
      );

      // Trigger boundary error
      fireEvent(window, new CustomEvent('error', {
        detail: { boundary: true, message: 'Component crashed' }
      }));

      // Check announcement
      const announcement = screen.getByRole('alert');
      expect(announcement).toHaveAttribute('aria-live', 'assertive');
      expect(announcement).toHaveTextContent(/component crashed/i);
    });
  });

  describe('Validation Errors', () => {
    it('should handle validation errors accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showValidationErrors={true} />
        </BrowserRouter>
      );

      // Check validation container
      const validationContainer = container.querySelector('[data-validation-errors]');
      expect(validationContainer).toHaveAttribute('role', 'alert');
      expect(validationContainer).toHaveAttribute('aria-live', 'polite');

      // Check error list
      const errorList = validationContainer.querySelector('[role="list"]');
      expect(errorList).toHaveAttribute('aria-label', 'Validation errors');

      // Check error items
      const errors = errorList.querySelectorAll('[role="listitem"]');
      errors.forEach(error => {
        expect(error).toHaveAttribute('aria-labelledby');
        expect(error).toHaveAttribute('aria-describedby');
      });
    });

    it('should announce validation failures', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showValidationErrors={true} />
        </BrowserRouter>
      );

      // Trigger validation
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      // Check announcement
      const announcement = screen.getByRole('alert');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/validation failed/i);
    });
  });

  describe('Error Status', () => {
    it('should handle error status accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showErrorStatus={true} />
        </BrowserRouter>
      );

      // Check status container
      const statusContainer = container.querySelector('[data-error-status]');
      expect(statusContainer).toHaveAttribute('role', 'status');
      expect(statusContainer).toHaveAttribute('aria-live', 'polite');
      expect(statusContainer).toHaveAttribute('aria-atomic', 'true');

      // Check status details
      const details = statusContainer.querySelector('[role="region"]');
      expect(details).toHaveAttribute('aria-label', 'Error status details');
      expect(details).toHaveAttribute('aria-expanded', 'false');
    });

    it('should announce status changes', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showErrorStatus={true} />
        </BrowserRouter>
      );

      // Update status
      fireEvent(window, new CustomEvent('errorStatus', {
        detail: { status: 'resolved' }
      }));

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/error resolved/i);
    });
  });

  describe('Error History', () => {
    it('should handle error history accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showErrorHistory={true} />
        </BrowserRouter>
      );

      // Check history container
      const historyContainer = container.querySelector('[data-error-history]');
      expect(historyContainer).toHaveAttribute('role', 'region');
      expect(historyContainer).toHaveAttribute('aria-label', 'Error history');

      // Check history list
      const list = historyContainer.querySelector('[role="list"]');
      expect(list).toHaveAttribute('aria-label', 'Previous errors');

      // Check history items
      const items = list.querySelectorAll('[role="listitem"]');
      items.forEach(item => {
        expect(item).toHaveAttribute('aria-labelledby');
        expect(item).toHaveAttribute('aria-describedby');
      });
    });

    it('should announce history updates', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showErrorHistory={true} />
        </BrowserRouter>
      );

      // Add history entry
      fireEvent(window, new CustomEvent('errorHistory', {
        detail: { error: 'Previous network error' }
      }));

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/error added to history/i);
    });
  });
});
