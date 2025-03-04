// Sort and filter utilities for accessibility testing
const sortUtils = {
  // Sort controls utilities
  sortControls: {
    // Create sort controls container
    createSortControls() {
      const container = document.createElement('div');
      container.setAttribute('data-sort-controls', 'true');
      container.setAttribute('role', 'group');
      container.setAttribute('aria-label', 'Sort options');
      
      const select = document.createElement('select');
      select.setAttribute('aria-label', 'Sort by');
      
      const description = document.createElement('div');
      description.id = `sort-desc-${Date.now()}`;
      description.textContent = 'Choose sorting criteria';
      select.setAttribute('aria-describedby', description.id);
      
      ['date', 'name', 'relevance', 'popularity'].forEach(option => {
        const optionEl = document.createElement('option');
        optionEl.value = option;
        optionEl.textContent = option;
        select.appendChild(optionEl);
      });
      
      const directionButton = document.createElement('button');
      directionButton.setAttribute('aria-label', 'Sort direction');
      directionButton.setAttribute('aria-pressed', 'false');
      
      container.appendChild(select);
      container.appendChild(description);
      container.appendChild(directionButton);
      return container;
    },

    // Create sort announcement
    createSortAnnouncement(criteria) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Sorted by ${criteria}`;
      return announcement;
    }
  },

  // Filter panel utilities
  filterPanel: {
    // Create filter panel container
    createFilterPanel() {
      const container = document.createElement('div');
      container.setAttribute('data-filter-panel', 'true');
      container.setAttribute('role', 'complementary');
      container.setAttribute('aria-label', 'Filter options');
      
      ['category', 'status', 'date'].forEach(type => {
        const section = document.createElement('div');
        section.setAttribute('role', 'region');
        
        const title = document.createElement('div');
        title.id = `filter-title-${Date.now()}`;
        title.textContent = `Filter by ${type}`;
        section.setAttribute('aria-labelledby', title.id);
        
        container.appendChild(title);
        container.appendChild(section);
      });
      
      return container;
    },

    // Create filter announcement
    createFilterAnnouncement(filter) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Filtered by ${filter}`;
      return announcement;
    }
  },

  // Active filters utilities
  activeFilters: {
    // Create active filters container
    createActiveFilters() {
      const container = document.createElement('div');
      container.setAttribute('data-active-filters', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Active filters');
      
      ['events', 'today'].forEach(filter => {
        const tag = document.createElement('button');
        tag.setAttribute('aria-label', `Remove ${filter} filter`);
        tag.setAttribute('aria-pressed', 'true');
        container.appendChild(tag);
      });
      
      const clearButton = document.createElement('button');
      clearButton.setAttribute('data-clear-filters', 'true');
      clearButton.setAttribute('aria-label', 'Clear all filters');
      container.appendChild(clearButton);
      
      return container;
    },

    // Create filter removal announcement
    createRemovalAnnouncement(filter) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Removed ${filter} filter`;
      return announcement;
    }
  },

  // Sort order utilities
  sortOrder: {
    // Create sort order container
    createSortOrder() {
      const container = document.createElement('div');
      container.setAttribute('data-sort-order', 'true');
      container.setAttribute('role', 'group');
      container.setAttribute('aria-label', 'Sort order');
      
      ['ascending', 'descending'].forEach(order => {
        const button = document.createElement('button');
        button.setAttribute('aria-pressed', order === 'descending');
        button.setAttribute('aria-label', `Sort ${order}`);
        container.appendChild(button);
      });
      
      return container;
    },

    // Create order announcement
    createOrderAnnouncement(order) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Sorted in ${order} order`;
      return announcement;
    }
  },

  // Filter presets utilities
  filterPresets: {
    // Create filter presets container
    createFilterPresets() {
      const container = document.createElement('div');
      container.setAttribute('data-filter-presets', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Filter presets');
      
      ['recent activity', 'popular', 'favorites'].forEach(preset => {
        const button = document.createElement('button');
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('aria-label', preset);
        
        const description = document.createElement('div');
        description.id = `preset-desc-${Date.now()}`;
        description.textContent = `Apply ${preset} preset`;
        button.setAttribute('aria-describedby', description.id);
        
        container.appendChild(button);
        container.appendChild(description);
      });
      
      return container;
    },

    // Create preset announcement
    createPresetAnnouncement(preset) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Applied ${preset} preset`;
      return announcement;
    }
  },

  // Column sorting utilities
  columnSorting: {
    // Create sortable table header
    createSortableHeader() {
      const header = document.createElement('div');
      header.setAttribute('role', 'rowgroup');
      
      ['date', 'name', 'status'].forEach(column => {
        const headerCell = document.createElement('div');
        headerCell.setAttribute('role', 'columnheader');
        headerCell.setAttribute('aria-sort', 'none');
        headerCell.setAttribute('aria-label', `Sort by ${column}`);
        header.appendChild(headerCell);
      });
      
      return header;
    },

    // Create column sort announcement
    createColumnAnnouncement(column) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Sorted by ${column}`;
      return announcement;
    }
  }
};

// Sort checkers
const sortCheckers = {
  // Check sort controls accessibility
  checkSortControls(element) {
    return {
      hasGroupRole: element.getAttribute('role') === 'group',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleSelect: this.checkSortSelect(element.querySelector('select')),
      hasAccessibleDirection: this.checkDirectionButton(element.querySelector('button')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check sort select accessibility
  checkSortSelect(select) {
    return select ? {
      hasLabel: !!select.getAttribute('aria-label'),
      hasDescription: !!select.getAttribute('aria-describedby')
    } : false;
  },

  // Check direction button accessibility
  checkDirectionButton(button) {
    return button ? {
      hasLabel: !!button.getAttribute('aria-label'),
      hasPressedState: button.hasAttribute('aria-pressed')
    } : false;
  },

  // Check filter panel accessibility
  checkFilterPanel(element) {
    return {
      hasComplementaryRole: element.getAttribute('role') === 'complementary',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleSections: Array.from(element.querySelectorAll('[role="region"]')).every(section => 
        !!section.getAttribute('aria-labelledby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check active filters accessibility
  checkActiveFilters(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleTags: Array.from(element.querySelectorAll('button:not([data-clear-filters])')).every(tag => 
        !!tag.getAttribute('aria-label') && tag.hasAttribute('aria-pressed')
      ),
      hasAccessibleClearButton: !!element.querySelector('[data-clear-filters]')?.getAttribute('aria-label'),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check sort order accessibility
  checkSortOrder(element) {
    return {
      hasGroupRole: element.getAttribute('role') === 'group',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleButtons: Array.from(element.querySelectorAll('button')).every(button => 
        !!button.getAttribute('aria-label') && button.hasAttribute('aria-pressed')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check filter presets accessibility
  checkFilterPresets(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleButtons: Array.from(element.querySelectorAll('button')).every(button => 
        !!button.getAttribute('aria-label') &&
        button.hasAttribute('aria-pressed') &&
        !!button.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check column sorting accessibility
  checkColumnSorting(element) {
    return {
      hasRowGroupRole: element.getAttribute('role') === 'rowgroup',
      hasAccessibleHeaders: Array.from(element.querySelectorAll('[role="columnheader"]')).every(header => 
        !!header.getAttribute('aria-label') && header.hasAttribute('aria-sort')
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
  sortUtils,
  sortCheckers
};
