// Compliance and regulatory utilities for accessibility testing
const complianceUtils = {
  // Compliance status utilities
  status: {
    // Create compliance status container
    createStatusContainer() {
      const container = document.createElement('div');
      container.setAttribute('data-compliance-status', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Compliance status');
      
      const indicators = ['GDPR', 'CCPA', 'PIPEDA'].map(regulation => {
        const indicator = document.createElement('div');
        indicator.setAttribute('role', 'status');
        indicator.setAttribute('aria-live', 'polite');
        indicator.setAttribute('aria-atomic', 'true');
        indicator.textContent = `${regulation} compliance status: compliant`;
        return indicator;
      });
      
      indicators.forEach(indicator => container.appendChild(indicator));
      return container;
    },

    // Create status change announcement
    createStatusAnnouncement(regulation, status) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.textContent = `${regulation} compliance status changed to ${status}`;
      return announcement;
    }
  },

  // Requirements utilities
  requirements: {
    // Create requirements container
    createRequirementsContainer() {
      const container = document.createElement('div');
      container.setAttribute('data-requirements', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Regulatory requirements');
      
      ['mandatory', 'optional'].forEach(type => {
        const group = document.createElement('div');
        group.setAttribute('role', 'group');
        
        const title = document.createElement('div');
        title.id = `requirements-${type}-${Date.now()}`;
        title.textContent = `${type} requirements`;
        group.setAttribute('aria-labelledby', title.id);
        
        const details = document.createElement('button');
        details.setAttribute('aria-expanded', 'false');
        details.setAttribute('aria-controls', `${type}-details`);
        details.textContent = 'View details';
        
        container.appendChild(title);
        container.appendChild(group);
        container.appendChild(details);
      });
      
      return container;
    }
  },

  // Audit utilities
  audit: {
    // Create audit controls
    createAuditControls() {
      const container = document.createElement('div');
      container.setAttribute('data-audit-controls', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Audit management');
      
      const schedule = document.createElement('table');
      schedule.setAttribute('role', 'table');
      schedule.setAttribute('aria-label', 'Audit schedule');
      
      ['Past', 'Current', 'Planned'].forEach(period => {
        const row = document.createElement('tr');
        row.setAttribute('role', 'row');
        
        const header = document.createElement('th');
        header.setAttribute('role', 'rowheader');
        header.textContent = period;
        
        row.appendChild(header);
        schedule.appendChild(row);
      });
      
      container.appendChild(schedule);
      return container;
    },

    // Create audit announcement
    createAuditAnnouncement(date) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Audit scheduled for ${date}`;
      return announcement;
    }
  },

  // Documentation utilities
  documentation: {
    // Create documentation container
    createDocumentationContainer() {
      const container = document.createElement('div');
      container.setAttribute('data-documentation', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Compliance documentation');
      
      const list = document.createElement('ul');
      list.setAttribute('role', 'list');
      list.setAttribute('aria-label', 'Required documents');
      
      ['Privacy Notice', 'DPIA', 'Consent Records'].forEach(doc => {
        const item = document.createElement('li');
        item.setAttribute('role', 'listitem');
        
        const title = document.createElement('div');
        title.id = `doc-title-${Date.now()}`;
        title.textContent = doc;
        item.setAttribute('aria-labelledby', title.id);
        
        const status = document.createElement('div');
        status.id = `doc-status-${Date.now()}`;
        status.textContent = 'Up to date';
        item.setAttribute('aria-describedby', status.id);
        
        list.appendChild(item);
      });
      
      container.appendChild(list);
      return container;
    },

    // Create document update announcement
    createDocumentAnnouncement(document, status) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `${document} ${status}`;
      return announcement;
    }
  },

  // Vendor assessment utilities
  vendor: {
    // Create vendor assessment container
    createVendorAssessment() {
      const container = document.createElement('div');
      container.setAttribute('data-vendor-assessment', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Vendor assessment');
      
      const form = document.createElement('form');
      form.setAttribute('aria-label', 'Vendor assessment form');
      
      ['name', 'services', 'compliance-status'].forEach(field => {
        const input = document.createElement(field === 'services' ? 'textarea' : 'input');
        input.setAttribute('aria-label', field.replace('-', ' '));
        
        const description = document.createElement('div');
        description.id = `field-desc-${Date.now()}`;
        description.textContent = `Enter vendor ${field}`;
        input.setAttribute('aria-describedby', description.id);
        
        form.appendChild(input);
        form.appendChild(description);
      });
      
      container.appendChild(form);
      return container;
    },

    // Create assessment announcement
    createAssessmentAnnouncement() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Assessment submitted successfully';
      return announcement;
    }
  },

  // Training utilities
  training: {
    // Create training container
    createTrainingContainer() {
      const container = document.createElement('div');
      container.setAttribute('data-compliance-training', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Compliance training');
      
      const nav = document.createElement('nav');
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Training modules');
      
      ['Introduction', 'Core Concepts', 'Best Practices'].forEach(module => {
        const article = document.createElement('article');
        article.setAttribute('role', 'article');
        
        const title = document.createElement('div');
        title.id = `module-title-${Date.now()}`;
        title.textContent = module;
        article.setAttribute('aria-labelledby', title.id);
        
        const content = document.createElement('div');
        content.id = `module-content-${Date.now()}`;
        content.textContent = `Content for ${module}`;
        article.setAttribute('aria-describedby', content.id);
        
        container.appendChild(article);
      });
      
      container.appendChild(nav);
      return container;
    },

    // Create training progress announcement
    createProgressAnnouncement(module) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `${module} completed`;
      return announcement;
    }
  }
};

// Compliance checkers
const complianceCheckers = {
  // Check status container accessibility
  checkStatusContainer(element) {
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

  // Check requirements container accessibility
  checkRequirementsContainer(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleGroups: Array.from(element.querySelectorAll('[role="group"]')).every(group => 
        !!group.getAttribute('aria-labelledby')
      ),
      hasAccessibleDetails: Array.from(element.querySelectorAll('button')).every(button => 
        button.hasAttribute('aria-expanded') && !!button.getAttribute('aria-controls')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check audit controls accessibility
  checkAuditControls(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleTable: this.checkAuditTable(element.querySelector('[role="table"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check audit table accessibility
  checkAuditTable(table) {
    return table ? {
      hasTableRole: table.getAttribute('role') === 'table',
      hasLabel: !!table.getAttribute('aria-label'),
      hasAccessibleRows: Array.from(table.querySelectorAll('[role="row"]')).every(row => 
        !!row.querySelector('[role="rowheader"]')
      )
    } : false;
  },

  // Check documentation container accessibility
  checkDocumentationContainer(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleList: this.checkDocumentList(element.querySelector('[role="list"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check document list accessibility
  checkDocumentList(list) {
    return list ? {
      hasListRole: list.getAttribute('role') === 'list',
      hasLabel: !!list.getAttribute('aria-label'),
      hasAccessibleItems: Array.from(list.querySelectorAll('[role="listitem"]')).every(item => 
        !!item.getAttribute('aria-labelledby') && !!item.getAttribute('aria-describedby')
      )
    } : false;
  },

  // Check vendor assessment accessibility
  checkVendorAssessment(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleForm: this.checkAssessmentForm(element.querySelector('form')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check assessment form accessibility
  checkAssessmentForm(form) {
    return form ? {
      hasLabel: !!form.getAttribute('aria-label'),
      hasAccessibleFields: Array.from(form.querySelectorAll('input, textarea')).every(field => 
        !!field.getAttribute('aria-label') && !!field.getAttribute('aria-describedby')
      )
    } : false;
  },

  // Check training container accessibility
  checkTrainingContainer(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleNavigation: !!element.querySelector('[role="navigation"]'),
      hasAccessibleModules: Array.from(element.querySelectorAll('[role="article"]')).every(module => 
        !!module.getAttribute('aria-labelledby') && !!module.getAttribute('aria-describedby')
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
  complianceUtils,
  complianceCheckers
};
