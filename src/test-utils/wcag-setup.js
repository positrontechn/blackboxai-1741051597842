import { axe, toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// WCAG Level configuration (A, AA, AAA)
const wcagLevel = 'AA';

// Custom axe configuration for WCAG testing
const axeConfig = {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
  },
  rules: {
    // 1. Perceivable
    'image-alt': { enabled: true },
    'button-name': { enabled: true },
    'color-contrast': { enabled: true },
    'link-name': { enabled: true },
    'video-caption': { enabled: true },
    'audio-caption': { enabled: true },

    // 2. Operable
    'keyboard-navigable': { enabled: true },
    'navigation-sequences': { enabled: true },
    'timing-adjustable': { enabled: true },
    'no-keyboard-trap': { enabled: true },

    // 3. Understandable
    'language-of-page': { enabled: true },
    'consistent-navigation': { enabled: true },
    'error-identification': { enabled: true },
    'label': { enabled: true },

    // 4. Robust
    'valid-lang': { enabled: true },
    'aria-valid-attr': { enabled: true },
    'aria-required-attr': { enabled: true },
    'aria-roles': { enabled: true }
  }
};

// WCAG Success Criteria checkers
const wcagCheckers = {
  // 1.1.1 Non-text Content
  hasTextAlternative(element) {
    return !!(
      element.getAttribute('alt') ||
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby')
    );
  },

  // 1.4.3 Contrast
  hasAdequateContrast(foreground, background) {
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

    const color1 = getRGB(foreground);
    const color2 = getRGB(background);

    const l1 = getLuminance(color1.r, color1.g, color1.b);
    const l2 = getLuminance(color2.r, color2.g, color2.b);

    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return ratio >= (wcagLevel === 'AAA' ? 7 : 4.5);
  },

  // 2.1.1 Keyboard
  isKeyboardAccessible(element) {
    const tabIndex = element.getAttribute('tabindex');
    return (
      element.tagName === 'A' ||
      element.tagName === 'BUTTON' ||
      element.tagName === 'INPUT' ||
      element.tagName === 'SELECT' ||
      element.tagName === 'TEXTAREA' ||
      tabIndex !== null
    );
  },

  // 2.4.3 Focus Order
  hasLogicalFocusOrder(elements) {
    return elements.every((element, index) => {
      if (index === 0) return true;
      const prev = elements[index - 1].getBoundingClientRect();
      const curr = element.getBoundingClientRect();
      return prev.bottom <= curr.top || prev.right <= curr.left;
    });
  },

  // 3.3.1 Error Identification
  hasErrorIdentification(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    return Array.from(inputs).every(input => {
      if (input.getAttribute('aria-invalid') === 'true') {
        const errorId = input.getAttribute('aria-describedby');
        return errorId && document.getElementById(errorId);
      }
      return true;
    });
  },

  // 4.1.2 Name, Role, Value
  hasValidARIA(element) {
    const role = element.getAttribute('role');
    if (role) {
      const requiredProps = {
        button: ['aria-pressed'],
        checkbox: ['aria-checked'],
        combobox: ['aria-expanded'],
        tab: ['aria-selected'],
        tabpanel: ['aria-labelledby']
      };
      
      return requiredProps[role] ? 
        requiredProps[role].every(prop => element.hasAttribute(prop)) : 
        true;
    }
    return true;
  }
};

// WCAG test utilities
const wcagUtils = {
  async testAccessibility(container) {
    const results = await axe(container, axeConfig);
    return results;
  },

  getTextAlternatives(container) {
    const images = container.querySelectorAll('img, [role="img"]');
    return Array.from(images).map(img => ({
      element: img,
      alt: img.getAttribute('alt'),
      ariaLabel: img.getAttribute('aria-label'),
      ariaLabelledby: img.getAttribute('aria-labelledby')
    }));
  },

  getFocusableElements(container) {
    return container.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  },

  getHeadingStructure(container) {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    return Array.from(headings).map(heading => ({
      level: parseInt(heading.tagName[1]),
      text: heading.textContent,
      element: heading
    }));
  },

  getLandmarks(container) {
    return container.querySelectorAll(
      '[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]'
    );
  }
};

export {
  axeConfig,
  wcagCheckers,
  wcagUtils,
  wcagLevel
};
