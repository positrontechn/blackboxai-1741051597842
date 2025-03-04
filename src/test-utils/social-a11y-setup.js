// Social interaction utilities for accessibility testing
const socialUtils = {
  // Connection utilities
  connections: {
    // Create connections container
    createConnectionsContainer() {
      const container = document.createElement('div');
      container.setAttribute('data-connections', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Your connections');
      
      const list = document.createElement('ul');
      list.setAttribute('role', 'list');
      list.setAttribute('aria-label', 'Connection list');
      
      ['friend1', 'friend2', 'friend3'].forEach(connection => {
        const item = document.createElement('li');
        item.setAttribute('role', 'listitem');
        
        const title = document.createElement('div');
        title.id = `connection-title-${Date.now()}`;
        title.textContent = connection;
        item.setAttribute('aria-labelledby', title.id);
        
        const description = document.createElement('div');
        description.id = `connection-desc-${Date.now()}`;
        description.textContent = `Connection details for ${connection}`;
        item.setAttribute('aria-describedby', description.id);
        
        list.appendChild(item);
      });
      
      container.appendChild(list);
      return container;
    },

    // Create connection announcement
    createConnectionAnnouncement(type, user) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `${type === 'new' ? 'New connection' : 'Connection removed'}: ${user}`;
      return announcement;
    }
  },

  // Group utilities
  groups: {
    // Create groups container
    createGroupsContainer() {
      const container = document.createElement('div');
      container.setAttribute('data-groups', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Community groups');
      
      const nav = document.createElement('nav');
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Group navigation');
      
      ['tree-planters', 'eco-warriors'].forEach(group => {
        const panel = document.createElement('div');
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', `group-tab-${group}`);
        panel.setAttribute('tabindex', '0');
        
        const tab = document.createElement('button');
        tab.id = `group-tab-${group}`;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('aria-controls', panel.id);
        
        nav.appendChild(tab);
        container.appendChild(panel);
      });
      
      container.appendChild(nav);
      return container;
    },

    // Create group activity announcement
    createGroupAnnouncement(group, type) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `New ${type} in ${group}`;
      return announcement;
    }
  },

  // Event utilities
  events: {
    // Create events container
    createEventsContainer() {
      const container = document.createElement('div');
      container.setAttribute('data-events', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Community events');
      
      ['community-cleanup', 'planting-day'].forEach(event => {
        const card = document.createElement('article');
        card.setAttribute('role', 'article');
        
        const title = document.createElement('div');
        title.id = `event-title-${Date.now()}`;
        title.textContent = event;
        card.setAttribute('aria-labelledby', title.id);
        
        const description = document.createElement('div');
        description.id = `event-desc-${Date.now()}`;
        description.textContent = `Details for ${event}`;
        card.setAttribute('aria-describedby', description.id);
        
        const controls = document.createElement('div');
        controls.setAttribute('role', 'group');
        controls.setAttribute('aria-label', 'Event actions');
        
        card.appendChild(controls);
        container.appendChild(card);
      });
      
      return container;
    },

    // Create event announcement
    createEventAnnouncement(action, event) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `${action} for ${event}`;
      return announcement;
    }
  },

  // Messaging utilities
  messaging: {
    // Create messaging container
    createMessagingContainer() {
      const container = document.createElement('div');
      container.setAttribute('data-messaging', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Messaging');
      
      const conversations = document.createElement('ul');
      conversations.setAttribute('role', 'list');
      conversations.setAttribute('aria-label', 'Conversations');
      
      const composer = document.createElement('form');
      composer.setAttribute('aria-label', 'New message');
      
      const textarea = document.createElement('textarea');
      textarea.setAttribute('aria-label', 'Message text');
      
      composer.appendChild(textarea);
      container.appendChild(conversations);
      container.appendChild(composer);
      
      return container;
    },

    // Create message announcement
    createMessageAnnouncement(from, preview) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `New message from ${from}: ${preview}`;
      return announcement;
    }
  },

  // Collaboration utilities
  collaboration: {
    // Create collaboration container
    createCollaborationContainer() {
      const container = document.createElement('div');
      container.setAttribute('data-collaboration', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Collaboration tools');
      
      const board = document.createElement('div');
      board.setAttribute('role', 'grid');
      board.setAttribute('aria-label', 'Project board');
      board.setAttribute('aria-rowcount', '3');
      board.setAttribute('aria-colcount', '3');
      
      container.appendChild(board);
      return container;
    },

    // Create task announcement
    createTaskAnnouncement(task, status) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Task "${task}" ${status}`;
      return announcement;
    }
  },

  // Mentions utilities
  mentions: {
    // Create mentions container
    createMentionsContainer() {
      const container = document.createElement('div');
      container.setAttribute('data-mentions', 'true');
      container.setAttribute('role', 'feed');
      container.setAttribute('aria-label', 'Mentions');
      
      const mention = document.createElement('article');
      mention.setAttribute('role', 'article');
      
      const title = document.createElement('div');
      title.id = `mention-title-${Date.now()}`;
      title.textContent = 'New mention';
      mention.setAttribute('aria-labelledby', title.id);
      
      const description = document.createElement('div');
      description.id = `mention-desc-${Date.now()}`;
      description.textContent = 'Mention details';
      mention.setAttribute('aria-describedby', description.id);
      
      container.appendChild(mention);
      return container;
    },

    // Create mention announcement
    createMentionAnnouncement(from, context) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `${from} mentioned you in a ${context}`;
      return announcement;
    }
  }
};

// Social checkers
const socialCheckers = {
  // Check connections accessibility
  checkConnections(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleList: this.checkConnectionList(element.querySelector('[role="list"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check connection list accessibility
  checkConnectionList(list) {
    return list ? {
      hasListRole: list.getAttribute('role') === 'list',
      hasLabel: !!list.getAttribute('aria-label'),
      hasAccessibleItems: Array.from(list.querySelectorAll('[role="listitem"]')).every(item => 
        !!item.getAttribute('aria-labelledby') && !!item.getAttribute('aria-describedby')
      )
    } : false;
  },

  // Check groups accessibility
  checkGroups(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleNavigation: this.checkGroupNavigation(element.querySelector('[role="navigation"]')),
      hasAccessiblePanels: Array.from(element.querySelectorAll('[role="tabpanel"]')).every(panel => 
        !!panel.getAttribute('aria-labelledby') && panel.getAttribute('tabindex') === '0'
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check group navigation accessibility
  checkGroupNavigation(nav) {
    return nav ? {
      hasNavigationRole: nav.getAttribute('role') === 'navigation',
      hasLabel: !!nav.getAttribute('aria-label'),
      hasAccessibleTabs: Array.from(nav.querySelectorAll('[role="tab"]')).every(tab => 
        tab.hasAttribute('aria-selected') && !!tab.getAttribute('aria-controls')
      )
    } : false;
  },

  // Check events accessibility
  checkEvents(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleCards: Array.from(element.querySelectorAll('[role="article"]')).every(card => 
        !!card.getAttribute('aria-labelledby') && 
        !!card.getAttribute('aria-describedby') &&
        !!card.querySelector('[role="group"]')?.getAttribute('aria-label')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check messaging accessibility
  checkMessaging(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleList: !!element.querySelector('[role="list"]')?.getAttribute('aria-label'),
      hasAccessibleComposer: this.checkMessageComposer(element.querySelector('form')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check message composer accessibility
  checkMessageComposer(form) {
    return form ? {
      hasLabel: !!form.getAttribute('aria-label'),
      hasAccessibleTextarea: !!form.querySelector('textarea')?.getAttribute('aria-label')
    } : false;
  },

  // Check collaboration accessibility
  checkCollaboration(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleBoard: this.checkProjectBoard(element.querySelector('[role="grid"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check project board accessibility
  checkProjectBoard(board) {
    return board ? {
      hasGridRole: board.getAttribute('role') === 'grid',
      hasLabel: !!board.getAttribute('aria-label'),
      hasDimensions: board.hasAttribute('aria-rowcount') && board.hasAttribute('aria-colcount')
    } : false;
  },

  // Check mentions accessibility
  checkMentions(element) {
    return {
      hasFeedRole: element.getAttribute('role') === 'feed',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleArticles: Array.from(element.querySelectorAll('[role="article"]')).every(article => 
        !!article.getAttribute('aria-labelledby') && !!article.getAttribute('aria-describedby')
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
  socialUtils,
  socialCheckers
};
