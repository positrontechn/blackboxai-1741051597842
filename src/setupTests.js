// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import 'jest-axe/extend-expect';
import { configure } from '@testing-library/react';

// Configure testing-library
configure({
  testIdAttribute: 'data-testid',
});

// Mock IntersectionObserver
class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }

  observe() {
    // Implementation for testing
    return null;
  }

  unobserve() {
    // Implementation for testing
    return null;
  }

  disconnect() {
    // Implementation for testing
    return null;
  }
}

// Mock ResizeObserver
class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {
    // Implementation for testing
    return null;
  }

  unobserve() {
    // Implementation for testing
    return null;
  }

  disconnect() {
    // Implementation for testing
    return null;
  }
}

// Add to global
global.IntersectionObserver = IntersectionObserver;
global.ResizeObserver = ResizeObserver;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo
window.scrollTo = jest.fn();

// Suppress console errors during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to %s inside a test was not wrapped in act')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Add custom matchers
expect.extend({
  toHaveBeenCalledAfter(received, expected) {
    const pass = received.mock.invocationCallOrder[0] > expected.mock.invocationCallOrder[0];
    return {
      pass,
      message: () =>
        `expected ${received.getMockName()} to have been called after ${expected.getMockName()}`,
    };
  },
});

// Mock animations
window.HTMLElement.prototype.animate = jest.fn();
window.Animation = class {};
window.KeyframeEffect = class {};

// Mock requestAnimationFrame
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = id => clearTimeout(id);

// Mock getComputedStyle
window.getComputedStyle = element => ({
  getPropertyValue: prop => {
    return '';
  },
});

// Add custom environment variables for testing
process.env.REACT_APP_TEST_MODE = 'true';

// Clean up after each test
afterEach(() => {
  // Reset any runtime handlers
  jest.clearAllTimers();
  
  // Clear any mocks
  jest.clearAllMocks();
  
  // Reset the document body
  document.body.innerHTML = '';
  
  // Clear any added event listeners
  window.matchMedia.mockClear();
});
