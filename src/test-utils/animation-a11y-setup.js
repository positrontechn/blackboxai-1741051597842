// Animation and transition utilities for accessibility testing
const animationUtils = {
  // Animation controls utilities
  controls: {
    // Create animation controls container
    createAnimationControls() {
      const container = document.createElement('div');
      container.setAttribute('data-animation-controls', 'true');
      container.setAttribute('role', 'group');
      container.setAttribute('aria-label', 'Animation controls');
      
      const toggleButton = document.createElement('button');
      toggleButton.setAttribute('aria-label', 'Toggle animations');
      toggleButton.setAttribute('aria-pressed', 'true');
      
      const description = document.createElement('div');
      description.id = `animation-desc-${Date.now()}`;
      description.textContent = 'Enable or disable all animations';
      toggleButton.setAttribute('aria-describedby', description.id);
      
      container.appendChild(toggleButton);
      container.appendChild(description);
      return container;
    },

    // Create animation state announcement
    createAnimationAnnouncement(enabled) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Animations ${enabled ? 'enabled' : 'disabled'}`;
      return announcement;
    }
  },

  // Motion preference utilities
  preferences: {
    // Create motion preferences container
    createMotionPreferences() {
      const container = document.createElement('div');
      container.setAttribute('data-motion-preferences', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Motion preferences');
      
      ['default', 'reduced'].forEach(motion => {
        const option = document.createElement('div');
        option.setAttribute('role', 'radio');
        option.setAttribute('aria-checked', motion === 'default');
        option.setAttribute('aria-label', `${motion} motion`);
        container.appendChild(option);
      });
      
      return container;
    },

    // Create preference announcement
    createPreferenceAnnouncement(reduced) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Reduced motion ${reduced ? 'enabled' : 'disabled'}`;
      return announcement;
    }
  },

  // Transition state utilities
  transitions: {
    // Create transition states container
    createTransitionStates() {
      const container = document.createElement('div');
      container.setAttribute('data-transition-states', 'true');
      container.setAttribute('role', 'status');
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      
      ['entering', 'active', 'exiting'].forEach(state => {
        const element = document.createElement('div');
        element.setAttribute('data-transitioning', 'true');
        element.setAttribute('aria-hidden', state !== 'active');
        container.appendChild(element);
      });
      
      return container;
    },

    // Create transition announcement
    createTransitionAnnouncement() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Transition complete';
      return announcement;
    }
  },

  // Animation focus utilities
  focus: {
    // Create animation focus container
    createAnimationFocus() {
      const container = document.createElement('div');
      container.setAttribute('data-animation-focus', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Animated content');
      
      ['button', 'link', 'input'].forEach(type => {
        const element = document.createElement(type === 'input' ? 'input' : 'div');
        element.setAttribute('tabindex', '0');
        element.setAttribute('aria-label', `Animated ${type}`);
        container.appendChild(element);
      });
      
      return container;
    }
  },

  // Progress indicator utilities
  progress: {
    // Create animation progress container
    createAnimationProgress() {
      const container = document.createElement('div');
      container.setAttribute('data-animation-progress', 'true');
      container.setAttribute('role', 'progressbar');
      container.setAttribute('aria-valuemin', '0');
      container.setAttribute('aria-valuemax', '100');
      container.setAttribute('aria-valuenow', '0');
      container.setAttribute('aria-valuetext', 'Animation 0% complete');
      return container;
    },

    // Create progress announcement
    createProgressAnnouncement(progress) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Animation ${progress}% complete`;
      return announcement;
    }
  },

  // Animation error utilities
  errors: {
    // Create animation errors container
    createAnimationErrors() {
      const container = document.createElement('div');
      container.setAttribute('data-animation-errors', 'true');
      container.setAttribute('role', 'alert');
      container.setAttribute('aria-live', 'assertive');
      
      const message = document.createElement('div');
      message.setAttribute('role', 'status');
      message.setAttribute('aria-label', 'Animation error');
      
      container.appendChild(message);
      return container;
    },

    // Create error announcement
    createErrorAnnouncement(error) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.textContent = error;
      return announcement;
    }
  }
};

// Animation checkers
const animationCheckers = {
  // Check animation controls accessibility
  checkAnimationControls(element) {
    return {
      hasGroupRole: element.getAttribute('role') === 'group',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleButton: this.checkToggleButton(element.querySelector('button')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check toggle button accessibility
  checkToggleButton(button) {
    return button ? {
      hasLabel: !!button.getAttribute('aria-label'),
      hasPressedState: button.hasAttribute('aria-pressed'),
      hasDescription: !!button.getAttribute('aria-describedby')
    } : false;
  },

  // Check motion preferences accessibility
  checkMotionPreferences(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleOptions: Array.from(element.querySelectorAll('[role="radio"]')).every(option => 
        option.hasAttribute('aria-checked') && !!option.getAttribute('aria-label')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check transition states accessibility
  checkTransitionStates(element) {
    return {
      hasStatusRole: element.getAttribute('role') === 'status',
      hasLiveRegion: element.getAttribute('aria-live') === 'polite',
      isAtomic: element.getAttribute('aria-atomic') === 'true',
      hasAccessibleElements: Array.from(element.querySelectorAll('[data-transitioning]')).every(el => 
        el.hasAttribute('aria-hidden')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check animation focus accessibility
  checkAnimationFocus(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleElements: Array.from(element.querySelectorAll('[tabindex="0"]')).every(el => 
        !!el.getAttribute('aria-label')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check animation progress accessibility
  checkAnimationProgress(element) {
    return {
      hasProgressRole: element.getAttribute('role') === 'progressbar',
      hasValueRange: element.hasAttribute('aria-valuemin') && 
                    element.hasAttribute('aria-valuemax') &&
                    element.hasAttribute('aria-valuenow'),
      hasValueText: !!element.getAttribute('aria-valuetext'),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check animation errors accessibility
  checkAnimationErrors(element) {
    return {
      hasAlertRole: element.getAttribute('role') === 'alert',
      hasLiveRegion: element.getAttribute('aria-live') === 'assertive',
      hasAccessibleMessage: !!element.querySelector('[role="status"]')?.getAttribute('aria-label'),
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
  animationUtils,
  animationCheckers
};
