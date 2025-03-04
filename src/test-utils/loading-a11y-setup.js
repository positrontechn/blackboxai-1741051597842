// Loading state utilities for accessibility testing
const loadingUtils = {
  // Loading indicator utilities
  indicators: {
    // Create loading indicators container
    createLoadingIndicators() {
      const container = document.createElement('div');
      container.setAttribute('data-loading-indicators', 'true');
      container.setAttribute('role', 'alert');
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-busy', 'true');
      
      const progress = document.createElement('div');
      progress.setAttribute('role', 'progressbar');
      progress.setAttribute('aria-valuemin', '0');
      progress.setAttribute('aria-valuemax', '100');
      progress.setAttribute('aria-valuenow', '0');
      progress.setAttribute('aria-valuetext', '0% complete');
      
      container.appendChild(progress);
      return container;
    },

    // Create progress announcement
    createProgressAnnouncement(progress) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `${progress}% complete`;
      return announcement;
    }
  },

  // Skeleton loading utilities
  skeleton: {
    // Create skeleton loading container
    createSkeletonLoading() {
      const container = document.createElement('div');
      container.setAttribute('data-skeleton-loading', 'true');
      container.setAttribute('role', 'presentation');
      container.setAttribute('aria-label', 'Content loading');
      container.setAttribute('aria-hidden', 'true');
      container.setAttribute('data-reduced-motion', 'true');
      
      ['header', 'content', 'sidebar'].forEach(section => {
        const skeleton = document.createElement('div');
        skeleton.setAttribute('role', 'presentation');
        skeleton.setAttribute('aria-hidden', 'true');
        container.appendChild(skeleton);
      });
      
      return container;
    }
  },

  // Loading state utilities
  states: {
    // Create loading states container
    createLoadingStates() {
      const container = document.createElement('div');
      container.setAttribute('data-loading-states', 'true');
      container.setAttribute('role', 'status');
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      
      ['initial', 'content', 'media', 'data'].forEach(state => {
        const description = document.createElement('div');
        description.setAttribute('role', 'status');
        description.setAttribute('aria-label', `Loading ${state}`);
        container.appendChild(description);
      });
      
      return container;
    },

    // Create state announcement
    createStateAnnouncement(state) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Loading ${state}`;
      return announcement;
    }
  },

  // Loading overlay utilities
  overlay: {
    // Create loading overlay container
    createLoadingOverlay() {
      const container = document.createElement('div');
      container.setAttribute('data-loading-overlay', 'true');
      container.setAttribute('role', 'dialog');
      container.setAttribute('aria-modal', 'true');
      container.setAttribute('aria-label', 'Loading content');
      
      const content = document.createElement('div');
      content.setAttribute('role', 'status');
      content.setAttribute('aria-live', 'polite');
      content.setAttribute('aria-atomic', 'true');
      
      container.appendChild(content);
      return container;
    },

    // Create overlay announcement
    createOverlayAnnouncement(visible) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Loading overlay ${visible ? 'shown' : 'hidden'}`;
      return announcement;
    }
  },

  // Loading message utilities
  messages: {
    // Create loading messages container
    createLoadingMessages() {
      const container = document.createElement('div');
      container.setAttribute('data-loading-messages', 'true');
      container.setAttribute('role', 'log');
      container.setAttribute('aria-label', 'Loading progress messages');
      container.setAttribute('aria-live', 'polite');
      
      const list = document.createElement('ul');
      list.setAttribute('role', 'list');
      
      ['Initializing', 'Fetching data', 'Processing'].forEach(message => {
        const item = document.createElement('li');
        item.setAttribute('role', 'listitem');
        
        const title = document.createElement('div');
        title.id = `message-${Date.now()}`;
        title.textContent = message;
        item.setAttribute('aria-labelledby', title.id);
        
        list.appendChild(item);
      });
      
      container.appendChild(list);
      return container;
    },

    // Create message announcement
    createMessageAnnouncement(message) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = message;
      return announcement;
    }
  },

  // Loading error utilities
  errors: {
    // Create loading errors container
    createLoadingErrors() {
      const container = document.createElement('div');
      container.setAttribute('data-loading-errors', 'true');
      container.setAttribute('role', 'alert');
      container.setAttribute('aria-live', 'assertive');
      container.setAttribute('aria-atomic', 'true');
      
      const retryButton = document.createElement('button');
      retryButton.setAttribute('aria-label', 'Retry loading');
      
      const description = document.createElement('div');
      description.id = `retry-desc-${Date.now()}`;
      description.textContent = 'Attempt to load content again';
      retryButton.setAttribute('aria-describedby', description.id);
      
      container.appendChild(retryButton);
      container.appendChild(description);
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

// Loading checkers
const loadingCheckers = {
  // Check loading indicators accessibility
  checkLoadingIndicators(element) {
    return {
      hasAlertRole: element.getAttribute('role') === 'alert',
      hasLiveRegion: element.getAttribute('aria-live') === 'polite',
      hasBusyState: element.getAttribute('aria-busy') === 'true',
      hasAccessibleProgress: this.checkProgress(element.querySelector('[role="progressbar"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check progress accessibility
  checkProgress(progress) {
    return progress ? {
      hasProgressRole: progress.getAttribute('role') === 'progressbar',
      hasValueRange: progress.hasAttribute('aria-valuemin') && 
                    progress.hasAttribute('aria-valuemax') &&
                    progress.hasAttribute('aria-valuenow'),
      hasValueText: !!progress.getAttribute('aria-valuetext')
    } : false;
  },

  // Check skeleton loading accessibility
  checkSkeletonLoading(element) {
    return {
      hasPresentationRole: element.getAttribute('role') === 'presentation',
      hasLabel: !!element.getAttribute('aria-label'),
      isHidden: element.getAttribute('aria-hidden') === 'true',
      hasReducedMotion: element.hasAttribute('data-reduced-motion'),
      hasAccessibleSections: Array.from(element.children).every(section => 
        section.getAttribute('role') === 'presentation' &&
        section.getAttribute('aria-hidden') === 'true'
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check loading states accessibility
  checkLoadingStates(element) {
    return {
      hasStatusRole: element.getAttribute('role') === 'status',
      hasLiveRegion: element.getAttribute('aria-live') === 'polite',
      isAtomic: element.getAttribute('aria-atomic') === 'true',
      hasAccessibleDescriptions: Array.from(element.querySelectorAll('[role="status"]')).every(desc => 
        !!desc.getAttribute('aria-label')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check loading overlay accessibility
  checkLoadingOverlay(element) {
    return {
      hasDialogRole: element.getAttribute('role') === 'dialog',
      isModal: element.getAttribute('aria-modal') === 'true',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleContent: this.checkOverlayContent(element.querySelector('[role="status"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check overlay content accessibility
  checkOverlayContent(content) {
    return content ? {
      hasStatusRole: content.getAttribute('role') === 'status',
      hasLiveRegion: content.getAttribute('aria-live') === 'polite',
      isAtomic: content.getAttribute('aria-atomic') === 'true'
    } : false;
  },

  // Check loading messages accessibility
  checkLoadingMessages(element) {
    return {
      hasLogRole: element.getAttribute('role') === 'log',
      hasLabel: !!element.getAttribute('aria-label'),
      hasLiveRegion: element.getAttribute('aria-live') === 'polite',
      hasAccessibleList: Array.from(element.querySelectorAll('[role="listitem"]')).every(item => 
        !!item.getAttribute('aria-labelledby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check loading errors accessibility
  checkLoadingErrors(element) {
    return {
      hasAlertRole: element.getAttribute('role') === 'alert',
      hasLiveRegion: element.getAttribute('aria-live') === 'assertive',
      isAtomic: element.getAttribute('aria-atomic') === 'true',
      hasAccessibleRetry: this.checkRetryButton(element.querySelector('button')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check retry button accessibility
  checkRetryButton(button) {
    return button ? {
      hasLabel: !!button.getAttribute('aria-label'),
      hasDescription: !!button.getAttribute('aria-describedby')
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
  loadingUtils,
  loadingCheckers
};
