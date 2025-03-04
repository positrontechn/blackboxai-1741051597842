// Error handling utilities for accessibility testing
const errorUtils = {
  // Error message utilities
  messages: {
    // Create error message container
    createErrorMessages() {
      const container = document.createElement('div');
      container.setAttribute('data-error-messages', 'true');
      container.setAttribute('role', 'alert');
      container.setAttribute('aria-live', 'assertive');
      container.setAttribute('aria-atomic', 'true');
      
      const content = document.createElement('div');
      content.setAttribute('role', 'status');
      content.setAttribute('aria-label', 'Error details');
      
      const description = document.createElement('div');
      description.id = `error-desc-${Date.now()}`;
      description.textContent = 'Error description';
      content.setAttribute('aria-describedby', description.id);
      
      container.appendChild(content);
      container.appendChild(description);
      return container;
    },

    // Create error announcement
    createErrorAnnouncement(message) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.textContent = message;
      return announcement;
    }
  },

  // Recovery utilities
  recovery: {
    // Create error recovery container
    createErrorRecovery() {
      const container = document.createElement('div');
      container.setAttribute('data-error-recovery', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Error recovery options');
      
      ['retry', 'refresh', 'fallback'].forEach(action => {
        const button = document.createElement('button');
        button.setAttribute('aria-label', `${action} action`);
        
        const description = document.createElement('div');
        description.id = `recovery-desc-${Date.now()}`;
        description.textContent = `Attempt to recover using ${action}`;
        button.setAttribute('aria-describedby', description.id);
        
        container.appendChild(button);
        container.appendChild(description);
      });
      
      return container;
    },

    // Create recovery announcement
    createRecoveryAnnouncement(action) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Attempting to recover using ${action}`;
      return announcement;
    }
  },

  // Error boundary utilities
  boundary: {
    // Create error boundary container
    createErrorBoundary() {
      const container = document.createElement('div');
      container.setAttribute('data-error-boundary', 'true');
      container.setAttribute('role', 'alert');
      container.setAttribute('aria-label', 'Application error');
      
      const fallback = document.createElement('div');
      fallback.setAttribute('role', 'region');
      fallback.setAttribute('aria-label', 'Error fallback content');
      
      const description = document.createElement('div');
      description.id = `boundary-desc-${Date.now()}`;
      description.textContent = 'An error occurred in the application';
      fallback.setAttribute('aria-describedby', description.id);
      
      container.appendChild(fallback);
      container.appendChild(description);
      return container;
    },

    // Create boundary announcement
    createBoundaryAnnouncement(message) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.textContent = message;
      return announcement;
    }
  },

  // Validation utilities
  validation: {
    // Create validation errors container
    createValidationErrors() {
      const container = document.createElement('div');
      container.setAttribute('data-validation-errors', 'true');
      container.setAttribute('role', 'alert');
      container.setAttribute('aria-live', 'polite');
      
      const list = document.createElement('ul');
      list.setAttribute('role', 'list');
      list.setAttribute('aria-label', 'Validation errors');
      
      ['required', 'format', 'range'].forEach(type => {
        const item = document.createElement('li');
        item.setAttribute('role', 'listitem');
        
        const title = document.createElement('div');
        title.id = `validation-title-${Date.now()}`;
        title.textContent = `${type} error`;
        item.setAttribute('aria-labelledby', title.id);
        
        const description = document.createElement('div');
        description.id = `validation-desc-${Date.now()}`;
        description.textContent = `Description of ${type} error`;
        item.setAttribute('aria-describedby', description.id);
        
        list.appendChild(item);
      });
      
      container.appendChild(list);
      return container;
    },

    // Create validation announcement
    createValidationAnnouncement() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Validation failed';
      return announcement;
    }
  },

  // Error status utilities
  status: {
    // Create error status container
    createErrorStatus() {
      const container = document.createElement('div');
      container.setAttribute('data-error-status', 'true');
      container.setAttribute('role', 'status');
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      
      const details = document.createElement('div');
      details.setAttribute('role', 'region');
      details.setAttribute('aria-label', 'Error status details');
      details.setAttribute('aria-expanded', 'false');
      
      container.appendChild(details);
      return container;
    },

    // Create status announcement
    createStatusAnnouncement(status) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Error ${status}`;
      return announcement;
    }
  },

  // Error history utilities
  history: {
    // Create error history container
    createErrorHistory() {
      const container = document.createElement('div');
      container.setAttribute('data-error-history', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Error history');
      
      const list = document.createElement('ul');
      list.setAttribute('role', 'list');
      list.setAttribute('aria-label', 'Previous errors');
      
      ['network', 'validation', 'server'].forEach(type => {
        const item = document.createElement('li');
        item.setAttribute('role', 'listitem');
        
        const title = document.createElement('div');
        title.id = `history-title-${Date.now()}`;
        title.textContent = `Previous ${type} error`;
        item.setAttribute('aria-labelledby', title.id);
        
        const description = document.createElement('div');
        description.id = `history-desc-${Date.now()}`;
        description.textContent = `Details of previous ${type} error`;
        item.setAttribute('aria-describedby', description.id);
        
        list.appendChild(item);
      });
      
      container.appendChild(list);
      return container;
    },

    // Create history announcement
    createHistoryAnnouncement() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Error added to history';
      return announcement;
    }
  }
};

