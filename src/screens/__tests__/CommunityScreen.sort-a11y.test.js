import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityScreen from '../CommunityScreen';
import useCommunity from '../../hooks/useCommunity';
import { searchUtils, searchCheckers } from '../../test-utils/search-a11y-setup';

// Mock the custom hooks
jest.mock('../../hooks/useCommunity');

const mockData = {
  sorting: {
    options: ['date', 'name', 'relevance', 'popularity'],
    direction: 'desc',
    current: 'date'
  },
  filtering: {
    categories: ['all', 'events', 'reports', 'discussions'],
    status: ['active', 'completed', 'pending'],
    date: ['today', 'week', 'month', 'year']
  }
};

describe('CommunityScreen Sort Accessibility', () => {
  beforeEach(() => {
    useCommunity.mockImplementation(() => ({
      ...mockData,
      loading: false,
      error: null
    }));
  });

  describe('Sort Controls', () => {
    it('should handle sort controls accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showSortControls={true} />
        </BrowserRouter>
      );

      // Check sort container
      const sortContainer = container.querySelector('[data-sort-controls]');
      expect(sortContainer).toHaveAttribute('role', 'group');
      expect(sortContainer).toHaveAttribute('aria-label', 'Sort options');

      // Check sort select
      const sortSelect = sortContainer.querySelector('select');
      expect(sortSelect).toHaveAttribute('aria-label', 'Sort by');
      expect(sortSelect).toHaveAttribute('aria-describedby');

      // Check direction toggle
      const directionButton = sortContainer.querySelector('button');
      expect(directionButton).toHaveAttribute('aria-label', 'Sort direction');
      expect(directionButton).toHaveAttribute('aria-pressed');
    });

    it('should announce sort changes', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showSortControls={true} />
        </BrowserRouter>
      );

      // Change sort option
      const sortSelect = screen.getByRole('combobox', { name: /sort by/i });
      fireEvent.change(sortSelect, { target: { value: 'name' } });

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/sorted by name/i);
    });
  });

  describe('Filter Panel', () => {
    it('should handle filter panel accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showFilterPanel={true} />
        </BrowserRouter>
      );

      // Check filter container
      const filterContainer = container.querySelector('[data-filter-panel]');
      expect(filterContainer).toHaveAttribute('role', 'complementary');
      expect(filterContainer).toHaveAttribute('aria-label', 'Filter options');

      // Check filter sections
      const sections = filterContainer.querySelectorAll('[role="region"]');
      sections.forEach(section => {
        expect(section).toHaveAttribute('aria-labelledby');
        const label = document.getElementById(section.getAttribute('aria-labelledby'));
        expect(label).toHaveTextContent(/filter by/i);
      });
    });

    it('should announce filter applications', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showFilterPanel={true} />
        </BrowserRouter>
      );

      // Apply filter
      const filterOption = screen.getByRole('checkbox', { name: /events/i });
      fireEvent.click(filterOption);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/filtered by events/i);
    });
  });

  describe('Active Filters', () => {
    it('should handle active filters accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showActiveFilters={true} />
        </BrowserRouter>
      );

      // Check active filters container
      const activeContainer = container.querySelector('[data-active-filters]');
      expect(activeContainer).toHaveAttribute('role', 'region');
      expect(activeContainer).toHaveAttribute('aria-label', 'Active filters');

      // Check filter tags
      const tags = activeContainer.querySelectorAll('[role="button"]');
      tags.forEach(tag => {
        expect(tag).toHaveAttribute('aria-label');
        expect(tag).toHaveAttribute('aria-pressed', 'true');
      });

      // Check clear all button
      const clearButton = activeContainer.querySelector('[data-clear-filters]');
      expect(clearButton).toHaveAttribute('aria-label', 'Clear all filters');
    });

    it('should announce filter removals', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showActiveFilters={true} />
        </BrowserRouter>
      );

      // Remove filter
      const filterTag = screen.getByRole('button', { name: /remove events filter/i });
      fireEvent.click(filterTag);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/removed events filter/i);
    });
  });

  describe('Sort Order', () => {
    it('should handle sort order controls accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showSortOrder={true} />
        </BrowserRouter>
      );

      // Check order container
      const orderContainer = container.querySelector('[data-sort-order]');
      expect(orderContainer).toHaveAttribute('role', 'group');
      expect(orderContainer).toHaveAttribute('aria-label', 'Sort order');

      // Check order buttons
      const buttons = orderContainer.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-pressed');
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('should announce order changes', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showSortOrder={true} />
        </BrowserRouter>
      );

      // Change order
      const ascButton = screen.getByRole('button', { name: /ascending/i });
      fireEvent.click(ascButton);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/sorted in ascending order/i);
    });
  });

  describe('Filter Presets', () => {
    it('should handle filter presets accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showFilterPresets={true} />
        </BrowserRouter>
      );

      // Check presets container
      const presetsContainer = container.querySelector('[data-filter-presets]');
      expect(presetsContainer).toHaveAttribute('role', 'region');
      expect(presetsContainer).toHaveAttribute('aria-label', 'Filter presets');

      // Check preset buttons
      const presets = presetsContainer.querySelectorAll('button');
      presets.forEach(preset => {
        expect(preset).toHaveAttribute('aria-pressed');
        expect(preset).toHaveAttribute('aria-label');
        expect(preset).toHaveAttribute('aria-describedby');
      });
    });

    it('should announce preset applications', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showFilterPresets={true} />
        </BrowserRouter>
      );

      // Apply preset
      const preset = screen.getByRole('button', { name: /recent activity/i });
      fireEvent.click(preset);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/applied recent activity preset/i);
    });
  });

  describe('Column Sorting', () => {
    it('should handle column sorting accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showColumnSorting={true} />
        </BrowserRouter>
      );

      // Check table header
      const tableHeader = container.querySelector('[role="rowgroup"]');
      expect(tableHeader).toBeTruthy();

      // Check sort buttons
      const sortButtons = tableHeader.querySelectorAll('[role="columnheader"]');
      sortButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-sort');
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('should announce column sort changes', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showColumnSorting={true} />
        </BrowserRouter>
      );

      // Sort column
      const column = screen.getByRole('columnheader', { name: /date/i });
      fireEvent.click(column);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/sorted by date/i);
    });
  });
});
