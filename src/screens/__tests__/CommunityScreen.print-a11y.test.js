import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityScreen from '../CommunityScreen';
import useCommunity from '../../hooks/useCommunity';
import { wcagCheckers, wcagUtils } from '../../test-utils/wcag-setup';

// Mock the custom hooks
jest.mock('../../hooks/useCommunity');

const mockData = {
  events: [
    { id: '1', title: 'Event 1', type: 'general' },
    { id: '2', title: 'Event 2', type: 'general' }
  ],
  featuredEvents: [
    { id: '3', title: 'Planting Day 1', type: 'planting' },
    { id: '4', title: 'Planting Day 2', type: 'planting' }
  ],
  volunteerOpportunities: [
    { id: '5', title: 'Volunteer 1' },
    { id: '6', title: 'Volunteer 2' }
  ],
  achievements: {
    totalEvents: 100,
    treesPlanted: 1000,
    volunteersActive: 50
  }
};

describe('CommunityScreen Print Accessibility', () => {
  beforeEach(() => {
    useCommunity.mockImplementation(() => ({
      ...mockData,
      loading: false,
      error: null,
      refreshEvents: jest.fn(),
      refreshAchievements: jest.fn()
    }));
  });

  describe('Print Styles', () => {
    beforeEach(() => {
      // Mock print media query
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === 'print',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));
    });

    it('should provide appropriate page breaks', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const sections = container.querySelectorAll('section, article');
      sections.forEach(section => {
        const style = window.getComputedStyle(section);
        expect(['always', 'avoid']).toContain(style.pageBreakInside);
      });
    });

    it('should ensure headers repeat on new pages', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const headers = container.querySelectorAll('thead');
      headers.forEach(header => {
        const style = window.getComputedStyle(header);
        expect(style.display).toBe('table-header-group');
      });
    });

    it('should expand all collapsed content for printing', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const collapsibleElements = container.querySelectorAll('[aria-expanded]');
      collapsibleElements.forEach(element => {
        const printStyle = window.getComputedStyle(element, '@media print');
        expect(printStyle.display).not.toBe('none');
      });
    });
  });

  describe('Print Layout', () => {
    it('should adjust layout for print format', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const printStyles = document.querySelectorAll('style[media="print"]');
      expect(printStyles.length).toBeGreaterThan(0);
    });

    it('should ensure sufficient contrast for grayscale printing', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const textElements = container.querySelectorAll('p, h1, h2, h3, span');
      textElements.forEach(element => {
        const style = window.getComputedStyle(element);
        const color = style.color;
        // Convert color to grayscale and check contrast
        const grayscale = wcagCheckers.convertToGrayscale(color);
        expect(wcagCheckers.hasAdequateContrast(grayscale, '#ffffff')).toBe(true);
      });
    });

    it('should provide print-specific styles for links', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const links = container.querySelectorAll('a');
      links.forEach(link => {
        const printStyle = window.getComputedStyle(link, '@media print');
        expect(printStyle.textDecoration).toBe('underline');
        // Check if href is displayed after link text
        expect(printStyle.content).toContain('attr(href)');
      });
    });
  });

  describe('Print Content', () => {
    it('should include full URLs in printed version', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const links = container.querySelectorAll('a[href^="http"]');
      links.forEach(link => {
        const printStyle = window.getComputedStyle(link, '@media print');
        expect(printStyle.content).toContain('attr(href)');
      });
    });

    it('should expand abbreviations and acronyms', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const abbreviations = container.querySelectorAll('abbr');
      abbreviations.forEach(abbr => {
        expect(abbr).toHaveAttribute('title');
      });
    });

    it('should provide table summaries for print', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const tables = container.querySelectorAll('table');
      tables.forEach(table => {
        expect(table).toHaveAttribute('summary');
      });
    });
  });

  describe('Print Navigation', () => {
    it('should include table of contents for long documents', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const headings = wcagUtils.getHeadingStructure(container);
      if (headings.length > 3) {
        const toc = container.querySelector('.print-toc');
        expect(toc).toBeInTheDocument();
      }
    });

    it('should provide page numbers in footers', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const footer = container.querySelector('.print-footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute('data-page-number');
    });
  });

  describe('Print Accessibility', () => {
    it('should maintain heading structure in print', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const headings = wcagUtils.getHeadingStructure(container);
      let previousLevel = 0;

      headings.forEach(({ level }) => {
        if (previousLevel !== 0) {
          expect(level - previousLevel).toBeLessThanOrEqual(1);
        }
        previousLevel = level;
      });
    });

    it('should provide alternative text for images in print', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const images = container.querySelectorAll('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        const printStyle = window.getComputedStyle(img, '@media print');
        // Check if alt text is displayed when image fails to print
        expect(printStyle.content).toContain('attr(alt)');
      });
    });

    it('should handle data visualization for print', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const charts = container.querySelectorAll('[role="img"][aria-label*="chart"]');
      charts.forEach(chart => {
        // Check for print-specific alternative representation
        const tableVersion = chart.querySelector('table.print-only');
        expect(tableVersion).toBeInTheDocument();
      });
    });
  });

  describe('Print Performance', () => {
    it('should handle large tables across page breaks', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const tables = container.querySelectorAll('table');
      tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          const style = window.getComputedStyle(row);
          expect(style.pageBreakInside).toBe('avoid');
        });
      });
    });

    it('should optimize images for print resolution', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen />
        </BrowserRouter>
      );

      const images = container.querySelectorAll('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('data-print-src');
      });
    });
  });
});