// Error checkers
const errorCheckers = {
  // Check error messages accessibility
  checkErrorMessages(element) {
    return {
      hasAlertRole: element.getAttribute('role') === 'alert',
      hasLiveRegion: element.getAttribute('aria-live') === 'assertive',
      isAtomic: element.getAttribute('aria-atomic') === 'true',
      hasAccessibleContent: this.checkErrorContent(element.querySelector('[role="status"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check error content accessibility
  checkErrorContent(content) {
    return content ? {
      hasStatusRole: content.getAttribute('role') === 'status',
      hasLabel: !!content.getAttribute('aria-label'),
      hasDescription: !!content.getAttribute('aria-describedby')
    } : false;
  },

  // Check error recovery accessibility
  checkErrorRecovery(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleButtons: Array.from(element.querySelectorAll('button')).every(button => 
        !!button.getAttribute('aria-label') && !!button.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check error boundary accessibility
  checkErrorBoundary(element) {
    return {
      hasAlertRole: element.getAttribute('role') === 'alert',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleFallback: this.checkFallback(element.querySelector('[role="region"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check fallback accessibility
  checkFallback(fallback) {
    return fallback ? {
      hasRegionRole: fallback.getAttribute('role') === 'region',
      hasLabel: !!fallback.getAttribute('aria-label'),
      hasDescription: !!fallback.getAttribute('aria-describedby')
    } : false;
  },

  // Check validation errors accessibility
  checkValidationErrors(element) {
    return {
      hasAlertRole: element.getAttribute('role') === 'alert',
      hasLiveRegion: element.getAttribute('aria-live') === 'polite',
      hasAccessibleList: this.checkErrorList(element.querySelector('[role="list"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check error list accessibility
  checkErrorList(list) {
    return list ? {
      hasListRole: list.getAttribute('role') === 'list',
      hasLabel: !!list.getAttribute('aria-label'),
      hasAccessibleItems: Array.from(list.querySelectorAll('[role="listitem"]')).every(item => 
        !!item.getAttribute('aria-labelledby') && !!item.getAttribute('aria-describedby')
      )
    } : false;
  },

  // Check error status accessibility
  checkErrorStatus(element) {
    return {
      hasStatusRole: element.getAttribute('role') === 'status',
      hasLiveRegion: element.getAttribute('aria-live') === 'polite',
      isAtomic: element.getAttribute('aria-atomic') === 'true',
      hasAccessibleDetails: this.checkStatusDetails(element.querySelector('[role="region"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check status details accessibility
  checkStatusDetails(details) {
    return details ? {
      hasRegionRole: details.getAttribute('role') === 'region',
      hasLabel: !!details.getAttribute('aria-label'),
      hasExpandedState: details.hasAttribute('aria-expanded')
    } : false;
  },

  // Check error history accessibility
  checkErrorHistory(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleList: this.checkHistoryList(element.querySelector('[role="list"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check history list accessibility
  checkHistoryList(list) {
    return list ? {
      hasListRole: list.getAttribute('role') === 'list',
      hasLabel: !!list.getAttribute('aria-label'),
      hasAccessibleItems: Array.from(list.querySelectorAll('[role="listitem"]')).every(item => 
        !!item.getAttribute('aria-labelledby') && !!item.getAttribute('aria-describedby')
      )
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
  errorUtils,
  errorCheckers
};
