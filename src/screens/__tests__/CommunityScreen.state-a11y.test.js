import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityScreen from '../CommunityScreen';
import useCommunity from '../../hooks/useCommunity';
import { inputUtils, inputCheckers } from '../../test-utils/input-a11y-setup';

// Mock the custom hooks
jest.mock('../../hooks/useCommunity');

const mockData = {
  states: {
    loading: false,
    error: null,
    success: false,
    dirty: false,
    pristine: true
  },
  transitions: {
    inProgress: false,
    direction: null,
    duration: 300
  }
};

describe('CommunityScreen State Accessibility', () => {
  beforeEach(() => {
    useCommunity.mockImplementation(() => ({
      ...mockData,
      loading: false,
      error: null
    }));
  });

  describe('Loading States', () => {
    it('should handle loading states accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showLoadingStates={true} />
        </BrowserRouter>
      );

      // Check loading container
      const loadingContainer = container.querySelector('[data-loading-state]');
      expect(loadingContainer).toHaveAttribute('aria-busy', 'true');
      expect(loadingContainer).toHaveAttribute('role', 'status');
      expect(loadingContainer).toHaveAttribute('aria-live', 'polite');

      // Check loading indicators
      const indicators = loadingContainer.querySelectorAll('[role="progressbar"]');
      indicators.forEach(indicator => {
        expect(indicator).toHaveAttribute('aria-valuemin');
        expect(indicator).toHaveAttribute('aria-valuemax');
        expect(indicator).toHaveAttribute('aria-valuenow');
      });
    });

    it('should announce loading state changes', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showLoadingStates={true} />
        </BrowserRouter>
      );

      // Trigger loading state
      fireEvent(window, new CustomEvent('stateChange', { detail: { loading: true } }));

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/loading/i);
    });
  });

  describe('Error States', () => {
    it('should handle error states accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showErrorStates={true} />
        </BrowserRouter>
      );

      // Check error container
      const errorContainer = container.querySelector('[data-error-state]');
      expect(errorContainer).toHaveAttribute('role', 'alert');
      expect(errorContainer).toHaveAttribute('aria-live', 'assertive');

      // Check error actions
      const actions = errorContainer.querySelectorAll('[role="button"]');
      actions.forEach(action => {
        expect(action).toHaveAttribute('aria-label');
        expect(action).toHaveAttribute('aria-describedby');
      });
    });

    it('should provide accessible error recovery options', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showErrorStates={true} />
        </BrowserRouter>
      );

      // Check recovery options
      const recoveryOptions = screen.getAllByRole('button');
      recoveryOptions.forEach(option => {
        expect(option).toHaveAttribute('aria-label');
        const description = document.getElementById(option.getAttribute('aria-describedby'));
        expect(description).toHaveTextContent(/recovery action/i);
      });
    });
  });

  describe('Success States', () => {
    it('should handle success states accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showSuccessStates={true} />
        </BrowserRouter>
      );

      // Check success container
      const successContainer = container.querySelector('[data-success-state]');
      expect(successContainer).toHaveAttribute('role', 'status');
      expect(successContainer).toHaveAttribute('aria-live', 'polite');

      // Check success message
      const message = successContainer.querySelector('[role="status"]');
      expect(message).toHaveTextContent(/success/i);
    });

    it('should announce success state transitions', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showSuccessStates={true} />
        </BrowserRouter>
      );

      // Trigger success state
      fireEvent(window, new CustomEvent('stateChange', { detail: { success: true } }));

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/success/i);
    });
  });

  describe('Form States', () => {
    it('should handle form states accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showFormStates={true} />
        </BrowserRouter>
      );

      // Check form container
      const formContainer = container.querySelector('[data-form-state]');
      expect(formContainer).toHaveAttribute('role', 'form');
      expect(formContainer).toHaveAttribute('aria-label');

      // Check state indicators
      const indicators = formContainer.querySelectorAll('[data-state-indicator]');
      indicators.forEach(indicator => {
        expect(indicator).toHaveAttribute('aria-label');
        expect(indicator).toHaveAttribute('aria-live', 'polite');
      });
    });

    it('should announce form state changes', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showFormStates={true} />
        </BrowserRouter>
      );

      // Change form state
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/changes made/i);
    });
  });

  describe('Transition States', () => {
    it('should handle transition states accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showTransitionStates={true} />
        </BrowserRouter>
      );

      // Check transition container
      const transitionContainer = container.querySelector('[data-transition-state]');
      expect(transitionContainer).toHaveAttribute('aria-live', 'polite');
      expect(transitionContainer).toHaveAttribute('aria-atomic', 'true');

      // Check transition elements
      const elements = transitionContainer.querySelectorAll('[data-transitioning]');
      elements.forEach(element => {
        expect(element).toHaveAttribute('aria-hidden');
      });
    });

    it('should maintain accessibility during transitions', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showTransitionStates={true} />
        </BrowserRouter>
      );

      // Focus an element
      const element = screen.getByRole('button');
      element.focus();

      // Trigger transition
      fireEvent(window, new CustomEvent('transitionStart'));

      // Check focus maintenance
      expect(document.activeElement).toBe(element);
    });
  });

  describe('Async States', () => {
    it('should handle async states accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showAsyncStates={true} />
        </BrowserRouter>
      );

      // Check async container
      const asyncContainer = container.querySelector('[data-async-state]');
      expect(asyncContainer).toHaveAttribute('aria-busy');
      expect(asyncContainer).toHaveAttribute('role', 'region');
      expect(asyncContainer).toHaveAttribute('aria-label');

      // Check progress indicators
      const indicators = asyncContainer.querySelectorAll('[role="progressbar"]');
      indicators.forEach(indicator => {
        expect(indicator).toHaveAttribute('aria-valuenow');
        expect(indicator).toHaveAttribute('aria-valuetext');
      });
    });

    it('should announce async state completion', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showAsyncStates={true} />
        </BrowserRouter>
      );

      // Trigger async completion
      fireEvent(window, new CustomEvent('asyncComplete'));

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/complete/i);
    });
  });
});
