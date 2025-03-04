import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Custom render that includes router and other providers
const customRender = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Mock data generators
const generateMockEvent = (overrides = {}) => ({
  id: Math.random().toString(36).substr(2, 9),
  title: 'Test Event',
  description: 'Test Description',
  date: new Date().toISOString(),
  location: 'Test Location',
  type: 'general',
  imageUrl: 'https://example.com/image.jpg',
  ...overrides
});

const generateMockPlantingEvent = (overrides = {}) => ({
  ...generateMockEvent({ type: 'planting' }),
  treesPlanned: 100,
  volunteersNeeded: 20,
  currentVolunteers: 10,
  ...overrides
});

const generateMockVolunteerOpportunity = (overrides = {}) => ({
  id: Math.random().toString(36).substr(2, 9),
  title: 'Test Opportunity',
  description: 'Test Description',
  commitment: '2 hours per week',
  location: 'Test Location',
  category: 'fire-watch',
  requiredSkills: ['First Aid', 'Communication'],
  positionsAvailable: 5,
  ...overrides
});

const generateMockAchievements = (overrides = {}) => ({
  totalEvents: 100,
  treesPlanted: 1000,
  volunteersActive: 50,
  areaProtected: 500,
  firesReported: 25,
  responseTime: 15,
  topContributors: [
    {
      id: '1',
      name: 'John Doe',
      avatar: 'https://example.com/avatar1.jpg',
      contributions: 50
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://example.com/avatar2.jpg',
      contributions: 45
    }
  ],
  recentMilestones: [
    {
      date: new Date().toISOString(),
      title: '1000 Trees Planted',
      description: 'Community reached 1000 trees planted milestone'
    }
  ],
  ...overrides
});

// Mock service responses
const mockServiceResponse = (data) => {
  return Promise.resolve(data);
};

const mockServiceError = (error) => {
  return Promise.reject(new Error(error));
};

// Test IDs for components
const testIds = {
  loadingScreen: 'loading-screen',
  errorScreen: 'error-screen',
  communityTabs: 'community-tabs',
  eventList: 'event-list',
  volunteerOpportunities: 'volunteer-opportunities',
  achievements: 'community-achievements',
  skipLink: 'skip-link'
};

// Accessibility helpers
const checkAccessibility = async (container) => {
  const { axe, toHaveNoViolations } = require('jest-axe');
  expect.extend(toHaveNoViolations);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

// Export everything
export {
  customRender as render,
  generateMockEvent,
  generateMockPlantingEvent,
  generateMockVolunteerOpportunity,
  generateMockAchievements,
  mockServiceResponse,
  mockServiceError,
  testIds,
  checkAccessibility
};

// Re-export everything from testing-library
export * from '@testing-library/react';
