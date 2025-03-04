// Privacy and data protection utilities for accessibility testing
const privacyUtils = {
  // Data collection utilities
  collection: {
    // Create data collection controls
    createCollectionControls() {
      const container = document.createElement('div');
      container.setAttribute('data-collection-controls', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Data collection settings');
      
      ['analytics', 'preferences', 'location'].forEach(type => {
        const toggle = document.createElement('div');
        toggle.setAttribute('role', 'switch');
        toggle.setAttribute('aria-checked', 'false');
        toggle.setAttribute('aria-label', `${type} data collection`);
        
        const description = document.createElement('div');
        description.id = `collection-desc-${Date.now()}`;
        description.textContent = `Allow collection of ${type} data`;
        toggle.setAttribute('aria-describedby', description.id);
        
        container.appendChild(toggle);
        container.appendChild(description);
      });
      
      return container;
    },

    // Create collection announcement
    createCollectionAnnouncement(type, enabled) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `${type} data collection ${enabled ? 'enabled' : 'disabled'}`;
      return announcement;
    }
  },

  // Data sharing utilities
  sharing: {
    // Create data sharing controls
    createSharingControls() {
      const container = document.createElement('div');
      container.setAttribute('data-sharing-controls', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Data sharing preferences');
      
      ['third-party', 'marketing', 'research'].forEach(category => {
        const group = document.createElement('div');
        group.setAttribute('role', 'group');
        
        const title = document.createElement('div');
        title.id = `sharing-title-${Date.now()}`;
        title.textContent = `${category} data sharing`;
        group.setAttribute('aria-labelledby', title.id);
        
        const explanation = document.createElement('div');
        explanation.setAttribute('role', 'region');
        explanation.setAttribute('aria-label', `${category} sharing explanation`);
        
        const description = document.createElement('div');
        description.id = `sharing-desc-${Date.now()}`;
        description.textContent = `How ${category} data is used`;
        explanation.setAttribute('aria-describedby', description.id);
        
        container.appendChild(title);
        container.appendChild(group);
        container.appendChild(explanation);
      });
      
      return container;
    }
  },

  // Data retention utilities
  retention: {
    // Create retention controls
    createRetentionControls() {
      const container = document.createElement('div');
      container.setAttribute('data-retention-controls', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Data retention settings');
      
      const select = document.createElement('select');
      select.setAttribute('aria-label', 'Select data retention period');
      
      const description = document.createElement('div');
      description.id = `retention-desc-${Date.now()}`;
      description.textContent = 'Choose how long to keep your data';
      select.setAttribute('aria-describedby', description.id);
      
      ['1-month', '6-months', '1-year', '2-years'].forEach(period => {
        const option = document.createElement('option');
        option.value = period;
        option.textContent = period;
        select.appendChild(option);
      });
      
      container.appendChild(select);
      container.appendChild(description);
      return container;
    },

    // Create retention announcement
    createRetentionAnnouncement(period) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Data retention period changed to ${period}`;
      return announcement;
    }
  },

  // Privacy policy utilities
  policy: {
    // Create privacy policy container
    createPolicyContainer() {
      const container = document.createElement('article');
      container.setAttribute('data-privacy-policy', 'true');
      container.setAttribute('role', 'article');
      container.setAttribute('aria-label', 'Privacy Policy');
      
      const sections = ['collection', 'usage', 'sharing', 'rights'].map(section => {
        const region = document.createElement('section');
        region.setAttribute('role', 'region');
        region.setAttribute('tabindex', '0');
        
        const title = document.createElement('h2');
        title.id = `policy-section-${Date.now()}`;
        title.textContent = `${section} policy`;
        region.setAttribute('aria-labelledby', title.id);
        
        return { region, title };
      });
      
      sections.forEach(({ region, title }) => {
        container.appendChild(title);
        container.appendChild(region);
      });
      
      return container;
    },

    // Create policy section summary
    createPolicySummary(section) {
      const button = document.createElement('button');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', `section-${section}`);
      button.textContent = `Expand ${section} section`;
      return button;
    }
  },

  // Consent management utilities
  consent: {
    // Create consent controls
    createConsentControls() {
      const container = document.createElement('form');
      container.setAttribute('data-consent-controls', 'true');
      container.setAttribute('role', 'form');
      container.setAttribute('aria-label', 'Consent management');
      
      ['essential', 'functional', 'marketing'].forEach(type => {
        const option = document.createElement('div');
        option.setAttribute('role', 'checkbox');
        option.setAttribute('aria-checked', type === 'essential');
        
        const description = document.createElement('div');
        description.id = `consent-desc-${Date.now()}`;
        description.textContent = `${type} cookies and data usage`;
        option.setAttribute('aria-describedby', description.id);
        
        container.appendChild(option);
        container.appendChild(description);
      });
      
      return container;
    },

    // Create consent announcement
    createConsentAnnouncement(type, granted) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `${type} consent ${granted ? 'granted' : 'withdrawn'}`;
      return announcement;
    }
  },

  // Data export utilities
  export: {
    // Create export controls
    createExportControls() {
      const container = document.createElement('div');
      container.setAttribute('data-export-controls', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Data export options');
      
      const button = document.createElement('button');
      button.setAttribute('aria-label', 'Export your data');
      
      const description = document.createElement('div');
      description.id = `export-desc-${Date.now()}`;
      description.textContent = 'Download a copy of your personal data';
      button.setAttribute('aria-describedby', description.id);
      
      container.appendChild(button);
      container.appendChild(description);
      return container;
    },

    // Create export progress
    createExportProgress(progress) {
      const progressBar = document.createElement('div');
      progressBar.setAttribute('role', 'progressbar');
      progressBar.setAttribute('aria-valuenow', progress);
      progressBar.setAttribute('aria-valuemin', '0');
      progressBar.setAttribute('aria-valuemax', '100');
      progressBar.setAttribute('aria-valuetext', `Export ${progress}% complete`);
      return progressBar;
    }
  }
};

// Privacy checkers
const privacyCheckers = {
  // Check collection controls accessibility
  checkCollectionControls(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleToggles: Array.from(element.querySelectorAll('[role="switch"]')).every(toggle => 
        !!toggle.getAttribute('aria-label') && 
        !!toggle.getAttribute('aria-describedby') &&
        toggle.hasAttribute('aria-checked')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check sharing controls accessibility
  checkSharingControls(element) {
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

  // Check retention controls accessibility
  checkRetentionControls(element) {
    const select = element.querySelector('select');
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleSelect: select ? {
        hasLabel: !!select.getAttribute('aria-label'),
        hasDescription: !!select.getAttribute('aria-describedby')
      } : false,
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check privacy policy accessibility
  checkPrivacyPolicy(element) {
    return {
      hasArticleRole: element.getAttribute('role') === 'article',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleSections: Array.from(element.querySelectorAll('[role="region"]')).every(section => 
        !!section.getAttribute('aria-labelledby') && section.getAttribute('tabindex') === '0'
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check consent controls accessibility
  checkConsentControls(element) {
    return {
      hasFormRole: element.getAttribute('role') === 'form',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleOptions: Array.from(element.querySelectorAll('[role="checkbox"]')).every(option => 
        option.hasAttribute('aria-checked') && !!option.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check export controls accessibility
  checkExportControls(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleButton: this.checkExportButton(element.querySelector('button')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check export button accessibility
  checkExportButton(button) {
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
  privacyUtils,
  privacyCheckers
};
