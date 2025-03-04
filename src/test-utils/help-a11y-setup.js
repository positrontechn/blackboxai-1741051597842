// Help and support utilities for accessibility testing
const helpUtils = {
  // Help center utilities
  center: {
    // Create help center container
    createHelpCenter() {
      const container = document.createElement('div');
      container.setAttribute('data-help-center', 'true');
      container.setAttribute('role', 'navigation');
      container.setAttribute('aria-label', 'Help center navigation');
      
      const list = document.createElement('ul');
      list.setAttribute('role', 'list');
      list.setAttribute('aria-label', 'Help topics');
      
      ['getting-started', 'features', 'troubleshooting'].forEach(topic => {
        const item = document.createElement('li');
        item.setAttribute('role', 'listitem');
        
        const title = document.createElement('div');
        title.id = `topic-title-${Date.now()}`;
        title.textContent = topic;
        item.setAttribute('aria-labelledby', title.id);
        
        const link = document.createElement('a');
        link.setAttribute('role', 'link');
        
        const description = document.createElement('div');
        description.id = `topic-desc-${Date.now()}`;
        description.textContent = `Learn about ${topic}`;
        link.setAttribute('aria-describedby', description.id);
        
        item.appendChild(title);
        item.appendChild(link);
        item.appendChild(description);
        list.appendChild(item);
      });
      
      container.appendChild(list);
      return container;
    },

    // Create topic selection announcement
    createTopicAnnouncement(topic) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Viewing ${topic} guide`;
      return announcement;
    }
  },

  // Interactive guide utilities
  guides: {
    // Create interactive guide container
    createInteractiveGuide() {
      const container = document.createElement('div');
      container.setAttribute('data-interactive-guide', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Interactive guide');
      
      const stepNav = document.createElement('div');
      stepNav.setAttribute('role', 'tablist');
      stepNav.setAttribute('aria-label', 'Guide steps');
      
      [1, 2, 3].forEach(step => {
        const panel = document.createElement('div');
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', `step-${step}`);
        panel.setAttribute('tabindex', '0');
        
        const tab = document.createElement('button');
        tab.id = `step-${step}`;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', step === 1);
        tab.setAttribute('aria-controls', panel.id);
        
        stepNav.appendChild(tab);
        container.appendChild(panel);
      });
      
      container.appendChild(stepNav);
      return container;
    },

    // Create guide progress announcement
    createProgressAnnouncement(step, total) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Step ${step} of ${total}`;
      return announcement;
    }
  },

  // FAQ utilities
  faq: {
    // Create FAQ section container
    createFAQSection() {
      const container = document.createElement('div');
      container.setAttribute('data-faq-section', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Frequently asked questions');
      
      ['common-issues', 'best-practices'].forEach(topic => {
        const button = document.createElement('button');
        button.setAttribute('role', 'button');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', `answer-${topic}`);
        
        const answer = document.createElement('div');
        answer.id = `answer-${topic}`;
        answer.setAttribute('role', 'region');
        answer.setAttribute('aria-labelledby', button.id);
        
        container.appendChild(button);
        container.appendChild(answer);
      });
      
      return container;
    },

    // Create FAQ expansion announcement
    createExpansionAnnouncement(expanded) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Answer ${expanded ? 'expanded' : 'collapsed'}`;
      return announcement;
    }
  },

  // Support channel utilities
  support: {
    // Create support channels container
    createSupportChannels() {
      const container = document.createElement('div');
      container.setAttribute('data-support-channels', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Support channels');
      
      ['chat', 'email', 'knowledge-base'].forEach(channel => {
        const button = document.createElement('button');
        button.setAttribute('aria-label', `Contact support via ${channel}`);
        
        const description = document.createElement('div');
        description.id = `channel-desc-${Date.now()}`;
        description.textContent = `Get help through ${channel}`;
        button.setAttribute('aria-describedby', description.id);
        
        container.appendChild(button);
        container.appendChild(description);
      });
      
      return container;
    },

    // Create channel selection announcement
    createChannelAnnouncement(channel) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Opening ${channel} support`;
      return announcement;
    }
  },

  // Knowledge base utilities
  knowledgeBase: {
    // Create knowledge base container
    createKnowledgeBase() {
      const container = document.createElement('div');
      container.setAttribute('data-knowledge-base', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Knowledge base');
      
      const search = document.createElement('div');
      search.setAttribute('role', 'search');
      search.setAttribute('aria-label', 'Search knowledge base');
      
      const searchbox = document.createElement('input');
      searchbox.setAttribute('role', 'searchbox');
      searchbox.setAttribute('aria-label', 'Search articles');
      
      ['article1', 'article2'].forEach(article => {
        const articleEl = document.createElement('article');
        articleEl.setAttribute('role', 'article');
        
        const title = document.createElement('div');
        title.id = `article-title-${Date.now()}`;
        articleEl.setAttribute('aria-labelledby', title.id);
        
        const description = document.createElement('div');
        description.id = `article-desc-${Date.now()}`;
        articleEl.setAttribute('aria-describedby', description.id);
        
        container.appendChild(articleEl);
      });
      
      search.appendChild(searchbox);
      container.appendChild(search);
      return container;
    },

    // Create search results announcement
    createSearchAnnouncement(count) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Found ${count} results`;
      return announcement;
    }
  },

  // Contextual help utilities
  contextual: {
    // Create contextual help container
    createContextualHelp() {
      const container = document.createElement('div');
      container.setAttribute('data-contextual-help', 'true');
      container.setAttribute('role', 'button');
      container.setAttribute('aria-label', 'Get help for this section');
      container.setAttribute('aria-expanded', 'false');
      
      const dialog = document.createElement('div');
      dialog.setAttribute('role', 'dialog');
      
      const title = document.createElement('div');
      title.id = `help-title-${Date.now()}`;
      dialog.setAttribute('aria-labelledby', title.id);
      
      const description = document.createElement('div');
      description.id = `help-desc-${Date.now()}`;
      dialog.setAttribute('aria-describedby', description.id);
      
      container.appendChild(dialog);
      return container;
    },

    // Create contextual help announcement
    createHelpAnnouncement(shown) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Help information ${shown ? 'shown' : 'hidden'}`;
      return announcement;
    }
  }
};

