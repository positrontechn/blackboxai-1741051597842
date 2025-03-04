import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {
  runAccessibilityTests,
  mockMatchMedia,
  checkFocusVisibility,
  checkTouchTargetSize,
  checkTextSpacing,
  simulateColorVision,
  checkAnimations,
  axeConfig
} from './accessibility-setup';

// Custom render with accessibility context
const renderWithA11y = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    // Additional accessibility helpers
    async checkA11y() {
      return runAccessibilityTests(this.container);
    },
    checkFocus(element) {
      return checkFocusVisibility(element);
    },
    checkTouch(element) {
      return checkTouchTargetSize(element);
    },
    checkSpacing(element) {
      return checkTextSpacing(element);
    }
  };
};

// Accessibility test IDs
const a11yTestIds = {
  main: 'main-content',
  navigation: 'main-navigation',
  tabList: 'tab-list',
  tabPanel: 'tab-panel',
  alert: 'alert-message',
  status: 'status-message',
  dialog: 'modal-dialog',
  skipLink: 'skip-link',
  loadingIndicator: 'loading-indicator',
  errorMessage: 'error-message'
};

// ARIA roles and attributes checker
const ariaChecker = {
  hasValidRole(element, expectedRole) {
    return element.getAttribute('role') === expectedRole;
  },
  
  hasValidLabel(element) {
    return !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.getAttribute('title') ||
      element.innerText
    );
  },
  
  hasValidDescription(element) {
    return !!(
      element.getAttribute('aria-description') ||
      element.getAttribute('aria-describedby')
    );
  },
  
  isLiveRegion(element) {
    return !!(
      element.getAttribute('aria-live') ||
      element.getAttribute('role') === 'alert' ||
      element.getAttribute('role') === 'status'
    );
  }
};

// Focus management helpers
const focusHelpers = {
  getFocusableElements(container) {
    return container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  },
  
  getFocusOrder(container) {
    const elements = this.getFocusableElements(container);
    return Array.from(elements).map(el => ({
      element: el,
      rect: el.getBoundingClientRect()
    }));
  },
  
  isValidFocusOrder(container) {
    const order = this.getFocusOrder(container);
    return order.every((item, index) => {
      if (index === 0) return true;
      const prev = order[index - 1];
      return (
        prev.rect.bottom <= item.rect.top ||
        (prev.rect.bottom > item.rect.top && prev.rect.right <= item.rect.left)
      );
    });
  }
};

// Keyboard interaction helpers
const keyboardHelpers = {
  pressTab(element, shiftKey = false) {
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
      shiftKey
    });
    element.dispatchEvent(event);
  },
  
  pressEnter(element) {
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  },
  
  pressSpace(element) {
    const event = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  },
  
  pressEscape(element) {
    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  },
  
  pressArrow(element, direction) {
    const event = new KeyboardEvent('keydown', {
      key: `Arrow${direction}`,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  }
};

// Color contrast helpers
const contrastHelpers = {
  getContrastRatio(color1, color2) {
    const getLuminance = (r, g, b) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const getRGB = (color) => {
      const hex = color.replace('#', '');
      return {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16)
      };
    };

    const color1RGB = getRGB(color1);
    const color2RGB = getRGB(color2);

    const l1 = getLuminance(color1RGB.r, color1RGB.g, color1RGB.b);
    const l2 = getLuminance(color2RGB.r, color2RGB.g, color2RGB.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  },
  
  meetsWCAGAA(ratio, isLargeText = false) {
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  },
  
  meetsWCAGAAA(ratio, isLargeText = false) {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
};

export {
  renderWithA11y,
  a11yTestIds,
  ariaChecker,
  focusHelpers,
  keyboardHelpers,
  contrastHelpers,
  // Re-export accessibility setup utilities
  runAccessibilityTests,
  mockMatchMedia,
  checkFocusVisibility,
  checkTouchTargetSize,
  checkTextSpacing,
  simulateColorVision,
  checkAnimations,
  axeConfig
};
