// Input and form control utilities for accessibility testing
const inputUtils = {
  // Form control utilities
  form: {
    // Create form controls container
    createFormControls() {
      const container = document.createElement('div');
      container.setAttribute('data-form-controls', 'true');
      container.setAttribute('role', 'form');
      container.setAttribute('aria-label', 'Input form');
      
      ['text', 'number', 'date', 'select'].forEach(type => {
        const field = document.createElement(type === 'select' ? 'select' : 'input');
        if (type !== 'select') {
          field.setAttribute('type', type);
        }
        field.setAttribute('aria-label', `${type} input`);
        field.setAttribute('aria-required', 'true');
        field.setAttribute('aria-invalid', 'false');
        
        const description = document.createElement('div');
        description.id = `input-desc-${Date.now()}`;
        description.textContent = `Enter ${type} value`;
        field.setAttribute('aria-describedby', description.id);
        
        container.appendChild(field);
        container.appendChild(description);
      });
      
      return container;
    },

    // Create validation announcement
    createValidationAnnouncement(errors) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.textContent = 'Validation errors found';
      return announcement;
    }
  },

  // Input feedback utilities
  feedback: {
    // Create input feedback container
    createInputFeedback() {
      const container = document.createElement('div');
      container.setAttribute('data-input-feedback', 'true');
      container.setAttribute('role', 'status');
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      
      ['success', 'warning', 'error'].forEach(type => {
        const message = document.createElement('div');
        message.setAttribute('role', 'status');
        message.setAttribute('aria-label', `${type} feedback`);
        container.appendChild(message);
      });
      
      return container;
    },

    // Create feedback announcement
    createFeedbackAnnouncement(status) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Input accepted';
      return announcement;
    }
  },

  // Input assistance utilities
  assistance: {
    // Create input assistance container
    createInputAssistance() {
      const container = document.createElement('div');
      container.setAttribute('data-input-assistance', 'true');
      container.setAttribute('role', 'complementary');
      container.setAttribute('aria-label', 'Input assistance');
      
      const tooltip = document.createElement('div');
      tooltip.setAttribute('role', 'tooltip');
      tooltip.id = `assistance-${Date.now()}`;
      tooltip.setAttribute('aria-hidden', 'true');
      
      container.appendChild(tooltip);
      return container;
    },

    // Create assistance announcement
    createAssistanceAnnouncement() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Help text available';
      return announcement;
    }
  },

  // Error state utilities
  errors: {
    // Create error states container
    createErrorStates() {
      const container = document.createElement('div');
      container.setAttribute('data-error-states', 'true');
      container.setAttribute('role', 'alert');
      container.setAttribute('aria-live', 'assertive');
      
      ['required', 'format', 'length'].forEach(type => {
        const message = document.createElement('div');
        message.setAttribute('role', 'alert');
        message.setAttribute('aria-label', `${type} error`);
        
        const description = document.createElement('div');
        description.id = `error-desc-${Date.now()}`;
        description.textContent = `${type} validation failed`;
        message.setAttribute('aria-describedby', description.id);
        
        container.appendChild(message);
        container.appendChild(description);
      });
      
      return container;
    },

    // Create error announcement
    createErrorAnnouncement() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.textContent = 'Required field';
      return announcement;
    }
  },

  // Input group utilities
  groups: {
    // Create input groups container
    createInputGroups() {
      const container = document.createElement('div');
      container.setAttribute('data-input-groups', 'true');
      container.setAttribute('role', 'group');
      container.setAttribute('aria-label', 'Input group');
      
      ['personal', 'contact', 'preferences'].forEach(section => {
        const group = document.createElement('div');
        group.setAttribute('role', 'group');
        
        const label = document.createElement('div');
        label.id = `group-label-${Date.now()}`;
        label.textContent = `${section} information`;
        group.setAttribute('aria-labelledby', label.id);
        
        container.appendChild(label);
        container.appendChild(group);
      });
      
      return container;
    },

    // Create group interaction announcement
    createGroupAnnouncement() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Group focused';
      return announcement;
    }
  }
};

// Input checkers
const inputCheckers = {
  // Check form controls accessibility
  checkFormControls(element) {
    return {
      hasFormRole: element.getAttribute('role') === 'form',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleFields: Array.from(element.querySelectorAll('input, select')).every(field => 
        !!field.getAttribute('aria-label') &&
        field.hasAttribute('aria-required') &&
        field.hasAttribute('aria-invalid') &&
        !!field.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check input feedback accessibility
  checkInputFeedback(element) {
    return {
      hasStatusRole: element.getAttribute('role') === 'status',
      hasLiveRegion: element.getAttribute('aria-live') === 'polite',
      isAtomic: element.getAttribute('aria-atomic') === 'true',
      hasAccessibleMessages: Array.from(element.querySelectorAll('[role="status"]')).every(message => 
        !!message.getAttribute('aria-label')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check input assistance accessibility
  checkInputAssistance(element) {
    return {
      hasComplementaryRole: element.getAttribute('role') === 'complementary',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleTooltip: this.checkTooltip(element.querySelector('[role="tooltip"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check tooltip accessibility
  checkTooltip(tooltip) {
    return tooltip ? {
      hasTooltipRole: tooltip.getAttribute('role') === 'tooltip',
      hasId: !!tooltip.id,
      hasHiddenState: tooltip.hasAttribute('aria-hidden')
    } : false;
  },

  // Check error states accessibility
  checkErrorStates(element) {
    return {
      hasAlertRole: element.getAttribute('role') === 'alert',
      hasLiveRegion: element.getAttribute('aria-live') === 'assertive',
      hasAccessibleMessages: Array.from(element.querySelectorAll('[role="alert"]')).every(message => 
        !!message.getAttribute('aria-label') && !!message.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check input groups accessibility
  checkInputGroups(element) {
    return {
      hasGroupRole: element.getAttribute('role') === 'group',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleGroups: Array.from(element.querySelectorAll('[role="group"]')).every(group => 
        !!group.getAttribute('aria-labelledby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
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
  inputUtils,
  inputCheckers
};
