// Preferences and settings utilities for accessibility testing
const prefsUtils = {
  // Theme preference utilities
  theme: {
    // Create theme controls
    createThemeControls() {
      const controls = document.createElement('div');
      controls.setAttribute('data-theme-controls', 'true');
      controls.setAttribute('role', 'radiogroup');
      controls.setAttribute('aria-label', 'Theme selection');
      
      ['light', 'dark', 'system'].forEach(theme => {
        const option = document.createElement('div');
        option.setAttribute('role', 'radio');
        option.setAttribute('aria-checked', theme === 'light');
        option.setAttribute('aria-label', `${theme} theme`);
        controls.appendChild(option);
      });
      
      return controls;
    },

    // Create theme announcement
    createThemeAnnouncement(theme) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Theme changed to ${theme}`;
      return announcement;
    }
  },

  // Font size utilities
  fontSize: {
    // Create font size controls
    createFontControls() {
      const controls = document.createElement('div');
      controls.setAttribute('data-font-controls', 'true');
      controls.setAttribute('role', 'group');
      controls.setAttribute('aria-label', 'Font size controls');
      
      ['decrease', 'increase'].forEach(action => {
        const button = document.createElement('button');
        button.setAttribute('aria-label', `${action} font size`);
        button.setAttribute('aria-pressed', 'false');
        controls.appendChild(button);
      });
      
      return controls;
    },

    // Create font size announcement
    createFontAnnouncement(action) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Font size ${action}d`;
      return announcement;
    }
  },

  // Contrast utilities
  contrast: {
    // Create contrast controls
    createContrastControls() {
      const controls = document.createElement('div');
      controls.setAttribute('data-contrast-controls', 'true');
      controls.setAttribute('role', 'group');
      controls.setAttribute('aria-label', 'Contrast controls');
      
      ['normal', 'high'].forEach(level => {
        const option = document.createElement('div');
        option.setAttribute('role', 'radio');
        option.setAttribute('aria-checked', level === 'normal');
        option.setAttribute('aria-label', `${level} contrast`);
        controls.appendChild(option);
      });
      
      return controls;
    },

    // Create contrast announcement
    createContrastAnnouncement(level) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Contrast changed to ${level}`;
      return announcement;
    }
  },

  // Motion utilities
  motion: {
    // Create motion controls
    createMotionControls() {
      const controls = document.createElement('div');
      controls.setAttribute('data-motion-controls', 'true');
      controls.setAttribute('role', 'group');
      controls.setAttribute('aria-label', 'Motion controls');
      
      const toggle = document.createElement('div');
      toggle.setAttribute('role', 'switch');
      toggle.setAttribute('aria-checked', 'false');
      toggle.setAttribute('aria-label', 'Reduce motion');
      
      controls.appendChild(toggle);
      return controls;
    },

    // Create motion announcement
    createMotionAnnouncement(reduced) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = reduced ? 'Motion reduced' : 'Motion restored';
      return announcement;
    }
  },

  // Language utilities
  language: {
    // Create language selector
    createLanguageSelector(languages) {
      const select = document.createElement('select');
      select.setAttribute('aria-label', 'Select language');
      
      const description = document.createElement('div');
      description.id = `lang-desc-${Date.now()}`;
      description.textContent = 'Choose your preferred language';
      select.setAttribute('aria-describedby', description.id);
      
      languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        option.setAttribute('lang', lang.code);
        select.appendChild(option);
      });
      
      const container = document.createElement('div');
      container.appendChild(select);
      container.appendChild(description);
      return container;
    },

    // Create language announcement
    createLanguageAnnouncement(language) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Language changed to ${language}`;
      return announcement;
    }
  },

  // Notification utilities
  notifications: {
    // Create notification preferences
    createNotificationPreferences() {
      const controls = document.createElement('div');
      controls.setAttribute('data-notification-prefs', 'true');
      controls.setAttribute('role', 'group');
      controls.setAttribute('aria-label', 'Notification preferences');
      
      ['email', 'push', 'in-app'].forEach(type => {
        const toggle = document.createElement('div');
        toggle.setAttribute('role', 'switch');
        toggle.setAttribute('aria-checked', 'false');
        toggle.setAttribute('aria-label', `Enable ${type} notifications`);
        controls.appendChild(toggle);
      });
      
      return controls;
    },

    // Create notification preference announcement
    createNotificationAnnouncement(type, enabled) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `${type} notifications ${enabled ? 'enabled' : 'disabled'}`;
      return announcement;
    }
  }
};

// Preferences checkers
const prefsCheckers = {
  // Check theme controls accessibility
  checkThemeControls(element) {
    return {
      hasRadiogroupRole: element.getAttribute('role') === 'radiogroup',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleOptions: Array.from(element.querySelectorAll('[role="radio"]')).every(option => 
        !!option.getAttribute('aria-label') && option.hasAttribute('aria-checked')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check font controls accessibility
  checkFontControls(element) {
    return {
      hasGroupRole: element.getAttribute('role') === 'group',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleButtons: Array.from(element.querySelectorAll('button')).every(button => 
        !!button.getAttribute('aria-label') && button.hasAttribute('aria-pressed')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check contrast controls accessibility
  checkContrastControls(element) {
    return {
      hasGroupRole: element.getAttribute('role') === 'group',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleOptions: Array.from(element.querySelectorAll('[role="radio"]')).every(option => 
        !!option.getAttribute('aria-label') && option.hasAttribute('aria-checked')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check motion controls accessibility
  checkMotionControls(element) {
    return {
      hasGroupRole: element.getAttribute('role') === 'group',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleToggle: this.checkToggle(element.querySelector('[role="switch"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check toggle accessibility
  checkToggle(toggle) {
    return toggle ? {
      hasSwitchRole: toggle.getAttribute('role') === 'switch',
      hasCheckedState: toggle.hasAttribute('aria-checked'),
      hasLabel: !!toggle.getAttribute('aria-label')
    } : false;
  },

  // Check language selector accessibility
  checkLanguageSelector(element) {
    const select = element.querySelector('select');
    return {
      hasLabel: !!select?.getAttribute('aria-label'),
      hasDescription: !!select?.getAttribute('aria-describedby'),
      hasLanguageAttributes: Array.from(element.querySelectorAll('option')).every(option => 
        option.hasAttribute('lang')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check notification preferences accessibility
  checkNotificationPreferences(element) {
    return {
      hasGroupRole: element.getAttribute('role') === 'group',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleToggles: Array.from(element.querySelectorAll('[role="switch"]')).every(toggle => 
        !!toggle.getAttribute('aria-label') && toggle.hasAttribute('aria-checked')
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
  prefsUtils,
  prefsCheckers
};
