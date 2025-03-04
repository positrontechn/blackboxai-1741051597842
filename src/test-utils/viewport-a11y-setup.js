// Viewport and responsiveness utilities for accessibility testing
const viewportUtils = {
  // Viewport adaptation utilities
  adaptation: {
    // Create viewport adaptation container
    createViewportAdaptation() {
      const container = document.createElement('div');
      container.setAttribute('data-viewport-adaptation', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Viewport adaptation');
      
      ['size', 'breakpoint', 'orientation'].forEach(metric => {
        const indicator = document.createElement('div');
        indicator.setAttribute('role', 'status');
        indicator.setAttribute('aria-label', `${metric} indicator`);
        indicator.setAttribute('aria-atomic', 'true');
        container.appendChild(indicator);
      });
      
      return container;
    },

    // Create viewport announcement
    createViewportAnnouncement(size) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Layout adapted for ${size < 768 ? 'mobile' : size < 1024 ? 'tablet' : 'desktop'}`;
      return announcement;
    }
  },

  // Responsive navigation utilities
  navigation: {
    // Create responsive navigation container
    createResponsiveNavigation() {
      const container = document.createElement('div');
      container.setAttribute('data-responsive-navigation', 'true');
      container.setAttribute('role', 'navigation');
      container.setAttribute('aria-label', 'Main navigation');
      
      const menuButton = document.createElement('button');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-controls', 'nav-menu');
      menuButton.setAttribute('aria-label', 'Toggle navigation menu');
      
      const menu = document.createElement('div');
      menu.id = 'nav-menu';
      menu.setAttribute('role', 'menu');
      menu.setAttribute('aria-hidden', 'true');
      
      container.appendChild(menuButton);
      container.appendChild(menu);
      return container;
    },

    // Create navigation announcement
    createNavigationAnnouncement(expanded) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Navigation menu ${expanded ? 'expanded' : 'collapsed'}`;
      return announcement;
    }
  },

  // Content reflow utilities
  reflow: {
    // Create content reflow container
    createContentReflow() {
      const container = document.createElement('div');
      container.setAttribute('data-content-reflow', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Content layout');
      
      ['main', 'sidebar', 'footer'].forEach(section => {
        const region = document.createElement('div');
        region.setAttribute('role', 'region');
        region.setAttribute('aria-label', `${section} content`);
        
        const description = document.createElement('div');
        description.id = `reflow-desc-${Date.now()}`;
        description.textContent = `${section} section content`;
        region.setAttribute('aria-describedby', description.id);
        
        container.appendChild(region);
        container.appendChild(description);
      });
      
      return container;
    },

    // Create reflow announcement
    createReflowAnnouncement(orientation) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Layout adjusted for ${orientation}`;
      return announcement;
    }
  },

  // Zoom controls utilities
  zoom: {
    // Create zoom controls container
    createZoomControls() {
      const container = document.createElement('div');
      container.setAttribute('data-zoom-controls', 'true');
      container.setAttribute('role', 'group');
      container.setAttribute('aria-label', 'Zoom controls');
      
      ['in', 'out', 'reset'].forEach(action => {
        const button = document.createElement('button');
        button.setAttribute('aria-label', `zoom ${action}`);
        button.setAttribute('aria-pressed', 'false');
        container.appendChild(button);
      });
      
      return container;
    },

    // Create zoom announcement
    createZoomAnnouncement(action) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Zoom level ${action === 'in' ? 'increased' : action === 'out' ? 'decreased' : 'reset'}`;
      return announcement;
    }
  },

  // Viewport warning utilities
  warnings: {
    // Create viewport warnings container
    createViewportWarnings() {
      const container = document.createElement('div');
      container.setAttribute('data-viewport-warnings', 'true');
      container.setAttribute('role', 'alert');
      container.setAttribute('aria-live', 'assertive');
      
      const content = document.createElement('div');
      content.setAttribute('role', 'status');
      content.setAttribute('aria-label', 'Viewport compatibility warning');
      
      container.appendChild(content);
      return container;
    },

    // Create warning announcement
    createWarningAnnouncement(issue) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.textContent = issue === 'minimum-width' ? 'Viewport too narrow' : 'Viewport incompatible';
      return announcement;
    }
  },

  // Orientation lock utilities
  orientation: {
    // Create orientation lock container
    createOrientationLock() {
      const container = document.createElement('div');
      container.setAttribute('data-orientation-lock', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Orientation lock');
      
      const toggle = document.createElement('div');
      toggle.setAttribute('role', 'switch');
      toggle.setAttribute('aria-checked', 'false');
      toggle.setAttribute('aria-label', 'Lock orientation');
      
      container.appendChild(toggle);
      return container;
    },

    // Create orientation announcement
    createOrientationAnnouncement(locked) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Orientation ${locked ? 'locked' : 'unlocked'}`;
      return announcement;
    }
  }
};

// Viewport checkers
const viewportCheckers = {
  // Check viewport adaptation accessibility
  checkViewportAdaptation(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleIndicators: Array.from(element.querySelectorAll('[role="status"]')).every(indicator => 
        !!indicator.getAttribute('aria-label') && indicator.getAttribute('aria-atomic') === 'true'
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check responsive navigation accessibility
  checkResponsiveNavigation(element) {
    return {
      hasNavigationRole: element.getAttribute('role') === 'navigation',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleButton: this.checkMenuButton(element.querySelector('button')),
      hasAccessibleMenu: this.checkMenu(element.querySelector('[role="menu"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check menu button accessibility
  checkMenuButton(button) {
    return button ? {
      hasExpandedState: button.hasAttribute('aria-expanded'),
      hasControls: !!button.getAttribute('aria-controls'),
      hasLabel: !!button.getAttribute('aria-label')
    } : false;
  },

  // Check menu accessibility
  checkMenu(menu) {
    return menu ? {
      hasMenuRole: menu.getAttribute('role') === 'menu',
      hasHiddenState: menu.hasAttribute('aria-hidden')
    } : false;
  },

  // Check content reflow accessibility
  checkContentReflow(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleSections: Array.from(element.querySelectorAll('[role="region"]')).every(section => 
        !!section.getAttribute('aria-label') && !!section.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check zoom controls accessibility
  checkZoomControls(element) {
    return {
      hasGroupRole: element.getAttribute('role') === 'group',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleButtons: Array.from(element.querySelectorAll('button')).every(button => 
        !!button.getAttribute('aria-label') && button.hasAttribute('aria-pressed')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check viewport warnings accessibility
  checkViewportWarnings(element) {
    return {
      hasAlertRole: element.getAttribute('role') === 'alert',
      hasLiveRegion: element.getAttribute('aria-live') === 'assertive',
      hasAccessibleContent: !!element.querySelector('[role="status"]')?.getAttribute('aria-label'),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check orientation lock accessibility
  checkOrientationLock(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleToggle: this.checkOrientationToggle(element.querySelector('[role="switch"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check orientation toggle accessibility
  checkOrientationToggle(toggle) {
    return toggle ? {
      hasSwitchRole: toggle.getAttribute('role') === 'switch',
      hasCheckedState: toggle.hasAttribute('aria-checked'),
      hasLabel: !!toggle.getAttribute('aria-label')
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
  viewportUtils,
  viewportCheckers
};
