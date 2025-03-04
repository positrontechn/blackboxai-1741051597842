import { configure } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Configure testing-library
configure({
  testIdAttribute: 'data-testid',
});

// Custom axe configuration
const axeConfig = {
  rules: {
    // Ensure all ARIA attributes are valid
    'aria-valid-attr': { enabled: true },
    // Ensure ARIA attributes have valid values
    'aria-valid-attr-value': { enabled: true },
    // Ensure elements with ARIA roles have required attributes
    'aria-required-attr': { enabled: true },
    // Ensure elements with ARIA roles have valid children
    'aria-required-children': { enabled: true },
    // Ensure elements with ARIA roles have valid parents
    'aria-required-parent': { enabled: true },
    // Color contrast requirements
    'color-contrast': { enabled: true },
    // Ensure form elements have labels
    'label': { enabled: true },
    // Ensure landmarks are unique
    'landmark-unique': { enabled: true }
  }
};

// Helper function to run accessibility tests
const runAccessibilityTests = async (container) => {
  const results = await axe(container, axeConfig);
  expect(results).toHaveNoViolations();
};

// Mock window.matchMedia for reduced motion tests
const mockMatchMedia = (reducedMotion = false) => {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: query === '(prefers-reduced-motion: reduce)' ? reducedMotion : false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

// Helper function to check focus visibility
const checkFocusVisibility = (element) => {
  const style = window.getComputedStyle(element);
  const outlineWidth = parseInt(style.outlineWidth);
  const outlineStyle = style.outlineStyle;
  const outlineColor = style.outlineColor;
  
  return {
    isVisible: outlineWidth > 0 && outlineStyle !== 'none' && outlineColor !== 'transparent',
    outlineWidth,
    outlineStyle,
    outlineColor
  };
};

// Helper function to check touch target size
const checkTouchTargetSize = (element) => {
  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  
  return {
    width: rect.width,
    height: rect.height,
    meetsRequirement: rect.width >= 44 && rect.height >= 44
  };
};

// Helper function to check text spacing
const checkTextSpacing = (element) => {
  const style = window.getComputedStyle(element);
  
  return {
    lineHeight: parseFloat(style.lineHeight),
    letterSpacing: parseFloat(style.letterSpacing),
    wordSpacing: parseFloat(style.wordSpacing),
    meetsRequirement: 
      parseFloat(style.lineHeight) >= 1.5 &&
      parseFloat(style.letterSpacing) >= 0.12 &&
      parseFloat(style.wordSpacing) >= 0.16
  };
};

// Helper function to simulate different color vision deficiencies
const simulateColorVision = (type) => {
  const filters = {
    protanopia: 'url(#protanopia)',
    deuteranopia: 'url(#deuteranopia)',
    tritanopia: 'url(#tritanopia)',
    achromatopsia: 'url(#achromatopsia)'
  };

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.innerHTML = `
    <defs>
      <filter id="protanopia">
        <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/>
      </filter>
      <filter id="deuteranopia">
        <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/>
      </filter>
      <filter id="tritanopia">
        <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/>
      </filter>
      <filter id="achromatopsia">
        <feColorMatrix type="matrix" values="0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0,0,0,1,0"/>
      </filter>
    </defs>
  `;

  document.body.appendChild(svg);
  document.body.style.filter = filters[type] || 'none';

  return () => {
    document.body.style.filter = 'none';
    svg.remove();
  };
};

// Helper function to check animation presence
const checkAnimations = (element) => {
  const style = window.getComputedStyle(element);
  
  return {
    hasAnimation: style.animation !== 'none',
    hasTransition: style.transition !== 'none',
    animationDuration: style.animationDuration,
    transitionDuration: style.transitionDuration
  };
};

// Export all utilities
export {
  runAccessibilityTests,
  mockMatchMedia,
  checkFocusVisibility,
  checkTouchTargetSize,
  checkTextSpacing,
  simulateColorVision,
  checkAnimations,
  axeConfig
};
