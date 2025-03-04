// Engagement and interaction utilities for accessibility testing
const engagementUtils = {
  // Reaction utilities
  reactions: {
    // Create reaction controls container
    createReactionControls() {
      const container = document.createElement('div');
      container.setAttribute('data-reaction-controls', 'true');
      container.setAttribute('role', 'group');
      container.setAttribute('aria-label', 'Reaction options');
      
      ['like', 'love', 'celebrate'].forEach(reaction => {
        const button = document.createElement('button');
        button.setAttribute('aria-label', `${reaction} reaction`);
        button.setAttribute('aria-pressed', 'false');
        
        const description = document.createElement('div');
        description.id = `reaction-desc-${Date.now()}`;
        description.textContent = `Add ${reaction} reaction`;
        button.setAttribute('aria-describedby', description.id);
        
        container.appendChild(button);
        container.appendChild(description);
      });
      
      return container;
    },

    // Create reaction announcement
    createReactionAnnouncement(type) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `${type} reaction added`;
      return announcement;
    }
  },

  // Comment system utilities
  comments: {
    // Create comment section container
    createCommentSection() {
      const container = document.createElement('div');
      container.setAttribute('data-comment-section', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Comments section');
      
      const form = document.createElement('form');
      form.setAttribute('aria-label', 'Add comment');
      
      const input = document.createElement('textarea');
      input.setAttribute('aria-label', 'Comment text');
      
      const description = document.createElement('div');
      description.id = `comment-desc-${Date.now()}`;
      description.textContent = 'Enter your comment';
      input.setAttribute('aria-describedby', description.id);
      
      const list = document.createElement('ul');
      list.setAttribute('role', 'list');
      list.setAttribute('aria-label', 'Comments');
      
      form.appendChild(input);
      form.appendChild(description);
      container.appendChild(form);
      container.appendChild(list);
      
      return container;
    },

    // Create comment announcement
    createCommentAnnouncement() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Comment posted successfully';
      return announcement;
    }
  },

  // Sharing utilities
  sharing: {
    // Create sharing features container
    createSharingFeatures() {
      const container = document.createElement('div');
      container.setAttribute('data-sharing-features', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Sharing options');
      
      ['email', 'social', 'link'].forEach(method => {
        const button = document.createElement('button');
        button.setAttribute('aria-label', `Share via ${method}`);
        
        const description = document.createElement('div');
        description.id = `share-desc-${Date.now()}`;
        description.textContent = `Share this content via ${method}`;
        button.setAttribute('aria-describedby', description.id);
        
        container.appendChild(button);
        container.appendChild(description);
      });
      
      return container;
    },

    // Create sharing announcement
    createSharingAnnouncement(method) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Shared successfully via ${method}`;
      return announcement;
    }
  },

  // Activity feed utilities
  activity: {
    // Create activity feed container
    createActivityFeed() {
      const container = document.createElement('div');
      container.setAttribute('data-activity-feed', 'true');
      container.setAttribute('role', 'feed');
      container.setAttribute('aria-label', 'Activity feed');
      
      ['comment', 'reaction', 'share'].forEach(type => {
        const article = document.createElement('article');
        article.setAttribute('role', 'article');
        
        const title = document.createElement('div');
        title.id = `activity-title-${Date.now()}`;
        title.textContent = `New ${type} activity`;
        article.setAttribute('aria-labelledby', title.id);
        
        const description = document.createElement('div');
        description.id = `activity-desc-${Date.now()}`;
        description.textContent = `Details of ${type} activity`;
        article.setAttribute('aria-describedby', description.id);
        
        container.appendChild(article);
      });
      
      return container;
    },

    // Create activity announcement
    createActivityAnnouncement() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'New activity in feed';
      return announcement;
    }
  },

  // Metrics utilities
  metrics: {
    // Create metrics container
    createMetricsDisplay() {
      const container = document.createElement('div');
      container.setAttribute('data-engagement-metrics', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Engagement metrics');
      
      ['interactions', 'users', 'retention'].forEach(metric => {
        const status = document.createElement('div');
        status.setAttribute('role', 'status');
        status.setAttribute('aria-label', `${metric} metric`);
        status.setAttribute('aria-atomic', 'true');
        container.appendChild(status);
      });
      
      return container;
    },

    // Create metrics announcement
    createMetricsAnnouncement() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Metrics updated';
      return announcement;
    }
  },

  // Trending content utilities
  trending: {
    // Create trending content container
    createTrendingContent() {
      const container = document.createElement('div');
      container.setAttribute('data-trending-content', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Trending content');
      
      const list = document.createElement('ul');
      list.setAttribute('role', 'list');
      
      ['popular', 'rising', 'recent'].forEach(category => {
        const item = document.createElement('li');
        item.setAttribute('role', 'listitem');
        
        const title = document.createElement('div');
        title.id = `trending-title-${Date.now()}`;
        title.textContent = `${category} content`;
        item.setAttribute('aria-labelledby', title.id);
        
        const description = document.createElement('div');
        description.id = `trending-desc-${Date.now()}`;
        description.textContent = `Details of ${category} content`;
        item.setAttribute('aria-describedby', description.id);
        
        list.appendChild(item);
      });
      
      container.appendChild(list);
      return container;
    },

    // Create trending update announcement
    createTrendingAnnouncement() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Trending content updated';
      return announcement;
    }
  }
};

// Engagement checkers
const engagementCheckers = {
  // Check reaction controls accessibility
  checkReactionControls(element) {
    return {
      hasGroupRole: element.getAttribute('role') === 'group',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleButtons: Array.from(element.querySelectorAll('button')).every(button => 
        !!button.getAttribute('aria-label') && 
        button.hasAttribute('aria-pressed') &&
        !!button.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check comment section accessibility
  checkCommentSection(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleForm: this.checkCommentForm(element.querySelector('form')),
      hasAccessibleList: !!element.querySelector('[role="list"]')?.getAttribute('aria-label'),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check comment form accessibility
  checkCommentForm(form) {
    return form ? {
      hasLabel: !!form.getAttribute('aria-label'),
      hasAccessibleInput: !!form.querySelector('textarea')?.getAttribute('aria-label') &&
                         !!form.querySelector('textarea')?.getAttribute('aria-describedby')
    } : false;
  },

  // Check sharing features accessibility
  checkSharingFeatures(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleButtons: Array.from(element.querySelectorAll('button')).every(button => 
        !!button.getAttribute('aria-label') && !!button.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check activity feed accessibility
  checkActivityFeed(element) {
    return {
      hasFeedRole: element.getAttribute('role') === 'feed',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleArticles: Array.from(element.querySelectorAll('[role="article"]')).every(article => 
        !!article.getAttribute('aria-labelledby') && !!article.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check metrics display accessibility
  checkMetricsDisplay(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleMetrics: Array.from(element.querySelectorAll('[role="status"]')).every(metric => 
        !!metric.getAttribute('aria-label') && metric.getAttribute('aria-atomic') === 'true'
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check trending content accessibility
  checkTrendingContent(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleList: Array.from(element.querySelectorAll('[role="listitem"]')).every(item => 
        !!item.getAttribute('aria-labelledby') && !!item.getAttribute('aria-describedby')
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
  engagementUtils,
  engagementCheckers
};
