// Gamification and rewards utilities for accessibility testing
const gamificationUtils = {
  // Points and level utilities
  points: {
    // Create points display container
    createPointsDisplay() {
      const container = document.createElement('div');
      container.setAttribute('data-points-display', 'true');
      container.setAttribute('role', 'status');
      container.setAttribute('aria-label', 'Points and level status');
      container.setAttribute('aria-live', 'polite');
      
      const levelIndicator = document.createElement('div');
      levelIndicator.setAttribute('data-level-indicator', 'true');
      levelIndicator.setAttribute('aria-label', 'Current level');
      levelIndicator.setAttribute('aria-atomic', 'true');
      
      container.appendChild(levelIndicator);
      return container;
    },

    // Create points update announcement
    createPointsAnnouncement(points) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.textContent = `Earned ${points} points`;
      return announcement;
    }
  },

  // Badge utilities
  badges: {
    // Create badge collection container
    createBadgeCollection() {
      const container = document.createElement('div');
      container.setAttribute('data-badge-collection', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Badge collection');
      
      const list = document.createElement('ul');
      list.setAttribute('role', 'list');
      
      ['eco-warrior', 'community-builder', 'tree-planter'].forEach(badge => {
        const item = document.createElement('li');
        item.setAttribute('role', 'listitem');
        
        const title = document.createElement('div');
        title.id = `badge-title-${Date.now()}`;
        title.textContent = badge;
        item.setAttribute('aria-labelledby', title.id);
        
        const description = document.createElement('div');
        description.id = `badge-desc-${Date.now()}`;
        description.textContent = `Description of ${badge} badge`;
        item.setAttribute('aria-describedby', description.id);
        
        list.appendChild(item);
      });
      
      container.appendChild(list);
      return container;
    },

    // Create badge unlock announcement
    createBadgeAnnouncement(badge) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.textContent = `Unlocked ${badge} badge`;
      return announcement;
    }
  },

  // Achievement utilities
  achievements: {
    // Create achievements container
    createAchievements() {
      const container = document.createElement('div');
      container.setAttribute('data-achievements', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Achievement progress');
      
      ['trees-planted', 'events-attended', 'reports-submitted'].forEach(achievement => {
        const progress = document.createElement('div');
        progress.setAttribute('role', 'progressbar');
        progress.setAttribute('aria-valuemin', '0');
        progress.setAttribute('aria-valuemax', '100');
        progress.setAttribute('aria-valuenow', '0');
        progress.setAttribute('aria-valuetext', `${achievement} progress: 0%`);
        
        container.appendChild(progress);
      });
      
      return container;
    },

    // Create achievement completion announcement
    createAchievementAnnouncement(achievement) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.textContent = `Achievement unlocked: ${achievement}`;
      return announcement;
    }
  },

  // Reward utilities
  rewards: {
    // Create rewards container
    createRewards() {
      const container = document.createElement('div');
      container.setAttribute('data-rewards', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Available rewards');
      
      ['special-badge', 'profile-theme', 'community-feature'].forEach(reward => {
        const button = document.createElement('button');
        button.setAttribute('aria-label', `Claim ${reward}`);
        button.setAttribute('aria-disabled', 'false');
        
        const description = document.createElement('div');
        description.id = `reward-desc-${Date.now()}`;
        description.textContent = `Details about ${reward}`;
        button.setAttribute('aria-describedby', description.id);
        
        container.appendChild(button);
        container.appendChild(description);
      });
      
      return container;
    },

    // Create reward claim announcement
    createRewardAnnouncement(reward) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.textContent = `${reward} reward claimed`;
      return announcement;
    }
  },

  // Progress tracking utilities
  progress: {
    // Create progress tracking container
    createProgressTracking() {
      const container = document.createElement('div');
      container.setAttribute('data-progress-tracking', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Progress tracking');
      
      ['next-level', 'monthly-goal'].forEach(goal => {
        const progress = document.createElement('div');
        progress.setAttribute('role', 'progressbar');
        progress.setAttribute('aria-valuemin', '0');
        progress.setAttribute('aria-valuemax', '100');
        progress.setAttribute('aria-valuenow', '0');
        progress.setAttribute('aria-valuetext', `${goal} progress: 0%`);
        
        container.appendChild(progress);
      });
      
      return container;
    },

    // Create milestone announcement
    createMilestoneAnnouncement(milestone) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.textContent = `Milestone reached: ${milestone}`;
      return announcement;
    }
  },

  // Leaderboard utilities
  leaderboard: {
    // Create leaderboard container
    createLeaderboard() {
      const container = document.createElement('div');
      container.setAttribute('data-leaderboard', 'true');
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Community leaderboard');
      
      const table = document.createElement('table');
      table.setAttribute('role', 'table');
      
      [1, 2, 3].forEach(rank => {
        const row = document.createElement('tr');
        row.setAttribute('role', 'row');
        row.setAttribute('aria-label', `Rank ${rank}`);
        
        ['rank', 'name', 'points'].forEach(field => {
          const cell = document.createElement('td');
          cell.setAttribute('role', 'cell');
          cell.setAttribute('aria-label', field);
          row.appendChild(cell);
        });
        
        table.appendChild(row);
      });
      
      container.appendChild(table);
      return container;
    },

    // Create ranking update announcement
    createRankingAnnouncement(newRank, oldRank) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.textContent = `Moved ${newRank < oldRank ? 'up' : 'down'} to rank ${newRank}`;
      return announcement;
    }
  }
};

