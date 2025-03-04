// Search and filtering utilities for accessibility testing
const searchUtils = {
  // Search bar utilities
  searchBar: {
    // Create search bar container
    createSearchBar() {
      const container = document.createElement('div');
      container.setAttribute('data-search-bar', 'true');
      container.setAttribute('role', 'search');
      container.setAttribute('aria-label', 'Search community content');
      
      const input = document.createElement('input');
      input.setAttribute('role', 'searchbox');
      input.setAttribute('aria-label', 'Search input');
      
      const description = document.createElement('div');
      description.id = `search-desc-${Date.now()}`;
      description.textContent = 'Enter search terms';
      input.setAttribute('aria-describedby', description.id);
      
      const suggestions = document.createElement('div');
      suggestions.id = `search-suggestions-${Date.now()}`;
      input.setAttribute('aria-controls', suggestions.id);
      input.setAttribute('aria-expanded', 'false');
      
      container.appendChild(input);
      container.appendChild(description);
      container.appendChild(suggestions);
      return container;
    },

    // Create search announcement
    createSearchAnnouncement(count) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Found ${count} results`;
      return announcement;
    }
  },

  // Suggestions utilities
  suggestions: {
    // Create suggestions container
    createSuggestionsContainer() {
      const container = document.createElement('div');
      container.setAttribute('data-search-suggestions', 'true');
      container.setAttribute('role', 'listbox');
      container.setAttribute('aria-label', 'Search suggestions');
      
      ['plant trees', 'community events', 'report issue'].forEach((suggestion, index) => {
        const option = document.createElement('div');
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', 'false');
        option.id = `suggestion-${index}`;
        option.textContent = suggestion;
        container.appendChild(option);
      });
      
      return container;
    },

    // Create suggestion selection announcement
    createSuggestionAnnouncement(suggestion) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Selected ${suggestion}`;
      return announcement;
    }
  },

  // Filter utilities
  filters: {
    // Create search filters container
    createSearchFilters() {
      const container = document.createElement('div');
      container.setAttribute('data-search-filters', 'true');
      container.setAttribute('role', 'group');
      container.setAttribute('aria-label', 'Search filters');
      
      ['type', 'date'].forEach(category => {
        const group = document.createElement('div');
        group.setAttribute('role', 'group');
        
        const title = document.createElement('div');
        title.id = `filter-title-${Date.now()}`;
        title.textContent = `Filter by ${category}`;
        group.setAttribute('aria-labelledby', title.id);
        
        const options = category === 'type' 
          ? ['all', 'events', 'reports', 'discussions']
          : ['any', 'today', 'week', 'month'];
        
        options.forEach(option => {
          const radio = document.createElement('div');
          radio.setAttribute('role', 'radio');
          radio.setAttribute('aria-checked', option === 'all' || option === 'any');
          radio.setAttribute('aria-label', option);
          group.appendChild(radio);
        });
        
        container.appendChild(title);
        container.appendChild(group);
      });
      
      return container;
    },

    // Create filter change announcement
    createFilterAnnouncement(filter) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Filtered by ${filter}`;
      return announcement;
    }
  },

  // Results utilities
  results: {
    // Create search results container
    createSearchResults() {
      const container = document.createElement('div');
      container.setAttribute('data-search-results', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Search results');
      
      const list = document.createElement('ul');
      list.setAttribute('role', 'list');
      list.setAttribute('aria-label', 'Search results list');
      
      ['result1', 'result2', 'result3'].forEach(result => {
        const item = document.createElement('li');
        item.setAttribute('role', 'listitem');
        
        const title = document.createElement('div');
        title.id = `result-title-${Date.now()}`;
        item.setAttribute('aria-labelledby', title.id);
        
        const description = document.createElement('div');
        description.id = `result-desc-${Date.now()}`;
        item.setAttribute('aria-describedby', description.id);
        
        const link = document.createElement('a');
        link.setAttribute('role', 'link');
        link.setAttribute('aria-label', `View ${result}`);
        
        item.appendChild(title);
        item.appendChild(description);
        item.appendChild(link);
        list.appendChild(item);
      });
      
      container.appendChild(list);
      return container;
    },

    // Create navigation announcement
    createNavigationAnnouncement(result) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Navigating to ${result}`;
      return announcement;
    }
  },

  // Recent searches utilities
  recent: {
    // Create recent searches container
    createRecentSearches() {
      const container = document.createElement('div');
      container.setAttribute('data-recent-searches', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Recent searches');
      
      const list = document.createElement('ul');
      list.setAttribute('role', 'list');
      list.setAttribute('aria-label', 'Recent search terms');
      
      const clearButton = document.createElement('button');
      clearButton.setAttribute('aria-label', 'Clear recent searches');
      
      container.appendChild(list);
      container.appendChild(clearButton);
      return container;
    },

    // Create recent searches announcement
    createRecentAnnouncement(action) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = action === 'clear' ? 'Cleared recent searches' : 'Recent search applied';
      return announcement;
    }
  },

  // Facets utilities
  facets: {
    // Create search facets container
    createSearchFacets() {
      const container = document.createElement('div');
      container.setAttribute('data-search-facets', 'true');
      container.setAttribute('role', 'complementary');
      container.setAttribute('aria-label', 'Search refinements');
      
      ['category', 'date', 'status'].forEach(facet => {
        const group = document.createElement('div');
        group.setAttribute('role', 'group');
        
        const title = document.createElement('div');
        title.id = `facet-title-${Date.now()}`;
        title.textContent = `Refine by ${facet}`;
        group.setAttribute('aria-labelledby', title.id);
        
        ['option1', 'option2'].forEach(option => {
          const checkbox = document.createElement('div');
          checkbox.setAttribute('role', 'checkbox');
          checkbox.setAttribute('aria-checked', 'false');
          checkbox.setAttribute('aria-label', `${option} in ${facet}`);
          group.appendChild(checkbox);
        });
        
        container.appendChild(title);
        container.appendChild(group);
      });
      
      return container;
    },

    // Create facet selection announcement
    createFacetAnnouncement(facet) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Filtered by ${facet}`;
      return announcement;
    }
  }
};

// Search checkers
const searchCheckers = {
  // Check search bar accessibility
  checkSearchBar(element) {
    return {
      hasSearchRole: element.getAttribute('role') === 'search',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleInput: this.checkSearchInput(element.querySelector('[role="searchbox"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check search input accessibility
  checkSearchInput(input) {
    return input ? {
      hasSearchboxRole: input.getAttribute('role') === 'searchbox',
      hasLabel: !!input.getAttribute('aria-label'),
      hasDescription: !!input.getAttribute('aria-describedby'),
      hasExpanded: input.hasAttribute('aria-expanded'),
      hasControls: !!input.getAttribute('aria-controls')
    } : false;
  },

  // Check suggestions accessibility
  checkSuggestions(element) {
    return {
      hasListboxRole: element.getAttribute('role') === 'listbox',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleOptions: Array.from(element.querySelectorAll('[role="option"]')).every(option => 
        option.hasAttribute('aria-selected') && !!option.id
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check filters accessibility
  checkSearchFilters(element) {
    return {
      hasGroupRole: element.getAttribute('role') === 'group',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleGroups: Array.from(element.querySelectorAll('[role="group"]')).every(group => 
        !!group.getAttribute('aria-labelledby') &&
        this.checkFilterOptions(group.querySelectorAll('[role="radio"]'))
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check filter options accessibility
  checkFilterOptions(options) {
    return Array.from(options).every(option => 
      option.hasAttribute('aria-checked') && !!option.getAttribute('aria-label')
    );
  },

  // Check results accessibility
  checkSearchResults(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleList: this.checkResultsList(element.querySelector('[role="list"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check results list accessibility
  checkResultsList(list) {
    return list ? {
      hasListRole: list.getAttribute('role') === 'list',
      hasLabel: !!list.getAttribute('aria-label'),
      hasAccessibleItems: Array.from(list.querySelectorAll('[role="listitem"]')).every(item => 
        !!item.getAttribute('aria-labelledby') && 
        !!item.getAttribute('aria-describedby') &&
        !!item.querySelector('[role="link"]')?.getAttribute('aria-label')
      )
    } : false;
  },

  // Check recent searches accessibility
  checkRecentSearches(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleList: !!element.querySelector('[role="list"]')?.getAttribute('aria-label'),
      hasAccessibleClearButton: !!element.querySelector('button')?.getAttribute('aria-label'),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check facets accessibility
  checkSearchFacets(element) {
    return {
      hasComplementaryRole: element.getAttribute('role') === 'complementary',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleGroups: Array.from(element.querySelectorAll('[role="group"]')).every(group => 
        !!group.getAttribute('aria-labelledby') &&
        Array.from(group.querySelectorAll('[role="checkbox"]')).every(checkbox => 
          checkbox.hasAttribute('aria-checked') && !!checkbox.getAttribute('aria-label')
        )
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
  searchUtils,
  searchCheckers
};
