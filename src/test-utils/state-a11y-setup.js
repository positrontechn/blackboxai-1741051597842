// State management utilities for accessibility testing
const stateUtils = {
  // Loading state utilities
  loading: {
    // Create loading container
    createLoadingContainer() {
      const container = document.createElement('div');
      container.setAttribute('data-loading-state', 'true');
      container.setAttribute('aria-busy', 'true');
      container.setAttribute('role', 'status');
      container.setAttribute('aria-live', 'polite');
      
      const progressBar = document.createElement('div');
      progressBar.setAttribute('role', 'progressbar');
      progressBar.setAttribute('aria-valuemin', '0');
      progressBar.setAttribute('aria-valuemax', '100');
      progressBar.setAttribute('aria-valuenow', '0');
      
      container.appendChild(progressBar);
      return container;
    },

    // Create loading announcement
    createLoadingAnnouncement(progress) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Loading${progress ? `: ${progress}%` : ''}`;
      return announcement;
    }
  },

  // Error state utilities
  error: {
    // Create error container
    createErrorContainer(error) {
      const container = document.createElement('div');
      container.setAttribute('data-error-state', 'true');
      container.setAttribute('role', 'alert');
      container.setAttribute('aria-live', 'assertive');
      
      const message = document.createElement('div');
      message.textContent = error.message;
      
      const actions = ['Retry', 'Cancel'].map(action => {
        const button = document.createElement('button');
        button.setAttribute('role', 'button');
        button.setAttribute('aria-label', action);
        
        const description = document.createElement('div');
        description.id = `error-action-${Date.now()}`;
        description.textContent = `${action} recovery action`;
        button.setAttribute('aria-describedby', description.id);
        
        return { button, description };
      });
      
      container.appendChild(message);
      actions.forEach(({ button, description }) => {
        container.appendChild(button);
        container.appendChild(description);
      });
      
      return container;
    }
  },

  // Success state utilities
  success: {
    // Create success container
    createSuccessContainer(message) {
      const container = document.createElement('div');
      container.setAttribute('data-success-state', 'true');
      container.setAttribute('role', 'status');
      container.setAttribute('aria-live', 'polite');
      
      const status = document.createElement('div');
      status.setAttribute('role', 'status');
      status.textContent = message || 'Operation successful';
      
      container.appendChild(status);
      return container;
    }
  },

  // Form state utilities
  form: {
    // Create form state container
    createFormContainer() {
      const container = document.createElement('form');
      container.setAttribute('data-form-state', 'true');
      container.setAttribute('role', 'form');
      container.setAttribute('aria-label', 'Form with state management');
      
      const indicator = document.createElement('div');
      indicator.setAttribute('data-state-indicator', 'true');
      indicator.setAttribute('aria-label', 'Form state');
      indicator.setAttribute('aria-live', 'polite');
      
      container.appendChild(indicator);
      return container;
    },

    // Create form state announcement
    createFormStateAnnouncement(state) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Form ${state}`;
      return announcement;
    }
  },

  // Transition state utilities
  transition: {
    // Create transition container
    createTransitionContainer() {
      const container = document.createElement('div');
      container.setAttribute('data-transition-state', 'true');
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      return container;
    },

    // Create transitioning element
    createTransitioningElement(visible) {
      const element = document.createElement('div');
      element.setAttribute('data-transitioning', 'true');
      element.setAttribute('aria-hidden', (!visible).toString());
      return element;
    }
  },

  // Async state utilities
  async: {
    // Create async container
    createAsyncContainer() {
      const container = document.createElement('div');
      container.setAttribute('data-async-state', 'true');
      container.setAttribute('aria-busy', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Asynchronous operation in progress');
      
      const progress = document.createElement('div');
      progress.setAttribute('role', 'progressbar');
      progress.setAttribute('aria-valuenow', '0');
      progress.setAttribute('aria-valuetext', 'Operation in progress');
      
      container.appendChild(progress);
      return container;
    },

    // Create async completion announcement
    createAsyncCompletionAnnouncement() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Operation complete';
      return announcement;
    }
  }
};

// State checkers
const stateCheckers = {
  // Check loading state accessibility
  checkLoadingState(element) {
    return {
      hasBusyState: element.getAttribute('aria-busy') === 'true',
      hasStatusRole: element.getAttribute('role') === 'status',
      hasLiveRegion: element.getAttribute('aria-live') === 'polite',
      hasAccessibleProgress: this.checkProgressBar(element.querySelector('[role="progressbar"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check progress bar accessibility
  checkProgressBar(progressBar) {
    return progressBar ? {
      hasValueRange: progressBar.hasAttribute('aria-valuemin') && 
                     progressBar.hasAttribute('aria-valuemax'),
      hasCurrentValue: progressBar.hasAttribute('aria-valuenow')
    } : false;
  },

  // Check error state accessibility
  checkErrorState(element) {
    return {
      hasAlertRole: element.getAttribute('role') === 'alert',
      hasLiveRegion: element.getAttribute('aria-live') === 'assertive',
      hasAccessibleActions: Array.from(element.querySelectorAll('[role="button"]')).every(button => 
        !!button.getAttribute('aria-label') && !!button.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check success state accessibility
  checkSuccessState(element) {
    return {
      hasStatusRole: element.getAttribute('role') === 'status',
      hasLiveRegion: element.getAttribute('aria-live') === 'polite',
      hasStatusMessage: !!element.querySelector('[role="status"]'),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check form state accessibility
  checkFormState(element) {
    return {
      hasFormRole: element.getAttribute('role') === 'form',
      hasLabel: !!element.getAttribute('aria-label'),
      hasStateIndicator: this.checkStateIndicator(element.querySelector('[data-state-indicator]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check state indicator accessibility
  checkStateIndicator(indicator) {
    return indicator ? {
      hasLabel: !!indicator.getAttribute('aria-label'),
      hasLiveRegion: indicator.getAttribute('aria-live') === 'polite'
    } : false;
  },

  // Check transition state accessibility
  checkTransitionState(element) {
    return {
      hasLiveRegion: element.getAttribute('aria-live') === 'polite',
      isAtomic: element.getAttribute('aria-atomic') === 'true',
      hasAccessibleElements: Array.from(element.querySelectorAll('[data-transitioning]')).every(el => 
        el.hasAttribute('aria-hidden')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check async state accessibility
  checkAsyncState(element) {
    return {
      hasBusyState: element.getAttribute('aria-busy') === 'true',
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleProgress: this.checkAsyncProgress(element.querySelector('[role="progressbar"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check async progress accessibility
  checkAsyncProgress(progress) {
    return progress ? {
      hasCurrentValue: progress.hasAttribute('aria-valuenow'),
      hasValueText: progress.hasAttribute('aria-valuetext')
    } : false;
  },

  // Check general accessibility
  checkAccessibility(element) {
    return {
      hasAriaLabel: !!element.getAttribute('aria-label') || !!element.getAttribute('aria-labelledby'),
      hasAriaDescription: !!element.getAttribute('aria-describedby'),
      maintainsFocus: document.activeElement !== document.body
    };
  }
};

export {
  stateUtils,
  stateCheckers
};