// Gamification checkers
const gamificationCheckers = {
  // Check points display accessibility
  checkPointsDisplay(element) {
    return {
      hasStatusRole: element.getAttribute('role') === 'status',
      hasLabel: !!element.getAttribute('aria-label'),
      hasLiveRegion: element.getAttribute('aria-live') === 'polite',
      hasAccessibleLevel: this.checkLevelIndicator(element.querySelector('[data-level-indicator]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check level indicator accessibility
  checkLevelIndicator(indicator) {
    return indicator ? {
      hasLabel: !!indicator.getAttribute('aria-label'),
      isAtomic: indicator.getAttribute('aria-atomic') === 'true'
    } : false;
  },

  // Check badge collection accessibility
  checkBadgeCollection(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleList: Array.from(element.querySelectorAll('[role="listitem"]')).every(item => 
        !!item.getAttribute('aria-labelledby') && !!item.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check achievements accessibility
  checkAchievements(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleProgress: Array.from(element.querySelectorAll('[role="progressbar"]')).every(bar => 
        bar.hasAttribute('aria-valuemin') &&
        bar.hasAttribute('aria-valuemax') &&
        bar.hasAttribute('aria-valuenow') &&
        bar.hasAttribute('aria-valuetext')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check rewards accessibility
  checkRewards(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleButtons: Array.from(element.querySelectorAll('button')).every(button => 
        !!button.getAttribute('aria-label') &&
        button.hasAttribute('aria-disabled') &&
        !!button.getAttribute('aria-describedby')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check progress tracking accessibility
  checkProgressTracking(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleProgress: Array.from(element.querySelectorAll('[role="progressbar"]')).every(bar => 
        bar.hasAttribute('aria-valuemin') &&
        bar.hasAttribute('aria-valuemax') &&
        bar.hasAttribute('aria-valuenow') &&
        bar.hasAttribute('aria-valuetext')
      ),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check leaderboard accessibility
  checkLeaderboard(element) {
    return {
      hasRegionRole: element.getAttribute('role') === 'region',
      hasLabel: !!element.getAttribute('aria-label'),
      hasAccessibleTable: this.checkLeaderboardTable(element.querySelector('[role="table"]')),
      maintainsAccessibility: this.checkAccessibility(element)
    };
  },

  // Check leaderboard table accessibility
  checkLeaderboardTable(table) {
    return table ? {
      hasTableRole: table.getAttribute('role') === 'table',
      hasAccessibleRows: Array.from(table.querySelectorAll('[role="row"]')).every(row => 
        !!row.getAttribute('aria-label') &&
        Array.from(row.querySelectorAll('[role="cell"]')).every(cell => 
          !!cell.getAttribute('aria-label')
        )
      )
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
  gamificationUtils,
  gamificationCheckers
};