// Help checkers
const helpCheckers = {
  // Check help center accessibility
  checkHelpCenter(element) {
    return {
      hasNavigationRole: element.getAttribute('role') === 'navigation',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleList: this.checkTopicList(element.querySelector('[role="list"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check topic list accessibility
  checkTopicList(list) {
    return list ? {
      hasListRole: list.getAttribute('role') === 'list',
      hasLabel: !!list.getAttribute('aria-label'),
      hasAccessibleItems: Array.from(list.querySelectorAll('[role="listitem"]')).every(item => 
        !!item.getAttribute('aria-labelledby') &&
        !!item.querySelector('[role="link"]')?.getAttribute('aria-describedby')
      )
    } : false;
  },

  // Check interactive guide accessibility
  checkInteractiveGuide(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleNavigation: this.checkStepNavigation(element.querySelector('[role="tablist"]')),
      hasAccessiblePanels: Array.from(element.querySelectorAll('[role="tabpanel"]')).every(panel => 
        !!panel.getAttribute('aria-labelledby') && panel.getAttribute('tabindex') === '0'
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check step navigation accessibility
  checkStepNavigation(nav) {
    return nav ? {
      hasTablistRole: nav.getAttribute('role') === 'tablist',
      hasLabel: !!nav.getAttribute('aria-label'),
      hasAccessibleTabs: Array.from(nav.querySelectorAll('[role="tab"]')).every(tab => 
        tab.hasAttribute('aria-selected') && !!tab.getAttribute('aria-controls')
      )
    } : false;
  },

  // Check FAQ section accessibility
  checkFAQSection(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleQuestions: Array.from(element.querySelectorAll('[role="button"]')).every(button => 
        button.hasAttribute('aria-expanded') && !!button.getAttribute('aria-controls')
      ),
      hasAccessibleAnswers: Array.from(element.querySelectorAll('[role="region"]')).every(answer => 
        !!answer.getAttribute('aria-labelledby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check support channels accessibility
  checkSupportChannels(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleButtons: Array.from(element.querySelectorAll('button')).every(button => 
        !!button.getAttribute('aria-label') && !!button.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check knowledge base accessibility
  checkKnowledgeBase(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleSearch: this.checkSearch(element.querySelector('[role="search"]')),
      hasAccessibleArticles: Array.from(element.querySelectorAll('[role="article"]')).every(article => 
        !!article.getAttribute('aria-labelledby') && !!article.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check search accessibility
  checkSearch(search) {
    return search ? {
      hasSearchRole: search.getAttribute('role') === 'search',
      hasLabel: !!search.getAttribute('aria-label'),
      hasAccessibleSearchbox: !!search.querySelector('[role="searchbox"]')?.getAttribute('aria-label')
    } : false;
  },

  // Check contextual help accessibility
  checkContextualHelp(element) {
    return {
      hasButtonRole: element.getAttribute('role') === 'button',
      hasLabel: !!element.getAttribute('aria-label'),
      hasExpandedState: element.hasAttribute('aria-expanded'),
      hasAccessibleDialog: this.checkHelpDialog(element.querySelector('[role="dialog"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check help dialog accessibility
  checkHelpDialog(dialog) {
    return dialog ? {
      hasDialogRole: dialog.getAttribute('role') === 'dialog',
      hasLabelledby: !!dialog.getAttribute('aria-labelledby'),
      hasDescribedby: !!dialog.getAttribute('aria-describedby')
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
  helpUtils,
  helpCheckers
};
