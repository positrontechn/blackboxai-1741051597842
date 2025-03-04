import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityScreen from '../CommunityScreen';
import useCommunity from '../../hooks/useCommunity';
import { notificationUtils, notificationCheckers } from '../../test-utils/notification-a11y-setup';

// Mock the custom hooks
jest.mock('../../hooks/useCommunity');

const mockData = {
  help: {
    topics: ['getting-started', 'features', 'troubleshooting'],
    guides: ['quick-start', 'advanced-features'],
    faqs: ['common-issues', 'best-practices']
  },
  support: {
    channels: ['chat', 'email', 'knowledge-base'],
    activeTickets: [],
    resources: []
  }
};

describe('CommunityScreen Help Accessibility', () => {
  beforeEach(() => {
    useCommunity.mockImplementation(() => ({
      ...mockData,
      loading: false,
      error: null
    }));
  });

  describe('Help Center', () => {
    it('should handle help center navigation accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showHelpCenter={true} />
        </BrowserRouter>
      );

      // Check help center container
      const helpContainer = container.querySelector('[data-help-center]');
      expect(helpContainer).toHaveAttribute('role', 'navigation');
      expect(helpContainer).toHaveAttribute('aria-label', 'Help center navigation');

      // Check topic list
      const topicList = helpContainer.querySelector('[role="list"]');
      expect(topicList).toHaveAttribute('aria-label', 'Help topics');

      // Check topic items
      const topics = topicList.querySelectorAll('[role="listitem"]');
      topics.forEach(topic => {
        expect(topic).toHaveAttribute('aria-labelledby');
        const link = topic.querySelector('[role="link"]');
        expect(link).toHaveAttribute('aria-describedby');
      });
    });

    it('should announce topic selection', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showHelpCenter={true} />
        </BrowserRouter>
      );

      // Select topic
      const topic = screen.getByRole('link', { name: /getting started/i });
      fireEvent.click(topic);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/viewing getting started guide/i);
    });
  });

  describe('Interactive Guides', () => {
    it('should handle interactive guides accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showGuides={true} />
        </BrowserRouter>
      );

      // Check guide container
      const guideContainer = container.querySelector('[data-interactive-guide]');
      expect(guideContainer).toHaveAttribute('role', 'region');
      expect(guideContainer).toHaveAttribute('aria-label', 'Interactive guide');

      // Check step navigation
      const stepNav = guideContainer.querySelector('[role="tablist"]');
      expect(stepNav).toHaveAttribute('aria-label', 'Guide steps');

      // Check step content
      const steps = guideContainer.querySelectorAll('[role="tabpanel"]');
      steps.forEach(step => {
        expect(step).toHaveAttribute('aria-labelledby');
        expect(step).toHaveAttribute('tabindex', '0');
      });
    });

    it('should announce guide progress', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showGuides={true} />
        </BrowserRouter>
      );

      // Navigate to next step
      const nextButton = screen.getByRole('button', { name: /next step/i });
      fireEvent.click(nextButton);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/step 2 of/i);
    });
  });

  describe('FAQ Section', () => {
    it('should handle FAQ section accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showFAQ={true} />
        </BrowserRouter>
      );

      // Check FAQ container
      const faqContainer = container.querySelector('[data-faq-section]');
      expect(faqContainer).toHaveAttribute('role', 'region');
      expect(faqContainer).toHaveAttribute('aria-label', 'Frequently asked questions');

      // Check question list
      const questions = faqContainer.querySelectorAll('[role="button"]');
      questions.forEach(question => {
        expect(question).toHaveAttribute('aria-expanded');
        expect(question).toHaveAttribute('aria-controls');
      });

      // Check answers
      const answers = faqContainer.querySelectorAll('[role="region"]');
      answers.forEach(answer => {
        expect(answer).toHaveAttribute('aria-labelledby');
      });
    });

    it('should announce expanded answers', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showFAQ={true} />
        </BrowserRouter>
      );

      // Expand question
      const question = screen.getByRole('button', { name: /common issues/i });
      fireEvent.click(question);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/expanded/i);
    });
  });

  describe('Support Channels', () => {
    it('should handle support options accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showSupportChannels={true} />
        </BrowserRouter>
      );

      // Check support container
      const supportContainer = container.querySelector('[data-support-channels]');
      expect(supportContainer).toHaveAttribute('role', 'region');
      expect(supportContainer).toHaveAttribute('aria-label', 'Support channels');

      // Check channel options
      const channels = supportContainer.querySelectorAll('[role="button"]');
      channels.forEach(channel => {
        expect(channel).toHaveAttribute('aria-label');
        expect(channel).toHaveAttribute('aria-describedby');
      });
    });

    it('should announce channel selection', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showSupportChannels={true} />
        </BrowserRouter>
      );

      // Select channel
      const channel = screen.getByRole('button', { name: /live chat/i });
      fireEvent.click(channel);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/opening live chat/i);
    });
  });

  describe('Knowledge Base', () => {
    it('should handle knowledge base accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showKnowledgeBase={true} />
        </BrowserRouter>
      );

      // Check knowledge base container
      const kbContainer = container.querySelector('[data-knowledge-base]');
      expect(kbContainer).toHaveAttribute('role', 'region');
      expect(kbContainer).toHaveAttribute('aria-label', 'Knowledge base');

      // Check search functionality
      const search = kbContainer.querySelector('[role="search"]');
      expect(search).toHaveAttribute('aria-label', 'Search knowledge base');

      // Check article list
      const articles = kbContainer.querySelectorAll('[role="article"]');
      articles.forEach(article => {
        expect(article).toHaveAttribute('aria-labelledby');
        expect(article).toHaveAttribute('aria-describedby');
      });
    });

    it('should announce search results', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showKnowledgeBase={true} />
        </BrowserRouter>
      );

      // Perform search
      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'getting started' } });
      fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 });

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/found.*results/i);
    });
  });

  describe('Contextual Help', () => {
    it('should handle contextual help accessibly', () => {
      const { container } = render(
        <BrowserRouter>
          <CommunityScreen showContextualHelp={true} />
        </BrowserRouter>
      );

      // Check help trigger
      const helpTrigger = container.querySelector('[data-contextual-help]');
      expect(helpTrigger).toHaveAttribute('role', 'button');
      expect(helpTrigger).toHaveAttribute('aria-label', 'Get help for this section');
      expect(helpTrigger).toHaveAttribute('aria-expanded', 'false');

      // Check help content
      const helpContent = container.querySelector('[role="dialog"]');
      expect(helpContent).toHaveAttribute('aria-labelledby');
      expect(helpContent).toHaveAttribute('aria-describedby');
    });

    it('should announce help content', () => {
      render(
        <BrowserRouter>
          <CommunityScreen showContextualHelp={true} />
        </BrowserRouter>
      );

      // Open help
      const helpButton = screen.getByRole('button', { name: /get help/i });
      fireEvent.click(helpButton);

      // Check announcement
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent(/help information shown/i);
    });
  });
});
