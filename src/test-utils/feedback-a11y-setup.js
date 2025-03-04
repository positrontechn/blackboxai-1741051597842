// Feedback and user response utilities for accessibility testing
const feedbackUtils = {
  // Feedback form utilities
  form: {
    // Create feedback form container
    createFeedbackForm() {
      const container = document.createElement('div');
      container.setAttribute('data-feedback-form', 'true');
      container.setAttribute('role', 'form');
      container.setAttribute('aria-label', 'Submit feedback');
      
      const fields = [
        { type: 'text', name: 'title', label: 'Feedback title' },
        { type: 'select', name: 'type', label: 'Feedback type' },
        { type: 'textarea', name: 'description', label: 'Feedback description' }
      ];
      
      fields.forEach(field => {
        const input = document.createElement(field.type === 'textarea' ? 'textarea' : field.type === 'select' ? 'select' : 'input');
        input.setAttribute('type', field.type === 'text' ? 'text' : undefined);
        input.setAttribute('aria-label', field.label);
        
        const description = document.createElement('div');
        description.id = `field-desc-${Date.now()}`;
        description.textContent = `Enter ${field.label.toLowerCase()}`;
        input.setAttribute('aria-describedby', description.id);
        
        container.appendChild(input);
        container.appendChild(description);
      });
      
      return container;
    },

    // Create submission announcement
    createSubmissionAnnouncement() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Feedback submitted successfully';
      return announcement;
    }
  },

  // Category selection utilities
  category: {
    // Create category selection container
    createCategorySelection() {
      const container = document.createElement('div');
      container.setAttribute('data-category-selection', 'true');
      container.setAttribute('role', 'radiogroup');
      container.setAttribute('aria-label', 'Feedback category');
      
      ['usability', 'accessibility', 'content'].forEach(category => {
        const option = document.createElement('div');
        option.setAttribute('role', 'radio');
        option.setAttribute('aria-checked', 'false');
        
        const description = document.createElement('div');
        description.id = `category-desc-${Date.now()}`;
        description.textContent = `${category} related feedback`;
        option.setAttribute('aria-describedby', description.id);
        
        container.appendChild(option);
        container.appendChild(description);
      });
      
      return container;
    },

    // Create category announcement
    createCategoryAnnouncement(category) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `${category} category selected`;
      return announcement;
    }
  },

  // Response management utilities
  response: {
    // Create response management container
    createResponseManagement() {
      const container = document.createElement('div');
      container.setAttribute('data-response-management', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Response management');
      
      const list = document.createElement('ul');
      list.setAttribute('role', 'list');
      list.setAttribute('aria-label', 'Feedback responses');
      
      ['pending', 'in-progress', 'completed'].forEach(status => {
        const item = document.createElement('li');
        item.setAttribute('role', 'listitem');
        
        const title = document.createElement('div');
        title.id = `response-title-${Date.now()}`;
        title.textContent = `Feedback response`;
        item.setAttribute('aria-labelledby', title.id);
        
        const status = document.createElement('div');
        status.id = `response-status-${Date.now()}`;
        status.textContent = `Status: ${status}`;
        item.setAttribute('aria-describedby', status.id);
        
        list.appendChild(item);
      });
      
      container.appendChild(list);
      return container;
    },

    // Create response update announcement
    createResponseAnnouncement(status) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Response updated to ${status}`;
      return announcement;
    }
  },

  // Status tracking utilities
  status: {
    // Create status tracking container
    createStatusTracking() {
      const container = document.createElement('div');
      container.setAttribute('data-status-tracking', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Feedback status');
      
      ['open', 'in-progress', 'resolved'].forEach(status => {
        const indicator = document.createElement('div');
        indicator.setAttribute('role', 'status');
        indicator.setAttribute('aria-live', 'polite');
        indicator.setAttribute('aria-atomic', 'true');
        indicator.textContent = `Status: ${status}`;
        container.appendChild(indicator);
      });
      
      return container;
    },

    // Create status change announcement
    createStatusAnnouncement(status) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.textContent = `Status changed to ${status}`;
      return announcement;
    }
  },

  // Follow-up utilities
  followUp: {
    // Create follow-up container
    createFollowUpControls() {
      const container = document.createElement('div');
      container.setAttribute('data-follow-up', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Follow-up management');
      
      const form = document.createElement('form');
      form.setAttribute('aria-label', 'Follow-up message');
      
      const textarea = document.createElement('textarea');
      textarea.setAttribute('aria-label', 'Follow-up message');
      
      const description = document.createElement('div');
      description.id = `followup-desc-${Date.now()}`;
      description.textContent = 'Enter your follow-up message';
      textarea.setAttribute('aria-describedby', description.id);
      
      form.appendChild(textarea);
      form.appendChild(description);
      container.appendChild(form);
      
      return container;
    },

    // Create follow-up announcement
    createFollowUpAnnouncement() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Follow-up message sent';
      return announcement;
    }
  },

  // Survey utilities
  survey: {
    // Create satisfaction survey container
    createSatisfactionSurvey() {
      const container = document.createElement('div');
      container.setAttribute('data-satisfaction-survey', 'true');
      container.setAttribute('role', 'form');
      container.setAttribute('aria-label', 'Satisfaction survey');
      
      // Rating options
      const ratings = [1, 2, 3, 4, 5].map(rating => {
        const option = document.createElement('div');
        option.setAttribute('role', 'radio');
        option.setAttribute('aria-checked', 'false');
        option.setAttribute('aria-label', `Rate ${rating} out of 5`);
        return option;
      });
      
      // Comment section
      const comment = document.createElement('textarea');
      comment.setAttribute('aria-label', 'Additional comments');
      
      const description = document.createElement('div');
      description.id = `comment-desc-${Date.now()}`;
      description.textContent = 'Share any additional feedback';
      comment.setAttribute('aria-describedby', description.id);
      
      ratings.forEach(rating => container.appendChild(rating));
      container.appendChild(comment);
      container.appendChild(description);
      
      return container;
    },

    // Create survey completion announcement
    createSurveyAnnouncement() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Survey completed successfully';
      return announcement;
    }
  }
};

// Feedback checkers
const feedbackCheckers = {
  // Check feedback form accessibility
  checkFeedbackForm(element) {
    return {
      hasFormRole: element.getAttribute('role') === 'form',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleFields: Array.from(element.querySelectorAll('input, textarea, select')).every(field => 
        !!field.getAttribute('aria-label') && !!field.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check category selection accessibility
  checkCategorySelection(element) {
    return {
      hasRadiogroupRole: element.getAttribute('role') === 'radiogroup',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleOptions: Array.from(element.querySelectorAll('[role="radio"]')).every(option => 
        option.hasAttribute('aria-checked') && !!option.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check response management accessibility
  checkResponseManagement(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleList: this.checkResponseList(element.querySelector('[role="list"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check response list accessibility
  checkResponseList(list) {
    return list ? {
      hasListRole: list.getAttribute('role') === 'list',
      hasLabel: !!list.getAttribute('aria-label'),
      hasAccessibleItems: Array.from(list.querySelectorAll('[role="listitem"]')).every(item => 
        !!item.getAttribute('aria-labelledby') && !!item.getAttribute('aria-describedby')
      )
    } : false;
  },

  // Check status tracking accessibility
  checkStatusTracking(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleIndicators: Array.from(element.querySelectorAll('[role="status"]')).every(indicator => 
        indicator.getAttribute('aria-live') === 'polite' && 
        indicator.getAttribute('aria-atomic') === 'true'
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check follow-up controls accessibility
  checkFollowUpControls(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleForm: this.checkFollowUpForm(element.querySelector('form')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check follow-up form accessibility
  checkFollowUpForm(form) {
    return form ? {
      hasLabel: !!form.getAttribute('aria-label'),
      hasAccessibleTextarea: !!form.querySelector('textarea')?.getAttribute('aria-label') && 
                           !!form.querySelector('textarea')?.getAttribute('aria-describedby')
    } : false;
  },

  // Check satisfaction survey accessibility
  checkSatisfactionSurvey(element) {
    return {
      hasFormRole: element.getAttribute('role') === 'form',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleRatings: Array.from(element.querySelectorAll('[role="radio"]')).every(rating => 
        rating.hasAttribute('aria-checked') && !!rating.getAttribute('aria-label')
      ),
      hasAccessibleComment: !!element.querySelector('textarea')?.getAttribute('aria-label') && 
                          !!element.querySelector('textarea')?.getAttribute('aria-describedby'),
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
  feedbackUtils,
  feedbackCheckers
};
