// Data protection and GDPR utilities for accessibility testing
const dataProtectionUtils = {
  // Data subject rights utilities
  rights: {
    // Create rights controls container
    createRightsControls() {
      const container = document.createElement('div');
      container.setAttribute('data-rights-controls', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Data subject rights');
      
      ['access', 'rectification', 'erasure', 'portability'].forEach(right => {
        const button = document.createElement('button');
        button.setAttribute('role', 'button');
        button.setAttribute('aria-label', `Request ${right} right`);
        
        const description = document.createElement('div');
        description.id = `right-desc-${Date.now()}`;
        description.textContent = `Exercise your right to ${right}`;
        button.setAttribute('aria-describedby', description.id);
        
        container.appendChild(button);
        container.appendChild(description);
      });
      
      return container;
    },

    // Create rights request announcement
    createRightsAnnouncement(right) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `${right} request submitted`;
      return announcement;
    }
  },

  // Processing purposes utilities
  purposes: {
    // Create processing purposes container
    createProcessingPurposes() {
      const container = document.createElement('div');
      container.setAttribute('data-processing-purposes', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Data processing purposes');
      
      ['service', 'analytics', 'marketing'].forEach(purpose => {
        const group = document.createElement('div');
        group.setAttribute('role', 'group');
        
        const title = document.createElement('div');
        title.id = `purpose-title-${Date.now()}`;
        title.textContent = `${purpose} processing purpose`;
        group.setAttribute('aria-labelledby', title.id);
        
        const explanation = document.createElement('div');
        explanation.setAttribute('role', 'region');
        explanation.setAttribute('aria-label', `${purpose} purpose explanation`);
        
        const description = document.createElement('div');
        description.id = `purpose-desc-${Date.now()}`;
        description.textContent = `How your data is used for ${purpose}`;
        explanation.setAttribute('aria-describedby', description.id);
        
        container.appendChild(title);
        container.appendChild(group);
        container.appendChild(explanation);
      });
      
      return container;
    }
  },

  // Legal basis utilities
  legalBasis: {
    // Create legal basis controls
    createLegalBasisControls() {
      const container = document.createElement('div');
      container.setAttribute('data-legal-basis', 'true');
      container.setAttribute('role', 'radiogroup');
      container.setAttribute('aria-label', 'Legal basis for processing');
      
      ['consent', 'contract', 'legal-obligation'].forEach(basis => {
        const option = document.createElement('div');
        option.setAttribute('role', 'radio');
        option.setAttribute('aria-checked', basis === 'consent');
        
        const description = document.createElement('div');
        description.id = `basis-desc-${Date.now()}`;
        description.textContent = `Processing based on ${basis}`;
        option.setAttribute('aria-describedby', description.id);
        
        container.appendChild(option);
        container.appendChild(description);
      });
      
      return container;
    },

    // Create legal basis announcement
    createBasisAnnouncement(basis) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Legal basis changed to ${basis}`;
      return announcement;
    }
  },

  // Request management utilities
  requests: {
    // Create request management container
    createRequestManagement() {
      const container = document.createElement('div');
      container.setAttribute('data-request-management', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Data request management');
      
      const list = document.createElement('ul');
      list.setAttribute('role', 'list');
      list.setAttribute('aria-label', 'Data requests');
      
      ['access', 'deletion'].forEach(type => {
        const item = document.createElement('li');
        item.setAttribute('role', 'listitem');
        
        const title = document.createElement('div');
        title.id = `request-title-${Date.now()}`;
        title.textContent = `${type} request`;
        item.setAttribute('aria-labelledby', title.id);
        
        const status = document.createElement('div');
        status.id = `request-status-${Date.now()}`;
        status.textContent = 'Pending';
        item.setAttribute('aria-describedby', status.id);
        
        list.appendChild(item);
      });
      
      container.appendChild(list);
      return container;
    },

    // Create request status announcement
    createRequestAnnouncement(type, status) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `${type} request ${status}`;
      return announcement;
    }
  },

  // Processing records utilities
  records: {
    // Create processing records container
    createProcessingRecords() {
      const container = document.createElement('div');
      container.setAttribute('data-processing-records', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Data processing records');
      
      ['collection', 'usage', 'sharing'].forEach(activity => {
        const record = document.createElement('article');
        record.setAttribute('role', 'article');
        
        const title = document.createElement('div');
        title.id = `record-title-${Date.now()}`;
        title.textContent = `${activity} record`;
        record.setAttribute('aria-labelledby', title.id);
        
        const details = document.createElement('div');
        details.id = `record-details-${Date.now()}`;
        details.textContent = `Details of ${activity}`;
        record.setAttribute('aria-describedby', details.id);
        
        container.appendChild(record);
      });
      
      return container;
    }
  },

  // DPO contact utilities
  dpoContact: {
    // Create DPO contact container
    createDPOContact() {
      const container = document.createElement('div');
      container.setAttribute('data-dpo-contact', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Contact Data Protection Officer');
      
      const form = document.createElement('form');
      form.setAttribute('aria-label', 'DPO contact form');
      
      ['subject', 'message'].forEach(field => {
        const input = document.createElement(field === 'message' ? 'textarea' : 'input');
        input.setAttribute('aria-label', `${field}`);
        
        const description = document.createElement('div');
        description.id = `field-desc-${Date.now()}`;
        description.textContent = `Enter your ${field}`;
        input.setAttribute('aria-describedby', description.id);
        
        form.appendChild(input);
        form.appendChild(description);
      });
      
      container.appendChild(form);
      return container;
    },

    // Create message submission announcement
    createSubmissionAnnouncement() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Message sent to DPO';
      return announcement;
    }
  }
};

// Data protection checkers
const dataProtectionCheckers = {
  // Check rights controls accessibility
  checkRightsControls(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleButtons: Array.from(element.querySelectorAll('[role="button"]')).every(button => 
        !!button.getAttribute('aria-label') && !!button.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check processing purposes accessibility
  checkProcessingPurposes(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleGroups: Array.from(element.querySelectorAll('[role="group"]')).every(group => 
        !!group.getAttribute('aria-labelledby')
      ),
      hasAccessibleExplanations: Array.from(element.querySelectorAll('[role="region"]')).every(explanation => 
        !!explanation.getAttribute('aria-label') && !!explanation.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check legal basis controls accessibility
  checkLegalBasisControls(element) {
    return {
      hasRadiogroupRole: element.getAttribute('role') === 'radiogroup',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleOptions: Array.from(element.querySelectorAll('[role="radio"]')).every(option => 
        option.hasAttribute('aria-checked') && !!option.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check request management accessibility
  checkRequestManagement(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleList: this.checkRequestList(element.querySelector('[role="list"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check request list accessibility
  checkRequestList(list) {
    return list ? {
      hasListRole: list.getAttribute('role') === 'list',
      hasLabel: !!list.getAttribute('aria-label'),
      hasAccessibleItems: Array.from(list.querySelectorAll('[role="listitem"]')).every(item => 
        !!item.getAttribute('aria-labelledby') && !!item.getAttribute('aria-describedby')
      )
    } : false;
  },

  // Check processing records accessibility
  checkProcessingRecords(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleRecords: Array.from(element.querySelectorAll('[role="article"]')).every(record => 
        !!record.getAttribute('aria-labelledby') && !!record.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check DPO contact accessibility
  checkDPOContact(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleForm: this.checkContactForm(element.querySelector('form')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check contact form accessibility
  checkContactForm(form) {
    return form ? {
      hasLabel: !!form.getAttribute('aria-label'),
      hasAccessibleFields: Array.from(form.querySelectorAll('input, textarea')).every(field => 
        !!field.getAttribute('aria-label') && !!field.getAttribute('aria-describedby')
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
  dataProtectionUtils,
  dataProtectionCheckers
};
