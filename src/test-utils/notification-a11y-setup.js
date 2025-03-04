// Notification and alert utilities for accessibility testing
const notificationUtils = {
  // Notification center utilities
  center: {
    // Create notification center container
    createNotificationCenter() {
      const container = document.createElement('div');
      container.setAttribute('data-notification-center', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Notification center');
      
      const list = document.createElement('ul');
      list.setAttribute('role', 'list');
      list.setAttribute('aria-label', 'Notifications');
      
      ['system', 'social', 'activity'].forEach(type => {
        const item = document.createElement('li');
        item.setAttribute('role', 'listitem');
        
        const title = document.createElement('div');
        title.id = `notification-title-${Date.now()}`;
        title.textContent = `${type} notification`;
        item.setAttribute('aria-labelledby', title.id);
        
        const description = document.createElement('div');
        description.id = `notification-desc-${Date.now()}`;
        description.textContent = `Details of ${type} notification`;
        item.setAttribute('aria-describedby', description.id);
        
        list.appendChild(item);
      });
      
      container.appendChild(list);
      return container;
    },

    // Create notification announcement
    createNotificationAnnouncement(type, message) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.textContent = message;
      return announcement;
    }
  },

  // Badge utilities
  badge: {
    // Create notification badge
    createNotificationBadge(count) {
      const badge = document.createElement('div');
      badge.setAttribute('data-notification-badge', 'true');
      badge.setAttribute('role', 'status');
      badge.setAttribute('aria-label', 'Unread notifications');
      badge.setAttribute('aria-live', 'polite');
      badge.setAttribute('aria-atomic', 'true');
      badge.textContent = count.toString();
      return badge;
    },

    // Create badge update announcement
    createBadgeAnnouncement(count) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `${count} unread notifications`;
      return announcement;
    }
  },

  // Settings utilities
  settings: {
    // Create notification settings container
    createNotificationSettings() {
      const container = document.createElement('div');
      container.setAttribute('data-notification-settings', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Notification settings');
      
      ['email', 'push', 'in-app'].forEach(type => {
        const group = document.createElement('div');
        group.setAttribute('role', 'group');
        
        const title = document.createElement('div');
        title.id = `settings-title-${Date.now()}`;
        title.textContent = `${type} notification settings`;
        group.setAttribute('aria-labelledby', title.id);
        
        const toggle = document.createElement('div');
        toggle.setAttribute('role', 'switch');
        toggle.setAttribute('aria-checked', 'true');
        toggle.setAttribute('aria-label', `${type} notifications`);
        
        group.appendChild(toggle);
        container.appendChild(group);
      });
      
      return container;
    },

    // Create settings update announcement
    createSettingsAnnouncement(type, enabled) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `${type} notifications ${enabled ? 'enabled' : 'disabled'}`;
      return announcement;
    }
  },

  // Priority alert utilities
  priority: {
    // Create priority alert container
    createPriorityAlert() {
      const container = document.createElement('div');
      container.setAttribute('data-priority-alerts', 'true');
      container.setAttribute('role', 'alertdialog');
      container.setAttribute('aria-label', 'Priority alert');
      container.setAttribute('aria-modal', 'true');
      
      const actions = document.createElement('div');
      actions.setAttribute('role', 'group');
      actions.setAttribute('aria-label', 'Alert actions');
      
      ['acknowledge', 'dismiss'].forEach(action => {
        const button = document.createElement('button');
        button.setAttribute('aria-label', action);
        actions.appendChild(button);
      });
      
      container.appendChild(actions);
      return container;
    },

    // Create priority alert announcement
    createPriorityAnnouncement(message) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.textContent = message;
      return announcement;
    }
  },

  // Toast utilities
  toast: {
    // Create toast container
    createToastContainer() {
      const container = document.createElement('div');
      container.setAttribute('data-toast-notifications', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Notifications');
      
      const toast = document.createElement('div');
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'polite');
      toast.setAttribute('aria-atomic', 'true');
      
      const dismiss = document.createElement('button');
      dismiss.setAttribute('aria-label', 'Dismiss notification');
      
      toast.appendChild(dismiss);
      container.appendChild(toast);
      return container;
    },

    // Create toast dismissal announcement
    createDismissalAnnouncement() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Notification dismissed';
      return announcement;
    }
  },

  // Filter utilities
  filters: {
    // Create notification filters
    createNotificationFilters() {
      const container = document.createElement('div');
      container.setAttribute('data-notification-filters', 'true');
      container.setAttribute('role', 'group');
      container.setAttribute('aria-label', 'Notification filters');
      
      ['all', 'social', 'system', 'activity'].forEach(filter => {
        const option = document.createElement('div');
        option.setAttribute('role', 'radio');
        option.setAttribute('aria-checked', filter === 'all');
        option.setAttribute('aria-label', `${filter} notifications`);
        container.appendChild(option);
      });
      
      return container;
    },

    // Create filter change announcement
    createFilterAnnouncement(filter) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Showing ${filter} notifications`;
      return announcement;
    }
  }
};

// Notification checkers
const notificationCheckers = {
  // Check notification center accessibility
  checkNotificationCenter(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleList: this.checkNotificationList(element.querySelector('[role="list"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check notification list accessibility
  checkNotificationList(list) {
    return list ? {
      hasListRole: list.getAttribute('role') === 'list',
      hasLabel: !!list.getAttribute('aria-label'),
      hasAccessibleItems: Array.from(list.querySelectorAll('[role="listitem"]')).every(item => 
        !!item.getAttribute('aria-labelledby') && !!item.getAttribute('aria-describedby')
      )
    } : false;
  },

  // Check notification badge accessibility
  checkNotificationBadge(element) {
    return {
      hasStatusRole: element.getAttribute('role') === 'status',
      hasLabel: !!element.getAttribute('aria-label'),
      hasLiveRegion: element.getAttribute('aria-live') === 'polite',
      isAtomic: element.getAttribute('aria-atomic') === 'true',
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check notification settings accessibility
  checkNotificationSettings(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleGroups: Array.from(element.querySelectorAll('[role="group"]')).every(group => 
        !!group.getAttribute('aria-labelledby') &&
        this.checkSettingsToggle(group.querySelector('[role="switch"]'))
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check settings toggle accessibility
  checkSettingsToggle(toggle) {
    return toggle ? {
      hasSwitchRole: toggle.getAttribute('role') === 'switch',
      hasCheckedState: toggle.hasAttribute('aria-checked'),
      hasLabel: !!toggle.getAttribute('aria-label')
    } : false;
  },

  // Check priority alert accessibility
  checkPriorityAlert(element) {
    return {
      hasAlertDialogRole: element.getAttribute('role') === 'alertdialog',
      hasLabel: !!element.getAttribute('aria-label'),
      isModal: element.getAttribute('aria-modal') === 'true',
      hasAccessibleActions: this.checkAlertActions(element.querySelector('[role="group"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check alert actions accessibility
  checkAlertActions(actions) {
    return actions ? {
      hasGroupRole: actions.getAttribute('role') === 'group',
      hasLabel: !!actions.getAttribute('aria-label'),
      hasAccessibleButtons: Array.from(actions.querySelectorAll('button')).every(button => 
        !!button.getAttribute('aria-label')
      )
    } : false;
  },

  // Check toast container accessibility
  checkToastContainer(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleToasts: Array.from(element.querySelectorAll('[role="alert"]')).every(toast => 
        toast.getAttribute('aria-live') === 'polite' &&
        toast.getAttribute('aria-atomic') === 'true' &&
        !!toast.querySelector('button')?.getAttribute('aria-label')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check notification filters accessibility
  checkNotificationFilters(element) {
    return {
      hasGroupRole: element.getAttribute('role') === 'group',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleOptions: Array.from(element.querySelectorAll('[role="radio"]')).every(option => 
        option.hasAttribute('aria-checked') && !!option.getAttribute('aria-label')
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
  notificationUtils,
  notificationCheckers
};
